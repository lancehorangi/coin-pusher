//@flow
"use strict";

import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
} from "react-native";
import { List, ListItem, Avatar } from "react-native-elements";
import { connect } from "react-redux";
import ScreenComponent from "./ScreenComponent";
import F8Colors from "./F8Colors";
import { isIphoneX } from "./../util";
import ModalOK from "./ModalOK";
import ImgButton from "./ImgButton";

const IPHONE_X_HEAD = 30;

const WEEK_CARD = 101;
const MONTH_CARD = 102;

class MineScreen extends ScreenComponent {
  constructor(props: Object) {
    super(props);

    this.state = {
      bShowHint: false
    };
  }

  static navigatorStyle = {
    navBarTextColor: "#ffffff",
    navBarBackgroundColor: F8Colors.mainBgColor2,
    navBarButtonColor: "#ffffff"
  };

  componentDidMount() {
  }

  renderContent = () => {
    return;
  }

  getCardDesc = (): Component => {
    let { items } = this.props;

    let desc = "无卡";

    if (items) {
      let _weekCard = false;

      if(items.find(function(element: Object): boolean {
        return element.id == WEEK_CARD;
      })){
        _weekCard = true;
        desc = "周卡";
      }

      if(items.find(function(element: Object): boolean {
        return element.id == MONTH_CARD;
      })){
        if (_weekCard) {
          desc += "/月卡";
        }
        else {
          desc = "月卡";
        }
      }
    }

    return desc;
  }

  renderHead = (): Component => {
    return (
      <View style={styles.header}>
        <Avatar
          large
          rounded
          //icon={{name: 'history', color: 'white'}}
          source={{uri:this.props.headUrl}}
          //overlayContainerStyle={{backgroundColor: 'grey'}}
          activeOpacity={0.7}
          containerStyle={{width:80, height:80, marginTop: 20, marginLeft:20}}
        />
        <View style={{
          flex:0,
          marginLeft: 10,
          marginTop:20,
          alignItems: "flex-start",
          justifyContent: "space-around",
          alignContent: "flex-start"
        }}>
          <Text style={{color:"white", fontSize:20}}>{this.props.nickName}</Text>
          <Text style={{color:"white", fontSize:15}}>{"ID:" + this.props.accountID}</Text>
          <Text style={{color:"white", fontSize:15}}>{this.getCardDesc()}</Text>
        </View>
      </View>
    );
  }

  renderCurr = (): Component => {
    return (
      <View style={styles.currContainer}>
        <View style={{justifyContent: "center"}}>
          <Text style={{color:"white", fontSize:12, alignSelf: "center" }}>
            钻石
          </Text>
          <View style={{flexDirection: "row", alignContent:"center", alignItems: "center"}}>
            <Image
              style={{height:25, width: 25, resizeMode: "stretch"}}
              source={require("./img/Diamonds.png")}/>
            <Text style={{color:"white", fontSize:15, marginLeft: 2 }}>
              {this.props.diamond}
            </Text>
            <ImgButton style={{
              marginLeft: 2, width: 20, height: 20
            }}
            onPress={this.pressBuy}
            icon={require("./img/add.png")}/>
          </View>
        </View>
        <View style={{justifyContent: "center"}}>
          <Text style={{color:"white", fontSize:12, alignSelf: "center" }}>
            积分
          </Text>
          <View style={{flexDirection: "row", alignContent:"center", alignItems: "center"}}>
            <Image
              style={{height:25, width: 25, resizeMode: "stretch"}}
              source={require("./img/integral.png")}/>
            <Text style={{color:"white", fontSize:15, marginLeft: 2}}>
              {this.props.integral}
            </Text>
            <ImgButton style={{
              marginLeft: 2, width: 20, height: 20
            }}
            onPress={this.pressHelp}
            icon={require("./img/question.png")}/>
          </View>
        </View>
      </View>
    );
  }

