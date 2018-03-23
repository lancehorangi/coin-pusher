"use strict";

import { NativeAppEventEmitter, Alert, AppState } from 'react-native';
import { Navigation } from 'react-native-navigation';
import { NIMLoginDescrib, NIMAVChatDescrib } from './nativeEventDescribe';
import type { Action, ThunkAction } from "./actions/types";
import { toastShow, codePushSync, BuglyUpdateVersion } from './util';

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
    toastShow('NIM AV STATUS=' + data);
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
    toastShow('NIM AV ERROR=' + NIMAVChatDescrib[data]);
      // Navigation.showInAppNotification({
      //     screen: "CP.Notification", // unique ID registered with Navigation.registerScreen
      //     passProps: {text:NIMAVChatDescrib[data]}, // simple serializable object that will pass as props to the in-app notification (optional)
      //     autoDismissTimerSec: 1 // auto dismiss notification in seconds
      //   });
  });
}

let _appState = AppState.currentState;
let _handleAppStateChange = (nextAppState) => {
  if (_appState.match(/inactive|background/) && nextAppState === 'active') {
    console.log('App has come to the foreground!')
    codePushSync();
  }
  _appState = nextAppState;
}

AppState.addEventListener('change', _handleAppStateChange);

module.exports = {configureListener, getStoreDispatch, getStore};
