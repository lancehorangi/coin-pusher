//@flow

import {
  View,
  Image,
  StyleSheet,
  Dimensions,
  Text,
  TouchableOpacity,
  Alert
} from 'react-native';
import Carousel, { Pagination } from 'react-native-snap-carousel';
import React, { Component } from "react";
import { connect } from "react-redux";
import { getStore } from '../configureListener';
import MoneyLabel from './MoneyLabel';

const WIN_WIDTH = Dimensions.get("window").width,
  WIN_HEIGHT = Dimensions.get("window").height;
const BANNER_HEIGHT = WIN_WIDTH / 4;

function select(state) {
  return {
    diamond: state.user.diamond,
    navigator: state.appNavigator.navigator,
  }
}

type Props = {
  store: ?Object,
  onPress: () => mixed,
}

type State = {
  diamond: number,
}

class CustomMainScreenTabButton extends Component<Props, State> {
    store: any;
    
    constructor() {
      super();
      this.state = {
        diamond: 0,
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
      let {diamond} = select(store.getState());
      this.setState( { diamond } );
    }

    componentDidMount() {
      let store = getStore();
      if (store) {
        store.subscribe(this.handleChange);
      }
    }

    render () {
        let {diamond} = this.state;

        return (
          <MoneyLabel
            type={'diamond'}
            count={diamond}
            withBtn={true}
            onPressBuy={this.onPress}/>
        )
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
