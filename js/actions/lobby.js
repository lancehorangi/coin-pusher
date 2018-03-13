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
import { APIRequest } from '../api';
import { STATUS_OK } from '../env';
import { NimUtils, NTESGLView, NimSession } from 'react-native-netease-im';

import type { Action, ThunkAction } from "./types";

async function _roomList(roomType: number) : Promise<Action> {
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
      roomType: roomType
    }), err => {
      console.warn("showRoomList failed=" + err.message);
    });
  };
}

async function _enterRoom(roomID: string, meetingName: string) : Promise<Action> {
  try {
    let response = await APIRequest('room/enter', {roomid: roomID}, true);

    if(response.StatusCode != STATUS_OK){
      throw Error(response.ReasonPhrase);
    }

    NimUtils.leaveMeeting();
    await NimUtils.joinMeeting(meetingName);
    return response;
  } catch(e) {
    throw Error(e.message);
  };
}

function enterRoom(roomID: string, meetingName: string): ThunkAction {
  return (dispatch, getState) => {
    const response = _enterRoom(roomID, meetingName);
    response.then(result => {

    }, err => {Alert.alert('进入房间失败:' + err.message)});
  };
}

async function _leaveRoom( ) : Promise<Action> {
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

    }, err => {console.warn('房间失败:' + err.message)});
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

    }, err => {Alert.alert(err.message)});
  };
}

module.exports = { showRoomList, enterRoom, pushCoin, leaveRoom };
