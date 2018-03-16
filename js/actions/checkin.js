"use strict";

import { Platform, Alert } from "react-native";
import { Navigation } from 'react-native-navigation';
import { APIRequest, configureAPIToken } from '../api';
import { STATUS_OK } from '../env';
import type { Action, ThunkAction } from "./types";
import { toastShow } from './../util';
import { freshMoney, freshItems } from './user';

async function _getCheckinInfo() : Promise<Action> {
  try {
    let response = await APIRequest('account/getCheckinInfo', { }, true);

    if(response.StatusCode != STATUS_OK){
      throw Error(response.ReasonPhrase);
    }

    return response;
  } catch(e) {
    throw Error(e.message);
  };
}

function getCheckinInfo(): ThunkAction {
  return (dispatch, getState) => {
    const response = _getCheckinInfo();

    response.then(result => dispatch({
      type: "CHECKIN_INFO",
      checkinInfo: result.checkinList,
    }),
      err => {
        console.log('getCheckinInfo failed reason=' + err.message);
      });

    return response;
  };
}

async function _checkin(type: number) : Promise<Action> {
  try {
    let response = await APIRequest('account/checkin', { type }, true);

    if(response.StatusCode != STATUS_OK){
      throw Error(response.ReasonPhrase);
    }

    return response;
  } catch(e) {
    throw Error(e.message);
  };
}

function checkin(type: number): ThunkAction {
  return (dispatch, getState) => {
    const response = _checkin(type);
    response.then(result => {
      toastShow('签到成功');
      dispatch(freshMoney());
      dispatch(freshItems());
      dispatch({
        type: "CHECKIN_INFO",
        checkinInfo: result.checkinList,
      })
    },
      err => {
        toastShow('签到失败(' + err.message + ')');
        console.log('getCheckinInfo failed reason=' + err.message);
      });

    return response;
  };
}

module.exports = { getCheckinInfo, checkin };
