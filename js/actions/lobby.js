//@flow
"use strict";

import { APIRequest, API_ENUM, API_RESULT } from "../api";
import { NimUtils } from "react-native-netease-im";
import { toastShow } from "../util";
import { heartRequest } from "./user";
import type { Action, ThunkAction, Dispatch } from "./types";

async function _roomList(roomType: number): Promise<Object> {
  try {
    let response = await APIRequest("room/list", {type:roomType}, true);

    if(response.StatusCode != API_RESULT.STATUS_OK){
      throw Error("room/list failed reason=" + response.ReasonPhrase);
    }

    return response;
  } catch(e) {
    console.warn("_roomList failed=" + e);
    throw e;
  }
}

function showRoomList(roomType: number): ThunkAction {
  return (dispatch: Dispatch): Object => {
    const response = _roomList(roomType);
    response.then((result: Object): any => dispatch({
      type: "ROOM_LIST",
      list: result.list,
      baseCost: result.baseCoins,
      roomType: roomType
    }), (err: Object) => {
      console.warn("showRoomList failed=" + err.message);
      //toastShow("刷新房间列表失败:" + err.message);
    });

    return response;
  };
}

async function _roomInfo(roomID: string): Promise<Object> {
  try {
    let response = await APIRequest("room/info", {roomid: roomID}, true);

    if(response.StatusCode != API_RESULT.STATUS_OK){
      throw Error(response.ReasonPhrase);
    }

    //NimUtils.leaveMeeting();

    return response;
  } catch(e) {
    throw Error(e.message);
  }
}

function roomInfo(roomID: string): ThunkAction {
  return (dispatch: Dispatch): Object => {
    const response = _roomInfo(roomID);
    response.then((result: Object): any => {
      dispatch({
        type: "CURR_ROOM_INFO",
        roomInfo: result.info,
      });
    }, (err: Object) => {
      console.warn("roomInfo failed=" + err.message);
      toastShow("查询房间信息失败:" + err.message);
    });
    return response;
  };
}

async function _enterRoom(roomID: string): Promise<Object> {
  try {
    let response = await APIRequest("room/enter", {roomid: roomID}, true);

    if(response.StatusCode != API_RESULT.STATUS_OK){
      throw Error(response.ReasonPhrase);
    }

    return response;
  } catch(e) {
    throw Error(e.message);
  }
}

function enterRoom(roomID: string): ThunkAction {
  return (dispatch: Dispatch): Object => {
    const response = _enterRoom(roomID);
    response.then((result: Object): any => {
      dispatch({
        type: "ACCOUNT_INFO",
        accountInfo: result.accountInfo
      });
      dispatch({
        type: "CURR_ROOM_INFO",
        roomInfo: result.roomInfo
      });
    }, (err: Object) => {
      console.warn("enterRoom failed=" + err.message);
      //toastShow("进入房间失败:" + err.message);
    });
    return response;
  };
}

async function _queueRoom(roomID: string): Promise<Object> {
  try {
    let response = await APIRequest("room/queue", {roomid: roomID}, true);

    if (response.StatusCode == API_RESULT.NOT_ENOUGH_DIAMOND) {
      throw Error(API_RESULT.NOT_ENOUGH_DIAMOND);
    }
    else if(response.StatusCode != API_RESULT.STATUS_OK){
      throw Error(response.ReasonPhrase);
    }

    return response;
  } catch(e) {
    throw Error(e.message);
  }
}

function queueRoom(roomID: string): ThunkAction {
  return (dispatch: Dispatch): Object => {
    const response = _queueRoom(roomID);
    response.then((result: Object): any => {
      dispatch({
        type: "ACCOUNT_INFO",
        accountInfo: result.info
      });
    }, (err: Object) => {
      console.warn("queueRoom failed=" + err.message);
      //toastShow("进入房间失败:" + err.message);
    });
    return response;
  };
}

async function _connectMeeting(meetingName: string): Promise<Action> {
  try {
    NimUtils.leaveMeeting();
    let nimresult = await NimUtils.joinMeeting(meetingName);

    return nimresult;
  } catch(e) {
    throw Error(e.message);
  }
}

function connectMeeting(meetingName: string): ThunkAction {
  return (): Object => {
    const response = _connectMeeting(meetingName);
    return response;
  };
}

async function _leaveRoom(): Promise<Action> {
  try {
    let response = await APIRequest("room/leave", { }, true);

    if(response.StatusCode != API_RESULT.STATUS_OK){
      throw Error(response.ReasonPhrase);
    }

    NimUtils.leaveMeeting();
    return response;
  } catch(e) {
    throw Error(e.message);
  }
}

function leaveRoom(): ThunkAction {
  return (dispatch: Dispatch): Object => {
    const response = _leaveRoom();
    response.then((): any => {
      dispatch(heartRequest());
    }, (err: Error) => {
      console.warn("离开房间失败:" + err.message);
    });
    return response;
  };
}

async function _pushCoin(): Promise<Action> {
  try {
    let response = await APIRequest("room/pushCoin", {}, true);

    if(response.StatusCode != API_RESULT.STATUS_OK){
      throw Error(response.ReasonPhrase);
    }

    return response;
  } catch(e) {
    throw Error(e.message);
  }
}

function pushCoin(): ThunkAction {
  return (): Object => {
    const response = _pushCoin();
    response.then((): any => {

    }, (err: Error) => {
      toastShow("投币失败:" + err.message);
    });
    return response;
  };
}

async function _getRoomHistory(id: number): Promise<Object> {
  try {
    let response = await APIRequest("machine/getHistory", {id}, true);

    if(response.StatusCode != API_RESULT.STATUS_OK){
      throw Error(response.ReasonPhrase);
    }

    return response;
  } catch(e) {
    throw Error(e.message);
  }
}

function getRoomHistory(id: number): ThunkAction {
  return (dispatch: Dispatch): Object => {
    const response = _getRoomHistory(id);
    response.then((result: Object): any => {
      dispatch({
        type: "ROOM_HISTORY_INFO",
        roomGameHistory: result.list,
      });
    });

    return response;
  };
}

module.exports = {
  showRoomList,
  enterRoom,
  pushCoin,
  leaveRoom,
  getRoomHistory,
  connectMeeting,
  roomInfo,
  queueRoom
};
