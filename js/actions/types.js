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

export type Action =
  | {
      type: "LOGGED_IN",
      token: string,
      account: string,
      id: ?number,
      source: ?string,
    }
  | {
      type: "ROOM_LIST",
      list: Array<Object>,
      roomType: number,
      baseCost: number,
    }
  | {
      type: "CLEAR_ROOM_LIST",
      roomType: number,
    }
  | {
      type: "ACCOUNT_INFO",
      nickName: string,
      roomID: string,
      meetingName: string,
      diamond: number,
      gold: number,
      integral: number,
      entityID: number,
      headUrl: string,
    }
  | {
      type: "ACCOUNT_UPDATE_MONEY",
      gold: number,
      integral: number,
      diamond: number,
    }
  | {
      type: "ACCOUNT_UPDATE_ITEMS",
      items: Array<Object>,
    }
  | {
      type: "CHECKIN_INFO",
      checkinInfo: Array<Object>,
    }
  | { type: "LOGGED_OUT" }
  | { type: "MSG_LIST", msgs:Object, unreadNum: number }
  | {
      type: "MSG_TAG_READ",
      msgID: number
    }
  | {
      type: "OPEN_MSG",
      openMail: Object,
    }
  | {
      type: "APP_SWITCH_TAB",
      navigator: Object
    }
  | {
      type: "MALL_CHARGE_LIST",
      chargeList: Array<Object>
    }
  | {
      type: "MALL_MARKET_LIST",
      marketList: Array<Object>,
    }
  | {
      type: "ACCOUNT_GAME_HISTORY",
      accountGameHistory: Array<Object>,
    }
  | {
      type: "CURR_ROOM_INFO",
      roomInfo: Object,
    }
  | {
      type: "ROOM_HISTORY_INFO",
      roomGameHistory: Object,
    }
  | {
      type: "TICK_INFO",
      gold: number,
      integral: number,
    }
;

export type Dispatch = (
  action: Action | ThunkAction | PromiseAction | Array<Action>
) => any;
export type GetState = () => Object;
export type ThunkAction = (dispatch: Dispatch, getState: GetState) => any;
export type PromiseAction = Promise<Action>;
