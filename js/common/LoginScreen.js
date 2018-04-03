//@flow
"use strict";

import React from "react";
import { connect } from "react-redux";
import { mobileCodeReq, mobileLogin, wxLogin } from "../actions";
import F8Colors from "../common/F8Colors";
import F8Button from "./F8Button";
//import { Text } from "../common/F8Text";
import {
  Animated,
  Image,
  StatusBar,
  View,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  TextInput,
  Alert,
  Text,
  Dimensions
} from "react-native";
import * as WeChat from "react-native-wechat";
import { Button } from "react-native-elements";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { APIRequest } from "../api";
import { logIn } from "../actions";
import Toast from "react-native-root-toast";
import { isIphoneX, toastShow } from "./../util";

const IPHONE_X_HEAD = 30;
const WIN_WIDTH = Dimensions.get("window").width,
  WIN_HEIGHT = Dimensions.get("window").height;

type Stats = {
  anim: Animated.Value,
  phone: null | string,
  mobileCodeBtnDesc: string,
  cooldown: number,
  enableMobileCode: boolean,
  logging: boolean
};

type Props = {
  dispatch: ?() => mixed
};

class LoginScreen extends React.Component<Props, Stats> {
  state = {
    anim: new Animated.Value(0),
    phone: null,
    mobileCodeBtnDesc: "获取验证码",
    cooldown: 60,
    enableMobileCode: true,
    logging:false,
  };

  componentDidMount() {
    Animated.timing(this.state.anim, { toValue: 3000, duration: 3000 }).start();
  }

  renderHeader = (): Component => {
    return (
      <View style={styles.logoContainer}>
        <View style={{width:"100%", height: isIphoneX() ? IPHONE_X_HEAD : 10}}>
        </View>
        <View style={{ flex:0, width:"100%"}}>

          <Image
            source={require("./img/background.png")}
            //style={styles.headerPattern}
          />
          <View style={{width:"100%", height:0}}>
          </View>
        </View>
      </View>
    );
  }

  renderLogo = (): Component => {
    return (
      <View style={{
        width: "100%",
        marginTop: -55,
        justifyContent: "center",
        alignContent: "center",
        alignItems: "center",
      }}>
        <Image
          source={require("./img/BT.png")}
        />
      </View>
    );
  }

  onPhoneChange = (phone: string) => {
    this.setState({phone});
  }

  onCodeChange = (code: string) => {
    this.setState({code});
  }

  getMobileCode = () => {
    let pattern = /^[1][3,4,5,6,7,8,9][0-9]{9}$/;
    if (!pattern.test(this.state.phone)) {
      Alert.alert("请输入正确的手机号");
      return;
    }

    this.props.dispatch(mobileCodeReq(this.state.phone));
    this.setState({enableMobileCode:false});
    this.setState({cooldown:60});
    this.setState({mobileCodeBtnDesc:"60秒后重试"});

    clearInterval(this.cdLoop);
    this.cdLoop = setInterval(() => {
      this.setState({cooldown:this.state.cooldown - 1});
      this.setState({mobileCodeBtnDesc:this.state.cooldown + "秒后重试"});

      if (this.state.cooldown == 0) {
        clearInterval(this.cdLoop);
        this.setState({mobileCodeBtnDesc:"获取验证码"});
        this.setState({enableMobileCode:true});
      }
    }, 1000);
  }

  renderMobileLogin = (): Component => {
    return (
      <View style={{
        width: "100%",
        justifyContent: "center",
        alignContent: "center",
        alignItems: "center",
        marginTop: 20,
      }}>
        <TextInput
          style={[styles.input, {width: 300}]}
          onChangeText={this.onPhoneChange}
          placeholder={"输入手机号"}
          placeholderTextColor={"white"}
          fontSize={15}
          keyboardType={"numeric"}
          maxLength={11}
        />
        <View style={{
          flexDirection: "row",
          marginTop: 10,
          justifyContent: "space-between",
          alignContent: "center",
          alignItems: "center",
          width: 300
        }}>
          <TextInput
            style={[styles.input, {width:200}]}
            onChangeText={this.onCodeChange}
            placeholder={"输入验证码"}
            placeholderTextColor={"white"}
            keyboardType={"numeric"}
            maxLength={6}
          />
          <TouchableOpacity
            onPress={this.getMobileCode}
            disabled={!this.state.enableMobileCode}
            style={{
              flex:0,
              backgroundColor:"transparent",
              justifyContent:"center",
              borderWidth: 8,
              borderRadius: 5,
              borderColor: "#373a41",
            }}>
            <Text style={
              [styles.input, {borderWidth: 0, borderRadius: 0, fontSize:12}]
            }>
              {this.state.mobileCodeBtnDesc}
            </Text>
          </TouchableOpacity>
        </View>
        <Button
          title={"手机登录"}
          titleStyle={{color:"white", fontSize:15}}
          buttonStyle={{backgroundColor:"blue", borderRadius:10, marginTop: 30, width:250}}
          onPress={this.mobileLogin}
        />
      </View>
    );
  }

