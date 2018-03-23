/**
 * Copyright 2016 Facebook, Inc.
 *
 * You are hereby granted a non-exclusive, worldwide, royalty-free license to
 * use, copy, modify, and distribute this software in source code or binary
 * form for use in connection with the web services and APIs provided by
 * Facebook.
 *
 * As with any software that integrates with the Facebook platform, your use
 * of this software is subject to the Facebook Developer Principles and
 * Policies [http://developers.facebook.com/policy/]. This copyright notice
 * shall be included in all copies or substantial portions of the software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL
 * THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
 * DEALINGS IN THE SOFTWARE
 */

"use strict";

import React from "react";
import F8Colors from "./F8Colors";
import F8Fonts from "./F8Fonts";
import { View, StyleSheet, TouchableOpacity, Image, Alert } from "react-native";
import { Text } from "./F8Text";

/* <F8Button />
============================================================================= */

class GridButton extends React.Component {
  props: {
    opacity: number,
    icon: number,
    caption?: string,
    style?: any,
    fontSize?: number,
    onPress: () => mixed
  };

  static defaultProps = {
    opacity: 1,
  };

  render() {
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
