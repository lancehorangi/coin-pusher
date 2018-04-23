//@flow
"use strict";

import React, { Component } from "react";
import {
  View,
  Text,
  FlatList,
  ScrollView,
  StyleSheet
} from "react-native";
import { ListItem, Avatar } from "react-native-elements";
import { getChatHistory } from "../actions";
import { connect } from "react-redux";
import dateFormat from "dateformat";

type Props = {
  roomID: number,
  chatList: Array<Object>
};

class ChatListHistory extends React.Component<Props> {
  static defaultProps = {
    roomID: 0,
    chatList: []
  };

  _scrollViewRef = null;

  constructor(props: Object) {
    super(props);
  }

  componentDidMount() {
    this.makeRemoteRequest();
  }

  async makeRemoteRequest(): void {
    try {
      console.log("makeRemoteRequest id=" + this.props.roomID);
      if (this.props.roomID) {
        this.props.dispatch(getChatHistory(this.props.roomID));
      }
    } catch (e) {
      //
    }
  }

  onContentSizeChange = () => {
    if (this._scrollViewRef) {
      this._scrollViewRef.scrollToEnd({animated: true});
    }
  }

  renderSeparator = (): Component => {
    return (
      <View
        style={{
          height: 1,
          width: "100%",
          backgroundColor: "#45474d",
          opacity: 0.5,
        }}
      />
    );
  };

  renderItem = ({item}: Object): Component => {
    return (
      <View style={styles.chatContainer}>
        <Text style={styles.nameLabel}> {item.nickName + ":"} </Text>
        <Text style={styles.chatLabel}> {item.content} </Text>
      </View>
    );
  }

  render(): Component {
    let {chatList} = this.props;
    return (
      <FlatList
        style={[styles.container, this.props.style]}
        ref={(ref: any) => {
          this._scrollViewRef = ref;
        }}
        onContentSizeChange={this.onContentSizeChange}
        data={chatList}
        renderItem={this.renderItem}
        keyExtractor={(item: Object, index: number): number => index}
        //ItemSeparatorComponent={this.renderSeparator}
      />
    );
  }
}

/* StyleSheet
============================================================================= */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: 200,
    height: 200,
    backgroundColor: "transparent",
  },
  chatContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center"
  },
  nameLabel: {
    fontSize: 15,
    color: "white"
  },
  chatLabel: {
    fontSize: 15,
    color: "red"
  }
});

function select(store: Object): Object {
  return {
    chatList: store.chat.chatList
  };
}

/* exports ================================================================== */
module.exports = connect(select)(ChatListHistory);
