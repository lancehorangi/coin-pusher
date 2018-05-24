//@flow
"use strict";

import * as React from "react";
import { Component } from "react";
import { View,
  StyleSheet,
  Dimensions,
  Animated,
  Alert,
  StatusBar } from "react-native";
import { TabViewAnimated, TabBar } from "react-native-tab-view";
import { connect } from "react-redux";
import { Navigation } from "react-native-navigation";
import { NimSession } from "react-native-netease-im";
import {
  loggedOut,
  setNavigator,
  refreshMsgs,
  getAccountInfo,
  getCheckinInfo,
  freshItems,
  freshMoney,
  showRoomList,
  getBanner
} from "./../actions";
import BannerCarousel from "./BannerCarousel";
import RoomList from "./RoomList";
import GridButton from "./GridButton";
import CustomMainScreenTabButton from "./CustomMainScreenTabButton";
import CustomMainScreenTabMsgButton from "./CustomMainScreenTabMsgButton";
import { showModal } from "./../navigator";
import F8Colors from "./F8Colors";

const initialLayout = {
  height: 0,
  width: Dimensions.get("window").width,
};

const ROOM_TYPE_GOLD = 0;
const ROOM_TYPE_GOLD10 = 1;

Navigation.registerComponent("CP.CustomMainScreenTabButton", (): Object => CustomMainScreenTabButton);
Navigation.registerComponent("CP.CustomMainScreenTabMsgButton", (): Object => CustomMainScreenTabMsgButton);

type Props = {
  dispatch: ?() => mixed,
  navigator: Object
};

type States = {
  index: number,
  routes: Array<Object>,
  tabY: number,
  bInitFinish: boolean
};

export class MainScreen extends React.Component<Props, States> {
  nScroll = new Animated.Value(0);
  _scrollRef = null;
  _offsetY = 0;

  _refs = {}
  state = {
    index: 0,
    routes: [
      { key: "first", title: "金币1倍场" },
      { key: "second", title: "金币10倍场" },
    ],
    tabY: 0,
    bInitFinish: false
  };

  static navigatorButtons = {
    rightButtons: [
      {
        id: "add",
        buttonColor: "#ffffff",
        //icon: require('./img/header/add.png'),
        component: "CP.CustomMainScreenTabButton",
        disableIconTint: true,
        passProps: {}
      }
    ],
    leftButtons: [
      {
        id: "message",
        buttonColor: "#ffffff",
        //icon: require("./img/header/news.png"),
        component: "CP.CustomMainScreenTabMsgButton",
        disableIconTint: true,
      }
    ]
  };

  static navigatorStyle = {
    navBarTextColor: "#ffffff",
    navBarBackgroundColor: F8Colors.mainBgColor2
  };

