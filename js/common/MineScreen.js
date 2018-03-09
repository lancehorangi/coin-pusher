import React, { Component } from "react";
import { View, Text, FlatList, ActivityIndicator, StyleSheet, ScrollView } from "react-native";
import { List, ListItem, SearchBar, Button, Avatar } from "react-native-elements";
import { refreshMsgs, setNavigator } from "../actions";
import { connect } from "react-redux";
import dateFormat from 'dateformat';
import ScreenComponent from './ScreenComponent';

class MineScreen extends ScreenComponent {
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

  renderContent = () => {
    return
  }

  renderHead = () => {
    return (
      <View style={styles.header}>
        <Avatar
          large
          rounded
          icon={{name: 'rocket', color: 'white'}}
          overlayContainerStyle={{backgroundColor: 'grey'}}
          activeOpacity={0.7}
          containerStyle={{width:80, height:80, marginTop: 40, marginLeft:40}}
          />
          <Text style={{color:'white', marginTop:40, marginLeft:10, fontSize:20}}>{this.props.account} </Text>
      </View>
    )
  }

  BTN_LIST = [
    {
      title: '消息记录',
      icon: 'av-timer',
      onPress: () => {this.pressMsgHistory()}
    },
    {
      title: '意见反馈',
      icon: 'flight-takeoff',
      onPress: () => {this.pressMsgHistory()}
    },
  ]

  pressMsgHistory = () => {
    this.props.navigator.push({
      screen: 'CP.MsgHistoryScreen', // unique ID registered with Navigation.registerScreen
      title: "邮件",
    });
  }

  renderBtn = () => {
    return (
      <List>
      {
        this.BTN_LIST.map((item, i) => (
          <ListItem
            key={i}
            title={item.title}
            leftIcon={{name: item.icon}}
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
          {this.renderHead()}
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
    backgroundColor: "#24272e",
    //height: '100%',
  },
  header: {
    width: '100%',
    height: 150,
    backgroundColor: 'black',
    flexDirection: "row",
  }
});

function select(store) {
  return {
    account:store.user.account,
  };
}

/* exports ================================================================== */
module.exports = connect(select)(MineScreen);
