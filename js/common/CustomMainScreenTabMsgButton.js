//@flow

import {
  View,
  Text,
  StyleSheet,
//  Dimensions,
} from "react-native";
import React, { Component } from "react";
import { getStore } from "../configureListener";
import ImgButton from "./ImgButton";

function select(state: Object): Object {
  return {
    unreadNum: state.msgs.unreadNum,
    navigator: state.appNavigator.navigator,
  };
}

type Props = {
  store: ?Object,
  onPress: () => mixed
};

type State = {
  unreadNum: number
};

class CustomMainScreenTabMsgButton extends Component<Props, State> {
  store: Object;

  constructor(props: Object) {
    super(props);

    this.state = {
      unreadNum: 0
    };
  }

  onPress = () => {
    let {navigator} = select(this.store.getState());

    navigator.push({
      screen: "CP.MsgHistoryScreen",
      title: "消息中心",
    });
  }

  handleChange = () => {
    let {unreadNum} = select(this.store.getState());
    this.setState({unreadNum});
  }

  componentDidMount() {
    this.store = getStore();
    if (this.store) {
      this.store.subscribe(this.handleChange);
    }
  }

  _renderCount = (): Component => {
    let {unreadNum} = this.state;

    if (unreadNum > 0) {
      return (
        <View style={styles.textContainer}>
          <Text style={styles.text}>
            {unreadNum}
          </Text>
        </View>
      );   
    }
    else {
      return;
    }
  }

  render (): Component<{}> {


    return (
      <View>
        <ImgButton
          style={{width: 30, height: 30}}
          icon={require("./img/header/news.png")}
          onPress={this.onPress}/>
        {this._renderCount()}
      </View>
    );
  }
}

/* StyleSheet
============================================================================= */

const styles = StyleSheet.create({
  textContainer: {
    position: "absolute",
    left: 20,
    top: -3,
    paddingHorizontal: 3,
    paddingVertical: 1,
    borderRadius: 15,
    backgroundColor: "red"
  },
  text: {
    fontSize: 12,
    color: "white",
    textAlign: "center"
  }
});

module.exports = CustomMainScreenTabMsgButton;
