"use strict";

import { NativeAppEventEmitter, AppState, NativeEventEmitter, Alert } from "react-native";
import {  NIMAVChatDescrib } from "./nativeEventDescribe";
import { toastShow, codePushSync, PlatformAlert, getMachineName } from "./util";
import JPush from "jpush-react-native";
import { showModal } from "./navigator";
import RNPayfubao from "react-native-payfubao";

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
    console.log("observeAVChatStatus:" + JSON.stringify(data));
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
    console.log("observeAVChatError:" + JSON.stringify(data));
    toastShow("NIM AV ERROR=" + NIMAVChatDescrib[data]);
    // Navigation.showInAppNotification({
    //     screen: "CP.Notification", // unique ID registered with Navigation.registerScreen
    //     passProps: {text:NIMAVChatDescrib[data]}, // simple serializable object that will pass as props to the in-app notification (optional)
    //     autoDismissTimerSec: 1 // auto dismiss notification in seconds
    //   });
  });

  JPush.addReceiveNotificationListener((event) => {
    console.log("JPushModule receive notfication:" + JSON.stringify(event));
    if (event && event.extras_roomID && event.extras_roomID !== 0) {
      PlatformAlert(
        "提醒",
        "您在" + getMachineName(parseInt(event.extras_roomID)) + "已经排到是否要上机",
        "继续",
        "取消",
        () => {
          showModal({
            screen: "CP.GameScreen",
            title: "游戏",
            passProps: {roomID:event.extras_roomID},
            navigatorStyle: { navBarHidden: true },
            navigatorButtons: {},
            animationType: "slide-up"
          });
        }
      );
    }
  });

  const payfubaoManagerEmitter = new NativeEventEmitter(RNPayfubao);

  /***
   * 当切换回应用后.在此方法内根据type获取结果，
   * 实现此代理方法后，返回APP后会自动调用此方法，SDK内部自动查询结果  注：此结果是向贝付宝服务器查询的结果
   * type  : 0   z
   *        : 1   w
   *        : 2   y

   * resultDic : 结果

   * status 1   该订单支付成功
   同时会返回以下参数：total_fee      订单金额，以分为单位
   ali_trade_no   第三方流水号
   order_time     支付成功的时间
   * status 2   该订单支付失败
   * status 3   签名失败
   * status 4   订单为空
   * status 5   无此支付类型
   * status 6   客户端获取结果时网络错误
   * status 7   客户端获取结果时返回json错误
   */
  payfubaoManagerEmitter.addListener(
    "PFBResult",
    (result): any => {
      console.log("payfubao result=" + JSON.stringify(result));

      if (result.result.status == 1) {
        Alert.alert("支付成功");
      }
      else {
        Alert.alert("支付失败");
      }
    }
  );

  /**
   * 获取苹果内购支付的结果
   * status：1000    苹果内购支付成功 且服务器验证成功
   * status：1001    支付成功后上传服务器进行验证的参数不全
   * status：1002    无此商户，请检查验证时上传的商户id是否正确
   * status：1003    支付成功后，向苹果服务器验证支付结果失败，code：苹果服务器返回的错误状态码
   * status：10001   没有开通内购功能
   * status：10002   找不到该商品
   * status：10003   连接苹果内购服务器失败
   * status：10004   支付完成后，连接服务器验证时出现网络错误
   * status：10005   改商品已经购买
   * status：10006   交易取消或失败
   * status：10007   连接服务器验证时返回的数据格式错误
   */
  payfubaoManagerEmitter.addListener(
    "AppleResult",
    (result): any => {
      console.log("payfubao result=" + JSON.stringify(result));

      if (result.result.status == 1000) {
        Alert.alert("支付成功");
      }
      else {
        Alert.alert("支付失败");
      }
    }
  );
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
