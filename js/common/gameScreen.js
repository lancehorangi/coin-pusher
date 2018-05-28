//@flow
"use strict";

import React from "react";
import { connect } from "react-redux";
import F8Colors from "./F8Colors";
import {
  Dimensions,
  StyleSheet,
  View,
  Alert,
  Text,
  ActivityIndicator,
  ScrollView,
  Switch,
  TextInput,
  TouchableOpacity
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
  toggleBGM,
  getAccountInfo,
  getChatHistory,
  chatReq,
  clearChatMsg,
  switchWiper,
  roomNotify,
  feedback,
  finishFirstHint
} from "../actions";
import ScreenComponent from "./ScreenComponent";
import MoneyLabel from "./MoneyLabel";
import ProfitAnimationMgr from "./ProfitAnimationMgr";
import Spinner from "react-native-spinkit";
import ChatList from "./ChatList";
import { isIphoneX, toastShow, getMachineName, PlatformAlert, AlertPrompt } from "./../util";
import ModalOK from "./ModalOK";
import RoomHistory from "./RoomHistory";
import ImgButton from "./ImgButton";
import PlayButton from "./PlayButton";
import ModalRoomNotify from "./ModalRoomNotify";
import ModalFirstHint from "./ModalFirstHint";
import { dismissModal } from "./../navigator";
import KSYVideo from "react-native-ksyvideo";
import { Avatar } from "react-native-elements";
import { API_ENUM, API_RESULT, GAME_STATE } from "../api";
import { PlayBGM, StopBGM, PlayCoinSound, PlayGetCoinSound } from "../sound";
import Permissions from "react-native-permissions";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { FIRST_HINT_PLAY, FIRST_HINT_QUEUE } from "../const";
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
  bSending: boolean,
  queuing: boolean,
  bShowChatTextInput: boolean,
  chatMsg: string,
  bShowChatList: boolean,
  bShowHint: boolean,
  bShowRoomNotify: boolean,
  centerInfo: string,
  countDown: number,
  firstHintType: number,
  bShowFirstHint: boolean
};

class GameScreen extends ScreenComponent<Props, States> {
  _isMounted: boolean;

