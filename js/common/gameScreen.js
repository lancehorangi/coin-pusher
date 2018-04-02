//@flow
"use strict";

import React from "react";
import { connect } from "react-redux";
import F8Colors from "./F8Colors";
import {
  Dimensions,
  StyleSheet,
  View,
  Image,
  Alert,
  TouchableOpacity,
  Text,
  ActivityIndicator,
  ScrollView,
  Switch
} from "react-native";
import { NimUtils, NTESGLView, NimSession } from "react-native-netease-im";
import { enterRoom, pushCoin, leaveRoom, connectMeeting, heartRequest } from "../actions";
import ScreenComponent from "./ScreenComponent";
import MoneyLabel from "./MoneyLabel";
import { isIphoneX, toastShow, getMachineName } from "./../util";
import { Button } from "react-native-elements";
import RoomHistory from "./RoomHistory";
import { dismissModal } from "./../navigator";
import KSYVideo from "react-native-ksyvideo";
import { Avatar } from "react-native-elements";

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
type Props = {
  roomID: string,
  meetingName: string
};

type States = {
  bLoading: boolean,
  autoPlay: boolean,
  bPlaying: boolean
};

class GameScreen extends ScreenComponent<Props, States> {
  _isMounted: boolean;

  constructor(props: Object) {
    super(props);
    this.state = {
      bLoading: true,
      autoPlay: false,
      bPlaying: false
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
    this.setState({autoPlay:false});

    NimUtils.leaveMeeting();
    //this.props.dispatch(leaveRoom());
  }

  componentWillUnmount() {
    clearInterval(this.updateLoop);
    clearInterval(this.heartLoop);

    //this.props.dispatch(leaveRoom());
  }

  componentDidMount() {
    //this._isMounted = true;
  }

  async reqEnterRoom(): void {
    await this.setState({ bLoading: true });
    let { roomID, account, token } = this.props;

    //test
    clearInterval(this.heartLoop);
    this.heartLoop = setInterval(() => {
      this.props.dispatch(heartRequest());
    }, 1000);

    try {
      let result = await this.props.dispatch(enterRoom(roomID));

      if (result.info.entityID === this.props.entityID) {
        await NimSession.login(account, token);
        await this.props.dispatch(connectMeeting(result.info.nimName));
        await this.setState({bPlaying:true});
      }
      else {
        Alert.alert("房间已有玩家\n请稍后再试");
      }

      //this.setState({bLoading:false});
    } catch (e) {
      toastShow("进入房间失败:" + e.message);
      Alert.alert("进入房间失败:" + e.message);
    } finally {
      //
      this.setState({bLoading:false});
    }
  }

  onAutoPlayValue = (value: boolean) => {
    if (this.state.bPlaying) {
      this.setState({autoPlay:value});
      if (value) {
        clearInterval(this.updateLoop);
        this.updateLoop = setInterval(() => {
          this.coinPush();
        }, 1000);
      }
      else {
        clearInterval(this.updateLoop);
      }
    }
  }

  onPress = async (): void => {
    try {
      await this.setState({enterState: "exit"});
      await this.props.dispatch(leaveRoom());
    } catch (e) {
      //
    } finally {
      dismissModal();
      this.props.navigator.pop();
    }
  }

  onPressIAP = () => {
    this.props.navigator.push({
      screen: "CP.IAPScreen", // unique ID registered with Navigation.registerScreen
      title: "商城",
    });
  }

  coinPush = () => {
    this.props.dispatch(pushCoin());
  }

  queueReq = () => {
    //
  }

  renderCloseBtn = (): Component => {
    return (
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
    );
  }

  renderWaitList = (): Component => {
    const waitList = [
      "https://circus.oss-cn-hangzhou.aliyuncs.com/logo.png",
      "https://circus.oss-cn-hangzhou.aliyuncs.com/logo.png",
      "https://circus.oss-cn-hangzhou.aliyuncs.com/logo.png",
      "https://circus.oss-cn-hangzhou.aliyuncs.com/logo.png",
      "https://circus.oss-cn-hangzhou.aliyuncs.com/logo.png",
      "https://circus.oss-cn-hangzhou.aliyuncs.com/logo.png",
      "https://circus.oss-cn-hangzhou.aliyuncs.com/logo.png",
      "https://circus.oss-cn-hangzhou.aliyuncs.com/logo.png",
      "https://circus.oss-cn-hangzhou.aliyuncs.com/logo.png"
    ];

    let useList = waitList.slice(0, 5);
    let waitNum = waitList.length;

    return (
      <View style={styles.waitListContainer}>
        {
          useList.map((item: Object, index: number): Component => (
            <Avatar
              key={index}
              width={23}
              height={23}
              //large
              rounded
              source={{uri:item}}
              //activeOpacity={0.7}
              //containerStyle={{width:10, height:10}}
            />
          ))
        }
        <Text style={{
          color: "white",
          marginLeft: 3
        }}>
          {waitNum + "人排队中"}
        </Text>
      </View>
    );
  }

  renderHeader = (): Component => {
    if (this.state.bLoading) {
      return;
    }

    let { roomInfo } = this.props;

    return (
      <View style={styles.headerContainer}>
        { this.renderCloseBtn() }
        { this.renderWaitList() }
        <Text
          numberOfLines={2}
          style={{
            marginRight: 20,
            color: "white",
          }}>
          { roomInfo ? getMachineName(roomInfo.roomID) + "\n消耗:" + roomInfo.coins + "/次" : ""}
        </Text>
      </View>
    );
  }

  _rmtpError = (event: any) => {
    console.warn("rmtp player error:" + JSON.stringify(event));
    Alert.alert("直播拉流失败");
  }

  renderContent = (): Component => {
    if (this.state.bLoading) {
      return (
        <View style={styles.loadingCotainer}>
          <ActivityIndicator animating size="large" color='white'/>
        </View>
      );
    }
    else if (this.state.bPlaying) {
      return (
        <View style={styles.container}>
          <View style={styles.videoLoading}>
            <ActivityIndicator animating size="large" color='white'/>
          </View>
          <NTESGLView style={styles.video}/>
          {this.renderPlayerInfo()}
        </View>
      );
    }
    //直播
    else {
      return (
        <View style={styles.container}>
          <View style={styles.videoLoading}>
            <ActivityIndicator animating size="large" color='white'/>
          </View>
          <KSYVideo
            style={styles.liveVideo}
            //source={{uri: this.props.roomInfo.rtmpUrl}}   // Can be a URL or a local file.
            source={{uri:"rtmp://v02225181.live.126.net/live/073afa1b14d04e2a9ac6106b7bb98326"}}
            // ref={(ref: any) => {
            //   this.player = ref;
            // }}                                      // Store reference
            volume={1.0}
            muted={true}
            paused={this._isMounted}                          // Pauses playback entirely.
            resizeMode="stretch"                      // Fill the whole screen at aspect ratio.*
            repeat={true}                           // Repeat forever.
            playInBackground={false}                // Audio continues to play when app entering background.
            progressUpdateInterval={250.0}          // Interval to fire onProgress (default to ~250ms)
            //onLoadStart={this._onLoadStart}            // Callback when video starts to load
            //onLoad={this._onLoad}               // Callback when video loads
            //onProgress={this.setTime}               // Callback every ~250ms with currentTime
            //onEnd={this.onEnd}                      // Callback when playback finishes
            onError={this._onError}               // Callback when video cannot be loaded
            //onBuffer={this._onReadyForDisplay}                // Callback when remote video is buffering
          />
          {this.renderPlayerInfo()}
        </View>
      );
    }
  }

  renderCenterBtn = (): Component => {
    if (this.state.bPlaying) {
      return (
        <Button
          title={"投币"}
          titleStyle={{color:"white", fontSize:25}}
          buttonStyle={{backgroundColor:"red", borderRadius:20, paddingVertical:20, paddingHorizontal:20}}
          onPress={this.coinPush}
        />
      );
    }
    else {
      return (
        <Button
          title={"上机"}
          titleStyle={{color:"white", fontSize:25}}
          buttonStyle={{backgroundColor:"red", borderRadius:20, paddingVertical:20, paddingHorizontal:20}}
          onPress={this.queueReq}
        />
      );
    }
  }

  renderBottom = (): Component => {
    if (!this.state.bLoading) {
      return (
        <View style={styles.bottomContainer}>
          <View style={{
            position: "absolute",
            left: 20,
            flex: 1,
            justifyContent:"center",
            alignItems:"center",
            alignContent:"center",
          }}>
            <Switch
              value={this.state.autoPlay}
              onValueChange={this.onAutoPlayValue}
              tintColor={"red"}
              onTintColor={"red"}
              //thumbTintColor={"red"}
            />
            <Text style={{color:"white", width:"100%", fontSize:15, marginTop:2, textAlign:"center"}}>
              {"自动"}
            </Text>
          </View>

          {this.renderCenterBtn()}

          <View style={{
            position: "absolute",
            right: 10,
            justifyContent:"center",
            alignItems:"flex-end",
            paddingVertical: 5,
          }}>

            <MoneyLabel
              containerStyle={{width:100}}
              type={"gold"}
              count={this.props.gold}
              withBtn={true}
              onPressBuy={this.onPressIAP}/>

            <MoneyLabel
              containerStyle={{marginTop:5, width:100}}
              type={"integral"}
              count={this.props.integral}
              withBtn={false}/>

          </View>
        </View>
      );
    }
  }

  renderHistory = (): Component => {
    return (
      <View>
        <View style={styles.historyTitle}>
          <Text style={{color:"white", fontSize:20}}>
            {"开奖记录"}
          </Text>
        </View>
        <View style={{width:"80%", height:2, backgroundColor:"#45474d", alignSelf: "center"}}/>
        <View style={{paddingHorizontal:30, marginBottom: 50}}>
          <RoomHistory id={this.props.roomID}/>
        </View>
      </View>
    );
  }

  renderPlayerInfo = (): Component => {
    if (this.props.roomInfo.entityID != 0) {
      return (
        <View style={styles.playerInfoContainer}>
          <Avatar
            //large
            rounded
            //source={{uri:this.props.roomInfo.headUrl}}
          />
          <Text style={{
            fontSize: 15,
            color: "white",
            alignSelf: "center",
            marginLeft: 5
          }}>
            {this.props.roomInfo.entityID}
          </Text>
        </View>
      );
    }

    return;
  }

  render(): Component {
    return (
      <ScrollView
        style={[styles.container]}
        //bounces={false}
      >
        <View style={{width:"100%", backgroundColor: F8Colors.mainBgColor2,
          height: isIphoneX() ? IPHONE_X_HEAD + 15 : 15}}/>
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
    justifyContent: "space-between",
    height: 50,
    marginLeft: 20,
    alignItems: "center",
    flexDirection: "row",
  },
  bottomContainer: {
    justifyContent: "center",
    width: "100%",
    height: 100,
    marginLeft: 0,
    alignItems: "center",
    flexDirection: "row",
    paddingHorizontal: 10,
    marginTop:10,
    //backgroundColor: 'black',
  },
  loadingCotainer: {
    height: WIN_HEIGHT,
    justifyContent: "center",
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
  liveVideo: {
    width: WIN_WIDTH,
    height: WIN_WIDTH / 3 * 4
  },
  videoLoading: {
    position: "absolute",
    top: 0,
    left: 0,
    justifyContent: "center",
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
    justifyContent: "center",
    width: "100%",
    height: 50,
    alignItems: "center",
    flexDirection: "row",
  },
  playerInfoContainer: {
    position: "absolute",
    top: -10,
    left: 10,
    height: 70,
    flexDirection: "row",
    alignContent: "center",
    alignItems: "center"
  },
  waitListContainer: {
    height: 22,
    flexDirection: "row",
    alignContent: "center",
    alignItems: "center"
  }
});

function select(store: Object): Object {
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
