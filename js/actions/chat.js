//@flow

"use strict";

import { APIRequest, API_RESULT } from "../api";
import type { Action, ThunkAction, Dispatch } from "./types";
import { toastShow } from "./../util";

async function _getChatHistory(roomID: number, readIdx: number = 0): Promise<Object> {
  try {
    let response = await APIRequest("room/chatHistory.action", { roomID, readIdx }, true);

    if(response.StatusCode != API_RESULT.STATUS_OK){
      throw Error(response.ReasonPhrase);
    }

    return response;
  } catch(e) {
    throw Error(e.message);
  }
}

function getChatHistory(roomID: number): ThunkAction {
  return (dispatch: Dispatch, getState: GetState): Object => {
    const response = _getChatHistory(roomID, getState().chat ? getState().chat.readIdx : 0);
    response.then((result: Object): any => {
      dispatch({
        type: "UPDATE_CHAT_MSGS",
        chatList: result.chatList,
        readIdx: result.index
      });
    },
    (err: Error) => {
      console.log("getChatHistory failed reason=" + err.message);
      toastShow("获得聊天失败:" + err.message);
    });

    return response;
  };
}

async function _chatReq(roomID: number, content: string): Promise<Object>{
  try {
    let response = await APIRequest("room/chat.action", { roomID, content }, true);

    if(response.StatusCode != API_RESULT.STATUS_OK){
      throw Error(response.ReasonPhrase);
    }

    return response;
  } catch(e) {
    throw Error(e.message);
  }
}

function chatReq(roomID: number, content: string): ThunkAction {
  return (dispatch: Dispatch): Object => {
    let response = _chatReq(roomID, content);
    response.then((): any => {
      dispatch(getChatHistory(roomID));
    },
    (err: Error) => {
      console.log("chatReq failed reason=" + err.message);
      toastShow("发送聊天失败:" + err.message);
    });

    return response;
  };
}

function clearChatMsg(): Action {
  return {
    type: "CLEAR_CHAT_MSGS"
  };
}


module.exports = { getChatHistory, chatReq, clearChatMsg };