  constructor(props: Object) {
    super(props);
    // if you want to listen on navigator events, set this up
    this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));
  }

  onNavigatorEvent(event: Object) {
    //console.log('MainScreen:' + JSON.stringify(event));
    switch(event.id) {
    case "willAppear":
      break;
    case "didAppear":
      this.props.dispatch(setNavigator(this.props.navigator));
      this.props.dispatch(freshMoney());
      this.props.dispatch(freshItems());
      this.props.dispatch(refreshMsgs());
      this.props.dispatch(getBanner());
      this._refreshRoomList(this.state.index);
      break;
    case "willDisappear":
      break;
    case "didDisappear":
      break;
    case "willCommitPreview":
      break;
    }

    if (event.type == "NavBarButtonPress") { // this is the event type for button presses
      if (event.id == "add") { // this is the same id field from the static navigatorButtons definition
        this.props.navigator.push({
          screen: "CP.IAPScreen", // unique ID registered with Navigation.registerScreen
          title: "商城",
        });
      }
      if (event.id == "message") {
        this.props.navigator.push({
          screen: "CP.MsgHistoryScreen", // unique ID registered with Navigation.registerScreen
          title: "消息中心",
        });
      }
    }
  }

  _refreshRoomList = (index: number) => {
    this.props.dispatch(showRoomList(index));
  }

  _handleIndexChange = async (index: number): void => {
    //
    this._scrollRef.getNode().scrollTo({y: this._offsetY, animated: true});

    await this.setState({ index });
    this._refreshRoomList(index);
  }

  _renderHeaderTabBar = (props: Object): Component => {
    return <TabBar style={{
      transform: [{translateY: this.state.tabY}],
      backgroundColor: F8Colors.mainBgColor2
    }}
    labelStyle={{color: "#d1d3e8", margin:1}}
    scrollEnabled={false}
    useNativeDriver={true}
    { ...props }/>;
  }

  _renderScene = ({ route }: Object): Component => {
    switch (route.key) {
    case "first":
      return <RoomList ref={(tabScene: Object) => {
        if(tabScene){
          this._refs[route.key] = tabScene.getWrappedInstance();
        }}}
      displayRoomType={ROOM_TYPE_GOLD}/>;
    case "second":
      return <RoomList ref={(tabScene: Object) => {
        if(tabScene){
          this._refs[route.key] = tabScene.getWrappedInstance();
        }}}
      displayRoomType={ROOM_TYPE_GOLD10}/>;
    default:
      return null;
    }
  }

  _onPressSign = () => {
    this.props.navigator.push({
      screen: "CP.SignScreen", // unique ID registered with Navigation.registerScreen
      title: "签到",
    });
  }

  _onPressTutorial = () => {
    showModal({
      screen: "CP.ImageSwiperScreen", // unique ID registered with Navigation.registerScreen
      title: "教程",
      passProps: {
        images: [
          require("./img/tutorial1.png"),
          require("./img/tutorial2.png"),
        ]
      },
      navigatorStyle: { navBarHidden: true },
      //animationType: 'fade',
    });
  }

  getAvaibleCheckinfoIcon(): boolean {
    let { checkinInfo } = this.props;

    if (checkinInfo) {
      for (let info of checkinInfo) {
        if (info && info.days != 0 && info.receive === 0 ) {
          return require("./img/buttons/sign_r.png");
        }
      }
    }

    return require("./img/buttons/sign.png");
  }

  _renderHeader = (): Component => { return (
    <View style={{backgroundColor: F8Colors.mainBgColor}}>
      <StatusBar barStyle="light-content"/>
      <BannerCarousel/>
      <View style={styles.gridContainer}>
        <GridButton
          icon={this.getAvaibleCheckinfoIcon()}
          caption={"签到"}
          onPress={(): void => this._onPressSign()}/>
        <GridButton
          icon={require("./img/buttons/course.png")}
          caption={"教程"}
          onPress={(): void => this._onPressTutorial()}/>
        <GridButton
          icon={require("./img/buttons/more.png")}
          caption={"敬请期待"}/>
      </View>
    </View>
  );
  }

  async initInfo(): any {
    try {
      await NimSession.login(this.props.account, this.props.token);
      this.props.dispatch(refreshMsgs());
      this.props.dispatch(getAccountInfo());
      this.props.dispatch(getCheckinInfo());
      this.props.dispatch(freshItems());

    } catch (e) {
      Alert.alert("account:" + this.props.account + ", token:" + this.props.token + ", err=" + e.message);
    } finally {
      //
    }
  }

  componentDidMount() {
    if(this.props.loggedIn){
      this.initInfo();
    }
    else {
      this.props.dispatch(loggedOut());
    }
  }

  _onEndReached = () => {
    let {routes, index} = this.state;

    routes.map((route: Object, refIndex: number) => {
      if(refIndex == index){
        let key = route["key"];
        this._refs[key].onEndReached();
        return;
      }
    });
  }

  _renderTabView = (): Component => {
    if (this.state.bInitFinish) {
      return <TabViewAnimated
        style={styles.container}
        navigationState={this.state}
        renderScene={this._renderScene}
        renderHeader={this._renderHeaderTabBar}
        onIndexChange={this._handleIndexChange}
        initialLayout={initialLayout}
      />;
    }
    else {
      return null;
    }
  }

  onHeaderLayout = (e: any) =>
  {
    //Alert.alert('layout height:' + e.nativeEvent.layout.height);
    let offsetY = e.nativeEvent.layout.height;
    this._offsetY = offsetY;

    if(this.nScroll){
      this.setState({ tabY:
        this.nScroll.interpolate({
          inputRange: [-offsetY + 1, offsetY - 1, offsetY, offsetY * 2],
          outputRange: [0, 0, offsetY - offsetY, offsetY * 2 - offsetY]
        })
      });
      this.setState({ bInitFinish: true });
    }
  }

  isReachEnd = ({layoutMeasurement, contentOffset, contentSize}: Object): Component => {
    const paddingToBottom = 0;
    return layoutMeasurement.height + contentOffset.y >=
                        contentSize.height - paddingToBottom;
  };

  render(): Component {
    return (
      <Animated.ScrollView
        ref={(ref: any) => {
          this._scrollRef = ref;
        }}
        alwaysBounceVertical={false}
        alwaysBounceHorizontal={false}
        bounces={false}
        scrollEventThrottle={5}
        showsVerticalScrollIndicator={false}
        onScroll={Animated.event([{nativeEvent: {contentOffset: {y: this.nScroll}}}], {useNativeDriver: true,
          listener: (event: Object) => {
            if(this.isReachEnd(event.nativeEvent))
              this._onEndReached();
          }})}
        style={styles.container}>
        <View onLayout={this.onHeaderLayout}>
          {this._renderHeader()}
        </View>
        {this._renderTabView()}
      </Animated.ScrollView>
    );
  }
}

const GRID_HEIGHT = 62;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: F8Colors.mainBgColor,
  },
  gridContainer: {
    flex: 1,
    width: "100%",
    height:GRID_HEIGHT,
    flexDirection: "row",
  }
});

function select(store: Object): Object {
  return {
    account: store.user.account,
    token: store.user.token,
    checkinInfo: store.user.checkinInfo
  };
}

module.exports = connect(select)(MainScreen);
