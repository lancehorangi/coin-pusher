//@flow
"use strict";

import { Alert } from "react-native";
import { APIRequest, configureAPIToken, API_ENUM, API_RESULT } from "../api";
import { NimSession } from "react-native-netease-im";
import type { Action, ThunkAction, Dispatch } from "./types";
import { toastShow, PlatformAlert, getMachineName, GetDeviceToken } from "./../util";
import { refreshMsgs } from "./msgs";
import { getCheckinInfo } from "./checkin";
import { showRoomList, leaveRoom } from "./lobby";
import { showModal, showLoginModal, hideLoginModal } from "./../navigator";
import { freshItems } from "./user";

async function _logIn(username: string, pwd: string): Promise<Object> {
  try {
    let response = await APIRequest("account/getToken", {
      account:username, password:pwd
    });

    if(response.StatusCode != API_RESULT.STATUS_OK){
      throw Error(response.ReasonPhrase);
    }

    return response;
  } catch(e) {
    throw Error(e.message);
  }
}

function logIn(account: string, pwd: string): ThunkAction {
  return (dispatch: Dispatch): Object => {
    const response = _logIn(account, pwd);
    response.then((result: Object): any => {
      dispatch(loggedIn(result.account, result.token));
    },
    (err: Error) => {
      Alert.alert("登录失败(" + err.message + ")");
    });

    return response;
  };
}

function loggedIn(
  account: string,
  token: string,
  id: ?number,
  source: ?string): ThunkAction {
  return ((dispatch: Dispatch): any => {
    NimSession.logout();
    console.log("Netease IM login account=" + account + ", token=" + token);

    NimSession.login(account, token)
      .then(() => {
        console.log("Netease IM login succ");
      }, (e: Error) => {
        console.warn("Netease IM login failed=" + e.message);
      });

    hideLoginModal();

    dispatch({
      type: "LOGGED_IN",
      account,
      token,
      id,
      source
    });

    dispatch(refreshMsgs());
    dispatch(getAccountInfo());
    dispatch(getCheckinInfo());
    dispatch(freshItems());
    dispatch(showRoomList(0));

    return;
  });
}

function loggedOut(): Action {
  configureAPIToken(null);
  NimSession.logout();

  // Navigation.dismissAllModals({
  //   animationType: 'none' // 'none' / 'slide-down' , dismiss animation for the modal (optional, default 'slide-down')
  // });

  // Navigation.showModal({
  //   screen: 'CP.LoginScreen', // unique ID registered with Navigation.registerScreen
  //   //title: '游戏', // title of the screen as appears in the nav bar (optional)
  //   passProps: {}, // simple serializable object that will pass as props to the modal (optional)
  //   navigatorStyle: { navBarHidden: true }, // override the navigator style for the screen, see "Styling the navigator" below (optional)
  //   navigatorButtons: {}, // override the nav buttons for the screen, see "Adding buttons to the navigator" below (optional)
  //   animationType: 'none' // 'none' / 'slide-up' , appear animation for the modal (optional, default 'slide-up')
  // });

  showLoginModal();

  return {
    type: "LOGGED_OUT"
  };
}

async function _mobileCodeReq(mobilePhone: string): Promise<Object> {
  try {
    let response = await APIRequest("account/phoneRegist", {
      phone:mobilePhone
    });

    if(response.StatusCode != API_RESULT.STATUS_OK){
      throw Error(response.ReasonPhrase);
    }

    return response;
  } catch(e) {
    throw Error(e.message);
  }
}

function mobileCodeReq(mobilePhone: string): ThunkAction {
  return (): Object => {
    const response = _mobileCodeReq(mobilePhone);
    response.then((): any => {
      toastShow("验证码发送成功");
    },
    (err: Error) => {
      //Alert.alert(err.message)
      toastShow("验证码发送失败:" + err.message);
    });

    return response;
  };
}

async function _mobileLogin(mobilePhone: string, code: string): Promise<Object> {
  try {
    let jpushDevice = await GetDeviceToken();
    let response = await APIRequest("account/phoneLogin", {
      phone:mobilePhone, code:code, jpushDevice
    });

    if(response.StatusCode != API_RESULT.STATUS_OK){
      throw Error(response.ReasonPhrase);
    }

    return response;
  } catch(e) {
    throw Error(e.message);
  }
}

