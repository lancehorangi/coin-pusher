/**
 * Copyright 2016 Facebook, Inc.
 *
 * You are hereby granted a non-exclusive, worldwide, royalty-free license to
 * use, copy, modify, and distribute this software in source code or binary
 * form for use in connection with the web services and APIs provided by
 * Facebook.
 *
 * As with any software that integrates with the Facebook platform, your use
 * of this software is subject to the Facebook Developer Principles and
 * Policies [http://developers.facebook.com/policy/]. This copyright notice
 * shall be included in all copies or substantial portions of the software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL
 * THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
 * DEALINGS IN THE SOFTWARE
 *
 * @flow
 */

"use strict";

import { Alert } from 'react-native';
import type { Action } from "../actions/types";
import { configureAPIToken } from '../api';

export type State = {
  msgs: Object,
  bLoading: boolean,
  unreadNum: ?number
};

const initialState = {
  msgs: null,
  bLoading: false,
  unreadNum: 0
};

function msgs(state: State = initialState, action: Action): State {
  if (action.type === "MSG_LIST") {
    let bLoading = true;
    return {
      ...state,
      bLoading
    };
  }

  if(action.type === "MSG_LIST_SUCC"){
    let { msgs, unreadNum } = action;
    return {
      ...state,
      msgs,
      unreadNum,
      bLoading: false
    };
  }

  if(action.type === "MSG_LIST_FAILED"){
    return {
      ...state,
      bLoading: false
    };
  }

  if(action.type === "LOGGED_OUT"){
    return initialState;
  }

  return state;
}

module.exports = msgs;
