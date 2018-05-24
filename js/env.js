"use strict";
import { AsyncStorage } from "react-native";

let _devMode = false;

async function loadDevMode() {
  try {
    let devModeString = await AsyncStorage.getItem("DevMode");
    _devMode = (devModeString === "true");
    console.log("loadDevMode type _devMode:" + typeof _devMode + ", value:" + _devMode);
  } catch (e) {
    console.error("loadDevMode err:" + e.message);
    _devMode = false;
  }
}

loadDevMode();

async function setDevMode(mode: boolean) {
  _devMode = mode;

  try {
    await AsyncStorage.setItem("DevMode", _devMode.toString());
  } catch (error) {
    console.error("setDevMode err:" + error.message);
  }
}

function getDevMode() {
  return _devMode;
}

let _env = {
  version: 1,
  testMenuEnabled: false,

  serverURL: "http://47.97.189.108:7001/1.0/",
  payServerUrl: "http://47.97.189.108:7010/1.0/",
  notifyUrl: "http://47.97.189.108:7010/1.0/pay/notify",

  devServerURL: "http://192.168.2.10:7001/1.0/",
  devPayServerUrl: "http://192.168.2.10:7010/1.0/",
  devNotifyUrl: "http://192.168.2.10:7010/1.0/pay/notify",

  talkingdataID: "B7E8A44ADCCE4C9ABBC2A9391E05E6A4",
  wxID: "wx03ea55f8013cb5e1",
  compatibleStoreVersion: "0.10",
  updateToggleAddress: "https://circus.oss-cn-hangzhou.aliyuncs.com/toggle.json",
  PFBparaID: "60100111",
  PFBAppID: "12141",
  PFBKey: "10cf545073595d3e50d46eaa52b37bec",
  codePushStageKey: "rPwFPpkVR_SrUzN6eAxA0IjGtxICbf415778-a89a-4469-9d3f-0bb68692a475",
  codePushProductKey: "HSAwqzrXyJ1DifUxOao7b5PpjWEBbf415778-a89a-4469-9d3f-0bb68692a475"
};

function getCodePushKey() {
  return getDevMode() ? _env.codePushStageKey : _env.codePushProductKey;
}

function getServerUrl() {
  return getDevMode() ? _env.devServerURL : _env.serverURL;
}

function getPayServerUrl() {
  return getDevMode() ? _env.devPayServerUrl : _env.payServerUrl;
}

function getNotifyUrl() {
  return getDevMode() ? _env.devNotifyUrl : _env.notifyUrl;
}

module.exports = {
  ..._env,
  setDevMode,
  getDevMode,
  getServerUrl,
  getPayServerUrl,
  getNotifyUrl,
  getCodePushKey
};