  BTN_LIST = [
    {
      title: "消息记录",
      icon: require("./img/message.png"),
      onPress: () => {this.pressMsgHistory();}
    },
    {
      title: "游戏历史",
      icon: require("./img/histery.png"),
      onPress: () => {this.pressGameHistory();}
    },
    {
      title: "意见反馈",
      icon: require("./img/us.png"),
      onPress: () => {this.pressFeeback();}
    },
    {
      title: "设置",
      icon: require("./img/set.png"),
      onPress: () => {this.pressOption();}
    },
  ]

  pressMsgHistory = () => {
    this.props.navigator.push({
      screen: "CP.MsgHistoryScreen",
      title: "邮件",
    });
  }

  pressFeeback = () => {
    this.props.navigator.push({
      screen: "CP.FeedbackScreen",
      title: "意见反馈",
    });
  }

  pressGameHistory = () => {
    this.props.navigator.push({
      screen: "CP.GameHistoryScreen",
      title: "游戏历史",
    });
  }

  pressOption = () => {
    this.props.navigator.push({
      screen: "CP.OptionScreen",
      title: "设置",
    });
  }

  pressBuy = () => {
    this.props.navigator.push({
      screen: "CP.IAPScreen",
      title: "商城",
    });
  }

  pressHelp = () => {
    this.setState({bShowHint: true});
  }

  renderBtn = (): Component => {
    return (
      <List containerStyle={styles.listContainer}>
        {
          this.BTN_LIST.map((item: Object, i: string): Component => (
            <ListItem
              containerStyle={{borderTopWidth: 0, borderBottomWidth: 1, borderBottomColor: F8Colors.mainBgColor2}}
              titleStyle={{color: "#d1d3e8", fontSize: 15}}
              key={i}
              title={item.title}
              leftIcon={
                <Image
                  style={{width:25, height:25, marginRight:5, marginLeft:5}}
                  source={item.icon}/>
              }
              onPress={(): void => item.onPress(item)}
            />
          ))
        }
      </List>
    );
  }

  render(): Component {
    return (
      <View style={styles.container}>
        <ModalOK
          visible={this.state.bShowHint}
          label={"游戏中回收的游戏币都将变为您的积分，积分可以在商城中兑换礼品。游戏中当您金币耗尽时，后续投币消耗将从积分余额中扣除。"}
          onPressClose={(): any => this.setState({bShowHint: false})}
        />
        <View style={{width:"100%", backgroundColor: F8Colors.mainBgColor2, height: isIphoneX() ? IPHONE_X_HEAD : 10}}>
        </View>
        {this.renderHead()}
        {this.renderCurr()}
        {this.renderBtn()}
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
    backgroundColor: F8Colors.mainBgColor,
    //height: '100%',
  },
  header: {
    width: "100%",
    //height: 150,
    paddingBottom: 15,
    backgroundColor: F8Colors.mainBgColor2,
    flexDirection: "row",
  },
  currContainer: {
    width: "100%",
    height: 50,
    flexDirection: "row",
    marginTop: 10,
    backgroundColor: F8Colors.mainBgColor2,
    //justifyContent: 'center',
    //alignContent: 'center',
    alignItems: "center",
    justifyContent: "space-around",
  },
  listContainer: {
    flex: 1,
    //height: '100%',
    marginTop: 0,
    borderTopWidth: 0,
    borderBottomWidth: 0,
    borderBottomColor: "#45474D",
    backgroundColor: F8Colors.mainBgColor,
  }
});

function select(store: Object): Object {
  return {
    account: store.user.account,
    nickName: store.user.nickName,
    diamond: store.user.diamond,
    integral: store.user.integral,
    //checkinInfo: store.user.checkinInfo,
    headUrl: store.user.headUrl,
    items: store.user.items,
    accountID: store.user.id,
  };
}

/* exports ================================================================== */
module.exports = connect(select)(MineScreen);
