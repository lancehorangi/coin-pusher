"use strict";

import { Platform, Alert } from "react-native";
import { Navigation } from 'react-native-navigation';
import { APIRequest, configureAPIToken } from '../api';
import { STATUS_OK } from '../env';
import type { Action, ThunkAction } from "./types";
import { toastShow } from './../util';

async function _getChargeList(): Promise<Action> {
  try {
    let response = await APIRequest('recharge/list', {}, true);

    if(response.StatusCode != STATUS_OK){
      throw Error(response.ReasonPhrase);
    }

    return response;
  } catch(e) {
    throw Error(e.message);
  };
}

function getChargeList(): ThunkAction {
  return (dispatch, getState) => {
    let response = _getChargeList();

    response.then( result => dispatch({
      type: "MALL_CHARGE_LIST",
      chargeList: result.items
    }),
    err => {
      console.log('getChargeList failed reason=' + err.message);
      toastShow('获取商城失败:' + err.message)
    });

    return response;
  }
}

async function _getMarketList(): Promise<Action> {
  try {
    let response = await APIRequest('market/list', {}, true);

    if(response.StatusCode != STATUS_OK){
      throw Error(response.ReasonPhrase);
    }

    return response;
  } catch(e) {
    throw Error(e.message);
  };
}

function getMarketList(): ThunkAction {
  return (dispatch, getState) => {
    let response = _getMarketList();

    response.then( result => dispatch({
      type: "MALL_MARKET_LIST",
      marketList: result.items
    }),
    err => {
      console.log('getMarketList failed reason=' + err.message);
      toastShow('获取积分商城失败:' + err.message)
    });

    return response;
  }
}

module.exports = { getChargeList, getMarketList };
