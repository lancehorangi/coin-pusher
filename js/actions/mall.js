//@flow

"use strict";

import { APIRequest, API_RESULT } from "../api";
import type { Action, ThunkAction, Dispatch } from "./types";
import { toastShow } from "./../util";
import { freshMoney, freshItems } from "./user";

async function _getChargeList(): Promise<Object> {
  try {
    let response = await APIRequest("recharge/list", {}, true);

    if(response.StatusCode != API_RESULT.STATUS_OK){
      throw Error(response.ReasonPhrase);
    }

    return response;
  } catch(e) {
    throw Error(e.message);
  }
}

function getChargeList(): ThunkAction {
  return (dispatch: Dispatch): Object => {
    let response = _getChargeList();

    response.then((result: Object): any => dispatch({
      type: "MALL_CHARGE_LIST",
      chargeList: result.items
    }),
    (err: Error) => {
      console.log("getChargeList failed reason=" + err.message);
      toastShow("获取商城失败:" + err.message);
    });

    return response;
  };
}

async function _getMarketList(): Promise<Object> {
  try {
    let response = await APIRequest("market/list", {}, true);

    if(response.StatusCode != API_RESULT.STATUS_OK){
      throw Error(response.ReasonPhrase);
    }

    return response;
  } catch(e) {
    throw Error(e.message);
  }
}

function getMarketList(): ThunkAction {
  return (dispatch: Dispatch): Object => {
    let response = _getMarketList();

    response.then((result: Object): any => dispatch({
      type: "MALL_MARKET_LIST",
      marketList: result.items
    }),
    (err: Error) => {
      console.log("getMarketList failed reason=" + err.message);
      toastShow("获取积分商城失败:" + err.message);
    });

    return response;
  };
}

async function _mallBuy(id: number): Promise<Action> {
  try {
    let response = await APIRequest("market/buy", {type:"2", id}, true);

    if(response.StatusCode != API_RESULT.STATUS_OK){
      throw Error(response.ReasonPhrase);
    }

    return response;
  } catch(e) {
    throw Error(e.message);
  }
}

function mallBuy(id: number): ThunkAction {
  return (dispatch: Dispatch): Object => {
    let response = _mallBuy(id);

    response.then((): any => {
      dispatch(freshMoney());
      dispatch(freshItems());
      toastShow("购买成功!");
    },
    (err: Error) => {
      console.log("mallBuy failed reason=" + err.message);
      toastShow("购买失败:" + err.message);
    });

    return response;
  };
}

module.exports = { getChargeList, getMarketList, mallBuy };
