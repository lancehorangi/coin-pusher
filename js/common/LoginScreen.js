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
 *
 * @flow
 */
"use strict";

import React from "react";
import { connect } from "react-redux";
import { skipLogin } from "../actions";
import F8Colors from "../common/F8Colors";
import F8Fonts from "../common/F8Fonts";
import F8Button from "./F8Button";
import { Text, Heading1 } from "../common/F8Text";
import {
  Animated,
  Dimensions,
  Image,
  StatusBar,
  View,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Alert
} from "react-native";
import { Input } from 'react-native-elements';
import LoginButton from "../common/LoginButton";
import { serverURL } from '../env';
import { APIRequest } from '../api';
import { logIn } from '../actions';
import Toast from 'react-native-root-toast';
import { isIphoneX } from './../util';
import RoomHistory from './RoomHistory';

const IPHONE_X_HEAD = 30;
/* Config/Constants
============================================================================= */

const SKIP_BTN_HEIGHT = 24,
  WINDOW_WIDTH = Dimensions.get("window").width,
  WINDOW_HEIGHT = Dimensions.get("window").height,
  VERTICAL_BREAKPOINT = WINDOW_HEIGHT <= 600,
  HEADER_HEIGHT = VERTICAL_BREAKPOINT ? 220 : 285,
  LOGIN_PADDING_BOTTOM = VERTICAL_BREAKPOINT ? 20 : 33,
  CONTENT_PADDING_H = VERTICAL_BREAKPOINT ? 15 : 20;

/* =============================================================================
<LoginScreen />
--------------------------------------------------------------------------------

Props:
  ?

============================================================================= */

class LoginScreen extends React.Component {
  state = {
    anim: new Animated.Value(0)
  };

  componentDidMount() {
    Animated.timing(this.state.anim, { toValue: 3000, duration: 3000 }).start();
  }

  render() {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="default" />
        <View style={{width:'100%', height: isIphoneX() ? IPHONE_X_HEAD : 0}}>
        </View>
        <View style={styles.content}>
            <TextInput
              style={styles.account}
              onChangeText={(account) => this.setState({account})}
            />
            <TextInput
              style={styles.account}
              onChangeText={(pwd) => this.setState({pwd})}
            />
            <F8Button
              theme="bordered"
              type="default"
              caption="注册"
              onPress={() => this.reg()}
            />
            <F8Button
              theme="bordered"
              type="default"
              caption="登录"
              onPress={() => this.login()}
            />
            <RoomHistory id={1}/>
        </View>

      </View>
    );
  }

  fadeIn(delay, from = 0) {
    const { anim } = this.state;
    return {
      opacity: anim.interpolate({
        inputRange: [delay, Math.min(delay + 500, 3000)],
        outputRange: [0, 1],
        extrapolate: "clamp"
      }),
      transform: [
        {
          translateY: anim.interpolate({
            inputRange: [delay, Math.min(delay + 500, 3000)],
            outputRange: [from, 0],
            extrapolate: "clamp"
          })
        }
      ]
    };
  }

  async login() {
    this.props.dispatch(logIn(this.state.account, this.state.pwd));
  }

  async reg() {
    let url = serverURL + 'account/regist';
    try {
        let response = await APIRequest('account/regist', {
          account:this.state.account, password:this.state.pwd});

        Toast.show(response.ReasonPhrase);

    } catch(e) {
      Alert.alert(e.message);
    };
  }

}

/* StyleSheet
============================================================================= */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: F8Colors.bianca
  },

  content: {
    flex: 1,
  },

  account: {
    height: 48,
    borderWidth: 1
  },

  h1: {
    marginTop: 16,
    textAlign: "center"
  },

});

function select(store) {
  return {
    // token: store.user.token,
    // account: store.user.account,
  };
}

/* Export
============================================================================= */
module.exports = connect(select)(LoginScreen);
