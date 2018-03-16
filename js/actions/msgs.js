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

async function _refreshMsgs() : Promise<Action> {
  try {
    let response = await APIRequest('account/mailList', { }, true);

    if(response.StatusCode != STATUS_OK){
      throw Error(response.ReasonPhrase);
    }

    return response;
  } catch(e) {
    throw Error(e.message);
  };
}

function refreshMsgs(): ThunkAction {
  return (dispatch, getState) => {
    const response = _refreshMsgs();
    response.then(result => dispatch(_succ(result.mailList, result.unreadNum)),
      err => {
        console.log('mailList failed reason=' + err.message);
        toastShow('邮件刷新失败:' + err.message)
      });

    return response;
  };
}

async function _openMsg(mailID: number): Promise<Action>{
  try {
    let response = await APIRequest('account/mailRead', {id:mailID }, true);

    if(response.StatusCode != STATUS_OK){
      throw Error(response.ReasonPhrase);
    }

    return response;
  } catch(e) {
    throw Error(e.message);
  };
}

function openMsg(mailID: nubmer): ThunkAction {
  return (dispatch, getState) => {
    let response = _openMsg(mailID);
    response.then( result => dispatch({
      type: "OPEN_MSG",
      openMail: result.info
    }),
    err => {
      console.log('openMsg failed reason=' + err.message);
      toastShow('打开邮件失败:' + err.message)
    });

    return response;
  };
}

async function _getMailAcessory(mailID: number): Promise<Action> {
  try {
    let response = await APIRequest('mail/pull', {id:mailID}, true);

    if(response.StatusCode != STATUS_OK){
      throw Error(response.ReasonPhrase);
    }

    return response;
  } catch(e) {
    throw Error(e.message);
  };
}

function getMailAccessory(mailID: number): ThunkAction {
  return (dispatch, getState) => {
    let response = _getMailAcessory(mailID);

    response.then( result => dispatch({
      type: "OPEN_MSG",
      openMail: result.info
    }),
    err => {
      console.log('pullMsg failed reason=' + err.message);
      toastShow('领取附件失败:' + err.message)
    });

    return response;
  }
}

function _succ(msgs: Object, unreadNum: number): Action {
  return {
    type: "MSG_LIST",
    msgs,
    unreadNum
  };
}

module.exports = { refreshMsgs, openMsg, getMailAccessory };
