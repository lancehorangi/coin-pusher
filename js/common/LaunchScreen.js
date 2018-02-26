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
import { connect } from "react-redux";
import F8Colors from "./F8Colors";
import F8Button from "./F8Button";
import { Dimensions, StyleSheet, View, Image, Alert } from "react-native";
import { NimUtils, NTESGLView, NimSession } from 'react-native-netease-im';
import { serverURL } from '../env';
import APIRequest from '../api';
import { logIn } from '../actions'

const WIN_WIDTH = Dimensions.get("window").width,
  WIN_HEIGHT = Dimensions.get("window").height;

/**
* ==============================================================================
* <LaunchScreen />
* ------------------------------------------------------------------------------
* @return {ReactElement}
* ==============================================================================
*/

class LaunchScreen extends React.Component {
  render() {
    return (
      <View style={[styles.container, this.props.style]}>
        <Image
          source={require("./img/launchscreen.png")}
          style={styles.image}
        />
        <NTESGLView style={styles.image}/>
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
          onPress={() => this.logIn()}
        />
      </View>
    );
  }

  async logIn()
  {
    //NimUtils.getCacheSize().then(size => Alert.alert(size))
    NimSession.login("test001", "340045a515dc689897ad77adf3c06346").then(size => Alert.alert(size), e => Alert.alert(e.message));

    // let response = await fetch(serverURL + 'account/getToken',{
    //   method: 'post',
    //   headers: {
    //     'Content-Type' : 'application/x-www-form-urlencoded'
    //   },
    //   body: JSON.stringify({account:'test124', password:'test124'})
    //   });

    //await this.props.dispatch(logIn('test126', 'test126'));
  }

  async reg()
  {
    let url = serverURL + 'account/regist';
    try {
      // let response = await fetch(url,{
      //   method: 'post',
      //   headers: {
      //     'Content-Type': 'application/x-www-form-urlencoded',
      //   },
      //   body: JSON.stringify({account:'test123', password:'test123'})
      //   });
      //
      //   let responseTxt = await response.text();
      //   Alert.alert(responseTxt);
      //
      //   let resJson = await response.json();
      //   Alert.alert(resJson);

        let response = await APIRequest('account/getToken', {
          account:'test124', password:'test124'});
        this.props.navigator.showInAppNotification({
            screen: "CP.Notification", // unique ID registered with Navigation.registerScreen
            passProps: {text:response.ReasonPhrase}, // simple serializable object that will pass as props to the in-app notification (optional)
            autoDismissTimerSec: 1 // auto dismiss notification in seconds
          });
    } catch(e) {
      Alert.alert(e.message);
    };
  }
}

/* StyleSheet =============================================================== */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: F8Colors.bianca
  },
  image: {
    position: "absolute",
    left: 0,
    top: 0,
    width: WIN_WIDTH,
    height: WIN_HEIGHT,
    resizeMode: "cover"
  }
});

/* exports ================================================================== */
module.exports = connect()(LaunchScreen);
