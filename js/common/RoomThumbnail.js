//@flow
"use strict";

import { View, Image, StyleSheet, TouchableOpacity, Text } from "react-native";
import React, { Component } from "react";
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
          投币折扣{ Math.floor((this.props.baseCost - this.props.currCost) / this.props.baseCost * 100) }%
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
            额外产出{this.props.integralRate}%
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
            {this.props.currCost}<Image style={{width: 15, height: 15}} source={require("./img/gold.png")}/>每次
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
        <View style={styles.statusLabelContainer}>
          <Text style={[styles.statusLabel, {color: "red"}]}>维护中</Text>
        </View>
      );
    }

    return null;
  }

  renderQueueStatus = (): Component => {
    if (this.props.queuing) {
      return (
        <View style={styles.statusLabelContainer}>
          <Text style={styles.statusLabel}>排队中</Text>
        </View>
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
            <Text style={[styles.label, {color: this.props.bPlaying || this.props.unavaible ? "red" : "green" }]}> { this.props.unavaible ? "维护中" : this.props.bPlaying ? "游戏中" : "空闲"} </Text>
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
    fontWeight: "bold"
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
    marginRight: 10,
    alignSelf: "flex-end"
  },
  topInfoContainer: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    //alignContent:"center",
    backgroundColor: "#000000"
  },
  statusLabelContainer: {
    backgroundColor: "#00000088",
    borderRadius: 15,
    padding: 10,
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center"
  },
  statusLabel: {
    color: "white",
    fontWeight: "bold"
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
