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

import { connect } from "react-redux";
import { refreshMsgs, checkin, getCheckinInfo } from "../actions";
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

const TYPE_IMG = {
  0: require('./img/new.png'),
  1: require('./img/gift.png'),
  2: require('./img/week.png'),
  3: require('./img/month.png'),
}

// Our custom component we want as a button in the nav bar
const NormalItem = ({ text, bAvaiable, onPress, icon, btnText }) =>
  <TouchableOpacity
    style={styles.card}
    activeOpacity={1}
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
      bLoading:true
    };
  }

  static navigatorStyle = {
    navBarTextColor: '#ffffff',
    navBarBackgroundColor: F8Colors.mainBgColor2,
    navBarButtonColor: '#ffffff'
  };

  RNNDidAppear = () => {
    this.initInfo();
  }

  async initInfo(){
    await this.setState({bLoading:true});

    try {
      let result = await this.props.dispatch(getCheckinInfo());
    } catch (e) {

    } finally {
      this.setState({bLoading:false});
    }
  }

  componentDidMount() {

  }

  onPress = (type: number, avaiable) => {
    if (avaiable) {
      this.props.dispatch(checkin(type));
    }
    else {
      this.props.navigator.push({
        screen: 'CP.IAPScreen', // unique ID registered with Navigation.registerScreen
        title: "商城",
      });
    }
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
    if (this.props.checkinInfo) {
      return this.props.checkinInfo.map((data, idx) => {
        if(data.type != 0 || data.days != 0 && TYPE_IMG[data.type.toString()]) {
          return (
            <View>
              <NormalItem
              text={this.getItemText(data.integral, data.days, data.type)}
              bAvaiable={data.days != 0}
              icon={TYPE_IMG[data.type.toString()]}
              btnText={this.getBtnText(data.type, data.receive, data.days != 0)}
              onPress={() => { this.onPress(data.type, data.days != 0) }}
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
        }
        else {
          return;
        }
      });
    }
    else {
      return;
    }
  }

  getItemText(num, leftDays, type) {
    let text = '';
    text += '每日奖励:' + num + '钻石';

    if(leftDays != 0) {
      text += '\n 有效期:' + leftDays + '天';
    }

    return text;
  }

  getBtnText(type, receive, avaiable) {
    if (avaiable) {
      if (receive == 1) {
        return "已领取"
      }
      else {
        return "领取"
      }
    }
    else {
      const BTN_DESC_TEXT = {
        0: "",
        1: "获得福利",
        2: "获得周卡",
        3: "获得月卡",
      }

      return BTN_DESC_TEXT[type.toString()];
    }

    return '';
  }

  render() {
    if (this.state.bLoading) {
      return (
        <View style={[styles.loadingCotainer]}>
            <ActivityIndicator animating size="large" color='white'/>
        </View>
      );
    }
    else {
      return (
        <ScrollView style={styles.container}>
            {this.renderContent()}
        </ScrollView>
      );
    }
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
  },
  loadingCotainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: F8Colors.mainBgColor,
  }
});

function select(store) {
  return {
    account: store.user.account,
    checkinInfo: store.user.checkinInfo,
  };
}

/* exports ================================================================== */
module.exports = connect(select)(SignScreen);
