//@flow

"use strict";

import React from "react";
import { View, StyleSheet, TouchableOpacity, Image } from "react-native";

class ImgButton extends React.Component {
  props: {
    opacity: number,
    icon: number,
    inverted: boolean,
    style?: any,
    onPress: () => mixed
  };

  static defaultProps = {
    opacity: 1,
    inverted: false
  };

  render(): Component {
    const { icon, opacity } = this.props;

    let iconImage;
    if (icon) {
      iconImage = (
        <Image source={icon} style={
          [styles.icon, {
            transform: this.props.inverted ? [
              { rotateZ: "180deg" }
            ] : []
          }]
        }/>
      );
    }

    const content = (
      <View style={[styles.button, { opacity }]}>
        {iconImage}
      </View>
    );

    return (
      <TouchableOpacity
        accessibilityTraits="button"
        onPress={this.props.onPress}
        activeOpacity={0.5}
        style={[styles.container, this.props.style]}
      >
        {content}
      </TouchableOpacity>
    );
  }
}

/* StyleSheet
============================================================================= */

const styles = StyleSheet.create({
  container: {
  },
  button: {
  },
  icon: {
    width: "100%",
    height: "100%"
  }
});

/* Exports
============================================================================= */
module.exports = ImgButton;
