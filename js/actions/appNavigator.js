//@flow

"use strict";

import type { Action } from "./types";

function setNavigator(navigator: Object): Action {
  return {
    type: "APP_SWITCH_TAB",
    navigator
  };
}

module.exports = { setNavigator };
