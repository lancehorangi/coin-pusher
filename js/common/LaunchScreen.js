/**
 */
"use strict";

import React from "react";
import { connect } from "react-redux";
import F8Colors from "./F8Colors";
import F8Button from "./F8Button";
import { Dimensions, StyleSheet, Alert, ScrollView } from "react-native";
import { NimUtils, NimSession } from "react-native-netease-im";
import { APIRequest } from "../api";
import { logIn, showRoomList } from "../actions";
import ScreenComponent from "./ScreenComponent";
import { Navigation } from "react-native-navigation";
import KSYVideo from "react-native-ksyvideo";

const WIN_WIDTH = Dimensions.get("window").width;
//  WIN_HEIGHT = Dimensions.get("window").height;

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

  _onLoadStart = (event) => {
    console.warn("_onLoadStart:" + JSON.stringify(event));
  }

  _onLoad = (event) => {
    console.warn("_onLoad:" + JSON.stringify(event));
  }

  _onError = (event)=>{
    console.warn("_onError:" + JSON.stringify(event));
  }

  _onReadyForDisplay = (event) => {
    console.warn("_onReadyForDisplay:" + JSON.stringify(event));
  };

  render() {
    return (
      <ScrollView style={[styles.container, this.props.style]}>
        <KSYVideo source={{uri: "rtmp://v02225181.live.126.net/live/073afa1b14d04e2a9ac6106b7bb98326"}}   // Can be a URL or a local file.
          ref={(ref) => {
            this.player = ref;
          }}                                      // Store reference
          volume={1.0}
          muted={true}
          paused={false}                          // Pauses playback entirely.
          resizeMode="cover"                      // Fill the whole screen at aspect ratio.*
          repeat={true}                           // Repeat forever.
          playInBackground={false}                // Audio continues to play when app entering background.
          progressUpdateInterval={250.0}          // Interval to fire onProgress (default to ~250ms)
          onLoadStart={this._onLoadStart}            // Callback when video starts to load
          onLoad={this._onLoad}               // Callback when video loads
          //onProgress={this.setTime}               // Callback every ~250ms with currentTime
          //onEnd={this.onEnd}                      // Callback when playback finishes
          onError={this._onError}               // Callback when video cannot be loaded
          onBuffer={this._onReadyForDisplay}                // Callback when remote video is buffering
          style={styles.video} />

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
          onPress={() => this.logout()}
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

    await this.props.dispatch(logIn("test135", "test135"));
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
        screen: "CP.GameScreen", // unique ID registered with Navigation.registerScreen
        title: "游戏",
        passProps:{
          roomID: this.props.roomList[0].roomID,
          meetingName: this.props.roomList[0].meetingName
        }
      });
    }
    else {
      Alert.alert("房间列表为空");
    }
  }

  async connectAVChat()
  {
    try{
      let v = await NimUtils.joinMeeting("test_room_1");
      Alert.alert(v);
    }
    catch(e){
      Alert.alert(e.message);
    }
  }

  async disconnectAVChat()
  {
    await NimUtils.leaveMeeting();
  }

  logout()
  {
    APIRequest("test", { });
    APIRequest("test", { });
    APIRequest("test", { });
    APIRequest("test", { });
  }

  async test() {
    Navigation.showLightBox({
      screen: "CP.LaunchScreen", // unique ID registered with Navigation.registerScreen
      passProps: {}, // simple serializable object that will pass as props to the lightbox (optional)
      style: {
        backgroundBlur: "dark", // 'dark' / 'light' / 'xlight' / 'none' - the type of blur on the background
        backgroundColor: "#ff000000", // tint color for the background, you can specify alpha here (optional)
        tapBackgroundToDismiss: true // dismisses LightBox on background taps (optional)
      }
    });
  }

  async reg()
  {
    try {

      let response = await APIRequest("account/regist", {
        account:"test135", password:"test135"});
      this.props.navigator.showInAppNotification({
        screen: "CP.Notification", // unique ID registered with Navigation.registerScreen
        passProps: {text:response.ReasonPhrase}, // simple serializable object that will pass as props to the in-app notification (optional)
        autoDismissTimerSec: 1 // auto dismiss notification in seconds
      });
    } catch(e) {
      Alert.alert(e.message);
    }
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
    //position: "absolute",
    // left: 0,
    // top: WIN_HEIGHT / 4,
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
