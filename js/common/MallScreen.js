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
import ModalYesNo from "./ModalYesNo";

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

type States = {
  item: Object,
  modalVisible: boolean
};

type Props = {
  dispatch: ?() => mixed,
  integral: number,
  items: Array<Object>
};

class MallScreen extends ScreenComponent<Props, States> {
  state = {
    modalVisible: false
  }

  constructor(props: Object) {
    super(props);

    // this.state = {
    //
    // };
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

  onPress = async (item: Object): any => {
    await this.setState({item});
    await this.setState({modalVisible: true});
  }

  renderContent = (): Component => {
    let { items } = this.props;
    if (items && items.length != 0) {
      return items.map((item: Object, idx: number): Component => {
        return (
          <NormalItem
            text={item.name}
            price={item.cost}
            icon={item.url}
            onPress={(): any => this.onPress(item)}
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

  getItemModalLabel = (): string => {
    let {item} = this.state;

    if (item) {
      return "是否要花" + item.cost + "积分购买道具 " + item.name + " ?";
    }

    return "无";
  }

  modalPressYes = () => {
    let {item} = this.state;

    if (item) {
      //this.props.dispatch(mallBuy(item.id));
    }
  }

  modalPressNo = () => {
    this.setState({modalVisible: false});
  }

  render = (): Component => {
    return (
      <View style={{
        width: "100%",
        height: "100%",
        backgroundColor: "transparent"
      }}>
        <ModalYesNo
          onPressYes={this.modalPressYes}
          onPressNo={this.modalPressNo}
          visible={this.state.modalVisible}
          label={this.getItemModalLabel()}
          yesLabel={"购买"}
          noLabel={"取消"}
        />
        <ScrollView style={styles.container}>
          {this.renderTitle(require("./img/shopmall.png"), "商城兑换")}
          <View style={styles.cardContainer}>
            {this.renderContent()}
          </View>
        </ScrollView>
      </View>
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
