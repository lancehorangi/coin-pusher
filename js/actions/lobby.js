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

//@flow
"use strict";

import { Platform, Alert } from "react-native";
import { Navigation } from 'react-native-navigation';
import { APIRequest } from '../api';
import { STATUS_OK } from '../env';
import { NimUtils, NTESGLView, NimSession } from 'react-native-netease-im';
import { toastShow } from '../util';
import { heartRequest } from './user';
import type { Action, ThunkAction } from "./types";

async function _roomList(roomType: number) : Promise<Object> {
  try {
    let response = await APIRequest('room/list', {type:roomType}, true);

    if(response.StatusCode != STATUS_OK){
      throw Error("room/list failed reason=" + response.ReasonPhrase);
    }

    return response;
  } catch(e) {
    console.warn("_roomList failed=" + e);
    throw e;
  };
}

function showRoomList(roomType: number): ThunkAction {
  return (dispatch, getState) => {
    const response = _roomList(roomType);
    response.then(result => dispatch({
      type: "ROOM_LIST",
      list: result.list,
      baseCost: result.baseCoins,
      roomType: roomType
    }), err => {
      console.warn("showRoomList failed=" + err.message);
      toastShow('刷新房间列表失败:' + err.message);
    });

    return response;
  };
}

async function _enterRoom(roomID: string) : Promise<Object> {
  try {
    let response = await APIRequest('room/enter', {roomid: roomID}, true);

    if(response.StatusCode != STATUS_OK){
      throw Error(response.ReasonPhrase);
    }

    NimUtils.leaveMeeting();
    //let nimresult = await NimUtils.joinMeeting(meetingName);

    return response;
  } catch(e) {
    throw Error(e.message);
  };
}

function enterRoom(roomID: string): ThunkAction {
  return (dispatch, getState) => {
    const response = _enterRoom(roomID);
    response.then(result => {
      dispatch({
        type: "CURR_ROOM_INFO",
        roomInfo: result.info,
      })
    }, err => {
      console.warn("enterRoom failed=" + err.message);
      toastShow('进入房间失败:' + err.message);
    });
    return response;
  };
}

async function _connectMeeting(meetingName: string) : Promise<Action> {
  try {
    NimUtils.leaveMeeting();
    let nimresult = await NimUtils.joinMeeting(meetingName);

    return nimresult;
  } catch(e) {
    throw Error(e.message);
  };
}

function connectMeeting(meetingName: string): ThunkAction {
  return (dispatch, getState) => {
    const response = _connectMeeting(meetingName);
    return response;
  };
}

async function _leaveRoom() : Promise<Action> {
  try {
    let response = await APIRequest('room/leave', { }, true);

    if(response.StatusCode != STATUS_OK){
      throw Error(response.ReasonPhrase);
    }

    NimUtils.leaveMeeting();
    return response;
  } catch(e) {
    throw Error(e.message);
  };
}

function leaveRoom(): ThunkAction {
  return (dispatch, getState) => {
    const response = _leaveRoom();
    response.then(result => {
      dispatch(heartRequest());
    }, err => {console.warn('离开房间失败:' + err.message)});
  };
}

async function _pushCoin() : Promise<Action> {
  try {
    let response = await APIRequest('room/pushCoin', {}, true);

    if(response.StatusCode != STATUS_OK){
      throw Error(response.ReasonPhrase);
    }

    return response;
  } catch(e) {
    throw Error(e.message);
  };
}

function pushCoin(): ThunkAction {
  return (dispatch, getState) => {
    const response = _pushCoin();
    response.then(result => {

    }, err => {
      toastShow('投币失败:' + err.message);
    });
  };
}

async function _getRoomHistory(id: number) : Promise<Object> {
  try {
    let response = await APIRequest('machine/getHistory', {id}, true);

    if(response.StatusCode != STATUS_OK){
      throw Error(response.ReasonPhrase);
    }

    return response;
  } catch(e) {
    throw Error(e.message);
  };
}

function getRoomHistory(id: number) : ThunkAction {
  return (dispatch, getState) => {
    const response = _getRoomHistory(id);
    response.then(result => {
      dispatch({
        type: "ROOM_HISTORY_INFO",
        roomGameHistory: result.list,
      })
    });

    return response;
  };
}

module.exports = { showRoomList, enterRoom, pushCoin, leaveRoom, getRoomHistory, connectMeeting };
