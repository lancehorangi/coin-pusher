/**
 * Copyright 2016 Facebook, Inc.
 *
 * You are hereby granted a non-exclusive, worldwide, royalty-free license to
 * use, copy, modify, and distribute this software in source code or binary
 * form for use in connection with the web services and APIs provided by
 * Facebook.
 *
 * As with any software that integrates with the Facebook platform, your use
 * of this software is subject to the Facebook Developer Principles and
 * Policies [http://developers.facebook.com/policy/]. This copyright notice
 * shall be included in all copies or substantial portions of the software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL
 * THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
 * DEALINGS IN THE SOFTWARE
 */
"use strict";

// Depdencies
import React from "react";
//import FacebookSDK from "./FacebookSDK";
//import Parse from "parse/react-native";
import configureStore from "./store/configureStore";
import { Provider } from "react-redux";
import registerScreens from "./screens";
import { configureListener } from "./configureListener";
// Components
import { Text, Alert } from "react-native";
//import F8App from "./F8App";
import LaunchScreen from "./common/LaunchScreen";
import { Navigation } from 'react-native-navigation';
import { APIRequest, configureAPIToken } from './api';
import CustomMainScreenTabButton from './common/CustomMainScreenTabButton';
import F8Colors from './common/F8Colors';
import codePush from "react-native-code-push";
import { toastShow, codePushSync, BuglyUpdateVersion } from './util';
import DeviceInfo from 'react-native-device-info';
import RNTalkingdataGame from 'react-native-talkingdata-game';
import RNBugly from 'react-native-bugly';

// Config
//import { serverURL, parseAppID } from "./env";

//console.disableYellowBox = true;
Text.defaultProps.allowFontScaling = false;
console.disableYellowBox = true;

//talkingdata
RNTalkingdataGame.onStart("B7E8A44ADCCE4C9ABBC2A9391E05E6A4", DeviceInfo.getApplicationName(), true);

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
        codePushSync().then( _ => {
          BuglyUpdateVersion();
        });

        if (bLogin) {
          RNTalkingdataGame.setAccountName(account, account);
          RNBugly.setUserIdentifier(account);
        }

        Navigation.startTabBasedApp({
              tabs: [
              {
                label: '大厅',
                screen: 'CP.MainScreen',
                icon: require('./common/img/buttons/hall.png'),
                selectedIcon: require('./common/img/buttons/hall_2.png'),
                title: '欢乐马戏城',
                navigatorStyle: {
                  navBarHidden: false
                },
                // navigatorButtons: {
                //   rightButtons: [
                //     {
                //       id: 'add', // id for this button, given in onNavigatorEvent(event) to help understand which button was clicked
                //       buttonColor: '#ffffff', // Optional, iOS only. Set color for the button (can also be used in setButtons function to set different button style programatically)
                //       //icon: require('./img/header/add.png'),
                //       component: 'CP.CustomMainScreenTabButton',
                //       disableIconTint: true,
                //     }
                //   ],
                //   leftButtons: [
                //     {
                //       id: 'message', // id for this button, given in onNavigatorEvent(event) to help understand which button was clicked
                //       buttonColor: '#ffffff', // Optional, iOS only. Set color for the button (can also be used in setButtons function to set different button style programatically)
                //       icon: require('./common/img/header/news.png'),
                //       disableIconTint: true,
                //     }
                //   ]
                // }
              },
              {
                  label: '商城',
                  //screen: 'CP.LaunchScreen',
                  screen: 'CP.MallScreen',
                  icon: require('./common/img/buttons/shop.png'),
                  selectedIcon: require('./common/img/buttons/shop_2.png'),
                  title: '商城',
                  navigatorStyle: {
                    navBarHidden: false
                  }
              },
              {
                  label: '我的',
                  screen: 'CP.MineScreen',
                  icon: require('./common/img/buttons/my.png'),
                  selectedIcon: require('./common/img/buttons/my_2.png'),
                  title: '个人资料',
                  navigatorStyle: {
                    navBarHidden: true
                  }
              },
              {
                  label: '商城',
                  screen: 'CP.LaunchScreen',
                  icon: require('./common/img/buttons/shop.png'),
                  selectedIcon: require('./common/img/buttons/shop_2.png'),
                  title: '商城',
                  navigatorStyle: {
                    navBarHidden: false
                  }
              },
              ],
              passProps: {loggedIn: bLogin}, // simple serializable object that will pass as props to all top screens (optional)
              animationType: 'fade',
              tabsStyle: { // optional, **iOS Only** add this if you want to style the tab bar beyond the defaults
                tabBarBackgroundColor: F8Colors.mainBgColor2,
                //tabBarLabelColor: '#ffffff',
                //tabBarButtonColor: '#ffffff', // change the color of the tab icons and text (also unselected)
                tabBarSelectedButtonColor: '#ffffff',
              }
          });
      }
    )


class Root extends React.Component {
}

module.exports = Root
