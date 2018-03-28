/**
 * @flow
 */

"use strict";

import type { Action } from "../actions/types";

export type State = {
  chargeList: null | Array<Object>
};

const initialState = {
  chargeList: null,
};

function mall(state: State = initialState, action: Action): State {
  if(action.type === "LOGGED_OUT"){
    return initialState;
  }

  if (action.type === "MALL_CHARGE_LIST") {
    let { chargeList } = action;
    return {
      ...state,
      chargeList
    };
  }

  if(action.type === "MALL_MARKET_LIST") {
    let { marketList } = action;
    return {
      ...state,
      marketList
    };
  }

  return state;
}

module.exports = mall;
