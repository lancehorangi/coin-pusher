//@flow
"use strict";

import { APIRequest, API_RESULT } from "../api";
import type { ThunkAction, Dispatch } from "./types";
import { toastShow } from "./../util";
import { freshMoney, freshItems } from "./user";

async function _getCheckinInfo(): Promise<Object> {
  try {
    let response = await APIRequest("account/getCheckinInfo", { }, true);

    if(response.StatusCode != API_RESULT.STATUS_OK){
      throw Error(response.ReasonPhrase);
    }

    return response;
  } catch(e) {
    throw Error(e.message);
  }
}

function getCheckinInfo(): ThunkAction {
  return (dispatch: Dispatch): any => {
    const response = _getCheckinInfo();

    response.then((result: Object): any => dispatch({
      type: "CHECKIN_INFO",
      checkinInfo: result.checkinList,
    }),
    (err: Error) => {
      console.log("getCheckinInfo failed reason=" + err.message);
    });

    return response;
  };
}

async function _checkin(type: number): Promise<Object> {
  try {
    let response = await APIRequest("account/checkin", { type }, true);

    if(response.StatusCode != API_RESULT.STATUS_OK){
      throw Error(response.ReasonPhrase);
    }

    return response;
  } catch(e) {
    throw Error(e.message);
  }
}

function checkin(type: number): ThunkAction {
  return (dispatch: Dispatch): any => {
    const response = _checkin(type);
    response.then((result: Object) => {
      toastShow("签到成功");
      dispatch(freshMoney());
      dispatch(freshItems());
      dispatch({
        type: "CHECKIN_INFO",
        checkinInfo: result.checkinList,
      });
    },
    (err: Error) => {
      toastShow("签到失败(" + err.message + ")");
      console.log("getCheckinInfo failed reason=" + err.message);
    });

    return response;
  };
}

module.exports = { getCheckinInfo, checkin };
