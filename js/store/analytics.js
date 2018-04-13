/* eslint no-unused-vars: "off" */

"use strict";

import track from "./track";

module.exports = store => next => action => {
  track(action);
  return next(action);
};
