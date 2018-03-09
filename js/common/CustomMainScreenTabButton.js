import { View, Image, StyleSheet, Dimensions, Text, TouchableOpacity, Alert} from 'react-native';
import Carousel, { Pagination } from 'react-native-snap-carousel';
import React, { Component } from "react";
import { connect } from "react-redux";
import { getStore } from '../configureListener';

const WIN_WIDTH = Dimensions.get("window").width,
  WIN_HEIGHT = Dimensions.get("window").height;
const BANNER_HEIGHT = WIN_WIDTH / 4;

function select(state) {
  return {
    gold: state.user.account,
    navigator: state.appNavigator.navigator,
  }
}

class CustomMainScreenTabButton extends Component {
    props: {
      store: ?Object,
      onPress: () => mixed,
    };
    state: {
      gold: number,
    };

    constructor() {
      super();
      this.state = {
        gold: 0,
      }
    }

    onPress = () => {
      let {navigator} = select(store.getState());

      navigator.push({
        screen: 'CP.IAPScreen', // unique ID registered with Navigation.registerScreen
        title: "商城",
      });
    }

    handleChange = () => {
      let {gold} = select(store.getState());
      this.setState( { gold } );
    }

    componentDidMount() {
      let store = getStore();
      if (store) {
        store.subscribe(this.handleChange);
      }
    }

    render () {
        return (
          <TouchableOpacity
            style={[styles.button]}
            onPress={this.onPress}
          >
            <View style={styles.button}>
              <Image
                source={require('./img/header/add.png')}
                style={styles.img}
                />
              <Text style={styles.label}>
                {this.state.gold}
              </Text>
            </View>
          </TouchableOpacity>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        height: BANNER_HEIGHT,
        backgroundColor: 'white',
        justifyContent: 'center'
    },
    button: {
      overflow: 'hidden',
      width: 80,
      height: 27,
      //borderRadius: 34 / 2,
      backgroundColor: 'transparent',
      justifyContent: 'center',
      alignItems: 'center',
    },
    img: {
      width: "100%",
      height: "100%",
      resizeMode: "stretch"
    },
    label: {
      position: "absolute",
      color: 'white',
      fontSize: 12,
      top: 6,
      left: 25
    }
});

module.exports = CustomMainScreenTabButton;
