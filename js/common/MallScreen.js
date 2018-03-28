//@flow
"use strict";

import React, { Component } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image, Dimensions } from "react-native";
import { getMarketList } from "../actions";
import { connect } from "react-redux";
import ScreenComponent from "./ScreenComponent";
import F8Colors from "./F8Colors";

const WIN_WIDTH = Dimensions.get("window").width,
  WIN_HEIGHT = Dimensions.get("window").height;

const cardWidth = (WIN_WIDTH - 50) / 2;

// Our custom component we want as a button in the nav bar
const NormalItem = ({ text, price, onPress, icon }: Object): Component =>
  <TouchableOpacity
    style={styles.card}
    onPress={(): void => onPress()}
  >
    <Image source={{uri:icon}} style={{width:"100%", height:cardWidth, resizeMode: "stretch"}} />
    <Text style={{color:"#d3d3e8"}}> {text} </Text>
    <Text style={{color:"#d3d3e8"}}> {"价格:" + price} </Text>
  </TouchableOpacity>;

class MallScreen extends ScreenComponent {
  constructor(props: Object) {
    super(props);

    this.state = {
    };
  }

  static navigatorStyle = {
    navBarTextColor: "#ffffff",
    navBarBackgroundColor: F8Colors.mainBgColor2,
    navBarButtonColor: "#ffffff"
  };

  RNNDidAppear = () => {
    this.props.dispatch(getMarketList());
  }

  componentDidMount() {
  }

  onPress = () => {

  }

  renderContent = (): Component => {
    let { items } = this.props;
    if (items) {
      return items.map((item: Object, idx: number): Component => {
        return (
          <NormalItem
            text={item.name}
            price={item.cost}
            icon={item.url}
            onPress={this.onPress}
            key={idx}
          />
        );
      });
    }
    else {
      return (
        <View style={[styles.loadingCotainer]}>
          <ActivityIndicator animating size="large" color='white'/>
        </View>
      );
    }
  }

  renderTitle = (icon: Object, label: string): Component => {
    return (
      <View style={styles.titleContainer}>
        <Image source={icon}/>
        <Text style={{color:"#d3d3e8"}}> {label} </Text>
        <Text style={{
          right: 40,
          position: "absolute",
          color: "#d3d3e8",
        }}> {"你的积分:" + this.props.integral} </Text>
      </View>
    );
  }

  render(): Component {
    return (
      <ScrollView style={styles.container}>
        {this.renderTitle(require("./img/shopmall.png"), "商城兑换")}
        <View style={styles.cardContainer}>
          {this.renderContent()}
        </View>
      </ScrollView>
    );
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
  cardContainer: {
    flex: 1,
    justifyContent: "flex-start",
    //alignItems: 'flex-start',
    //alignContent: 'space-around',
    flexWrap: "wrap",
    flexDirection: "row",
    backgroundColor: F8Colors.mainBgColor,
    marginLeft: 10,
    marginRight: 10,
  },
  card: {
    width: cardWidth,
    height: cardWidth + 30,
    borderRadius: 13,
    marginTop:15,
    marginLeft:10,
    backgroundColor: "transparent"
  },
  titleContainer: {
    flex: 1,
    width: WIN_WIDTH,
    height: 40,
    marginLeft: 20,
    marginTop: 10,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: F8Colors.mainBgColor,
  },
  loadingCotainer: {
    flex: 1,
    width: "100%",
    height: WIN_HEIGHT,
    justifyContent: "center",
    alignContent: "center",
    alignItems: "center",
    backgroundColor: F8Colors.mainBgColor,
  }
});

function select(store: Object): Object {
  return {
    items: store.mall.marketList,
    integral: store.user.integral,
  };
}

/* exports ================================================================== */
module.exports = connect(select)(MallScreen);
