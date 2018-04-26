//@flow

"use strict";

import React from "react";
import { View, StyleSheet, TouchableOpacity, Image, Text } from "react-native";

class PlayButton extends React.Component {
  props: {
    type: | "play" | "queue" | "queuing",
    value: ?number,
    style?: any,
    loading?: boolean,
    onPress: () => mixed
  };

  static defaultProps = {
    opacity: 1,
    inverted: false,
    loading: false
  };

  render(): Component {
    const { type, value } = this.props;

    let content, backgroundColor, borderRadius;
    borderRadius = styles.container.borderRadius;
    if (type === "play") {
      backgroundColor = "#ff6b00";
      borderRadius = 20;
      content = (
        <View style={styles.playContainer}>
          <Image source={require("./img/Playbutton.png")}/>
          <Text style={styles.text}>{value}<Image style={{width: 13, height: 13}} source={require("./img/Diamonds.png")}/>每次</Text>
        </View>
      );
    }
    else if (type === "queue") {
      backgroundColor = "#ee4943";
      content = (
        <View style={styles.playContainer}>
          <Image source={require("./img/Lineup.png")}/>
          <Text style={styles.text}>{value}<Image style={{width: 13, height: 13}} source={require("./img/Diamonds.png")}/></Text>
        </View>
      );
    }
    else if (type === "queuing") {
      backgroundColor = "#9b00d1";
      content = (
        <View style={styles.playContainer}>
          <Image source={require("./img/Waiting.png")}/>
        </View>
      );
    }

    return (
      <TouchableOpacity
        accessibilityTraits="button"
        onPress={this.props.loading ? null : this.props.onPress}
        activeOpacity={0.5}
        style={[styles.container, this.props.style, {backgroundColor, borderRadius}]}
      >
        {content}
      </TouchableOpacity>
    );
  }
}

/* StyleSheet
============================================================================= */

const styles = StyleSheet.create({
  playContainer: {
    justifyContent: "center",
    marginTop: 5,
    marginBottom: 5,
    alignContent: "center",
    alignItems: "center"
  },
  container: {
    flex: 0,
    minHeight: 50,
    justifyContent: "center",
    alignContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
    borderRadius: 20
  },
  text: {
    color: "white",
    fontSize: 13,
    alignContent: "center",
    alignItems: "center"
  }
});

/* Exports
============================================================================= */
module.exports = PlayButton;
