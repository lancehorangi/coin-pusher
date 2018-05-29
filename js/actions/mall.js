//@flow

"use strict";

import { APIRequest, API_RESULT } from "../api";
import type { Action, ThunkAction, Dispatch } from "./types";
import { toastShow } from "./../util";
import { freshMoney, freshItems } from "./user";
import RNPayfubao from "react-native-payfubao";
import { PFBparaID, PFBAppID, PFBKey, getNotifyUrl } from "./../env";
import uuid from "react-native-uuid";
import DeviceInfo from "react-native-device-info";

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

async function _mallBuy(itemID: number, appleID: number, cost: number): Promise<Action> {
  try {

    let orderNo = uuid.v1();
    //0:支付宝   1:微信   2:银联
    let appleCost = cost * 100;
    let result = await RNPayfubao.sendWithRepeatStatus(PFBparaID, PFBAppID, PFBKey,
      "1", appleCost.toString(), orderNo, getNotifyUrl(), appleID.toString(), ["1"]);

    console.log("PFB status=" + JSON.stringify(result));

    let apple = result.result == 106 ? 1 : 0;
    let channel = DeviceInfo.getBundleId();
    let response = await APIRequest("pay/order", {itemID, orderNo, apple, channel, appID: PFBAppID}, true, true);

    if(response.StatusCode != API_RESULT.STATUS_OK){
      throw Error(response.ReasonPhrase);
    }

    if (result.result != 106) {
      await RNPayfubao.payWithBody(JSON.parse(response.data));
    }
    else {
      await RNPayfubao.beginApplePayWithAppleID(appleID.toString(), appleCost.toString(), orderNo, getNotifyUrl());
    }
  } catch(e) {
    throw Error(e.message);
  }
}

function mallBuy(id: number, appleID: number, cost: number): ThunkAction {
  return (dispatch: Dispatch): Object => {
    let response = _mallBuy(id, appleID, cost);

    response.then((): any => {
      dispatch(freshMoney());
      dispatch(freshItems());
      //toastShow("购买成功!");
    },
    (err: Error) => {
      console.log("mallBuy failed reason=" + err.message);
      toastShow("购买失败:" + err.message);
    });

    return response;
  };
}

module.exports = { getChargeList, getMarketList, mallBuy };
