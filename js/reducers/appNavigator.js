/**
 * @flow
 */

"use strict";

import type { Action } from "../actions/types";

type navigatorType = {
  popToRoot: any => any,
  switchToTab: any => any
};

export type State = {
  navigator: null | navigatorType
};

const initialState = {
  navigator: null,
};

function appNavigator(state: State = initialState, action: Action): State {
  if (action.type === "APP_SWITCH_TAB") {
    return {
      navigator: action.navigator
    };
  }

  if (action.type === "LOGGED_OUT") {
    if(state.navigator) {
      state.navigator.popToRoot({
        animated: false
      });
    }

    if(state.navigator) {
      state.navigator.switchToTab({
        tabIndex: 0 // (optional) if missing, this screen's tab will become selected
      });
    }
  }

  return state;
}

module.exports = appNavigator;
