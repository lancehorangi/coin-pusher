/**
 * @flow
 */

"use strict";

import type { Action } from "../actions/types";

export type State = {
  list: null | Array<Object>,
  roomType?: number,
  baseCost?: number,
  bannerList: Array<string>
};

const initialState = {
  list: null,
  bannerList: []
};

function lobby(state: State = initialState, action: Action): State {
  if (action.type === "ROOM_LIST") {
    return {
      ...state,
      list: action.list,
      roomType: action.roomType,
      baseCost: action.baseCost,
    };
  }

  if(action.type === "CLEAR_ROOM_LIST"){
    return {
      list: null,
    };
  }

  if(action.type === "LOGGED_OUT"){
    return initialState;
  }

  if (action.type === "UPDATE_BANNER_INFO") {
    let {bannerList} = action;
    return {
      ...state,
      bannerList
    };
  }

  return state;
}

module.exports = lobby;
