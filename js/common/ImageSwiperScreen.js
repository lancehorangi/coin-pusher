import React, { Component } from "react";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity
} from "react-native";
import { connect } from "react-redux";
import Swiper from 'react-native-swiper';
import ScreenComponent from './ScreenComponent';
import F8Colors from './F8Colors';
import { dismissModal } from './../navigator';
import { isIphoneX } from './../util';

class ImageSwiperScreen extends ScreenComponent {
  constructor(props) {
    super(props);
  }

  static navigatorStyle = {
    navBarTextColor: '#ffffff',
    navBarBackgroundColor: F8Colors.mainBgColor2,
    navBarButtonColor: '#ffffff'
  };

  componentDidMount() {

  }

  _onClose = () => {
    dismissModal();
  }

  render() {
    return (
      <View style={{
        backgroundColor: 'transparent',
        height: '100%',
        width: '100%',
      }}>

      <Swiper
        style={styles.wrapper}
        showsButtons={false}
        loop={false}
        dotColor={F8Colors.mainBgColor}
        activeDotColor={'#00000088'}>
      {
        this.props.images.map((item, i) => (
          <View style={styles.slide}>
          <Image
            style={styles.Image}
            source={item}
          />
          </View>
        ))
      }
      </Swiper>

      <TouchableOpacity
        accessibilityTraits="button"
        onPress={this._onClose}
        activeOpacity={0.5}
        style={styles.closeBtn}
      >
        <Image
          // style={{
          //   width: 20,
          //   height: 20,
          // }}
          source={require("./img/close.png")}
          resizeMode={"stretch"}/>
      </TouchableOpacity>
      </View>
    );
  }
}

/* StyleSheet
============================================================================= */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    backgroundColor: F8Colors.mainBgColor,
    //height: '100%',
  },
  wrapper: {
  },
  slide: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: F8Colors.mainBgColor,
  },
  Image: {
    flex: 1,
    backgroundColor: 'transparent',
    resizeMode: 'contain',
  },
  closeBtn: {
    position: 'absolute',
    top: isIphoneX() ? IPHONE_X_HEAD + 40 : 40,
    left: 20,
    // right: 40,
    width: 50,
    height: 50,
    backgroundColor: 'transparent',
  },
});

function select(store) {
  return {

  };
}

/* exports ================================================================== */
module.exports = connect(select)(ImageSwiperScreen);
