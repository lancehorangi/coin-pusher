//@flow
"use strict";

import {
  Image,
  StyleSheet,
  Text,
  View,
  Animated
} from "react-native";
import React, { Component } from "react";

const WIDTH = 80;
const HEIGHT = 27;
const TO_VALUE = 3000;

type Props = {
  count: number,
  onFinish: (number) => mixed,
  id: number,
  containerStyle: ?Object
};


class ProfitAnimation extends Component<Props> {
    static defaultProps = {
      count: 0
    };

    state = {
      anim: new Animated.Value(0)
    };

    constructor(props: Object) {
      super(props);
    }

    componentDidMount() {
      const duration = 4000;
      const toValue = TO_VALUE;
      Animated.timing(this.state.anim, { toValue, duration, useNativeDriver: true }).start();
      this.state.anim.addListener(({value}: Object) => {
        if (value === toValue) {
          this.props.onFinish(this.props.id);
        }
      });
    }

    renderIcon = (): Component => {
      return (
        <Image
          style={{height:HEIGHT, marginLeft:5}}
          source={require("./img/integral.png")}/>
      );
    }

    renderCount = (): Component => {
      return  (
        <Text style={styles.label}>
          + {this.props.count}
        </Text>
      );
    }

    fadeIn(to: number = -15): Object {
      const { anim } = this.state;
      return {
        opacity: anim.interpolate({
          inputRange: [0, TO_VALUE / 3, TO_VALUE / 3 * 2, TO_VALUE],
          outputRange: [0, 1, 1, 0],
          extrapolate: "clamp"
        }),
        transform: [
          {
            translateY: anim.interpolate({
              inputRange: [0, TO_VALUE],
              outputRange: [0, to],
              extrapolate: "clamp"
            })
          }
        ]
      };
    }

    //this.fadeIn(0, -40)
    render (): Component {
      return (
        <Animated.View
          style={[styles.container, this.fadeIn(-100)]}>
          {this.renderIcon()}
          {this.renderCount()}
          <Text>
          </Text>
        </Animated.View>
      );
    }
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    flex: 0,
    height: HEIGHT,
    minWidth: WIDTH,
    borderRadius: 30,
    justifyContent: "space-between",
    alignContent: "center",
    alignItems: "center",
    backgroundColor: "#ee494388",
    //paddingHorizontal: 10,
    flexDirection: "row",
  },
  label: {
    color: "white",
    fontSize: 12,
    marginLeft: 3,
    marginRight: 3,
  }
});

module.exports = ProfitAnimation;
