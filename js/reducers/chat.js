/**
 * @flow
 */

"use strict";

import type { Action } from "../actions/types";

export type State = {
  chatList: Array<Object>,
  readIdx: number
};

const initialState = {
  chatList: [],
  readIdx: 0
};

function chat(state: State = initialState, action: Action): State {
  if(action.type === "LOGGED_OUT"){
    return initialState;
  }

  if (action.type === "UPDATE_CHAT_MSGS") {
    let { chatList } = state;
    let { readIdx } = action;
    let chatListNew = action.chatList;
    let mergeChatList = chatList.concat(chatListNew);
    
    return {
      ...state,
      chatList: mergeChatList,
      readIdx
    };
  }

  if (action.type === "CLEAR_CHAT_MSGS") {
    return initialState;
  }

  return state;
}

module.exports = chat;
