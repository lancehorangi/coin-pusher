/**
 * @flow
 */

"use strict";

import type { Action } from "../actions/types";
import { configureAPIToken } from "../api";

export type State = {
  isLoggedIn: boolean,
  token: null | string,
  account: null | string,
  nickName: ?string,
  diamond: ?number,
  gold: ?number,
  integral: ?number,
  source: ?string,
  checkinInfo: ?Array<Object>,
  accountGameHistory: ?Array<Object>,
  items: ?Array<Object>,
  id: ?number
};

const initialState = {
  isLoggedIn: false,
  token: null,
  account: null,
  nickName: "",
  diamond: 0,
  gold: 0,
  integral: 0,
  source: null,
  checkinInfo: null,
  accountGameHistory: null,
  items: null,
  id: 0,
};

function user(state: State = initialState, action: Action): State {
  if (action.type === "LOGGED_IN") {
    let { token, account, id } = action;

    configureAPIToken(token);

    return {
      ...initialState,
      isLoggedIn: true,
      token,
      id,
      account
    };
  }

  if(action.type === "LOGGED_OUT"){
    return initialState;
  }

  if(action.type === "ACCOUNT_INFO") {
    return {
      ...state,
      nickName: action.nickName,
      //roomID: action.roomID,
      //meetingName: action.roomID,
      diamond: action.diamond,
      gold: action.gold,
      integral: action.integral,
      entityID: action.entityID,
      headUrl: action.headUrl,
    };
  }

  if(action.type === "CHECKIN_INFO") {
    return {
      ...state,
      checkinInfo: action.checkinInfo,
    };
  }

  if (action.type === "ACCOUNT_GAME_HISTORY") {
    return {
      ...state,
      accountGameHistory: action.accountGameHistory,
    };
  }

  if (action.type === "TICK_INFO") {
    return {
      ...state,
      gold: action.gold,
      integral: action.integral,
    };
  }

  if (action.type === "ACCOUNT_UPDATE_MONEY") {
    return {
      ...state,
      gold: action.gold,
      integral: action.integral,
      diamond: action.diamond,
    };
  }

  if (action.type === "ACCOUNT_UPDATE_ITEMS") {
    return {
      ...state,
      items: action.items,
    };
  }

  return state;
}

module.exports = user;
