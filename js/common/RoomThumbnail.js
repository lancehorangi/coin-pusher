//@flow
"use strict";

import { View, Image, StyleSheet, TouchableOpacity } from "react-native";
import React, { Component } from "react";
import { Text } from "./F8Text";
import { showModal } from "./../navigator";
import { connect } from "react-redux";

type Props = {
  dispatch: (action: any) => Promise,
  roomID: number,
  baseCost: number,
  currCost: number,
  integralRate: number,
  picUrl: string,
  bPlaying: boolean,
  style: null | Object,
  meetingName: string,
  rmtpUrl: string,
  bgWidth: number,
  bgHeight: number,
  queuing: boolean,
  unavaible: boolean
};

class RoomThumbnail extends Component<Props> {
  constructor() {
    super();
  }

  onPress = () => {
    showModal({
      screen: "CP.GameScreen",
      title: "游戏",
      passProps: {roomID:this.props.roomID},
      navigatorStyle: { navBarHidden: true },
      navigatorButtons: {},
      animationType: "none"
    });
  }

  _hasActivity = (): boolean => {
    return this.props.baseCost != this.props.currCost || this.props.integralRate !== 0;
  }

  _hasCostActivity = (): boolean => {
    return this.props.baseCost != this.props.currCost;
  }

  _hasIntegralActivity = (): boolean => {
    return this.props.integralRate !== 0;
  }

  renderCost = () => {
    if (this.props.baseCost != this.props.currCost) {
      return (
        <View style={[{
          flex:1, backgroundColor:"#ee4943"
        }, this._hasIntegralActivity() ? styles.bottomLeftBorderStyle  : styles.bottomBorderStyle]}>
          <Text style={{
            color:"white",
            fontSize:12,
            textAlign: "center"
          }}>
          优惠:{ Math.floor((this.props.baseCost - this.props.currCost) / this.props.baseCost * 100) }%
          </Text>
        </View>
      );
    }
    else {
      return;
    }
  }

  //this.props.integralRate
  renderIntegralRate = () => {
    if (this.props.integralRate !== 0) {
      return (
        <View style={[{flex:1, backgroundColor:"#3b94e6"},
          this._hasCostActivity() ? styles.bottomRightBorderStyle : styles.bottomBorderStyle]}>
          <Text style={{
            color:"white",
            fontSize:12,
            textAlign: "center"
          }}>
            积分赠送{this.props.integralRate}%
          </Text>
        </View>
      );
    }
    else {
      return;
    }
  }

  renderInfo = (): Component => {
    return (
      <View>
        <View style={[styles.consumeContainer, this._hasActivity() ? {} : styles.bottomBorderStyle]}>
          <Text style={styles.consumeLabel}>
            {this.props.currCost}<Image style={{width: 15, height: 15}} source={require("./img/Diamonds.png")}/>每次
          </Text>
        </View>
        <View style={[styles.actContainer, styles.bottomBorderStyle]}>
          {this.renderCost()}
          {this.renderIntegralRate()}
        </View>
      </View>
    );
  }

  renderUnavaibleStatus = (): Component => {
    if (this.props.unavaible) {
      return (
        <Image style={styles.statusImg} source={require("./img/whz.png")}/>
      );
    }

    return null;
  }

  renderQueueStatus = (): Component => {
    if (this.props.queuing) {
      return (
        <Image style={styles.statusImg} source={require("./img/pdz.png")}/>
      );
    }

    return null;
  }

  render (): Component {
    return (
      <TouchableOpacity
        accessibilityTraits="button"
        onPress={this.onPress}
        style={[styles.container, this.props.style]}
      >
        <Image style={[styles.bg]} source={{uri:this.props.picUrl}}/>
        <View style={styles.statusContainer}>
          {this.renderUnavaibleStatus()}
          {this.renderQueueStatus()}
        </View>
        <View>
          <View style={[styles.topInfoContainer, styles.topBorderStyle]}>
            <Text style={[styles.label]}> { this.props.roomID }号 </Text>
            <Text style={[styles.label, {color: this.props.bPlaying ? "red" : "green" }]}> { this.props.bPlaying ? "游戏中" : "空闲"} </Text>
          </View>
        </View>
        {this.renderInfo()}
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    justifyContent: "space-between",
    marginTop: 10,
    borderRadius: 13
  },
  bg: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    resizeMode: "stretch",
    borderRadius: 10
  },
  statusContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center"
  },
  label: {
    color: "white",
    fontSize: 13,
    textShadowColor: "black",
  },
  actContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignContent:"center",
    backgroundColor: "#000000",
    alignSelf: "flex-end",
  },
  consumeContainer: {
    backgroundColor: "#000000"
  },
  consumeLabel: {
    color: "white",
    fontSize: 12,
    alignSelf: "flex-end"
  },
  topInfoContainer: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    //alignContent:"center",
    backgroundColor: "#000000"
  },
  statusImg: {
    flex: 0,
    width: 80,
    height: 15,
    resizeMode: "stretch"
  },
  topBorderStyle: {
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10
  },
  bottomBorderStyle: {
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10
  },
  bottomLeftBorderStyle: {
    borderBottomLeftRadius: 10
  },
  bottomRightBorderStyle: {
    borderBottomRightRadius: 10
  }
});

function select(state: Object): Object {
  return {
    navigator: state.appNavigator
  };
}

module.exports = connect(select)(RoomThumbnail);
