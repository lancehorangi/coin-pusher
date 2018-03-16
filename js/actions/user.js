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
import { APIRequest, configureAPIToken } from '../api';
import { STATUS_OK } from '../env';
import type { Action, ThunkAction } from "./types";
import { toastShow } from './../util';

async function _getAccountHistory(): Promise<Action>{
  try {
    let response = await APIRequest('account/getHistory', {}, true);

    if(response.StatusCode != STATUS_OK){
      throw Error(response.ReasonPhrase);
    }

    return response;
  } catch(e) {
    throw Error(e.message);
  };
}

function getAccountHistory(): ThunkAction {
  return (dispatch, getState) => {
    let responese = _getAccountHistory();
    responese.then( result => dispatch({
      type: "ACCOUNT_GAME_HISTORY",
      accountGameHistory: result.list
    }),
    err => {
      console.log('getAccountHistory failed reason=' + err.message);
      toastShow('获取个人游戏记录失败:' + err.message)
    });
  };
}

async function _heartRequest() {
  try {
    let response = await APIRequest('account/heart', {}, true);

    if(response.StatusCode != STATUS_OK){
      throw Error(response.ReasonPhrase);
    }

    return response;
  } catch(e) {
    throw Error(e.message);
  };
}

function heartRequest(): ThunkAction {
  return (dispatch, getState) => {
    let responese = _heartRequest();
    responese.then( result => dispatch({
      type: "TICK_INFO",
      gold: result.gold,
      integral: result.integral,
    }),
    err => {
      console.warn('heartRequest failed reason=' + err.message);
    });
  }
}

async function _freshMoney() {
  try {
    let response = await APIRequest('account/moneyInfo', {}, true);

    if(response.StatusCode != STATUS_OK){
      throw Error(response.ReasonPhrase);
    }

    return response;
  } catch(e) {
    throw Error(e.message);
  };
}

function freshMoney(): ThunkAction {
  return (dispatch, getState) => {
    let responese = _freshMoney();
    responese.then( result => dispatch({
      type: "ACCOUNT_UPDATE_MONEY",
      gold: result.gold,
      integral: result.integral,
      diamond: result.diamond,
    }),
    err => {
      console.warn('moneyFresh failed reason=' + err.message);
    });
  }
}

async function _freshItems() {
  try {
    let response = await APIRequest('account/bagInfo', {}, true);

    if(response.StatusCode != STATUS_OK){
      throw Error(response.ReasonPhrase);
    }

    return response;
  } catch(e) {
    throw Error(e.message);
  };
}

function freshItems(): ThunkAction {
  return (dispatch, getState) => {
    let responese = _freshItems();
    responese.then( result => dispatch({
      type: "ACCOUNT_UPDATE_ITEMS",
      items: result.bag,
    }),
    err => {
      console.warn('freshItems failed reason=' + err.message);
    });
  }
}

module.exports = { getAccountHistory, heartRequest, freshMoney, freshItems };
