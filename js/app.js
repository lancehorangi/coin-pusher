"use strict";

import React from "react";
//import FacebookSDK from "./FacebookSDK";
//import Parse from "parse/react-native";
import configureStore from "./store/configureStore";
import { Provider } from "react-redux";
import registerScreens from "./screens.js"

// Components
import { Text } from "react-native";
//import F8App from "./F8App";
import LaunchScreen from "./common/LaunchScreen";
import { Navigation } from 'react-native-navigation'

export default class AppRoot extends React.Component {
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

    console.warn('App Start:')
    registerScreens();
    Navigation.startTabBasedApp({
        tabs: [
        {
            label: '大厅',
            screen: 'CP.LaunchScreen',
            icon: require('./img/checkmark.png'),
            selectedIcon: require('./img/checkmark.png'),
            title: '欢迎进入大厅',
            overrideBackPress: false,
            navigatorStyle: {}
        },

        {
            label: '个人资料',
            screen: 'CP.LaunchScreen',
            icon: require('./img/checkmark.png'),
            selectedIcon: require('./img/checkmark.png'),
            title: '个人资料',
            navigatorStyle: {}
        }
        ],
    });

    configureStore(
      // rehydration callback (after async compatibility and persistStore)
      _ => {
            this.setState({ storeRehydrated: true });
          }
    ).then(
      // creation callback (after async compatibility)
      store => {
        this.setState({ store, storeCreated: true });
        console.warn('this.state:' + store)
        registerScreens(store, Provider);

        Navigation.startTabBasedApp({
            tabs: [
            {
                label: '大厅',
                screen: 'CP.LaunchScreen',
                icon: require('./img/checkmark.png'),
                selectedIcon: require('./img/checkmark.png'),
                title: '欢迎进入大厅',
                overrideBackPress: false,
                navigatorStyle: {}
            },

            {
                label: '个人资料',
                screen: 'CP.LaunchScreen',
                icon: require('./img/checkmark.png'),
                selectedIcon: require('./img/checkmark.png'),
                title: '个人资料',
                navigatorStyle: {}
            }
            ],
        });
      }
    );
  }
}
