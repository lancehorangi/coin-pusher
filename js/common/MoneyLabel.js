//@flow
"use strict";

import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity
} from "react-native";
import React, { Component } from "react";

const WIDTH = 80;
const HEIGHT = 27;

const ICON_RES = {
  diamond: require("./img/Diamonds.png"),
  gold: require("./img/gold.png"),
  integral: require("./img/integral.png"),
};

type Props = {
  onPressBg: ?() => mixed,
  onPress: () => mixed,
  count: number,
  withBgBtn: boolean,
  adjustsFontSizeToFit: boolean,
  btnType: | "none" | "add" | "help",
  type: string,
  containerStyle: ?Object
};


class MoneyLabel extends Component<Props> {
    static defaultProps = {
      withBgBtn: false,
      btnType: "none",
      type: "diamond",
      adjustsFontSizeToFit: false
    };

    constructor(props: Object) {
      super(props);
    }

    renderIcon = () => {
      if (ICON_RES[this.props.type]) {
        return (
          <Image
            style={styles.moneyIcon}
            source={ICON_RES[this.props.type]}/>
        );
      }
      else {
        return;
      }
    }

    renderCount = (): Component => {
      return  (
        <Text style={styles.label} numberOfLines={2} adjustsFontSizeToFit={this.props.adjustsFontSizeToFit}>
          {this.props.count}
        </Text>
      );
    }

    renderBtn = (): Component => {
      if (this.props.btnType !== "none") {
        let icon;
        if (this.props.btnType === "add") {
          icon = require("./img/add.png");
        }
        else if (this.props.btnType === "help") {
          icon = require("./img/question.png");
        }

        return (
          <TouchableOpacity
            style={[styles.button]}
            onPress={this.props.onPress}
          >
            <Image
              source={icon}
              style={styles.img}
            />
          </TouchableOpacity>
        );
      }
      else {
        return (
          <TouchableOpacity
            style={[styles.button]}
            onPress={this.props.onPress}
          >
            <Image
              source={require("./img/add.png")}
              style={[styles.img, {opacity:0}]}
            />
          </TouchableOpacity>
        );
      }
    }

    render (): Component {
      return (
        <TouchableOpacity
          style={[styles.container, this.props.containerStyle]}
          onPress={ this.props.onPressBg}
          activeOpacity={this.props.onPressBg ? 0.5 : 1}
        >
          {this.renderIcon()}
          {this.renderBtn()}
          {this.renderCount()}
        </TouchableOpacity>
      );
    }
}

const styles = StyleSheet.create({
  container: {
    flex: 0,
    height: HEIGHT,
    minWidth: WIDTH,
    borderRadius: 30,
    justifyContent: "center",
    alignContent: "center",
    alignItems: "center",
    backgroundColor: "#ee4943",
    //paddingHorizontal: 10,
    flexDirection: "row",
  },
  button: {
    position: "absolute",
    right: 3,
    width: HEIGHT,
    height: HEIGHT,
    backgroundColor: "transparent",
    justifyContent: "center",
    alignItems: "center",
  },
  img: {
    width: "100%",
    height: "100%",
    resizeMode: "stretch"
  },
  label: {
    color: "white",
    fontSize: 12,
    marginLeft: 30,
    marginRight: 30,
  },
  moneyIcon: {
    position: "absolute",
    left: 5,
    height:HEIGHT
  }
});

module.exports = MoneyLabel;
