//@flow

import {
//  StyleSheet,
//  Dimensions,
} from "react-native";
import React, { Component } from "react";
import { getStore } from "../configureListener";
import MoneyLabel from "./MoneyLabel";

//const WIN_WIDTH = Dimensions.get("window").width;
//const BANNER_HEIGHT = WIN_WIDTH / 4;

function select(state: Object): Object {
  return {
    diamond: state.user.diamond,
    navigator: state.appNavigator.navigator,
  };
}

type Props = {
  store: ?Object,
  onPress: () => mixed
};

type State = {
  diamond: number
};

class CustomMainScreenTabButton extends Component<Props, State> {
  store: Object;

  constructor(props: Object) {
    super(props);
    this.state = {
      diamond: 0,
    };
  }

  onPress = () => {
    let {navigator} = select(this.store.getState());

    navigator.push({
      screen: "CP.IAPScreen", // unique ID registered with Navigation.registerScreen
      title: "商城",
    });
  }

  handleChange = () => {
    let {diamond} = select(this.store.getState());
    this.setState( { diamond } );
  }

  componentDidMount() {
    this.store = getStore();
    if (this.store) {
      this.store.subscribe(this.handleChange);
    }
  }

  render (): Component<{}> {
    let {diamond} = this.state;

    return (
      <MoneyLabel
        adjustsFontSizeToFit={false}
        type={"diamond"}
        count={diamond}
        btnType={"add"}
        onPress={this.onPress}/>
    );
  }
}

module.exports = CustomMainScreenTabButton;
