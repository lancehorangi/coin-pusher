"use strict";

// Depdencies
import React from "react";
import configureStore from "./store/configureStore";
import { Provider } from "react-redux";
import registerScreens from "./screens";
import { configureListener } from "./configureListener";
// Components
import { Text } from "react-native";
import { Navigation } from "react-native-navigation";
import { configureAPIToken } from "./api";
import F8Colors from "./common/F8Colors";
import { codePushSync } from "./util";
import DeviceInfo from "react-native-device-info";
import RNTalkingdataGame from "react-native-talkingdata-game";
import RNBugly from "react-native-bugly";
import * as WeChat from "react-native-wechat";

// Config
import { talkingdataID, wxID } from "./env";

//console.disableYellowBox = true;
Text.defaultProps.allowFontScaling = false;
console.disableYellowBox = true;

//talkingdata
RNTalkingdataGame.onStart(talkingdataID, DeviceInfo.getApplicationName(), true);

//WeChat
WeChat.registerApp(wxID);

configureStore(
  // rehydration callback (after async compatibility and persistStore)
  (store, didReset) => {
    //this.setState({ storeRehydrated: true });
    //this.setState({ store, storeCreated: true });
    registerScreens(store, Provider);

    //init native event listener
    configureListener(store);
    configureAPIToken(store.getState().user.token);

    let { token, account } = store.getState().user;
    let bLogin = token && token.length != 0;
    codePushSync();

    if (bLogin) {
      RNTalkingdataGame.setAccountName(account, account);
      RNBugly.setUserIdentifier(account);
    }

    Navigation.startTabBasedApp({
      tabs: [
        {
          label: "大厅",
          screen: "CP.MainScreen",
          icon: require("./common/img/buttons/hall.png"),
          selectedIcon: require("./common/img/buttons/hall_2.png"),
          title: "欢乐马戏城",
          navigatorStyle: {
            navBarHidden: false
          },
        },
        {
          label: "商城",
          //screen: 'CP.LaunchScreen',
          screen: "CP.MallScreen",
          icon: require("./common/img/buttons/shop.png"),
          selectedIcon: require("./common/img/buttons/shop_2.png"),
          title: "商城",
          navigatorStyle: {
            navBarHidden: false
          }
        },
        {
          label: "我的",
          screen: "CP.MineScreen",
          icon: require("./common/img/buttons/my.png"),
          selectedIcon: require("./common/img/buttons/my_2.png"),
          title: "个人资料",
          navigatorStyle: {
            navBarHidden: true
          }
        }
        // {
        //   label: "商城",
        //   screen: "CP.LaunchScreen",
        //   icon: require("./common/img/buttons/shop.png"),
        //   selectedIcon: require("./common/img/buttons/shop_2.png"),
        //   title: "商城",
        //   navigatorStyle: {
        //     navBarHidden: false
        //   }
        // },
      ],
      passProps: {loggedIn: bLogin}, // simple serializable object that will pass as props to all top screens (optional)
      animationType: "fade",
      tabsStyle: { // optional, **iOS Only** add this if you want to style the tab bar beyond the defaults
        tabBarBackgroundColor: F8Colors.mainBgColor2,
        //tabBarLabelColor: '#ffffff',
        //tabBarButtonColor: '#ffffff', // change the color of the tab icons and text (also unselected)
        tabBarSelectedButtonColor: "#ffffff",
      }
    });
  }
);


class Root extends React.Component {
}

module.exports = Root;
