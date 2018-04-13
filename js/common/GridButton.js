/**
 @flow
 */

"use strict";

import React from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Image
} from "react-native";
import { Text } from "./F8Text";

type Props = {
  opacity: number,
  icon: number,
  caption?: string,
  style?: any,
  fontSize?: number,
  onPress: () => mixed
};

class GridButton extends React.Component<Props> {
  static defaultProps = {
    opacity: 1,
  };

  render(): Component {
    const { icon, fontSize, opacity } = this.props;
    const caption = this.props.caption && this.props.caption.toUpperCase();

    let iconImage;
    if (icon) {
      iconImage = (
        <Image source={icon} style={[styles.icon]} />
      );
    }

    let fontSizeOverride;
    if (fontSize) {
      fontSizeOverride = { fontSize };
    }

    const content = (
      <View style={[styles.button, { opacity }]}>
        {iconImage}
        <Text
          style={[styles.caption, fontSizeOverride]}
        >
          {caption}
        </Text>
      </View>
    );

    if (this.props.onPress) {
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
    } else {
      return (
        <View style={[styles.container, this.props.style]}>
          {content}
        </View>
      );
    }
  }
}

/* constants ================================================================ */

const BUTTON_WIDTH = 62;
const IMAGE_WIDTH = 25;

/* StyleSheet
============================================================================= */

const styles = StyleSheet.create({
  container: {
    width: BUTTON_WIDTH
  },
  button: {
    flex: 1,
    //flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    //paddingHorizontal: 30,
    //borderRadius: BUTTON_HEIGHT / 2
  },
  icon: {
    width: IMAGE_WIDTH,
    height: IMAGE_WIDTH,
    resizeMode: "stretch"
  },
  caption: {
    //fontFamily: F8Fonts.button,
    fontSize: 12,
    textAlign: "center",
    color: "#d1d3e8"
  }
});

/* Exports
============================================================================= */
module.exports = GridButton;
