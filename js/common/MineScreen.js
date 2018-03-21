import React, { Component } from "react";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
} from "react-native";
import { List, ListItem, SearchBar, Button, Avatar } from "react-native-elements";
import { refreshMsgs, setNavigator } from "../actions";
import { connect } from "react-redux";
import dateFormat from 'dateformat';
import ScreenComponent from './ScreenComponent';
import F8Colors from './F8Colors';
import { isIphoneX } from './../util';

const IPHONE_X_HEAD = 30;

const WEEK_CARD = 101;
const MONTH_CARD = 102;

class MineScreen extends ScreenComponent {
  constructor(props) {
    super(props);

    this.state = {
    };
  }

  static navigatorStyle = {
    navBarTextColor: '#ffffff',
    navBarBackgroundColor: F8Colors.mainBgColor2,
    navBarButtonColor: '#ffffff'
  };

  componentDidMount() {
  }

  renderContent = () => {
    return
  }

  getCardDesc = () => {
    let { items } = this.props;

    let desc = '无卡';

    // const WEEK_CARD = 2;
    // const MONTH_CARD = 3;

    if (items) {
      let _weekCard = false;

      if(items.find(function(element) {
        return element.id == WEEK_CARD;
      })){
        _weekCard = true;
        desc = '周卡';
      }

      if(items.find(function(element) {
        return element.id == MONTH_CARD;
      })){
        if (_weekCard) {
          desc += '/月卡';
        }
        else {
          desc = '月卡';
        }
      }
    }

    return desc;
  }

  renderHead = () => {
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
        <View style={{flex:0, marginLeft: 10, marginTop:20, alignItems:'flex-start'}}>
            <Text style={{color:'white', marginLeft:10, fontSize:20}}> {"" + this.props.nickName} </Text>
            <Text style={{color:'white', marginLeft:10, marginTop:5, fontSize:15}}> {"id:" + this.props.account}  </Text>
            <Text style={{color:'white', marginLeft:10, marginTop:5, fontSize:15}}>
             {this.getCardDesc()}
            </Text>
        </View>
      </View>
    )
  }

  renderCurr = () => {
    return (
      <View style={styles.currContainer}>
        <View style={{flexDirection: "row", alignContent:'center'}}>
          <Text style={{color:'white', fontSize:15, marginLeft: 10}}>
            {"钻石:" + this.props.diamond}
          </Text>
          <TouchableOpacity
            style={{justifyContent:'center', alignContent:'center', marginLeft:3}}
            onPress={this.pressBuy}
          >
            <Image
              source={require('./img/add.png')}
              style={{width:20, height:20}}
              />
          </TouchableOpacity>
        </View>
        <Text style={{color:'white', fontSize:15, marginRight: 10}}>
          {"积分:" + this.props.integral}
        </Text>
      </View>
    )
  }

  BTN_LIST = [
    {
      title: '消息记录',
      icon: require('./img/message.png'),
      onPress: () => {this.pressMsgHistory()}
    },
    {
      title: '游戏历史',
      icon: require('./img/histery.png'),
      onPress: () => {this.pressGameHistory()}
    },
    {
      title: '意见反馈',
      icon: require('./img/us.png'),
      onPress: () => {this.pressFeeback()}
    },
    {
      title: '设置',
      icon: require('./img/set.png'),
      onPress: () => {this.pressOption()}
    },
  ]

  pressMsgHistory = () => {
    this.props.navigator.push({
      screen: 'CP.MsgHistoryScreen', // unique ID registered with Navigation.registerScreen
      title: "邮件",
    });
  }

  pressFeeback = () => {
    this.props.navigator.push({
      screen: 'CP.FeedbackScreen', // unique ID registered with Navigation.registerScreen
      title: "意见反馈",
    });
  }

  pressGameHistory = () => {
    this.props.navigator.push({
      screen: 'CP.GameHistoryScreen', // unique ID registered with Navigation.registerScreen
      title: "游戏历史",
    });
  }

  pressOption = () => {
    this.props.navigator.push({
      screen: 'CP.OptionScreen', // unique ID registered with Navigation.registerScreen
      title: "设置",
    });
  }

  pressBuy = () => {
    this.props.navigator.push({
      screen: 'CP.IAPScreen', // unique ID registered with Navigation.registerScreen
      title: "商城",
    });
  }

  renderBtn = () => {
    return (
      <List containerStyle={styles.listContainer}>
      {
        this.BTN_LIST.map((item, i) => (
          <ListItem
            containerStyle={{borderTopWidth: 0, borderBottomWidth: 1, borderBottomColor: F8Colors.mainBgColor2}}
            titleStyle={{color: '#d1d3e8', fontSize: 15}}
            key={i}
            title={item.title}
            leftIcon={
              <Image
              style={{width:25, height:25, marginRight:5, marginLeft:5}}
              source={item.icon}/>
            }
            onPress={() => item.onPress(item)}
          />
        ))
      }
    </List>
    )
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={{width:'100%', backgroundColor: F8Colors.mainBgColor2, height: isIphoneX() ? IPHONE_X_HEAD : 10}}>
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
    width: '100%',
    backgroundColor: F8Colors.mainBgColor,
    //height: '100%',
  },
  header: {
    width: '100%',
    //height: 150,
    paddingBottom: 15,
    backgroundColor: F8Colors.mainBgColor2,
    flexDirection: "row",
  },
  currContainer: {
    width: '100%',
    height: 50,
    flexDirection: "row",
    marginTop: 10,
    backgroundColor: F8Colors.mainBgColor2,
    //justifyContent: 'center',
    //alignContent: 'center',
    alignItems: 'center',
    justifyContent: "space-between",
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

function select(store) {
  return {
    account: store.user.account,
    nickName: store.user.nickName,
    diamond: store.user.diamond,
    integral: store.user.integral,
    //checkinInfo: store.user.checkinInfo,
    headUrl: store.user.headUrl,
    items: store.user.items,
  };
}

/* exports ================================================================== */
module.exports = connect(select)(MineScreen);