  constructor(props: Object) {
    super(props);
    this.state = {
      bLoading: true,
      autoPlay: false,
      bPlaying: false,
      queuing: false,
      bSending: false,
      bShowChatTextInput: false,
      bShowRoomNotify: false,
      chatMsg: "",
      bShowChatList: true,
      bShowHint: false,
      centerInfo: "",
      countDown: 120,
      bShowFirstHint: false
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
    clearInterval(this.roomInfoLoop);
    this.setState({autoPlay:false});

    NimUtils.leaveMeeting();
    StopBGM();
    //this.props.dispatch(leaveRoom());
  }

  componentWillUnmount() {
    clearInterval(this.updateLoop);
    clearInterval(this.heartLoop);
    clearInterval(this.roomInfoLoop);

    //this.props.dispatch(leaveRoom());
  }

  componentDidMount() {
    //this._isMounted = true;
  }

  async reqEnterRoom(): void {
    await this.setState({ bLoading: true });
    let { roomID, account, token } = this.props;
    this.props.dispatch(clearChatMsg());

    clearInterval(this.heartLoop);
    clearInterval(this.roomInfoLoop);
    this.roomInfoLoop = setInterval(async (): void => {
      let resultRoomInfo = await this.props.dispatch(roomInfo(roomID));

      if (this.state.bPlaying && resultRoomInfo.info.entityID !== this.props.entityID) {
        dismissModal("您已自动退出房间");
      }

      if (!this.state.bPlaying && resultRoomInfo.info.entityID == 0) {
        this.reqEnterRoom();
      }

      await this.props.dispatch(getChatHistory(roomID));
      let roomNotifyResult = await this.props.dispatch(roomNotify());
      if (roomNotifyResult.specialReward) {
        this.setState({bShowRoomNotify: true});
      }
    }, 5000);

    let result = null;
    try {
      result = await this.props.dispatch(roomInfo(roomID));

      //机台处在非正常状态
      if (result.info.state !== 0 && !this.props.isGM) {
        dismissModal("此房间暂不可用");
        return;
      }

      if (result.info.entityID !== this.props.entityID) {
        await this.props.dispatch(enterRoom(roomID));
      }
      await this.setState({bPlaying:true});

      this.heartLoop = setInterval(async (): void => {
        try {
          let result = await this.props.dispatch(heartRequest());
          this.setState({countDown: result.countDown});
          if (result.addIntegral > 0) {
            this._profitAnimMgr.addInfo(result.addIntegral);
            if (this.props.enabledBGM) {
              PlayGetCoinSound();
            }
          }
        } catch (e) {
          //
        }
      }, 1000);

      if (this.props.enabledBGM) {
        PlayBGM();
      }

      if (!this.props.firstHint[FIRST_HINT_PLAY]) {
        await this.setState({bShowFirstHint:true, firstHintType:FIRST_HINT_PLAY});
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

      if (!this.props.firstHint[FIRST_HINT_QUEUE]) {
        await this.setState({bShowFirstHint:true, firstHintType:FIRST_HINT_QUEUE});
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
          this.onPressCoinPush();
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

  onPressChat = () => {
    this.setState({bShowChatTextInput: true});
  }

  onPressSwitchWiper = () => {
    this.props.dispatch(switchWiper());
  }

  onPressToggleChat = () => {
    let {bShowChatList} = this.state;
    bShowChatList = !bShowChatList;
    this.setState({bShowChatList});
  }

  onPressShowHint = () => {
    this.setState({bShowHint: true});
  }

  onPressShowHistory = () => {
    if (this._scrollRef) {
      this._scrollRef.props.scrollToPosition(0, WIN_HEIGHT);
    }
  }

  onPressCoinPush = async (): any => {
    try {
      await this.props.dispatch(pushCoin());

      if (this.props.enabledBGM) {
        PlayCoinSound();
      }
    } catch (e) {
      if (e.message === API_RESULT.NOT_ENOUGH_DIAMOND) {
        this.setState({autoPlay:false});
        this.onAutoPlayValue(false);
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

  _queueAlertShow = async (): any => {
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

  pressQueue = async (): any => {
    try {
      let pushPermission = await Permissions.request("notification");

      console.log("pressQueue pushPermission:" + pushPermission);
      if (pushPermission !== "authorized") {
        PlatformAlert(
          "提示",
          "您未开启推送这会导致无法接受到排队相关通知，是否要开启推送权限？",
          "前往设置",
          "取消",
          Permissions.openSettings,
          this._queueAlertShow
        );
      }
      else {
        this._queueAlertShow();
      }
    } catch (e) {
      console.log("pressQueue e:" + e.message);
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
      <ImgButton
        style={styles.closeBtn}
        icon={require("./img/Back.png")}
        onPress={this.onPressClose}/>
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

  renderSoundBtn = (): Component => {
    return (
      <ImgButton
        style={styles.muteBtn}
        icon={this.props.enabledBGM ? require("./img/soundon.png") : require("./img/soundoff.png")}
        onPress={this.onPressMute}/>
    );
  }

  renderHeader = (): Component => {
    if (this.state.bLoading) {
      return;
    }

    return (
      <View style={styles.headerContainer}>
        { this.renderCloseBtn() }
        { this.renderWaitList() }
        { this.renderSoundBtn() }
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

  renderVideo = (): Component => {
    if (this.state.bLoading) {
      return (
        <View style={styles.loadingCotainer}>
          <Spinner isVisible={true} size={50} type={"9CubeGrid"} color="white"/>
        </View>
      );
    }
    else if (this.state.bPlaying) {
      return (
        <View style={styles.container}>
          <View style={styles.videoLoading}>
            <Spinner isVisible={true} size={50} type={"9CubeGrid"} color="white"/>
          </View>
          <NTESGLView style={styles.video}/>
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
            source={{uri: this.props.roomInfo ? this.props.roomInfo.rtmpUrl : ""}}   // Can be a URL or a local file.                                 // Store reference
            volume={1.0}
            muted={true}
            paused={this._isMounted}                          // Pauses playback entirely.
            //resizeMode="stretch"                      // Fill the whole screen at aspect ratio.*
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
        </View>
      );
    }
  }

  renderCenterBottom = (): Component => {
    let { roomInfo } = this.props;
    let centerBtn;

    if (this.state.bPlaying) {
      centerBtn = (
        <PlayButton value={roomInfo ? roomInfo.coins : 0} type={"play"} onPress={this.onPressCoinPush}/>
      );
    }
    else if (this._currQueueStatus()) {
      centerBtn = (
        <PlayButton type={"queuing"}/>
      );
    }
    else {
      centerBtn = (
        <PlayButton loading={this.state.queuing} value={800} type={"queue"} onPress={this.pressQueue}/>
      );
    }

    return (
      <View style={{
        justifyContent: "center",
        alignContent: "center",
        alignItems: "center"
      }}>
        {centerBtn}
        <ImgButton style={{marginTop: 5, width: 24, height: 24}} onPress={this.onPressShowHistory} icon={require("./img/arrow.png")}/>
      </View>
    );
  }

  renderBottom = (): Component => {
    if (!this.state.bLoading) {
      let autoComp;
      if (this.state.bPlaying) {
        autoComp = (
          <View style={{
            position: "absolute",
            left: 10,
          }}>
            <Switch
              value={this.state.autoPlay}
              onValueChange={this.onAutoPlayValue}
              tintColor={"#ee4943"}
              onTintColor={"#ee4943"}
            />
            <Text style={{color:"white", width:"100%", fontSize:15, marginTop:2, textAlign:"center"}}>
              {"自动"}
            </Text>
          </View>
        );
      }

      return (
        <View style={styles.bottomContainer}>
          {autoComp}
          {this.renderCenterBottom()}

          <View style={{
            position: "absolute",
            right: 10,
            justifyContent:"center",
            alignItems:"flex-end",
            paddingVertical: 5,
          }}>

            <MoneyLabel
              containerStyle={{width: 100}}
              type={this.state.bPlaying ? "gold" : "diamond"}
              count={this.state.bPlaying ? this.props.gold : this.props.diamond}
              btnType={"add"}
              onPress={this.onPressIAP}/>

            <MoneyLabel
              containerStyle={{marginTop:5, width: 100}}
              type={"integral"}
              count={this.props.integral}
              btnType={"help"}
              onPress={this.onPressShowHint}/>

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
    let feedbackBtn;

    if (this.state.bPlaying) {
      feedbackBtn = (
        <TouchableOpacity style={styles.feedbackBtn}
          onPress={async (): any => {
            let content = getMachineName(roomInfo.roomID) + "出现问题, 官方将及时修复\n请输入手机号:";
            AlertPrompt(
              "报修",
              content,
              "发送",
              "取消",
              (text: string) => {
                let pattern = /^[1][3,4,5,6,7,8,9][0-9]{9}$/;
                if (!pattern.test(text)) {
                  Alert.alert("请输入正确的手机号");
                  return;
                }

                this.props.dispatch(feedback(text, content));
              }
            );
          }}>
          <Text style={{color: "white"}}>报修</Text>
        </TouchableOpacity>
      );
    }


    if (roomInfo && roomInfo.entityID != 0) {
      return (
        <View style={styles.videoHeaderContainer}>
          <View style={styles.playerInfoContainer}>
            <Avatar
              rounded
              source={{uri:this.props.roomInfo.headUrl}}
            />
            <View>
              <Text style={{
                fontSize: 14,
                color: "white",
                marginLeft: 5,
                marginRight: 5
              }}>
                {this.props.roomInfo.nickName }
              </Text>
              <Text style={{
                fontSize: 10,
                color: "white",
                marginLeft: 5,
                marginRight: 5
              }}>
                { getMachineName(roomInfo.roomID) + "游戏中"}
              </Text>
            </View>
          </View>
          {feedbackBtn}
        </View>
      );
    }
    return;
  }

  renderChatList = (): Component => {
    if (this.state.bShowChatList) {
      return (
        <ChatList style={styles.chatListContainer}
          roomID={this.props.roomID}
          chatList={this.props.chatList}
        />
      );
    }

    return;
  }

  renderChatListToggleBtn = (): Component => {
    return (
      <ImgButton
        style={styles.toggleChatListBtn}
        icon={require("./img/arrow02.png")}
        onPress={this.onPressToggleChat}
        inverted={!this.state.bShowChatList}/>
    );
  }

  renderChatFrame = (): Component => {
    return (
      <View>
        {this.renderChatList()}
        {this.renderChatListToggleBtn()}
      </View>
    );
  }

  renderChatTextInput = (): Component => {
    if (this.state.bShowChatTextInput) {
      return (
        <View style={styles.chatInputTextContainer}>
          <TouchableOpacity
            accessibilityTraits="button"
            onPress={async (): any => {
              await this.setState({bShowChatTextInput: false});
              this.setState({chatMsg: ""});
            }}
            activeOpacity={0.5}
            style={styles.toggleChatInputBtn}
          >
            <Text style={{textAlign: "center", color: "white"}}>收起</Text>
          </TouchableOpacity>
          <TextInput
            style={styles.chatInputText}
            autoFocus={true}
            returnKeyLabel={"发送"}
            returnKeyType={"send"}
            maxLength={50}
            onSubmitEditing={ async (): any => {
              if (this.state.bSending) {
                return;
              }

              await this.setState({bSending: true});
              await this.props.dispatch(chatReq(this.props.roomID, this.state.chatMsg));
              await this.setState({bShowChatTextInput: false, bSending: false});
            }}
            onChangeText={async (text: string): any => {
              this.setState({chatMsg: text});
            }}>
          </TextInput>
          <TouchableOpacity
            accessibilityTraits="button"
            onPress={async (): any => {
              console.log("room/chat.action chat:" + this.state.chatMsg);
              if (this.state.bSending) {
                return;
              }

              await this.setState({bSending: true});
              await this.props.dispatch(chatReq(this.props.roomID, this.state.chatMsg));
              await this.setState({bShowChatTextInput: false, bSending: false});
            }}
            activeOpacity={0.5}
            style={styles.sendChatBtn}
          >
            <Text style={{textAlign: "center", color: "white"}}>发送</Text>
          </TouchableOpacity>
        </View>
      );
    }
    else {
      return;
    }
  }

  renderChat = (): Component => {
    return (
      <View style={{
        flex: 0,
        marginLeft: 10,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
      }}>
        <View>
          {this.renderChatFrame()}
          {this.renderChatTextInput()}
        </View>
      </View>
    );
  }

  renderGainEffect = (): Component => {
    return (
      <View style={styles.videoBottomContainer}>
        <ProfitAnimationMgr
          style={{width: 100}}
          ref={(ref: any) => {
            this._profitAnimMgr = ref;
          }}
        />
      </View>
    );
  }

  renderBottomSideBtns = (): Component => {
    let brushContent;

    if (this.state.bPlaying) {
      brushContent = (
        <ImgButton
          style={{width: 40, height: 40}}
          icon={require("./img/burshon.png")}
          onPress={this.onPressSwitchWiper}/>
      );
    }

    return (
      <View style={styles.bottomSideContainer}>
        <ImgButton
          style={{width: 40, height: 40}}
          icon={require("./img/talk.png")}
          onPress={this.onPressChat}/>
        {brushContent}
      </View>
    );
  }

  renderCenterInfo = (): Component => {
    let {roomInfo} = this.props;

    if (this.state.countDown <= 60 && this.state.bPlaying) {
      return (
        <View style={styles.centerInfoContainer}>
          <View style={styles.centerInfoTextContainer}>
            <Text style={{color: "white", fontWeight: "bold", fontSize: 20}}>
              <Text style={{color: "red"}}>{this.state.countDown}</Text>秒不投币将自动退出
            </Text>
          </View>
        </View>
      );
    }
    else if (roomInfo && roomInfo.gameState === GAME_STATE.GS_Wait) {
      return (
        <View style={styles.centerInfoContainer}>
          <View style={styles.centerInfoTextContainer}>
            <Text style={{color: "white", fontWeight: "bold", fontSize: 20}}>
              {"正在等待其他排到的玩家进入游戏"}
            </Text>
          </View>
        </View>
      );
    }

    return;
  }

  render(): Component {
    return (
      <KeyboardAwareScrollView
        innerRef={(ref: any) => {
          this._scrollRef = ref;
        }}
        style={[styles.container]}
        bounces={false}
      >
        <ModalOK
          visible={this.state.bShowHint}
          title={"积分说明"}
          label={"游戏中回收的游戏币都将变为您的积分，积分可以在商城中兑换礼品。游戏中当您金币耗尽时，后续投币消耗将从积分余额中扣除。"}
          onPressClose={(): any => this.setState({bShowHint: false})}
        />

        <ModalRoomNotify
          visible={this.state.bShowRoomNotify}
          onPressClose={(): any => {
            this.setState({bShowRoomNotify: false});
            this.props.navigator.push({
              screen: "CP.MsgHistoryScreen",
              title: "消息中心",
            });
          }}
        />

        <ModalFirstHint
          visible={this.state.bShowFirstHint}
          type={this.state.firstHintType}
          onPressClose={async (): any => {
            await this.props.dispatch(finishFirstHint(this.state.firstHintType));
            await this.setState({bShowFirstHint: false});
          }}
        />

        {this.renderVideo()}
        {this.renderCenterInfo()}

        <View style={styles.videoFrame}>
          <View>
            <View style={{width:"100%", backgroundColor: "transparent",
              height: isIphoneX() ? IPHONE_X_HEAD + 10 : 10}}/>
            {this.renderHeader()}
            {this.renderVideoHeader()}
          </View>
          <View>
            {this.renderChat()}
            {this.renderGainEffect()}
            {this.renderBottomSideBtns()}
            {this.renderBottom()}
          </View>
        </View>
        {this.renderHistory()}
      </KeyboardAwareScrollView>
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
    marginLeft: 10,
    marginTop: 10,
    alignItems: "center",
    flexDirection: "row",
  },
  bottomContainer: {
    justifyContent: "center",
    width: "100%",
    //height: 100,
    marginLeft: 0,
    alignItems: "center",
    flexDirection: "row",
    paddingHorizontal: 10,
    marginTop: 10,
    marginBottom: 5
    //backgroundColor: 'black',
  },
  loadingCotainer: {
    height: WIN_HEIGHT,
    justifyContent: "center",
    alignItems: "center",
    alignContent: "center",
    backgroundColor: F8Colors.mainBgColor2,
  },
  bottomSideContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    paddingHorizontal: 10,
    marginTop: 10
  },
  videoFrame: {
    justifyContent: "space-between",
    width: WIN_WIDTH,
    height: WIN_HEIGHT
  },
  video: {
    position: "absolute",
    left: 0,
    top: 0,
    width: WIN_WIDTH,
    height: WIN_HEIGHT,
    resizeMode: "contain",
    transform: [
      { rotateZ: "90deg" },
      { scaleX: WIN_HEIGHT / WIN_WIDTH },
      { scaleY: WIN_WIDTH / WIN_HEIGHT }
    ]
  },
  liveVideo: {
    position: "absolute",
    left: 0,
    top: 0,
    width: WIN_WIDTH,
    height: WIN_HEIGHT,
    resizeMode: "stretch",
    transform: [
      { rotateZ: "90deg" },
      { scaleX: WIN_HEIGHT / WIN_WIDTH },
      { scaleY: WIN_WIDTH / WIN_HEIGHT }
    ]
  },
  videoLoading: {
    position: "absolute",
    top: 0,
    left: 0,
    justifyContent: "center",
    alignItems: "center",
    alignContent: "center",
    width: WIN_WIDTH,
    height: WIN_HEIGHT,
  },
  centerInfoContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    justifyContent: "center",
    alignItems: "center",
    alignContent: "center",
    width: WIN_WIDTH,
    height: WIN_HEIGHT,
  },
  centerInfoTextContainer: {
    backgroundColor: "#00000088",
    borderRadius: 14,
    padding: 10
  },
  closeBtn: {
    width:40,
    height:40,
  },
  toggleChatListBtn: {
    marginLeft: 7,
    width: 24,
    height: 24
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
    marginTop: 10
  },
  videoHeaderContainer: {
    marginTop: 10,
    marginLeft: 10,
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-between",
    alignContent: "center",
    alignItems: "center"
  },
  videoBottomContainer: {
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
  feedbackBtn: {
    //height: 40,
    marginRight: 15,
    padding: 5,
    justifyContent: "center",
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
  },
  chatListContainer: {
    height: 100,
    backgroundColor: "#00000044",
    borderRadius: 10
  },
  chatInputTextContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: WIN_WIDTH - 25,
    color: "white",
    backgroundColor: "#00000088",
    borderRadius: 10,
    paddingHorizontal: 5,
    paddingVertical: 5
  },
  chatInputText: {
    width: WIN_WIDTH - 25 - 60 - 52,
    color: "white",
  },
  sendChatBtn: {
    backgroundColor: "blue",
    borderRadius: 10,
    padding: 5,
    width: 50,
    marginRight: 10
  },
  toggleChatInputBtn: {
    marginLeft: 2,
    marginRight: 5,
    width: 40,
    borderRadius: 10,
    backgroundColor: "#000000EE",
    padding: 5
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
    diamond: store.user.diamond,
    status: store.user.entityState,
    userRoomID: store.user.roomID,
    enabledBGM: store.user.bgmEnabled,
    chatList: store.chat.chatList,
    firstHint: store.user.firstHint,
    isGM: store.user.isGM
  };
}

/* exports ================================================================== */
module.exports = connect(select)(GameScreen);
