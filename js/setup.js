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
import configureListener from "./configureListener";
// Components
import { Text, Alert } from "react-native";
//import F8App from "./F8App";
import LaunchScreen from "./common/LaunchScreen";
import { Navigation } from 'react-native-navigation'
import { APIRequest, configureAPIToken } from './api';

// Config
//import { serverURL, parseAppID } from "./env";

//console.disableYellowBox = true;
Text.defaultProps.allowFontScaling = false;

export default class Root extends React.Component {
  state: {
    isLoading: boolean,
    store: any
  };

  constructor(props) {
    super(props);
    this.state = {
      storeCreated: false,
      storeRehydrated: false,
      store: null
    };

    //const stores = configureStore()
    //console.error('this.state:' + Object.values(stores))
    //registerScreens(stores, Provider);

    configureStore(
      // rehydration callback (after async compatibility and persistStore)
      (store, didReset) => {
            this.setState({ storeRehydrated: true });
            this.setState({ store, storeCreated: true });
            registerScreens(store, Provider);

            //init native event listener
            configureListener(store);
            configureAPIToken(store.getState().user.token);

            let bLogin = store.getState().user.token && store.getState().user.token.length != 0;
            if(bLogin)
            {
              Navigation.startTabBasedApp({
                  tabs: [
                  {
                      label: 'LoginScreen',
                      screen: 'CP.LoginScreen',
                      icon: require('./common/img/logo.png'),
                      selectedIcon: require('./common/img/logo.png'),
                      title: '123进入大厅',
                      overrideBackPress: false,
                      navigatorStyle: {}
                  },

                  {
                      label: 'LaunchScreen',
                      screen: 'CP.LaunchScreen',
                      icon: require('./common/img/logo.png'),
                      selectedIcon: require('./common/img/logo.png'),
                      title: '个人资料',
                      navigatorStyle: {}
                  }
                  ],
              });
            }
            else {
              Navigation.startSingleScreenApp({
                screen: {
                  screen: 'CP.LaunchScreen', // unique ID registered with Navigation.registerScreen
                  //title: '请登录', // title of the screen as appears in the nav bar (optional)
                  navigatorStyle: {navBarHidden: true }, // override the navigator style for the screen, see "Styling the navigator" below (optional)
                  navigatorButtons: {} // override the nav buttons for the screen, see "Adding buttons to the navigator" below (optional)
                }
              });
            }
          }
    )
    // .then(
    //   // creation callback (after async compatibility)
    //   store => {
    //     this.setState({ store, storeCreated: true });
    //     registerScreens(store, Provider);
    //
    //     Alert.alert(JSON.stringify(store.getState()));
    //     //let bLogin = this.getState().store.user.token && this.getState().store.user.token.length != 0;
    //     if(bLogin)
    //     {
    //       Navigation.startTabBasedApp({
    //           tabs: [
    //           {
    //               label: 'LoginScreen',
    //               screen: 'CP.LoginScreen',
    //               icon: require('./common/img/logo.png'),
    //               selectedIcon: require('./common/img/logo.png'),
    //               title: '123进入大厅',
    //               overrideBackPress: false,
    //               navigatorStyle: {}
    //           },
    //
    //           {
    //               label: 'LaunchScreen',
    //               screen: 'CP.LaunchScreen',
    //               icon: require('./common/img/logo.png'),
    //               selectedIcon: require('./common/img/logo.png'),
    //               title: '个人资料',
    //               navigatorStyle: {}
    //           }
    //           ],
    //       });
    //     }
    //     else {
    //       Navigation.startSingleScreenApp({
    //         screen: {
    //           screen: 'CP.LaunchScreen', // unique ID registered with Navigation.registerScreen
    //           //title: '请登录', // title of the screen as appears in the nav bar (optional)
    //           navigatorStyle: {navBarHidden: true }, // override the navigator style for the screen, see "Styling the navigator" below (optional)
    //           navigatorButtons: {} // override the nav buttons for the screen, see "Adding buttons to the navigator" below (optional)
    //         }
    //       });
    //     }
    //  }
    // );
  }

  componentDidMount() {

  }

  // render() {
  //   if (!this.state.storeCreated || !this.state.storeRehydrated) {
  //     return <LaunchScreen />;
  //   }
  // }
}
