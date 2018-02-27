//@flow
"use strict";

import { NativeAppEventEmitter, Alert } from 'react-native';
import { Navigation } from 'react-native-navigation';
import { NIMLoginDescrib, NIMAVChatDescrib } from './nativeEventDescribe';

function configureListener(store): void {
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
      Navigation.showInAppNotification({
          screen: "CP.Notification", // unique ID registered with Navigation.registerScreen
          passProps: {text:NIMAVChatDescrib[data]}, // simple serializable object that will pass as props to the in-app notification (optional)
          autoDismissTimerSec: 1 // auto dismiss notification in seconds
        });
  });
}

module.exports = configureListener;
