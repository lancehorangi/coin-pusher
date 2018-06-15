/**
 * @flow
 */

"use strict";

import type { Action } from "../actions/types";
// @ANDROID_TODO
// import RNTalkingdataGame from "react-native-talkingdata-game";
// import RNBugly from "react-native-bugly";
// @ANDROID_TODO END

function track(action: Action): any {
  switch (action.type) {
  case "LOGGED_IN":
    // @ANDROID_TODO
    // RNTalkingdataGame.setAccountName(action.account, action.account);
    // RNBugly.setUserIdentifier(action.account);
    // @ANDROID_TODO END
    break;
  }

  return;
}

module.exports = track;
