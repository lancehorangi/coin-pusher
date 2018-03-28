//@flow
"use strict";

import { View, Image, StyleSheet, TouchableOpacity } from "react-native";
import React, { Component } from "react";
import { Text } from "./F8Text";
import { showModal } from "./../navigator";

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
  bgWidth: number,
  bgHeight: number
};

class RoomThumbnail extends Component<Props> {
  constructor() {
    super();
  }

  onPress = () => {
    showModal({
      screen: "CP.GameScreen", // unique ID registered with Navigation.registerScreen
      title: "游戏", // title of the screen as appears in the nav bar (optional)
      passProps: {roomID:this.props.roomID}, // simple serializable object that will pass as props to the modal (optional)
      navigatorStyle: { navBarHidden: true }, // override the navigator style for the screen, see "Styling the navigator" below (optional)
      navigatorButtons: {}, // override the nav buttons for the screen, see "Adding buttons to the navigator" below (optional)
      animationType: "slide-up" // 'none' / 'slide-up' , appear animation for the modal (optional, default 'slide-up')
    });
  }

  //优惠:{ Math.floor((this.props.baseCost - this.props.currCost) / this.props.baseCost * 100) }%

  renderCost = () => {
    if (this.props.baseCost != this.props.currCost) {
      return (
        <View style={{flex:1, backgroundColor:"#ee4943"}}>
          <Text style={{
            color:"white",
            fontSize:12
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
          <View style={{flex:1, backgroundColor:"#3b94e6"}}>
            <Text style={{
              color:"white",
              fontSize:12
            }}>
              积分赠送{Math.floor(this.props.integralRate * 100)}%
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
        <View style={{
          //width:'100%',
          //height: '100%',
          //justifyContent: 'flex-end',
        }}>
          <Text style={{
            color:"white",
            fontSize:12,
            //alignItems: 'flex-end',
            alignSelf: "flex-end",
            backgroundColor: "#00000088",
          }}>
            消耗:{this.props.currCost}每次
          </Text>
          <View style={{
            //flex: 0,
            //width:'100%',
            flexDirection: "row",
            justifyContent: "space-between",
            alignContent:"center",
            backgroundColor: "#00000088",
            alignSelf: "flex-end",
          }}>
            {this.renderCost()}
            {this.renderIntegralRate()}
          </View>
        </View>
      );
    }

    render (): Component {
      return (
        <TouchableOpacity
          accessibilityTraits="button"
          onPress={this.onPress}
          //activeOpacity={0.5}
          style={[styles.container, this.props.style]}
        >
          <Image style={[styles.bg]} source={{uri:this.props.picUrl}}/>

          <View style={{
            width:"100%",
            flexDirection: "row",
            justifyContent: "space-between",
            alignContent:"center",
            backgroundColor: "#00000088",
          }}>
            <Text style={ styles.label }> { this.props.roomID }号 </Text>
            <Text style={ styles.label }> { this.props.bPlaying ? "游戏中" : "空闲"} </Text>
          </View>

          {this.renderInfo()}
        </TouchableOpacity>
      );
    }
}

const styles = StyleSheet.create({
  container: {
    //flex: 0,
    //width: THUMB_WIDTH,
    //height: THUMB_HEIGHT,
    //backgroundColor: 'transp',
    justifyContent: "space-between",
    marginTop: 10
  },
  bg: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    resizeMode: "stretch"
  },
  label: {
    color: "white",
    fontSize: 13,
    //textShadowOffset: {width:1, height:1},
    textShadowColor: "black",
  }
});

module.exports = RoomThumbnail;
