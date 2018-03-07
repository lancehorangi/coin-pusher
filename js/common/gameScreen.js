"use strict";

import React from "react";
import { connect } from "react-redux";
import F8Colors from "./F8Colors";
import F8Button from "./F8Button";
import { Dimensions, StyleSheet, View, Image, Alert, PixelRatio } from "react-native";
import { NimUtils, NTESGLView, NimSession } from 'react-native-netease-im';
import { serverURL } from '../env';
import { APIRequest } from '../api';
import { logIn, showRoomList, enterRoom, pushCoin } from '../actions'
import { Navigation } from 'react-native-navigation';

const WIN_WIDTH = Dimensions.get("window").width,
  WIN_HEIGHT = Dimensions.get("window").height;

/**
* ==============================================================================
* <GameScreen />
* ------------------------------------------------------------------------------
* @return {ReactElement}
* ==============================================================================
*/

class GameScreen extends React.Component {
  props: {
    roomID: string,
    meetingName: string
  };

  _isMounted: boolean;

  state: {
    loaded: boolean
  };

  constructor() {
    super();
    this.state = { loaded: false };
    this._isMounted = false;
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  componentDidMount() {
    this._isMounted = true;

    let {roomID, meetingName} = this.props;
    this.props.dispatch(enterRoom(roomID, meetingName));
  }

  onPress = _ => {
    Navigation.dismissModal({
      animationType: 'slide-down' // 'none' / 'slide-down' , dismiss animation for the modal (optional, default 'slide-down')
    });
  }

  render() {
    return (
      <View style={[styles.container, this.props.style]}>
        <NTESGLView style={styles.image}/>
        <F8Button
          style={styles.btn}
          theme="bordered"
          type="round"
          icon={require("../common/img/buttons/icon-x.png")}
          onPress={this.onPress}
        />
        <F8Button
          theme="bordered"
          type="default"
          caption="投币"
          onPress={() => this.coinPush()}
        />
        <F8Button
          theme="bordered"
          type="default"
          caption="充值(temp)"
          onPress={() => this.charge()}
        />
      </View>
    );
  }

  async coinPush()
  {
    await this.props.dispatch(pushCoin());
  }

  async charge()
  {
    try {
        let response = await APIRequest('account/recharge', { money:'99999' }, true);
        this.props.navigator.showInAppNotification({
            screen: "CP.Notification", // unique ID registered with Navigation.registerScreen
            passProps: {text:response.ReasonPhrase}, // simple serializable object that will pass as props to the in-app notification (optional)
            autoDismissTimerSec: 1 // auto dismiss notification in seconds
          });
    } catch(e) {
      Alert.alert(e.message);
    };
  }
}

/* StyleSheet =============================================================== */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: F8Colors.bianca
  },
  image: {
    flex: 1,
    width: WIN_WIDTH
  },
  video: {
    position: "absolute",
    width: WIN_WIDTH,
    height: WIN_WIDTH / 4 * 3,
    resizeMode: "cover"
  },
  btn: {
    position: "absolute",
    top: 20,
    left: 20
  }
});

function select(store) {
  return {
    token: store.user.token,
    account: store.user.account,
    roomList: store.lobby.list
  };
}

/* exports ================================================================== */
module.exports = connect(select)(GameScreen);
