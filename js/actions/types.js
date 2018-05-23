/**
 * @flow
 */

"use strict";

export type Action =
  | {
      type: "LOGGED_IN",
      token: string,
      account: string,
      id: ?number,
      source: ?string
    }
  | {
      type: "ROOM_LIST",
      list: Array<Object>,
      roomType: number,
      baseCost: number
    }
  | {
      type: "CLEAR_ROOM_LIST",
      roomType: number
    }
  | {
      type: "ACCOUNT_INFO",
      accountInfo: Object
    }
  | {
      type: "ACCOUNT_UPDATE_MONEY",
      gold: number,
      integral: number,
      diamond: number
    }
  | {
      type: "ACCOUNT_UPDATE_ITEMS",
      items: Array<Object>
    }
  | {
      type: "CHECKIN_INFO",
      checkinInfo: Array<Object>
    }
  | { type: "LOGGED_OUT" }
  | { type: "MSG_LIST", msgs: Object, unreadNum: number }
  | {
      type: "MSG_TAG_READ",
      msgID: number
    }
  | {
      type: "OPEN_MSG",
      openMail: Object
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
      marketList: Array<Object>
    }
  | {
      type: "ACCOUNT_GAME_HISTORY",
      accountGameHistory: Array<Object>
    }
  | {
      type: "CURR_ROOM_INFO",
      roomInfo: Object
    }
  | {
      type: "ROOM_HISTORY_INFO",
      roomGameHistory: Object
    }
  | {
      type: "TICK_INFO",
      gold: number,
      integral: number,
      countDown: ?number
    }
  | {
      type: "ROOM_QUEUE_SUCC",
      roomID: string,
      entityState: number
    }
  | {
      type: "TOGGLE_BGM",
      bgmEnabled: boolean
    }
  | {
      type: "UPDATE_CHAT_MSGS",
      chatList: Array<Object>,
      readIdx: number
    }
  | {
      type: "CLEAR_CHAT_MSGS"
    }
  | {
      type: "ACCOUNT_UPDATE_NICKNAME",
      nickname: string
    }
  | {
      type: "INIT_LOCAL_VALUES"
    }
  | {
      type: "UPDATE_GAME_FIRST_HINT",
      index: number,
      value: boolean
    }
  | {
      type: "ACCOUNT_UPDATE_RENAME_FREE",
      value: boolean
    }
;

export type Dispatch = (
  action: Action | ThunkAction | PromiseAction | Array<Action>
) => any;
export type GetState = () => Object;
export type ThunkAction = (dispatch: Dispatch, getState: GetState) => any;
export type PromiseAction = Promise<Action>;
