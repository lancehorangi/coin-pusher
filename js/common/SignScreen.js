import React, { Component } from "react";
import { View, Text, FlatList, ActivityIndicator,
  StyleSheet, ScrollView, TouchableOpacity, Image, Dimensions } from "react-native";
import { List, ListItem, SearchBar, Button, Avatar } from "react-native-elements";
import { refreshMsgs } from "../actions";
import { connect } from "react-redux";
import dateFormat from 'dateformat';
import ScreenComponent from './ScreenComponent';
import F8Colors from './F8Colors';

const WIN_WIDTH = Dimensions.get("window").width,
  WIN_HEIGHT = Dimensions.get("window").height;

cardWidth = (WIN_WIDTH - 50) / 2;

renderUnavaibleMark = (bAvaiable) => {
  if (bAvaiable) {
    return null;
  }

  return (
    <Image source={require('./img/wlq.png')}
          style={{
            position: "absolute",
            left: 20,
            height: 50,
            width: 50,
            resizeMode: "stretch"
          }}/>
  )
}

// Our custom component we want as a button in the nav bar
const NormalItem = ({ text, bAvaiable, onPress, icon, btnText }) =>
  <TouchableOpacity
    style={styles.card}
  >
    <Image source={icon} style={{width:40, resizeMode: "stretch"}} />
    {renderUnavaibleMark(bAvaiable)}
    <Text style={{
      color:'#d3d3e8',
      marginLeft: 50}}
      numberOfLines={2}> {text} </Text>
    <TouchableOpacity
      style={styles.cardBtn}
      onPress={() => onPress()}
    >
      <Text style={{
        color:'#d3d3e8'
      }}> {btnText} </Text>
    </TouchableOpacity>
  </TouchableOpacity>;

class SignScreen extends ScreenComponent {
  constructor(props) {
    super(props);

    this.state = {
    };
  }

  static navigatorStyle = {
    navBarTextColor: '#ffffff',
    navBarBackgroundColor: '#373a41',
    navBarButtonColor: '#ffffff'
  };

  componentDidMount() {
  }

  onPress = () => {

  }

  renderSeparator = () => {
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

  renderContent = () => {
    TEMP_DATA = [{
      text: "每日奖励10积分\n 有效期7次",
      bAvaiable: false,
      icon: require('./img/new.png'),
      btnText: '领取领取'
    },
    {
      text: "每日奖励10积分\n 有效期7次",
      bAvaiable: true,
      icon: require('./img/new.png'),
      btnText: '领取领取'
    },
    {
      text: "每日奖励10积分\n 有效期7次",
      bAvaiable: false,
      icon: require('./img/new.png'),
      btnText: '领取领取'
    },
    {
      text: "每日奖励10积分\n 有效期7次",
      bAvaiable: false,
      icon: require('./img/new.png'),
      btnText: '领取领取'
    },]

    return TEMP_DATA.map((data, idx) => {
      return (
        <View>
        <NormalItem
          text={data.text}
          bAvaiable={data.bAvaiable}
          icon={data.icon}
          btnText={data.btnText}
          onPress={this.onPress}
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
    });
  }

  render() {
    return (
      <ScrollView style={styles.container}>
          {this.renderContent()}
      </ScrollView>
    );
  }
}

/* StyleSheet
============================================================================= */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    backgroundColor: F8Colors.mainBgColor
  },
  card: {
    width: '100%',
    height: 60,
    borderRadius: 13,
    marginTop: 15,
    marginLeft: 30,
    backgroundColor: 'transparent',
    flexDirection: "row",
    alignContent: 'center',
  },
  cardBtn: {
    position: 'absolute',
    flex: 0,
    paddingHorizontal: 10,
    paddingVertical: 8,
    right: 40,
    marginTop: 5,
    borderRadius: 13,
    //height: 23,
    backgroundColor: "#ee4943",
    flexDirection: 'row',
    justifyContent: 'center',
  }
});

function select(store) {
  return {
    account:store.user.account,
  };
}

/* exports ================================================================== */
module.exports = connect(select)(SignScreen);
