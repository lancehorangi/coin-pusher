/**
 * @flow
 */

"use strict";

import type { Action } from "../actions/types";

export type State = {
  msgs: null | Object,
  unreadNum: ?number,
  openMail: ?Object
};

const initialState = {
  msgs: null,
  unreadNum: 0,
  openMail: null,
};

function msgs(state: State = initialState, action: Action): State {
  if(action.type === "MSG_LIST"){
    let { msgs, unreadNum } = action;

    return {
      ...state,
      msgs,
      unreadNum,
    };
  }

  if(action.type === "LOGGED_OUT"){
    return initialState;
  }

  if (action.type === "OPEN_MSG") {
    let { openMail } = action;
    return {
      ...state,
      openMail,
    };
  }

  return state;
}

module.exports = msgs;
