//@flow
"use strict";

import React, { Component } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Dimensions
} from "react-native";

type Props = {
  roomID: number,
  chatList: Array<Object>
};

const WIN_WIDTH = Dimensions.get("window").width;

class ChatList extends React.Component<Props> {
  static defaultProps = {
    roomID: 0,
    chatList: []
  };

  _scrollViewRef = null;

  constructor(props: Object) {
    super(props);
  }

  componentDidMount() {
  }

  onContentSizeChange = () => {
    if (this._scrollViewRef) {
      if (this.props.chatList && this.props.chatList.length > 0) {
        this._scrollViewRef.scrollToOffset({animated: true, offset:0});
      }
    }
  }

  renderItem = ({item}: Object): Component => {
    return (
      <View style={styles.chatContainer}>
        <Text style={styles.nameLabel}>
          {item.nickName + ":"}
          <Text style={styles.chatLabel} numberOfLines={1}> {item.content} </Text>
        </Text>
      </View>
    );
  }

  render(): Component {
    let {chatList} = this.props;
    let reverseList = chatList.slice();
    reverseList.reverse();
    return (
      <FlatList
        style={[styles.container, this.props.style]}
        ref={(ref: any) => {
          this._scrollViewRef = ref;
        }}
        onContentSizeChange={this.onContentSizeChange}
        data={reverseList}
        renderItem={this.renderItem}
        keyExtractor={(item: Object, index: number): number => index}
        inverted={true}
      />
    );
  }
}

/* StyleSheet
============================================================================= */

const styles = StyleSheet.create({
  container: {
    width: WIN_WIDTH / 4 * 3,
    height: 200,
    backgroundColor: "transparent",
  },
  chatContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "flex-start",
    marginLeft: 5,
    marginRight: 5
  },
  nameLabel: {
    fontSize: 13,
    color: "yellow"
  },
  chatLabel: {
    fontSize: 13,
    color: "white"
  }
});

/* exports ================================================================== */
module.exports = ChatList;