function mobileLogin(mobilePhone: string, code: string): ThunkAction {
  return (dispatch: Dispatch): Object => {
    const response = _mobileLogin(mobilePhone, code);
    response.then((result: Object): any => {
      toastShow("登录成功");
      dispatch(loggedIn(result.account, result.token, result.id));
    },
    (err: Error) => {
      //Alert.alert(err.message)
      toastShow("登录失败:" + err.message);
    });

    return response;
  };
}

async function _wxLogin(code: string): Promise<Object> {
  try {
    let jpushDevice = await GetDeviceToken();
    let response = await APIRequest("account/wxLogin", {
      code, jpushDevice
    });

    if(response.StatusCode != API_RESULT.STATUS_OK){
      throw Error(response.ReasonPhrase);
    }

    return response;
  } catch(e) {
    throw Error(e.message);
  }
}

function wxLogin(code: string): ThunkAction {
  return (dispatch: Dispatch): Object => {
    const response = _wxLogin(code);
    response.then((result: Object): any => {
      console.log();
      dispatch(loggedIn(result.account, result.token, result.id));
    },
    (err: Error) => {
      //Alert.alert(err.message)
      toastShow("登录失败:" + err.message);
    });

    return response;
  };
}

async function _getAccountInfo(): Promise<Object> {
  try {
    let response = await APIRequest("account/accountInfo", {}, true);

    if(response.StatusCode != API_RESULT.STATUS_OK){
      throw Error(response.ReasonPhrase);
    }

    return response;
  } catch(e) {
    throw Error(e.message);
  }
}

function getAccountInfo(): ThunkAction {
  return (dispatch: Dispatch): Object => {
    const response = _getAccountInfo();

    response.then((result: Object): any => {
      dispatch({
        type: "ACCOUNT_INFO",
        // nickName: result.nickName,
        // roomID: result.roomID,
        // meetingName: result.roomID,
        // diamond: result.diamond,
        // gold: result.gold,
        // integral: result.integral,
        // entityID: result.entityID,
        // headUrl: result.url,
        // entityState: result.entityState
        accountInfo: result.info
      });

      if (result.info.roomID != 0 && result.info.entityState === API_ENUM.ES_Game) {
        PlatformAlert(
          "提醒",
          "检测到您上次在" + getMachineName(result.info.roomID) + "游戏是否要继续?",
          "继续",
          "取消",
          () => {
            showModal({
              screen: "CP.GameScreen",
              title: "游戏",
              passProps: {roomID:result.info.roomID},
              navigatorStyle: { navBarHidden: true },
              navigatorButtons: {},
              animationType: "slide-up"
            });
          },
          () => {
            dispatch(leaveRoom());
          }
        );
      }
      else if (result.info.roomID != 0 && result.info.entityState === API_ENUM.ES_QueueTimeout) {
        PlatformAlert(
          "提醒",
          "检测到您上次在" + getMachineName(result.info.roomID) + "排队并且已经超时是否要继续?",
          "继续",
          "取消",
          () => {
            showModal({
              screen: "CP.GameScreen",
              title: "游戏",
              passProps: {roomID:result.info.roomID},
              navigatorStyle: { navBarHidden: true },
              navigatorButtons: {},
              animationType: "slide-up"
            });
          }
        );
      }
      else if (result.info.roomID != 0 && result.info.entityState === API_ENUM.ES_Queue) {
        PlatformAlert(
          "提醒",
          "检测到您上次在" + getMachineName(result.info.roomID) + "排队是否要进入该房间?",
          "进入",
          "取消",
          () => {
            showModal({
              screen: "CP.GameScreen",
              title: "游戏",
              passProps: {roomID:result.info.roomID},
              navigatorStyle: { navBarHidden: true },
              navigatorButtons: {},
              animationType: "slide-up"
            });
          }
        );
      }
    },
    (err: Error) => {
      console.log("getAccountInfo err:" + err.message);
    });

    return response;
  };
}

module.exports = { logIn, loggedOut, getAccountInfo, mobileCodeReq, mobileLogin, wxLogin };
