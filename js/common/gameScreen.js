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
import {
  enterRoom,
  pushCoin,
  leaveRoom,
  connectMeeting,
  heartRequest,
  roomInfo,
  queueRoom,
  toggleBGM
} from "../actions";
import ScreenComponent from "./ScreenComponent";
import MoneyLabel from "./MoneyLabel";
import ProfitAnimationMgr from "./ProfitAnimationMgr";
import { isIphoneX, toastShow, getMachineName, PlatformAlert } from "./../util";
import { Button } from "react-native-elements";
import RoomHistory from "./RoomHistory";
import { dismissModal, showModal } from "./../navigator";
import KSYVideo from "react-native-ksyvideo";
import { Avatar } from "react-native-elements";
import { API_ENUM, API_RESULT } from "../api";
import { PlayBGM, StopBGM } from "../bgm";
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
  bPlaying: boolean,
  queuing: boolean
};

class GameScreen extends ScreenComponent<Props, States> {
  _isMounted: boolean;

  constructor(props: Object) {
    super(props);
    this.state = {
      bLoading: true,
      autoPlay: false,
      bPlaying: false,
      queuing: false
    };
    this._isMounted = false;
    this._profitAnimMgr = null;
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
    StopBGM();
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
    this.heartLoop = setInterval(async (): void => {
      try {
        let result = await this.props.dispatch(heartRequest());
        if (result.addIntegral > 0) {
          this._profitAnimMgr.addInfo(result.addIntegral);
        }
      } catch (e) {
        //
      }
    }, 1000);

    let result = null;
    try {
      result = await this.props.dispatch(roomInfo(roomID));
      await this.props.dispatch(enterRoom(roomID));
      // await NimSession.login(account, token);
      // await this.props.dispatch(connectMeeting(result.info.nimName));
      await this.setState({bPlaying:true});

      if (this.props.enabledBGM) {
        PlayBGM();
      }

    } catch (e) {
      //toastShow("进入房间失败:" + e.message);
      toastShow("房间已有玩家,请排队");
      let {status} = this.props;

      if (API_ENUM.ES_QueueTimeout == status) {
        PlatformAlert(
          "提示",
          "您上次排队超时本次免费排队,取消之后排队需要支付费用",
          "排队",
          "取消",
          (): any => this._queueReq()
        );
      }
      return;

    } finally {
      this.setState({bLoading:false});
    }

    try {
      await this.setState({bPlaying:true});
      await NimSession.login(account, token);
      await this.props.dispatch(connectMeeting(result.info.nimName));
    } catch (e) {
      Alert.alert("服务暂时不可用,请退出房间重试");
    } finally {
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

  onPressClose = async (): void => {
    try {
      if (this.state.bPlaying) {
        PlatformAlert(
          "提示",
          "您正在游戏中是否退出?",
          "退出",
          "取消",
          (): any => {
            dismissModal();
            this.props.dispatch(leaveRoom());
          }
        );
      }
      else {
        dismissModal();
        this.props.dispatch(leaveRoom());
      }
    } catch (e) {
      //
    } finally {
      //
    }
  }

  onPressMute = () => {
    if (this.props.enabledBGM) {
      StopBGM();
    }
    else {
      PlayBGM();
    }

    this.props.dispatch(toggleBGM(!this.props.enabledBGM));
  }

  onPressIAP = () => {
    this.props.navigator.push({
      screen: "CP.IAPScreen",
      title: "商城",
    });
  }

  coinPush = async (): any => {
    try {
      await this.props.dispatch(pushCoin());
    } catch (e) {
      if (e.message === API_RESULT.NOT_ENOUGH_DIAMOND) {
        PlatformAlert(
          "钻石不足",
          "您的钻石不足是否充值?",
          "充值",
          "取消",
          () => {
            this.props.navigator.push({
              screen: "CP.IAPScreen", // unique ID registered with Navigation.registerScreen
              title: "商城",
            });
          }
        );
      }
    }
  }

  pressQueue = async (): any => {
    let {status, entityID, roomInfo} = this.props;

    if (API_ENUM.ES_QueueTimeout == status) {
      PlatformAlert(
        "提示",
        "您上次排队超时本次免费排队",
        "排队",
        "取消",
        (): any => this._queueReq()
      );
    }
    else if (API_ENUM.ES_Queue == status && entityID != roomInfo.entityID) {
      PlatformAlert(
        "提示",
        "您已在其他房间排队,是否要支付800钻石费用排队",
        "排队",
        "取消",
        (): any => this._queueReq()
      );
    }
    else {
      PlatformAlert(
        "提示",
        "您需要支付800钻石排队",
        "排队",
        "取消",
        (): any => this._queueReq()
      );
    }
  }

  _queueReq = async (): any => {
    //
    await this.setState({queuing: true});
    try {
      let { roomID } = this.props;
      await this.props.dispatch(queueRoom(roomID));
    } catch (e) {
      //
      if (e.message === API_RESULT.NOT_ENOUGH_DIAMOND) {
        PlatformAlert(
          "钻石不足",
          "您的钻石不足支付排队消耗",
          "充值",
          "取消",
          () => {
            this.props.navigator.push({
              screen: "CP.IAPScreen", // unique ID registered with Navigation.registerScreen
              title: "商城",
            });
          }
        );
      }
    } finally {
      this.setState({queuing: false});
    }
  }

  renderCloseBtn = (): Component => {
    return (
      <TouchableOpacity
        accessibilityTraits="button"
        onPress={this.onPressClose}
        activeOpacity={0.5}
        style={styles.closeBtn}
      >
        <Image
          style={{
            width: "100%",
            height: "100%"
          }}
          source={require("./img/close.png")}
          resizeMode={"stretch"}/>
      </TouchableOpacity>
    );
  }

  renderWaitList = (): Component => {
    let { roomInfo } = this.props;

    if (roomInfo && roomInfo.queueList && roomInfo.queueList.length > 0) {
      let useList = roomInfo.queueList.slice(0, 5);
      let waitNum = roomInfo.queueList.length;

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
                source={{uri:item.headUrl}}
                //activeOpacity={0.7}
                containerStyle={{
                  marginLeft: -10
                }}
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

    return;
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

  _currQueueStatus = (): boolean => {
    let {status, roomInfo, userRoomID} = this.props;

    if (API_ENUM.ES_Queue == status && userRoomID == roomInfo.roomID) {
      return true;
    }

    return false;
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
          {this.renderVideoHeader()}
          {this.renderVideoBottom()}
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
          {this.renderVideoHeader()}
          {this.renderVideoBottom()}
        </View>
      );
    }
  }

  renderCenterBtn = (): Component => {
    if (this.state.bPlaying) {
      return (
        <Button
          title={"投币"}
          titleStyle={{color:"white", fontSize:35}}
          buttonStyle={{backgroundColor:"#ee4943", borderRadius:20, paddingVertical:20, paddingHorizontal:20}}
          onPress={this.coinPush}
        />
      );
    }
    else {
      return (
        <Button
          loading={this.state.queuing}
          title={this._currQueueStatus() ? "排队中" : "排队"}
          titleStyle={{color:"white", fontSize:25}}
          buttonStyle={{backgroundColor:"#ee4943", borderRadius:20, paddingVertical:20, paddingHorizontal:20}}
          onPress={this._currQueueStatus() ? null : this.pressQueue}
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
              tintColor={"#ee4943"}
              onTintColor={"#ee4943"}
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
            {"机台游戏记录"}
          </Text>
        </View>
        <View style={{width:"80%", height:2, backgroundColor:"#45474d", alignSelf: "center"}}/>
        <View style={{paddingHorizontal:30, marginBottom: 50}}>
          <RoomHistory id={this.props.roomID}/>
        </View>
      </View>
    );
  }

  renderVideoHeader = (): Component => {
    let {roomInfo} = this.props;
    if (roomInfo && roomInfo.entityID != 0) {
      return (
        <View style={styles.videoHeaderContainer}>
          <View style={styles.playerInfoContainer}>
            <Avatar
              //large
              rounded
              source={{uri:this.props.roomInfo.headUrl}}
            />
            <Text style={{
              fontSize: 15,
              color: "white",
              alignSelf: "center",
              marginLeft: 5
            }}>
              {this.props.roomInfo.nickName}
            </Text>
          </View>
          <TouchableOpacity
            accessibilityTraits="button"
            onPress={this.onPressMute}
            activeOpacity={0.5}
            style={styles.muteBtn}
          >
            <Image
              source={this.props.enabledBGM ? require("./img/soundon.png") : require("./img/soundoff.png")}
              resizeMode={"stretch"}/>
          </TouchableOpacity>
        </View>
      );
    }
    return;
  }

  renderVideoBottom = (): Component => {
    return (
      <View style={styles.videoBottomContainer}>
        <ProfitAnimationMgr
          ref={(ref: any) => {
            this._profitAnimMgr = ref;
          }}
        />
      </View>
    );
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
  video: {
    width: WIN_WIDTH,
    height: WIN_WIDTH / 3 * 4,
    resizeMode: "stretch",
    transform: [
      { rotateZ: "90deg" },
      { scaleX: 4 / 3},
      { scaleY: 3 / 4 }
    ]
  },
  liveVideo: {
    width: WIN_WIDTH,
    height: WIN_WIDTH / 3 * 4,
    resizeMode: "stretch",
    transform: [
      { rotateZ: "90deg" },
      { scaleX: 4 / 3},
      { scaleY: 3 / 4 }
    ]
  },
  videoLoading: {
    position: "absolute",
    top: 0,
    left: 0,
    justifyContent: "center",
    width: WIN_WIDTH,
    height: WIN_WIDTH / 3 * 4,
  },
  closeBtn: {
    width:40,
    height:40,
  },
  muteBtn: {
    marginRight: 10,
    width:40,
    height:40,
    justifyContent: "center"
  },
  historyTitle: {
    justifyContent: "center",
    width: "100%",
    height: 50,
    alignItems: "center",
    flexDirection: "row",
  },
  videoHeaderContainer: {
    position: "absolute",
    width: "100%",
    marginTop: 10,
    marginLeft: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignContent: "center",
    alignItems: "center"
  },
  videoBottomContainer: {
    position: "absolute",
    bottom: 10,
    left: 10,
    right: 10,
    flexDirection: "row",
    justifyContent: "flex-end",
    alignContent: "center",
    alignItems: "center"
  },
  playerInfoContainer: {
    height: 40,
    flexDirection: "row",
    alignContent: "center",
    alignItems: "center",
    backgroundColor: "#00000088",
    paddingHorizontal: 5,
    minWidth: 50,
    borderRadius: 30
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
    status: store.user.entityState,
    userRoomID: store.user.roomID,
    enabledBGM: store.user.bgmEnabled
  };
}

/* exports ================================================================== */
module.exports = connect(select)(GameScreen);
