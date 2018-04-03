"use strict";

import { NativeAppEventEmitter, AppState } from "react-native";
import {  NIMAVChatDescrib } from "./nativeEventDescribe";
import { toastShow, codePushSync, PlatformAlert, showModal, getMachineName } from "./util";
import JPush from "jpush-react-native";

let _store = null;

function getStoreDispatch() {
  console.log("getStoreDispatch store=" + _store);
  if(_store && _store.dispatch) {
    return _store.dispatch;
  }

  return null;
}

function getStore() {
  if(_store) {
    return _store;
  }

  return null;
}

function configureListener(store): void {
  _store = store;

  //NIM 用户相关事件
  NativeAppEventEmitter.addListener("observeOnlineStatus",(data)=>{
    console.log("observeOnlineStatus:" + data.status);
    //store.getState().dispatch();

    //data.status 为连接状态
    //NIMLoginDescrib[data.status]
    // if (NIMLoginDescrib[data.status]) {
    //   Navigation.showInAppNotification({
    //       screen: "CP.Notification", // unique ID registered with Navigation.registerScreen
    //       passProps: {text:NIMLoginDescrib[data.status]}, // simple serializable object that will pass as props to the in-app notification (optional)
    //       autoDismissTimerSec: 1 // auto dismiss notification in seconds
    //     });
    // }
  });

  //NIM AVChat 相关事件
  NativeAppEventEmitter.addListener("observeAVChatStatus",(data)=>{
    toastShow("NIM AV STATUS=" + data);
    if (NIMAVChatDescrib[data]) {
      // Navigation.showInAppNotification({
      //     screen: "CP.Notification", // unique ID registered with Navigation.registerScreen
      //     passProps: {text:NIMAVChatDescrib[data]}, // simple serializable object that will pass as props to the in-app notification (optional)
      //     autoDismissTimerSec: 1 // auto dismiss notification in seconds
      //   });
    }
  });

  //NIM AVChat 中断出错
  NativeAppEventEmitter.addListener("observeAVChatError",(data)=>{
    toastShow("NIM AV ERROR=" + NIMAVChatDescrib[data]);
    // Navigation.showInAppNotification({
    //     screen: "CP.Notification", // unique ID registered with Navigation.registerScreen
    //     passProps: {text:NIMAVChatDescrib[data]}, // simple serializable object that will pass as props to the in-app notification (optional)
    //     autoDismissTimerSec: 1 // auto dismiss notification in seconds
    //   });
  });

  JPush.addReceiveNotificationListener((event) => {
    console.log("JPushModule receive notfication:" +  + JSON.stringify(event));
    PlatformAlert(
      "提醒",
      "您在" + getMachineName(event.extras.roomID) + "已经排到是否要上机",
      "继续",
      "上机",
      () => {
        showModal({
          screen: "CP.GameScreen",
          title: "游戏",
          passProps: {roomID:event.extras.roomID},
          navigatorStyle: { navBarHidden: true },
          navigatorButtons: {},
          animationType: "slide-up"
        });
      }
    );
  });
}

let _appState = AppState.currentState;
let _handleAppStateChange = (nextAppState) => {
  if (_appState.match(/inactive|background/) && nextAppState === "active") {
    console.log("App has come to the foreground!");
    codePushSync();
  }
  _appState = nextAppState;
};

AppState.addEventListener("change", _handleAppStateChange);

module.exports = {configureListener, getStoreDispatch, getStore};
