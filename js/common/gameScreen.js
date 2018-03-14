"use strict";

import React from "react";
import { connect } from "react-redux";
import F8Colors from "./F8Colors";
import F8Button from "./F8Button";
import {
  Dimensions,
  StyleSheet,
  View,
  Image,
  Alert,
  PixelRatio,
  TouchableOpacity,
  Text,
  ActivityIndicator,
  ScrollView,
  Switch
} from "react-native";
import { NimUtils, NTESGLView, NimSession } from 'react-native-netease-im';
import { serverURL } from '../env';
import { APIRequest } from '../api';
import { logIn, showRoomList, enterRoom, pushCoin, leaveRoom } from '../actions'
import { Navigation } from 'react-native-navigation';
import ScreenComponent from './ScreenComponent';
import { isIphoneX, toastShow, getMachineName } from './../util';
import { Button } from "react-native-elements";

const WIN_WIDTH = Dimensions.get("window").width,
  WIN_HEIGHT = Dimensions.get("window").height;

const IPHONE_X_HEAD = 30;

/**
* ==============================================================================
* <GameScreen />
* ------------------------------------------------------------------------------
* @return {ReactElement}
* ==============================================================================
*/

class GameScreen extends ScreenComponent {
  props: {
    roomID: string,
    meetingName: string
  };

  _isMounted: boolean;

  state: {
    bLoading: boolean
  };

  constructor(props) {
    super(props);
    this.state = { bLoading: true };
    this._isMounted = false;
  }

  RNNDidAppear = () => {

  }

  RNNWillDisappear = () => {

  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  componentDidMount() {
    this._isMounted = true;

    this.reqEnterRoom();
  }

  async reqEnterRoom() {
    await this.setState({ bLoading:true });
    let {roomID, meetingName} = this.props;

    try {
      let result = await this.props.dispatch(enterRoom(roomID, meetingName));
      this.setState({bLoading:false});
    } catch (e) {
      toastShow("进入房间失败:" + e.message);
      Alert.alert("进入房间失败:" + e.message);
      // Navigation.dismissAllModals({
      //   animationType: 'slide-down' // 'none' / 'slide-down' , dismiss animation for the modal (optional, default 'slide-down')
      // });
    } finally {

    }
  }

  onPress = _ => {
    this.props.dispatch(leaveRoom());
    Navigation.dismissModal({
      animationType: 'slide-down' // 'none' / 'slide-down' , dismiss animation for the modal (optional, default 'slide-down')
    });
  }

  onPressIAP = () => {
    this.props.navigator.push({
      screen: 'CP.IAPScreen', // unique ID registered with Navigation.registerScreen
      title: "商城",
    });
  }

  async coinPush() {
    await this.props.dispatch(pushCoin());
  }

  renderHeader = () => {
    let { roomInfo } = this.props;

    return (
      <View style={styles.headerContainer}>
        <TouchableOpacity
          accessibilityTraits="button"
          onPress={this.onPress}
          activeOpacity={0.5}
          style={styles.closeBtn}
        >
          <Image
            source={require("../common/img/buttons/icon-x.png")}
            resizeMode={"stretch"}/>
        </TouchableOpacity>
        <Text
          numberOfLines={2}
          style={{
            marginRight: 20,
            color: "white",
          }}>
          { roomInfo ? getMachineName(roomInfo.roomID) + "\n消耗:" + roomInfo.coins + "/次" : ""}
        </Text>
      </View>
    )
  }

  renderContent = () => {
    if (this.state.bLoading) {
      return (
        <View style={styles.loadingCotainer}>
          <ActivityIndicator animating size="large" color='white'/>
        </View>
      )
    }
    else {
      return (
        <View style={styles.container}>
          <NTESGLView style={styles.video}/>
        </View>
      )
    }
  }

  renderBottom = () => {
    if (!this.state.bLoading) {
      return (
        <View style={styles.bottomContainer}>
          <View style={{justifyContent:'center', alignItems:'center', alignContent:'center'}}>
            <Switch style={{width:'100%'}}/>
            <Text style={{color:"white", width:'100%', fontSize:15, marginTop:2, textAlign:'center'}}>
              {"自动"}
            </Text>
          </View>

          <Button
            title={'投币'}
            titleStyle={{color:"white", fontSize:25}}
            buttonStyle={{backgroundColor:"red", borderRadius:20, paddingVertical:20, paddingHorizontal:20}}
            onPress={this.coinPush}
            />

            <View style={{justifyContent:'center', alignItems:'center'}}>
              <Button
                title={this.props.gold}
                titleStyle={{color:"red", fontSize:15}}
                buttonStyle={{backgroundColor:"red", borderRadius:20}}
                onPress={this.onPressIAP}
                />

              <Button
                title={this.props.integral}
                titleStyle={{color:"white", fontSize:15}}
                buttonStyle={{backgroundColor:"red", borderRadius:20}}
              />
            </View>
        </View>
      )
    }
  }

  render() {
    return (
      <ScrollView
      style={[styles.container]}
      bounces={false}>
        <View style={{width:'100%', backgroundColor: F8Colors.mainBgColor2,
        height: isIphoneX() ? IPHONE_X_HEAD : 0}}/>
        {this.renderHeader()}
        {this.renderContent()}
        {this.renderBottom()}
      </ScrollView>
    );
  }
}

/* StyleSheet =============================================================== */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: F8Colors.mainBgColor2
  },
  headerContainer: {
    justifyContent: 'space-between',
    height: 50,
    marginLeft: 20,
    alignItems: 'center',
    flexDirection: 'row',
  },
  bottomContainer: {
    justifyContent: 'space-between',
    width: '100%',
    height: 150,
    marginLeft: 0,
    alignItems: 'center',
    flexDirection: 'row',
    paddingHorizontal: 10,
    backgroundColor: 'black',
  },
  loadingCotainer: {
    height: WIN_HEIGHT,
    justifyContent: 'center',
    backgroundColor: F8Colors.mainBgColor2,
  },
  image: {
    flex: 1,
    width: WIN_WIDTH
  },
  video: {
    width: WIN_WIDTH,
    height: WIN_WIDTH / 3 * 4,
    resizeMode: "stretch"
  },
  btn: {
    width:20,
    height:20
  },
  closeBtn: {
    width:20,
    height:20,
  }
});

function select(store) {
  return {
    account: store.user.account,
    entityID: store.user.entityID,
    roomInfo: store.room.roomInfo,
    integral: store.user.integral,
    gold: store.user.gold,
  };
}

/* exports ================================================================== */
module.exports = connect(select)(GameScreen);
