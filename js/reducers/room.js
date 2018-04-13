"use strict";

import type { Action } from "../actions/types";

export type State = {
  roomInfo: Object,
  roomGameHistory: Object,
};

const initialState = {
  roomInfo: null,
  roomGameHistory: null,
};

function room(state: State = initialState, action: Action): State {
  if(action.type === "CURR_ROOM_INFO"){
    return {
      ...state,
      roomInfo: action.roomInfo,
    };
  }

  if(action.type === "ROOM_HISTORY_INFO")
  {
    return {
      ...state,
      roomGameHistory: action.roomGameHistory,
    };
  }

  if(action.type === "LOGGED_OUT"){
    return initialState;
  }

  return state;
}

module.exports = room;
