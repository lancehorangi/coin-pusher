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

// Our custom component we want as a button in the nav bar
const NormalItem = ({ text, price, onPress, icon }) =>
  <TouchableOpacity
    style={styles.card}
    onPress={() => onPress()}
  >
    <Image source={{uri:icon}} style={{width:'100%', height:cardWidth, resizeMode: "stretch"}} />
    <Text style={{color:'#d3d3e8'}}> {text} </Text>
    <Text style={{color:'#d3d3e8'}}> {'价格:' + price} </Text>
  </TouchableOpacity>;

class MallScreen extends ScreenComponent {
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

  renderContent = () => {
    TEMP_DATA = [{
      text: "这是商品的描述",
      price: "1200",
      icon: 'https://www.baidu.com/img/bd_logo1.png',
    },
    {
      text: "这是商品的描述",
      price: "1200",
      icon: 'https://www.baidu.com/img/bd_logo1.png',
    },
    {
      text: "这是商品的描述",
      price: "1200",
      icon: 'https://www.baidu.com/img/bd_logo1.png',
    },
    {
      text: "这是商品的描述",
      price: "1200",
      icon: 'https://www.baidu.com/img/bd_logo1.png',
    },
    {
      text: "这是商品的描述",
      price: "1200",
      icon: 'https://www.baidu.com/img/bd_logo1.png',
    },
    {
      text: "这是商品的描述",
      price: "1200",
      icon: 'https://www.baidu.com/img/bd_logo1.png',
    },]

    return TEMP_DATA.map((data, idx) => {
      return (
        <NormalItem
          text={data.text}
          price={data.price}
          icon={data.icon}
          onPress={this.onPress}
          />
      );
    });
  }

  renderTitle = (icon, label) => {
    return (
    <View style={styles.titleContainer}>
      <Image source={icon}/>
      <Text style={{color:'#d3d3e8'}}> {label} </Text>
      <Text style={{
        right: 40,
        position: 'absolute',
        color: '#d3d3e8',
      }}> {"你的积分:" + this.props.integral} </Text>
    </View>
    )
  }

  render() {
    return (
      <ScrollView style={styles.container}>
        {this.renderTitle(require('./img/shopmall.png'), '商城兑换')}
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
    width: '100%',
    backgroundColor: F8Colors.mainBgColor
  },
  cardContainer: {
      flex: 1,
      justifyContent: 'space-around',
      //alignItems: 'flex-start',
      //alignContent: 'space-around',
      flexWrap: 'wrap',
      flexDirection: 'row',
      backgroundColor: F8Colors.mainBgColor,
      marginLeft: 10,
      marginRight: 10,
  },
  card: {
    width: cardWidth,
    height: cardWidth + 30,
    borderRadius: 13,
    marginTop:15,
    backgroundColor: 'transparent'
  },
  titleContainer: {
    flex: 1,
    width: WIN_WIDTH,
    height: 40,
    marginLeft: 20,
    marginTop: 10,
    flexDirection: "row",
    alignItems: 'center',
    backgroundColor: F8Colors.mainBgColor,
  }
});

function select(store) {
  return {
    account: store.user.account,
    integral: store.user.integral,
  };
}

/* exports ================================================================== */
module.exports = connect(select)(MallScreen);
