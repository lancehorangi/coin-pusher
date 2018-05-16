"use strict";
import { serverURL, payServerUrl } from "./env";
import md5 from "js-md5";
import { getStoreDispatch } from "./configureListener";
import { loggedOut } from "./actions";

const APICode = {
  TokenDisabled: "8",
};

export const API_ENUM = {
  ES_Normal: 0,
  ES_Game: 1,
  ES_QueueTimeout: 2,
  ES_Queue: 3
};

export const GAME_STATE = {
  GS_Normal: 0,
  GS_Wait: 1
};

export const API_RESULT = {
  STATUS_OK: "0",
  NOT_ENOUGH_DIAMOND: "10"
};

const LOG_API = true;
/**
 * Parses the JSON returned by a network request
 *
 * @param  {object} response A response from a network request
 *
 * @return {object}          The parsed JSON, status from the response
 */
function parseJSON(response): Promise<any> {
  return new Promise((resolve, reject) => response.json()
    .then((json) => {
      if (LOG_API) {
        console.log("api status=" + response.status);
      }

      resolve({
        status: response.status,
        ok: response.ok,
        json,
      });}, (e) => {
      console.error("JSON Parse Error:" + e.message);
      reject(e);
    }));
}

let _token = null;
let _id = null;

export function configureAPIToken(token: string, id: string)
{
  _token = token;
  _id = id;
}

export function APIRequest(path, json, bToken = false, bPayReq = false, bRelogin = false)
{
  return new Promise((resolve, reject) => {
    if(bToken && _token == null){
      getStoreDispatch()(loggedOut());
      return reject(Error("请重新登录"));
    }

    if (bToken) {
      json["token"] = _token;
    }

    if (json["auth"]) {
      delete json["auth"];
    }
    
    let propList = Object.keys(json);
    let checkStr = "";
    propList.sort();
    for(let keyVal of propList)
    {
      checkStr += json[keyVal];
    }
    checkStr += "shuzhu1305";

    let authStr = md5(checkStr).toUpperCase();
    json["auth"] = authStr;

    if (LOG_API) {
      console.log("Start api req: path=" + path + ", json" + JSON.stringify(json) + ", checkStr=" + checkStr);
    }

    let sUrl = bPayReq ? payServerUrl : serverURL;

    fetch(sUrl + path, {
      body:JSON.stringify(json),
      method: "post",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      }})
      .then(parseJSON)
      .then((response) => {
        if (LOG_API) {
          console.log("API req=" + path + ", response=" + JSON.stringify(response));
        }

        if (response.ok) {
          if (response.json.StatusCode === APICode.TokenDisabled) {
            if (bRelogin) {
              console.warn("Account Token check failed, loggout");
              getStoreDispatch()(loggedOut());
              return resolve(response.json);
            }

            //尝试重新登录
            APIRequest("account/relogin.action", {id: _id}, true, false, true)
              .then((response) => {
                //
                if (response.StatusCode == API_RESULT.STATUS_OK) {
                  APIRequest(path, json, bToken, bPayReq)
                    .then((response) => {
                      return resolve(response);
                    }, (e) => {
                      return reject(e);
                    });
                }
                else {
                  getStoreDispatch()(loggedOut());
                  return reject(Error("请重新登录"));
                }
              }, (e) => {
                //
                return reject(e);
              });
          }
          else {
            return resolve(response.json);
          }
        }

        console.warn("API Request HTTP failed, response=" + response.ok);
        return reject(Error("API:" + path + ", status code=" + response.status));
      }, (e) => {
        console.warn("API Request Json failed, response=" + e.message);
        return reject(Error(e.message));
      })
      .catch((error) => reject(error));
  });
}
