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
import { getChargeList, mallBuy } from "../actions";
import { connect } from "react-redux";
import ScreenComponent from "./ScreenComponent";
import F8Colors from "./F8Colors";

const WIN_WIDTH = Dimensions.get("window").width;
//WIN_HEIGHT = Dimensions.get("window").height;

// Our custom component we want as a button in the nav bar
const NormalItem = ({ text, price, unit, describ, onPress, bgColor, subBgColor }: Object): Component =>
  <TouchableOpacity
    style={[styles.card, { backgroundColor: bgColor }]}
    onPress={(): void => onPress()}
  >
    <View style={{flex: 0, height:100, backgroundColor: "transparent"}}>
      <Text style={{ color: "white", top: 10, left: 10, fontSize:30 }}>
        {text}
      </Text>
      <View style={{flex: 0, position: "absolute",
        backgroundColor: "#ffdf00", borderRadius: 13,
        marginTop:5, right:5, paddingHorizontal:10, height: 18 }}>
        <Text style={{ color: "#ee4943", fontSize:14 }}>
          {price}
        </Text>
      </View>
      <Text style={{ color: "white", top: 10, left: 10, fontSize:15 }}>
        {unit}
      </Text>
      <View style={{position: "absolute", left:0, right:0, bottom:0, height:25, backgroundColor: subBgColor, borderBottomLeftRadius: 13,
        borderBottomRightRadius: 13}}>
        <Text style={{ color: "white", fontSize:12, width:"90%", top:4, left:10 }}
          numberOfLines={1}>
          {describ}
        </Text>
      </View>
    </View>
  </TouchableOpacity>;

const NormalCardItem = ({ text, price, unit, describ, describ2, onPress, bgColor, subBgColor }: Object): Component =>
  <TouchableOpacity
    style={[styles.card, { backgroundColor: bgColor }]}
    onPress={(): void => onPress()}
  >
    <View style={{flex: 0, height:100, backgroundColor: "transparent"}}>
      <View style={{flexDirection: "row", height: 40}}>
        <Text style={{ color: "white", marginTop: 10, marginLeft: 10, fontSize:30 }}>
          {text}
        </Text>
        <View style={{flex:0, justifyContent:"flex-end"}}>
          <Text style={{ color: "white", marginLeft: 5, fontSize:12 }}>
            {unit}
          </Text>
        </View>
      </View>
      <View style={{flex: 0, position: "absolute",
        backgroundColor: "#ffdf00", borderRadius: 13,
        marginTop:5, right:5, paddingHorizontal:10, height: 18 }}>
        <Text style={{ color: "#ee4943", fontSize:14 }}>
          {price}
        </Text>
      </View>
      <Text style={{ color: "white", marginLeft:10, marginTop: 3, fontSize:10 }} numberOfLines={2}>
        {describ2}
      </Text>
      <View style={{position: "absolute", left:0, right:0, bottom:0, height:25, backgroundColor: subBgColor, borderBottomLeftRadius: 13,
        borderBottomRightRadius: 13}}>
        <Text style={{ color: "white", fontSize:12, width:"90%", top:4, left:10 }}
          numberOfLines={1}>
          {describ}
        </Text>
      </View>
    </View>
  </TouchableOpacity>;

const WEEK_CARD = 101;
const MONTH_CARD = 102;

class IAPScreen extends ScreenComponent {
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
    this.props.dispatch(getChargeList());
  }

  componentDidMount() {
  }

  onPress = (id: number) => {
    //Alert.alert('iap buy:' + id);
    this.props.dispatch(mallBuy(id));
  }

  renderContent = (): Component => {
    let { items } = this.props;

    return items.map((item: Object): Component => {
      if (item.id != WEEK_CARD && item.id != MONTH_CARD) {
        return (
          <NormalItem
            text={item.desc1}
            price={item.cost + "元"}
            describ={item.desc2}
            unit={"钻石"}
            onPress={(): void => this.onPress(item.id)}
            bgColor={"#ee4943"}
            subBgColor={"#3b94e6"}
            key={item.id}
          />
        );
      }
    });
  }

  renderCard = (): Component => {
    let { items } = this.props;

    return items.map((item: Object): Component => {
      if (item.id == WEEK_CARD || item.id == MONTH_CARD) {
        return (
          <NormalCardItem
            text={item.desc1}
            price={item.cost + "元"}
            describ={item.desc2}
            describ2={item.desc3}
            unit={"钻石"}
            onPress={(): void => this.onPress(item.id)}
            bgColor={item.id == WEEK_CARD ? "#00c832" : "#3d38f6"}
            subBgColor={item.id == WEEK_CARD ? "#008321" : "#1f66a7"}
            key={item.id}
          />
        );
      }
    });
  }

  renderTitle = (icon: Object, label: string): Component => {
    return (
      <View style={styles.titleContainer}>
        <Image source={icon}/>
        <Text style={{color:"#d3d3e8"}}> {label} </Text>
      </View>
    );
  }

  render(): Component {
    let { items } = this.props;
    if (items && items.length != 0) {
      return (
        <ScrollView style={styles.container}>
          {this.renderTitle(require("./img/Recharge1.png"), "超值充值")}
          <View style={styles.cardContainer}>
            {this.renderContent()}
          </View>
          {this.renderTitle(require("./img/Recharge2.png"), "周卡月卡")}
          <View style={styles.cardContainer}>
            {this.renderCard()}
          </View>
        </ScrollView>
      );
    }
    else {
      return (
        <View style={[styles.loadingCotainer]}>
          <ActivityIndicator animating size="large" color='white'/>
        </View>
      );
    }
  }
}

/* StyleSheet
============================================================================= */
let cardWidth = 170;
if(WIN_WIDTH < 3200) {
  cardWidth = (WIN_WIDTH - 50) / 2;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    backgroundColor: F8Colors.mainBgColor
  },
  cardContainer: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    //alignContent: 'space-around',
    flexWrap: "wrap",
    flexDirection: "row",
    backgroundColor: F8Colors.mainBgColor,
    marginLeft: 10,
    marginRight: 10,
  },
  card: {
    width: cardWidth,
    height: 100,
    borderRadius: 13,
    marginTop:15,
    marginLeft:10,
  },
  titleContainer: {
    flex: 1,
    height: 40,
    marginLeft: 20,
    marginTop: 10,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: F8Colors.mainBgColor,
  },
  loadingCotainer: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: F8Colors.mainBgColor,
  }
});

function select(store: Object): Object {
  return {
    items: store.mall.chargeList,
  };
}

/* exports ================================================================== */
module.exports = connect(select)(IAPScreen);
