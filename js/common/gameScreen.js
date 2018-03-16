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
import { enterRoom, pushCoin, leaveRoom, connectMeeting, heartRequest } from '../actions'
import { Navigation } from 'react-native-navigation';
import ScreenComponent from './ScreenComponent';
import MoneyLabel from './MoneyLabel';
import { isIphoneX, toastShow, getMachineName } from './../util';
import { Button } from "react-native-elements";
import RoomHistory from './RoomHistory';
import { showModal, showLoginModal, hideLoginModal, dismissModal } from './../navigator';

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
    bLoading: boolean,
    autoPlay: boolean,
    bPlaying: boolean,
  };

  constructor(props) {
    super(props);
    this.state = {
      bLoading: true,
      autoPlay: false,
      bPlaying: false,
    };
    this._isMounted = false;
  }

  RNNDidAppear = () => {
    this._isMounted = true;
    this.reqEnterRoom();
  }

  RNNWillDisappear = () => {
    this._isMounted = false;
    clearInterval(this.updateLoop);
    clearInterval(this.heartLoop);
    this.setState({autoPlay:false})
    NimUtils.leaveMeeting();
  }

  componentWillUnmount() {
    clearInterval(this.updateLoop);
    clearInterval(this.heartLoop);
  }

  componentDidMount() {
    this._isMounted = true;
    //this.reqEnterRoom();
  }

  async reqEnterRoom() {
    await this.setState({ bLoading:true });
    let { roomID, account, token } = this.props;

    try {
      let result = await this.props.dispatch(enterRoom(roomID));

      if (result.info.entityID === this.props.entityID) {
        await NimSession.login(account, token);
        await this.props.dispatch(connectMeeting(result.info.nimName));
        await this.setState({bPlaying:true});

        clearInterval(this.heartLoop);
        this.heartLoop = setInterval( _ => {
          this.props.dispatch(heartRequest());
        }, 1000);
      }
      else {
        Alert.alert("房间已有玩家\n请稍后再试");
      }

      this.setState({bLoading:false});
    } catch (e) {
      toastShow("进入房间失败:" + e.message);
      Alert.alert("进入房间失败:" + e.message);
    } finally {

    }
  }

  onAutoPlayValue = (value) => {
    if (this.state.bPlaying) {
      this.setState({autoPlay:value});
      if (value) {
        clearInterval(this.updateLoop);
        this.updateLoop = setInterval( _ => {
          this.coinPush();
        }, 1000);
      }
      else {
        clearInterval(this.updateLoop);
      }
    }
  }

  onPress = _ => {
    this.props.dispatch(leaveRoom());
    // Navigation.dismissModal({
    //   animationType: 'none' // 'none' / 'slide-down' , dismiss animation for the modal (optional, default 'slide-down')
    // });
    dismissModal();
  }

  onPressIAP = () => {
    this.props.navigator.push({
      screen: 'CP.IAPScreen', // unique ID registered with Navigation.registerScreen
      title: "商城",
    });
  }

  coinPush = () => {
    this.props.dispatch(pushCoin());
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
            source={require("../common/img/close.png")}
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
          <View style={styles.videoLoading}>
            <ActivityIndicator animating size="large" color='white'/>
          </View>
          <NTESGLView style={styles.video}/>
        </View>
      )
    }
  }

  renderBottom = () => {
    if (!this.state.bLoading) {
      return (
        <View style={styles.bottomContainer}>
          <View style={{
            position: 'absolute',
            left: 20,
            flex: 1,
            justifyContent:'center',
            alignItems:'center',
            alignContent:'center',
            }}>
            <Switch
              value={this.state.autoPlay}
              onValueChange={this.onAutoPlayValue}
              tintColor={"red"}
              onTintColor={"red"}
              //thumbTintColor={"red"}
              />
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

          <View style={{
            position: 'absolute',
            right: 10,
            justifyContent:'center',
            alignItems:'flex-end',
            paddingVertical: 5,
          }}>

              <MoneyLabel
                containerStyle={{width:100}}
                type={'gold'}
                count={this.props.gold}
                withBtn={true}
                onPressBuy={this.onPressIAP}/>

              <MoneyLabel
                containerStyle={{marginTop:5, width:100}}
                type={'integral'}
                count={this.props.integral}
                withBtn={false}/>

          </View>
        </View>
      )
    }
  }

  renderHistory = () => {
    return (
      <View>
        <View style={styles.historyTitle}>
          <Text style={{color:"white", fontSize:20}}>
            {"开奖记录"}
          </Text>
        </View>
        <View style={{width:'80%', height:2, backgroundColor:"#45474d", alignSelf: 'center'}}/>
        <View style={{paddingHorizontal:30, marginBottom: 50}}>
          <RoomHistory id={this.props.roomID}/>
        </View>
      </View>
    )
  }

  render() {
      return (
        <ScrollView
          style={[styles.container]}
          //bounces={false}
          >
            <View style={{width:'100%', backgroundColor: F8Colors.mainBgColor2,
            height: isIphoneX() ? IPHONE_X_HEAD : 0}}/>
            {this.renderHeader()}
            {this.renderContent()}
            {this.renderBottom()}
            {this.renderHistory()}
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
    justifyContent: 'center',
    width: '100%',
    height: 100,
    marginLeft: 0,
    alignItems: 'center',
    flexDirection: 'row',
    paddingHorizontal: 10,
    marginTop:10,
    //backgroundColor: 'black',
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
  videoLoading: {
    position: "absolute",
    top: 0,
    left: 0,
    justifyContent: 'center',
    width: WIN_WIDTH,
    height: WIN_WIDTH / 3 * 4,
  },
  btn: {
    width:20,
    height:20
  },
  closeBtn: {
    width:20,
    height:20,
  },
  historyTitle: {
    justifyContent: 'center',
    width: '100%',
    height: 50,
    alignItems: 'center',
    flexDirection: 'row',
  }
});

function select(store) {
  return {
    account: store.user.account,
    token: store.user.token,
    entityID: store.user.entityID,
    roomInfo: store.room.roomInfo,
    integral: store.user.integral,
    gold: store.user.gold,
  };
}

/* exports ================================================================== */
module.exports = connect(select)(GameScreen);
