//@flow
"use strict";

import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
  ActivityIndicator
} from "react-native";

import { connect } from "react-redux";
import { checkin, getCheckinInfo } from "../actions";
import ScreenComponent from "./ScreenComponent";
import F8Colors from "./F8Colors";

let renderUnavaibleMark = (bAvaiable: boolean): Component => {
  if (bAvaiable) {
    return null;
  }

  return (
    <Image source={require("./img/wlq.png")}
      style={{
        marginLeft: -20,
        height: 50,
        width: 50,
        resizeMode: "stretch"
      }}/>
  );
};

const TYPE_IMG = {
  0: require("./img/new.png"),
  1: require("./img/gift.png"),
  2: require("./img/week.png"),
  3: require("./img/month.png"),
};

const NormalItem = ({ text, bAvaiable, onPress, icon, btnText, bReceive }: Object): Component =>
  <TouchableOpacity
    style={styles.card}
    activeOpacity={1}
  >
    <View style={{flexDirection: "row", justifyContent: "center", alignItems: "center"}}>
      <Image source={icon} style={{width:40, marginLeft: 15, resizeMode: "stretch"}} />
      {renderUnavaibleMark(bAvaiable)}
    </View>
    <Text style={{
      color:"#d3d3e8"}}
    numberOfLines={2} textAlign={"left"}>{text}</Text>
    <TouchableOpacity
      style={[styles.cardBtn, bReceive ? {backgroundColor: "grey"} : {} ]}
      onPress={(): void => onPress()}
    >
      <Text style={{
        color:"#d3d3e8"
      }}> {btnText} </Text>
    </TouchableOpacity>
  </TouchableOpacity>;

type States = {
    bLoading: boolean
};

class SignScreen extends ScreenComponent<{}, States> {
  constructor(props: Object) {
    super(props);

    this.state = {
      bLoading:true
    };
  }

  static navigatorStyle = {
    navBarTextColor: "#ffffff",
    navBarBackgroundColor: F8Colors.mainBgColor2,
    navBarButtonColor: "#ffffff"
  };

  RNNDidAppear = () => {
    this.initInfo();
  }

  async initInfo(): void {
    await this.setState({bLoading:true});

    try {
      await this.props.dispatch(getCheckinInfo());
    } catch (e) {
      //
    } finally {
      this.setState({bLoading:false});
    }
  }

  componentDidMount() {

  }

  onPress = (type: number, avaiable: boolean, receive: number) => {
    if (avaiable && receive != 1) {
      this.props.dispatch(checkin(type));
    }
    else if (!avaiable) {
      this.props.navigator.push({
        screen: "CP.IAPScreen", // unique ID registered with Navigation.registerScreen
        title: "商城",
      });
    }
  }

  renderSeparator = (): Component => {
    return (
      <View
        style={{
          height: 1,
          width: "100%",
          backgroundColor: "#45474D",
        }}
      />
    );
  };

  renderContent = (): Component => {
    if (this.props.checkinInfo) {
      return this.props.checkinInfo.map((data: Object, index: number) => {
        if(data.type != 0 || data.days != 0 && TYPE_IMG[data.type.toString()]) {
          return (
            <View>
              <NormalItem
                key={index}
                text={this.getItemText(data.value, data.days, data.type, data.desc)}
                bAvaiable={data.days != 0}
                icon={TYPE_IMG[data.type.toString()]}
                btnText={this.getBtnText(data.type, data.receive, data.days != 0)}
                onPress={() => { this.onPress(data.type, data.days != 0, data.receive); }}
                bReceive={data.receive == 1}
              />
              <View
                style={{
                  height: 1,
                  width: "100%",
                  backgroundColor: "#45474D",
                }}
              />
            </View>
          );
        }
        else {
          return;
        }
      });
    }
    else {
      return;
    }
  }

  getItemText(num: number, leftDays: number, type: number, desc: string): string {
    const PAID_CHECKIN_TYPE = 1;
    let text = "";
    text += "每日奖励:" + num + "钻石";

    if(leftDays != 0 && type != PAID_CHECKIN_TYPE) {
      text += "\n有效期:" + leftDays + "天";
    }
    else if (leftDays != 0 && type == PAID_CHECKIN_TYPE) {
      text += "\n有效期:永久";
    }
    else {
      text += "\n" + desc;
    }

    return text;
  }

  getBtnText(type: number, receive: number, avaiable: boolean): string {
    if (avaiable) {
      if (receive == 1) {
        return "已领取";
      }
      else {
        return "领取";
      }
    }
    else {
      const BTN_DESC_TEXT = {
        0: "",
        1: "获得福利",
        2: "获得周卡",
        3: "获得月卡",
      };

      return BTN_DESC_TEXT[type.toString()];
    }
  }

  render(): Component {
    if (this.state.bLoading) {
      return (
        <View style={[styles.loadingCotainer]}>
          <ActivityIndicator animating size="large" color='white'/>
        </View>
      );
    }
    else {
      return (
        <ScrollView style={styles.container}>
          {this.renderContent()}
        </ScrollView>
      );
    }
  }
}

/* StyleSheet
============================================================================= */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    backgroundColor: F8Colors.mainBgColor
  },
  card: {
    width: "100%",
    height: 60,
    flexDirection: "row",
    justifyContent: "space-between",
    alignContent: "center",
    alignItems: "center"
  },
  cardBtn: {
    marginRight: 10,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 13,
    backgroundColor: "#ee4943",
    flexDirection: "row",
    justifyContent: "center",
  },
  loadingCotainer: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: F8Colors.mainBgColor,
  }
});

function select(store: Object): Object {
  return {
    account: store.user.account,
    checkinInfo: store.user.checkinInfo,
  };
}

/* exports ================================================================== */
module.exports = connect(select)(SignScreen);
