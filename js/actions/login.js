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
 */

"use strict";

import { Platform, Alert } from "react-native";
import { Navigation } from 'react-native-navigation';
import APIRequest from '../api';
import { STATUS_OK } from '../env';

import type { Action, ThunkAction } from "./types";

async function _logIn(username: string, pwd: string) : Promise<Action> {
  try {
    let response = await APIRequest('account/getToken', {
        account:username, password:pwd
       });

    Navigation.showInAppNotification({
        screen: "CP.Notification", // unique ID registered with Navigation.registerScreen
        passProps: {text:response.ReasonPhrase}, // simple serializable object that will pass as props to the in-app notification (optional)
        autoDismissTimerSec: 1 // auto dismiss notification in seconds
      });

    if(response.StatusCode != STATUS_OK){
      throw Error(response.ReasonPhrase);
    }

    return response;
  } catch(e) {
    throw Error(e.message);
  };
}

function logIn(username: string, pwd: string, source: ?string): ThunkAction {
  return (dispatch, getState) => {
    //let name = getState().user.name || "there";
    //dispatch(logOut())

    const response = _logIn(username, pwd);
    response.then(result => dispatch({
      type: "LOGGED_IN",
      token: result.token,
      account: result.account
    }), err => {Alert.alert(err.message)});
  };
}

function loggedIn(token: string, source: ?string): Action {
  return {
    type: "LOGGED_IN",
    token,
    source
  };
}

module.exports = { logIn, loggedIn };
