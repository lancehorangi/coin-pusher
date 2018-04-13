/**
 * @flow
 */

"use strict";

import type { Action } from "../actions/types";
import RNTalkingdataGame from "react-native-talkingdata-game";
import RNBugly from "react-native-bugly";

function track(action: Action): any {
  switch (action.type) {
  case "LOGGED_IN":
    //F8Analytics.logEvent("Login", 1, { source: action.source || "" });
    RNTalkingdataGame.setAccountName(action.account, action.account);
    RNBugly.setUserIdentifier(action.account);
    break;
  }

  return;
}

module.exports = track;
