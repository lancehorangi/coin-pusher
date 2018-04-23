/**
 * @flow
 */

"use strict";

import { combineReducers } from "redux";

module.exports = combineReducers({
  user: require("./user"),
  lobby: require("./lobby"),
  msgs: require("./msgs"),
  appNavigator: require("./appNavigator"),
  mall: require("./mall"),
  room: require("./room"),
  chat: require("./chat")
});
