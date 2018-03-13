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
  isLoggedIn: boolean,
  token: string,
  account: string,
  nickName: ?string,
  diamond: ?number,
  gold: ?number,
  integral: ?number,
  source: ?string,
  checkinInfo: ?Array<Object>,
};

const initialState = {
  isLoggedIn: false,
  token: null,
  account: null,
  nickName: '',
  diamond: 0,
  gold: 0,
  integral: 0,
  source: null,
  checkinInfo: null,
};

function user(state: State = initialState, action: Action): State {
  if (action.type === "LOGGED_IN") {
    let { token, account } = action;

    configureAPIToken(token);

    return {
      ...initialState,
      isLoggedIn: true,
      token,
      account
    };
  }

  if(action.type === "LOGGED_OUT"){
    return initialState;
  }

  if(action.type === "ACCOUNT_INFO") {
    return {
      ...state,
      nickName: action.nickName,
      //roomID: action.roomID,
      //meetingName: action.roomID,
      diamond: action.diamond,
      gold: action.gold,
      integral: action.integral,
    }
  }

  if(action.type === "CHECKIN_INFO") {
    return {
      ...state,
      checkinInfo: action.checkinInfo,
    }
  }

  return state;
}

module.exports = user;
