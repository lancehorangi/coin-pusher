"use strict";
import { serverURL } from './env';
import { Alert } from 'react-native';
import md5 from "react-native-md5";
import { getStoreDispatch } from "./configureListener";
import { loggedOut } from "./actions";

const APICode = {
  TokenDisabled: '8',
}

let APICodeDescrib = { }
APICodeDescrib[APICode.TokenDisabled] = '登录失效'

const LOG_API = false;
/**
 * Parses the JSON returned by a network request
 *
 * @param  {object} response A response from a network request
 *
 * @return {object}          The parsed JSON, status from the response
 */
function parseJSON(response) {
  return new Promise((resolve, reject) => response.json()
    .then((json) => resolve({
      status: response.status,
      ok: response.ok,
      json,
    }), (e) => {
        console.error('JSON Parse Error:' + e.message);
        reject(e);
    }));
}

let _token = null;

export function configureAPIToken(token: string | null)
{
  _token = token;
}

export function APIRequest(path, json, bToken = false)
{
  console.log('Start api req: path=' + path + ', json' + JSON.stringify(json));
  return new Promise((resolve, reject) => {
    if(bToken && _token == null){
      return reject(Error("Already logged out."));
    }

    if (bToken) {
      json['token'] = _token;
    }
    let propList = Object.keys(json);
    let checkStr = '';
    propList.sort();
    for(let keyVal of propList)
    {
      checkStr += json[keyVal];
    }
    checkStr += 'shuzhu1305';
    let authStr = md5.hex_md5(checkStr).toUpperCase();
    json['auth'] = authStr;

    fetch(serverURL + path, {
      body:JSON.stringify(json),
      method: 'post',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      }}).then(parseJSON)
      .then((response) => {
        if (LOG_API) {console.log("API response=" + JSON.stringify(response))}

        if (response.ok) {
          if (response.status === APICode.TokenDisabled) {
            console.warn('Account Token check failed, loggout');
            getStoreDispatch()(loggedOut());
          }
          else {
            return resolve(response.json);
          }
        }
        console.error('API Request HTTP failed, response=' + response.ok);
        return reject(Error("API:" + path + ", status code=" + response.status));
      }, (e) => {
        console.warn('API Request Json failed, response=' + e.message);
        return reject(Error(e.message));
      })
      .catch((error) => reject(error));
  });
}
