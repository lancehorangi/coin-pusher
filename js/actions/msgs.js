//@flow

"use strict";

import { APIRequest, API_RESULT } from "../api";
import type { Action, ThunkAction, Dispatch } from "./types";
import { toastShow } from "./../util";

async function _refreshMsgs(): Promise<Object> {
  try {
    let response = await APIRequest("account/mailList", { }, true);

    if(response.StatusCode != API_RESULT.STATUS_OK){
      throw Error(response.ReasonPhrase);
    }

    return response;
  } catch(e) {
    throw Error(e.message);
  }
}

function refreshMsgs(): ThunkAction {
  return (dispatch: Dispatch): Object => {
    const response = _refreshMsgs();
    response.then((result: Object): any => {
      dispatch(_succ(result.mailList, result.unreadNum));
    },
    (err: Error) => {
      console.log("mailList failed reason=" + err.message);
      toastShow("消息刷新失败:" + err.message);
    });

    return response;
  };
}

async function _openMsg(mailID: number): Promise<Object>{
  try {
    let response = await APIRequest("account/mailRead", {id:mailID }, true);

    if(response.StatusCode != API_RESULT.STATUS_OK){
      throw Error(response.ReasonPhrase);
    }

    return response;
  } catch(e) {
    throw Error(e.message);
  }
}

function openMsg(mailID: number): ThunkAction {
  return (dispatch: Dispatch): Object => {
    let response = _openMsg(mailID);
    response.then((result: Object): any => dispatch({
      type: "OPEN_MSG",
      openMail: result.info
    }),
    (err: Error) => {
      console.log("openMsg failed reason=" + err.message);
      toastShow("打开消息失败:" + err.message);
    });

    return response;
  };
}

async function _getMailAcessory(mailID: number): Promise<Object> {
  try {
    let response = await APIRequest("mail/pull", {id:mailID}, true);

    if(response.StatusCode != API_RESULT.STATUS_OK){
      throw Error(response.ReasonPhrase);
    }

    return response;
  } catch(e) {
    throw Error(e.message);
  }
}

function getMailAccessory(mailID: number): ThunkAction {
  return (dispatch: Dispatch): Object => {
    let response = _getMailAcessory(mailID);

    response.then((result: Object): any => dispatch({
      type: "OPEN_MSG",
      openMail: result.info
    }),
    (err: Error) => {
      console.log("pullMsg failed reason=" + err.message);
      toastShow("领取附件失败:" + err.message);
    });

    return response;
  };
}

function _succ(msgs: Object, unreadNum: number): Action {
  return {
    type: "MSG_LIST",
    msgs,
    unreadNum
  };
}

module.exports = { refreshMsgs, openMsg, getMailAccessory };
