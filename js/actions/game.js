//@flow

"use strict";

import { APIRequest, API_RESULT } from "../api";
import type { ThunkAction } from "./types";
import { toastShow } from "./../util";

async function _switchWiper(): Promise<Object> {
  try {
    let response = await APIRequest("room/switchWiper", {}, true);

    if(response.StatusCode != API_RESULT.STATUS_OK){
      throw Error(response.ReasonPhrase);
    }

    return response;
  } catch(e) {
    throw Error(e.message);
  }
}

function switchWiper(): ThunkAction {
  return (): Object => {
    const response = _switchWiper();
    response.then((): any => {

    },
    (err: Error) => {
      console.log("switchWiper failed reason=" + err.message);
      toastShow("切换雨刷失败:" + err.message);
    });

    return response;
  };
}

async function _roomNotify(): Promise<Object> {
  try {
    let response = await APIRequest("room/notify.action", {}, true);

    if(response.StatusCode != API_RESULT.STATUS_OK){
      throw Error(response.ReasonPhrase);
    }

    return response;
  } catch(e) {
    throw Error(e.message);
  }
}

function roomNotify(): ThunkAction {
  return (): Object => {
    const response = _roomNotify();
    response.then((): any => {

    },
    (err: Error) => {
      console.log("roomNotify failed reason=" + err.message);
      //toastShow("切换雨刷失败:" + err.message);
    });

    return response;
  };
}

module.exports = { switchWiper, roomNotify };
