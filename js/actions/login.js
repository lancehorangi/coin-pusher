/**
 * Copyright 2016 Facebook, Inc.
 *
 * You are hereby granted a non-exclusive, worldwide, royalty-free license to
 * use, copy, modify, and distribute this software in source code or binary
 * form for use in connection with the web services and APIs provided by
 * Facebook.
 *
 * As with any software that integrates with the Facebook platform, your use
 * of this software is subject to the Facebook Developer Principles and
 * Policies [http://developers.facebook.com/policy/]. This copyright notice
 * shall be included in all copies or substantial portions of the software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL
 * THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
 * DEALINGS IN THE SOFTWARE
 */

"use strict";

import { Platform, Alert } from "react-native";
import { Navigation } from 'react-native-navigation';
import { APIRequest, configureAPIToken } from '../api';
import { STATUS_OK } from '../env';
import { NimUtils, NimSession } from 'react-native-netease-im';
import type { Action, ThunkAction } from "./types";
import { toastShow } from './../util';
import { showRoomList } from './lobby';
import { refreshMsgs } from './msgs';
import { getCheckinInfo, checkin } from './checkin';
import { showModal, showLoginModal, hideLoginModal, dismissModal } from './../navigator';
import { freshMoney, freshItems } from './user';

async function _logIn(username: string, pwd: string) : Promise<Action> {
  try {
    let response = await APIRequest('account/getToken', {
        account:username, password:pwd
       });

    if(response.StatusCode != STATUS_OK){
      throw Error(response.ReasonPhrase);
    }

    return response;
  } catch(e) {
    throw Error(e.message);
  };
}

function logIn(account: string, pwd: string, source: ?string): ThunkAction {
  return (dispatch, getState) => {
    const response = _logIn(account, pwd);
    response.then(result => dispatch(loggedIn(result.account, result.token)),
      err => {
        Alert.alert("登录失败(" + err.message + ")");
      });
  };
}

async function _loggedIn( ) : Promise<Action> {
  // try {
  //   await ;
  //
  // } catch(e) {
  //   throw Error(e.message);
  // };
}

function loggedIn(account: string, token: string, source: ?string): ThunkAction {
  return (dispatch, getState) => {
    NimSession.logout();
    console.log("Netease IM login account=" + account + ", token=" + token);

    NimSession.login(account, token)
    .then(size => {
      console.log("Netease IM login succ")
    }, e => {
      console.warn("Netease IM login failed=" + e.message);
    });

    // Navigation.dismissModal({
    //   animationType: 'slide-down' // 'none' / 'slide-down' , dismiss animation for the modal (optional, default 'slide-down')
    // });

    //Toast.show('登录成功');

    hideLoginModal();

    dispatch({
      type: "LOGGED_IN",
      account,
      token,
      source
    })

    dispatch(showRoomList(0));
    dispatch(refreshMsgs());
    dispatch(getAccountInfo());
    dispatch(getCheckinInfo());
    dispatch(freshItems());
    // return {
    //   type: "LOGGED_IN",
    //   account,
    //   token,
    //   source
    // };
  }
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
  }
}

async function _mobileCodeReq(mobilePhone: string) : Promise<Action> {
  try {
    let response = await APIRequest('account/phoneRegist', {
        phone:mobilePhone
       });

    if(response.StatusCode != STATUS_OK){
      throw Error(response.ReasonPhrase);
    }

    return response;
  } catch(e) {
    throw Error(e.message);
  };
}

function mobileCodeReq(mobilePhone: string): ThunkAction {
  return (dispatch, getState) => {
    const response = _mobileCodeReq(mobilePhone);
    response.then(result => {
      toastShow('验证码发送成功');
    },
    err => {
      //Alert.alert(err.message)
      toastShow("验证码发送失败:" + err.message);
    });

    return response;
  };
}

async function _mobileLogin(mobilePhone: string, code: string) : Promise<Action> {
  try {
    let response = await APIRequest('account/phoneLogin', {
        phone:mobilePhone, code:code
       });

    if(response.StatusCode != STATUS_OK){
      throw Error(response.ReasonPhrase);
    }

    return response;
  } catch(e) {
    throw Error(e.message);
  };
}

function mobileLogin(mobilePhone: string, code: string): ThunkAction {
  return (dispatch, getState) => {
    const response = _mobileLogin(mobilePhone, code);
    response.then(result => {
      toastShow('登录成功');
      dispatch(loggedIn(result.account, result.token));
    },
    err => {
      //Alert.alert(err.message)
      toastShow("登录失败:" + err.message);
    });

    return response;
  };
}

async function _wxLogin(code: string) : Promise<Action> {
  try {
    let response = await APIRequest('account/wxLogin', {
        code
       });

    if(response.StatusCode != STATUS_OK){
      throw Error(response.ReasonPhrase);
    }

    return response;
  } catch(e) {
    throw Error(e.message);
  };
}

function wxLogin(code: string): ThunkAction {
  return (dispatch, getState) => {
    const response = _wxLogin(code);
    response.then(result => {
      console.log()
      dispatch(loggedIn(result.openID, result.token));
    },
    err => {
      //Alert.alert(err.message)
      toastShow("登录失败:" + err.message);
    });

    return response;
  };
}

async function _getAccountInfo() : Promise<Action> {
  try {
    let response = await APIRequest('account/accountInfo', {}, true);

    if(response.StatusCode != STATUS_OK){
      throw Error(response.ReasonPhrase);
    }

    return response;
  } catch(e) {
    throw Error(e.message);
  };
}

function getAccountInfo(): ThunkAction {
  return (dispatch, getState) => {
    const response = _getAccountInfo();

    response.then(result => {
      dispatch({
      type: 'ACCOUNT_INFO',
      nickName: result.nickName,
      roomID: result.roomID,
      meetingName: result.roomID,
      diamond: result.diamond,
      gold: result.gold,
      integral: result.integral,
      entityID: result.entityID,
      headUrl: result.url,
    });

    if (result.roomID != 0) {
      showModal({
        screen: 'CP.GameScreen', // unique ID registered with Navigation.registerScreen
        title: '游戏', // title of the screen as appears in the nav bar (optional)
        passProps: {roomID:result.roomID}, // simple serializable object that will pass as props to the modal (optional)
        navigatorStyle: { navBarHidden: true }, // override the navigator style for the screen, see "Styling the navigator" below (optional)
        navigatorButtons: {}, // override the nav buttons for the screen, see "Adding buttons to the navigator" below (optional)
        animationType: 'slide-up' // 'none' / 'slide-up' , appear animation for the modal (optional, default 'slide-up')
      });
    }
  },
      err => {
        console.log('getAccountInfo err:' + err.message);
    });
  }
}

module.exports = { logIn, loggedOut, getAccountInfo, mobileCodeReq, mobileLogin, wxLogin };
