import React, { Component } from "react";
import { View, Text, FlatList, ActivityIndicator, StyleSheet, ScrollView } from "react-native";
import { List, ListItem, SearchBar, Button, Avatar } from "react-native-elements";
import { refreshMsgs, setNavigator } from "../actions";
import { connect } from "react-redux";
import dateFormat from 'dateformat';
import ScreenComponent from './ScreenComponent';

class MsgDetailScreen extends ScreenComponent {
  props:{
    id: number,
    sendTime: number,
    content: string,
    items: ?Object,
  }

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
    return (
      <ScrollView style={[styles.container, {height:150}]}>
        <Text> {this.props.content} </Text>
      </ScrollView>
    )
  }

  renderItem = () => {
    if(this.props.items) {
      return (
        <Text> {"有道具"} </Text>
      )
    }
    else {
      return;
    }
  }

  renderBtn = () => {
    if(this.props.items) {
      return (
        <Button
          text='领取'
        />
      )
    }
    else {
      return;
    }
  }

  render() {
    return (
      <ScrollView style={[styles.container]}>
          <ListItem
            roundAvatar
            title={'系统消息'}
            subtitle={this.props.content}
            rightTitle={dateFormat(Date(this.props.sendTime), 'yyyy/mm/dd\nHH:MM')}
            rightTitleNumberOfLines={2}
            hideChevron={true}
            avatar={<Avatar
              rounded
              title={'系统'}
            />}
          />
          {this.renderContent()}
          {this.renderItem()}
          {this.renderBtn()}
      </ScrollView>
    );
  }
}

/* StyleSheet
============================================================================= */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%'
    //height: '100%',
  }
});

function select(store) {
  return {

  };
}

/* exports ================================================================== */
module.exports = connect(select)(MsgDetailScreen);
