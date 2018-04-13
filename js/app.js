"use strict";

import React from "react";
import configureStore from "./store/configureStore";
import { Provider } from "react-redux";
import registerScreens from "./screens.js";
import { Navigation } from "react-native-navigation";

export default class AppRoot extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      storeCreated: false,
      storeRehydrated: false,
      store: null
    };

    console.warn("App Start:");
    registerScreens();
    Navigation.startTabBasedApp({
      tabs: [
        {
          label: "大厅",
          screen: "CP.LaunchScreen",
          icon: require("./img/checkmark.png"),
          selectedIcon: require("./img/checkmark.png"),
          title: "欢迎进入大厅",
          overrideBackPress: false,
          navigatorStyle: {}
        },

        {
          label: "个人资料",
          screen: "CP.LaunchScreen",
          icon: require("./img/checkmark.png"),
          selectedIcon: require("./img/checkmark.png"),
          title: "个人资料",
          navigatorStyle: {}
        }
      ],
    });

    configureStore(
      // rehydration callback (after async compatibility and persistStore)
      () => {
        this.setState({ storeRehydrated: true });
      }
    ).then(
      // creation callback (after async compatibility)
      store => {
        this.setState({ store, storeCreated: true });
        console.warn("this.state:" + store);
        registerScreens(store, Provider);

        Navigation.startTabBasedApp({
          tabs: [
            {
              label: "大厅",
              screen: "CP.LaunchScreen",
              icon: require("./img/checkmark.png"),
              selectedIcon: require("./img/checkmark.png"),
              title: "欢迎进入大厅",
              overrideBackPress: false,
              navigatorStyle: {}
            },

            {
              label: "个人资料",
              screen: "CP.LaunchScreen",
              icon: require("./img/checkmark.png"),
              selectedIcon: require("./img/checkmark.png"),
              title: "个人资料",
              navigatorStyle: {}
            }
          ],
        });
      }
    );
  }
}
