/**
 * @flow
 */

"use strict";

import * as loginActions from "./login";
import * as lobbyActions from "./lobby";
import * as msgsActions from "./msgs";
import * as naviActions from "./appNavigator";
import * as checkinActions from "./checkin";
import * as mallActions from "./mall";
import * as usersActions from "./user";
import * as chatActions from "./chat";

module.exports = {
  ...loginActions,
  ...lobbyActions,
  ...msgsActions,
  ...naviActions,
  ...checkinActions,
  ...mallActions,
  ...usersActions,
  ...chatActions
};
