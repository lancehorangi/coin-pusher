//@flow

"use strict";

import { APIRequest, API_RESULT } from "../api";
import type { Action, ThunkAction, Dispatch } from "./types";
import { toastShow } from "./../util";
import { dismissModal } from "./../navigator";
import { NimUtils } from "react-native-netease-im";

async function _getAccountHistory(): Promise<Object>{
  try {
    let response = await APIRequest("account/getHistory", {}, true);

    if(response.StatusCode != API_RESULT.STATUS_OK){
      throw Error(response.ReasonPhrase);
    }

    return response;
  } catch(e) {
    throw Error(e.message);
  }
}

function getAccountHistory(): ThunkAction {
  return (dispatch: Dispatch): Object => {
    let responese = _getAccountHistory();
    responese.then((result: Object): any => dispatch({
      type: "ACCOUNT_GAME_HISTORY",
      accountGameHistory: result.list
    }),
    (err: Error) => {
      console.log("getAccountHistory failed reason=" + err.message);
      toastShow("获取个人游戏记录失败:" + err.message);
    });
    return responese;
  };
}

async function _heartRequest(): Promise<Object> {
  try {
    let response = await APIRequest("account/heart", {}, true);

    if(response.StatusCode != API_RESULT.STATUS_OK){
      throw Error(response.ReasonPhrase);
    }

    return response;
  } catch(e) {
    throw Error(e.message);
  }
}

function heartRequest(): ThunkAction {
  return (dispatch: Dispatch): Object => {
    let responese = _heartRequest();
    responese.then((result: Object): any => {
      if (result.kickFlag) {
        NimUtils.leaveMeeting();
        dismissModal("长时间未操作自动退出房间");
      }

      dispatch({
        type: "TICK_INFO",
        gold: result.gold,
        integral: result.integral
      });
    },
    (err: Error) => {
      console.warn("heartRequest failed reason=" + err.message);
    });

    return responese;
  };
}

async function _freshMoney(): Promise<Object> {
  try {
    let response = await APIRequest("account/moneyInfo", {}, true);

    if(response.StatusCode != API_RESULT.STATUS_OK){
      throw Error(response.ReasonPhrase);
    }

    return response;
  } catch(e) {
    throw Error(e.message);
  }
}

function freshMoney(): ThunkAction {
  return (dispatch: Dispatch): Object => {
    let responese = _freshMoney();
    responese.then((result: Object): any => dispatch({
      type: "ACCOUNT_UPDATE_MONEY",
      gold: result.gold,
      integral: result.integral,
      diamond: result.diamond,
    }),
    (err: Error) => {
      console.warn("moneyFresh failed reason=" + err.message);
    });

    return responese;
  };
}

async function _freshItems(): Promise<Action> {
  try {
    let response = await APIRequest("account/bagInfo", {}, true);

    if(response.StatusCode != API_RESULT.STATUS_OK){
      throw Error(response.ReasonPhrase);
    }

    return response;
  } catch(e) {
    throw Error(e.message);
  }
}

function freshItems(): ThunkAction {
  return (dispatch: Dispatch): Object => {
    let responese = _freshItems();
    responese.then((result: Object): any => dispatch({
      type: "ACCOUNT_UPDATE_ITEMS",
      items: result.bag,
    }),
    (err: Error) => {
      console.warn("freshItems failed reason=" + err.message);
    });

    return responese;
  };
}

async function _feedback(phone: string, content: string): Promise<Action> {
  try {
    let response = await APIRequest("account/feedback", {phone, content}, true);

    if(response.StatusCode != API_RESULT.STATUS_OK){
      throw Error(response.ReasonPhrase);
    }

    return response;
  } catch(e) {
    throw Error(e.message);
  }
}

function feedback(phone: string, content: string): ThunkAction {
  return (): Object => {
    let responese = _feedback(phone, content);
    responese.then(() => {
      toastShow("发送反馈成功");
    },
    (err: Error) => {
      console.warn("freshItems failed reason=" + err.message);
    });

    return responese;
  };
}

function toggleBGM(enable: boolean): Action {
  return {
    type: "TOGGLE_BGM",
    bgmEnabled: enable
  };
}

module.exports = { getAccountHistory, heartRequest, freshMoney, freshItems, feedback, toggleBGM };
