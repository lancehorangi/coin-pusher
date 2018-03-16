import {
  View,
  Image,
  StyleSheet,
  Dimensions,
  Text,
  TouchableOpacity,
  Alert
} from 'react-native';
import React, { Component } from "react";
import { connect } from "react-redux";

const WIN_WIDTH = Dimensions.get("window").width,
  WIN_HEIGHT = Dimensions.get("window").height;

const WIDTH = 80;
const HEIGHT = 27;

const ICON_RES = {
    diamond: require("./img/Diamonds.png"),
    gold: require("./img/gold.png"),
    integral: require("./img/integral.png"),
}

class MoneyLabel extends Component {
    static defaultProps = {
      withBgBtn: false,
      withBtn: false,
      type: 'diamond',
    };

    props: {
      onPressBg: ?() => mixed,
      onPressBuy: () => mixed,
      count: number,
      withBgBtn: boolean,
      withBtn: boolean,
      type: string,
    };

    state: {

    };

    constructor(props) {
      super(props);
    }

    renderIcon = () => {
      if (ICON_RES[this.props.type]) {
        return (
          <Image
            style={{height:HEIGHT, marginLeft:5}}
            source={ICON_RES[this.props.type]}/>
        )
      }
      else {
        return;
      }
    }

    renderCount = () => {
      return  (
        <Text style={styles.label}>
          {this.props.count}
        </Text>
      )
    }

    renderBtn = () => {
      if (this.props.withBtn) {
        return (
          <TouchableOpacity
            style={[styles.button]}
            onPress={this.props.onPressBuy}
          >
            <Image
              source={require('./img/add.png')}
              style={styles.img}
              />
          </TouchableOpacity>
        )
      }
      else {
        return (
          <TouchableOpacity
            style={[styles.button]}
            onPress={this.props.onPressBuy}
          >
            <Image
              source={require('./img/add.png')}
              style={[styles.img, {opacity:0}]}
              />
          </TouchableOpacity>
        )
      }
    }

    render () {
        return (
          <TouchableOpacity
            style={[styles.container, this.props.containerStyle]}
            onPress={ this.props.onPressBg}
            >
            {this.renderIcon()}
            {this.renderCount()}
            {this.renderBtn()}
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
      justifyContent: 'space-between',
      alignContent: 'center',
      alignItems: 'center',
      backgroundColor: '#ee4943',
      //paddingHorizontal: 10,
      flexDirection: 'row',
    },
    button: {
      //overflow: 'hidden',
      //width: 80,
      height: '100%',
      //borderRadius: 34 / 2,
      backgroundColor: 'transparent',
      justifyContent: 'center',
      alignItems: 'center',
    },
    img: {
      height:HEIGHT,
      resizeMode: "stretch"
    },
    label: {
      color: 'white',
      fontSize: 12,
      marginLeft: 3,
      marginRight: 3,
    }
});

module.exports = MoneyLabel;
