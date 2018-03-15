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

import React from "react";
import { connect } from "react-redux";
import F8Colors from "./F8Colors";
import F8Button from "./F8Button";
import { Dimensions, StyleSheet, View, Image, Alert, ScrollView } from "react-native";
import { NimUtils, NTESGLView, NimSession } from 'react-native-netease-im';
import { serverURL } from '../env';
import { APIRequest } from '../api';
import { logIn, showRoomList, enterRoom } from '../actions'
import ScreenComponent from './ScreenComponent';
import { Navigation } from 'react-native-navigation';
import RoomHistory from './RoomHistory';

const WIN_WIDTH = Dimensions.get("window").width,
  WIN_HEIGHT = Dimensions.get("window").height;

/**
* ==============================================================================
* <LaunchScreen />
* ------------------------------------------------------------------------------
* @return {ReactElement}
* ==============================================================================
*/

class LaunchScreen extends ScreenComponent {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <ScrollView style={[styles.container, this.props.style]}>
        <Image
          source={require("./img/launchscreen.png")}
          style={styles.image}
        />
        <F8Button
          theme="bordered"
          type="default"
          caption="连接IM"
          onPress={() => this.logInIM()}
        />
        <F8Button
          theme="bordered"
          type="default"
          caption="连接视频"
          onPress={() => this.connectAVChat()}
        />
        <F8Button
          theme="bordered"
          type="default"
          caption="断开视频"
          onPress={() => this.disconnectAVChat()}
        />
        <F8Button
          theme="bordered"
          type="default"
          caption="请求房间列表"
          onPress={() => this.roomList()}
        />
        <F8Button
          theme="bordered"
          type="default"
          caption="进入房间"
          onPress={() => this.enterRoom()}
        />
        <F8Button
          theme="bordered"
          type="default"
          caption="登录失效"
          onPress={() => this.test()}
        />

      </ScrollView>
    );
  }

  async logIn()
  {
    //NimUtils.getCacheSize().then(size => Alert.alert(size))
    //NimSession.login("test001", "340045a515dc689897ad77adf3c06346").then(size => Alert.alert(size), e => Alert.alert(e.message));

    // let response = await fetch(serverURL + 'account/getToken',{
    //   method: 'post',
    //   headers: {
    //     'Content-Type' : 'application/x-www-form-urlencoded'
    //   },
    //   body: JSON.stringify({account:'test124', password:'test124'})
    //   });

    await this.props.dispatch(logIn('test135', 'test135'));
  }

  async logInIM()
  {
    NimSession.login(this.props.account, this.props.token).then(size => Alert.alert(size), e => Alert.alert(e.message));
  }

  async roomList()
  {
    await this.props.dispatch(showRoomList());
  }

  async enterRoom()
  {
    if(this.props.roomList && this.props.roomList.length != 0)
    {
      this.props.navigator.push({
        screen: 'CP.GameScreen', // unique ID registered with Navigation.registerScreen
        title: "游戏",
        passProps:{
          roomID: this.props.roomList[0].roomID,
          meetingName: this.props.roomList[0].meetingName
        }
      });
    }
    else {
      Alert.alert('房间列表为空');
    }
  }

  async connectAVChat()
  {
    try{
      let v = await NimUtils.joinMeeting('test_room_1');
      Alert.alert(v);
    }
    catch(e){
      Alert.alert(e.message);
    }
  }

  async disconnectAVChat()
  {
    let v = await NimUtils.leaveMeeting();
  }

  async logout()
  {
    try {
        let response = await APIRequest('test', { });

    } catch(e) {
      Alert.alert(e.message);
    };
  }

  async test() {
    Navigation.showLightBox({
      screen: 'CP.LaunchScreen', // unique ID registered with Navigation.registerScreen
      passProps: {}, // simple serializable object that will pass as props to the lightbox (optional)
      style: {
        backgroundBlur: 'dark', // 'dark' / 'light' / 'xlight' / 'none' - the type of blur on the background
        backgroundColor: '#ff000000', // tint color for the background, you can specify alpha here (optional)
        tapBackgroundToDismiss: true // dismisses LightBox on background taps (optional)
      }
    });
  }

  async reg()
  {
    let url = serverURL + 'account/regist';
    try {

        let response = await APIRequest('account/regist', {
          account:'test135', password:'test135'});
        this.props.navigator.showInAppNotification({
            screen: "CP.Notification", // unique ID registered with Navigation.registerScreen
            passProps: {text:response.ReasonPhrase}, // simple serializable object that will pass as props to the in-app notification (optional)
            autoDismissTimerSec: 1 // auto dismiss notification in seconds
          });
    } catch(e) {
      Alert.alert(e.message);
    };
  }

  componentDidMount() {
  }
}

/* StyleSheet =============================================================== */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: F8Colors.bianca
  },
  image: {
    position: "absolute",
    left: 0,
    top: 0,
    // width: WIN_WIDTH,
    // height: WIN_HEIGHT,
    right:0,
    bottom:0,
    resizeMode: "cover"
  },
  video: {
    position: "absolute",
    left: 0,
    top: WIN_HEIGHT / 4,
    width: WIN_WIDTH,
    height: WIN_WIDTH / 4 * 3,
    resizeMode: "cover"
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
module.exports = connect(select)(LaunchScreen);
