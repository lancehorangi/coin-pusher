"use strict";
import { serverURL } from './env';
import { Alert } from 'react-native';
import md5 from "react-native-md5";

/**
 * Parses the JSON returned by a network request
 *
 * @param  {object} response A response from a network request
 *
 * @return {object}          The parsed JSON, status from the response
 */
function parseJSON(response) {
  return new Promise((resolve) => response.json()
    .then((json) => resolve({
      status: response.status,
      ok: response.ok,
      json,
    }), e => {
        Alert.alert('JSON Parse Error:' + e.message);
    }));
}

let _token = null;

export function configureAPIToken(token: string)
{
  _token = token;
}

export function APIRequest(path, json, bToken = false)
{
  return new Promise((resolve, reject) => {
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
        if (response.ok) {
          return resolve(response.json);
        }
        return reject(response.status);
      })
      .catch((error) => reject(error.message));
  });
}