  renderWX = (): Component => {
    return (
      <View style={{
        flex:0,
        justifyContent:"center",
        alignContent:"center",
        alignItems:"center",
        marginTop:30,
      }}>
        <Text style={{
          fontSize:10,
          color:"white"
        }}>
        其他登录方式
        </Text>
        <View style={{
          height:1,
          backgroundColor:"#00000088",
        }}/>
        <TouchableOpacity
          onPress={this.onWxLogin}
          style={{
            flex:0,
            marginTop:5,
          }}>
          <Image
            source={require("./img/wxdl.png")}
            style={{
              width:42,
              height:32,
              resizeMode:"stretch"
            }}
          />
        </TouchableOpacity>
      </View>
    );
  }

  renderLoading = () => {
    if (this.state.logging) {
      return (
        <View style={{
          flex: 0,
          position: "absolute",
          left:0,
          top:0,
          width: WIN_WIDTH,
          height: WIN_HEIGHT,
          justifyContent:"center",
          alignItems:"center",
          alignContent:"center",
          backgroundColor: "#00000088"
        }}>
          <Text style={{
            color:"white",
            fontSize:13,
          }}>
            登录中
          </Text>
          <ActivityIndicator animating size="large" color='white'/>
        </View>
      );
    }
    else {
      return;
    }
  }

  render(): Component {
    return (
      <KeyboardAwareScrollView
        style={{
          backgroundColor: F8Colors.mainBgColor,
        }}
        bounces={false}
      >
        <View style={styles.container}>
          <StatusBar barStyle="light-content" />
          {this.renderHeader()}
          {this.renderLogo()}
          {this.renderMobileLogin()}
          {this.renderWX()}
          {this.renderLoading()}
        </View>
      </KeyboardAwareScrollView>
    );
  }

  mobileLogin = async (): any => {
    let {phone, code} = this.state;
    let pattern = /^[1][3,4,5,6,7,8,9][0-9]{9}$/;
    if (!pattern.test(phone)) {
      Alert.alert("请输入正确的手机号");
      return;
    }

    pattern = /^[0-9]{6}$/;
    if (!pattern.test(code)) {
      Alert.alert("请输入6位验证码");
      return;
    }

    this.setState({logging:true});
    try {
      await this.props.dispatch(mobileLogin(phone, code));
    } catch (e) {
      //
    } finally {
      this.setState({logging:false});
    }
  }

  onWxLogin = async (): any => {
    this.setState({logging:true});

    try {
      let result = await WeChat.sendAuthRequest("snsapi_userinfo");

      console.log("Weixin: code=" + result.code);
      if (result.errCode != 0) {
        toastShow("登录失败");
      }
      else {

        await this.props.dispatch(wxLogin(result.code));
      }

    } catch (e) {
      toastShow("登录失败:" + e.message);
    } finally {
      this.setState({logging:false});
    }
  }


  //  test
  async login(): any {
    this.props.dispatch(logIn(this.state.account, this.state.pwd));
  }

  async reg(): any {
    try {
      let response = await APIRequest("account/regist", {
        account:this.state.account, password:this.state.pwd});

      Toast.show(response.ReasonPhrase);

    } catch(e) {
      Alert.alert(e.message);
    }
  }

  renderInternalLogin = (): Component => {
    return (
      <View style={styles.content}>
        <TextInput
          style={styles.account}
          onChangeText={(account: string): any => this.setState({account})}
        />
        <TextInput
          style={styles.account}
          onChangeText={(pwd: string): any => this.setState({pwd})}
        />
        <F8Button
          theme="bordered"
          type="default"
          caption="注册"
          onPress={(): void => this.reg()}
        />
        <F8Button
          theme="bordered"
          type="default"
          caption="登录"
          onPress={(): void => this.login()}
        />
      </View>
    );
  }
}

/* StyleSheet
============================================================================= */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: F8Colors.mainBgColor
  },

  logoContainer: {
    flex: 0,
    backgroundColor: "#ee4943",
    justifyContent: "space-between",
    alignContent: "center",
  },

  input: {
    color: "white",
    backgroundColor: "#373a41",
    borderColor: "transparent",
    borderWidth: 10,
    borderRadius: 5
  },

  content: {
    flex: 1,
  },

  account: {
    height: 48,
    borderWidth: 1
  }
});

/* Export
============================================================================= */
module.exports = connect()(LoginScreen);
