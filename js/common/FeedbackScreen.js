//@flow

import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  Alert,
  TextInput,
} from "react-native";
import { Button } from "react-native-elements";
import { connect } from "react-redux";
import ScreenComponent from "./ScreenComponent";
import F8Colors from "./F8Colors";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { feedback } from "../actions";

type State = {
  text: string,
  phone: string,
  sumbitting: boolean
};

class FeedbackScreen extends ScreenComponent<Object, State> {
  constructor(props: Object) {
    super(props);

    this.state = {
      text: "",
      phone: "",
      sumbitting: false
    };
  }

  static navigatorStyle = {
    navBarTextColor: "#ffffff",
    navBarBackgroundColor: F8Colors.mainBgColor2,
    navBarButtonColor: "#ffffff"
  };

  componentDidMount() {
  }

  onTextChange = (text: string) => {
    this.setState({text});
  }

  onPhoneChange = (phone: string) => {
    this.setState({phone});
  }

  onSubmit = async (): any => {
    let {phone, text} = this.state;

    let pattern = /^[1][3,4,5,6,7,8,9][0-9]{9}$/;
    if (!pattern.test(phone)) {
      Alert.alert("请输入正确的手机号");
      return;
    }

    if (text === "") {
      Alert.alert("请输入反馈内容");
      return;
    }

    await this.setState({sumbitting: true});
    await this.props.dispatch(feedback(phone, text));
    this.contentInput.clear();
    this.phoneInput.clear();
    await this.setState({sumbitting: false});
  }

  render(): Component<{}> {
    return (
      <KeyboardAwareScrollView style={{backgroundColor: F8Colors.mainBgColor}}>
        <View style={styles.container}>
          <Text style={styles.label}>
            请描述反馈的问题:
          </Text>
          <TextInput
            style={[styles.input, {height:200}]}
            multiline={true}
            onChangeText={this.onTextChange}
            ref={(ref: any) => {
              this.contentInput = ref;
            }}
          />
          <Text style={[styles.input,  {borderWidth: 0, marginTop:10}]}>
            请留下你的电话:
          </Text>
          <TextInput
            style={[styles.input]}
            onChangeText={this.onPhoneChange}
            keyboardType={"numeric"}
            ref={(ref: any) => {
              this.phoneInput = ref;
            }}
          />
          <Button
            title="提交"
            loading={this.state.sumbitting}
            // loadingProps={{ size: "large", color: "rgba(111, 202, 186, 1)" }}
            //titleStyle={{ fontWeight: "700" }}
            buttonStyle={{
              backgroundColor: "#ee4943",
              height: 45,
              borderColor: "transparent",
              borderWidth: 0,
              borderRadius: 5,
              marginTop: 20,
              marginLeft: 50,
              marginRight: 50,
            }}
            containerStyle={{
              marginTop: 40,
              marginLeft: 50,
              marginRight: 50,
            }}
            onPress={this.onSubmit}
          />
        </View>
      </KeyboardAwareScrollView>
    );
  }
}

/* StyleSheet
============================================================================= */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    backgroundColor: F8Colors.mainBgColor,
    //height: '100%',
  },
  label: {
    color: "white",
    fontSize: 15,
    marginTop: 10,
    marginLeft: 10,
  },
  input: {
    marginTop: 10,
    marginLeft: 20,
    marginRight: 20,
    borderWidth: 1,
    borderColor: "#45474d",
    color: "white",
  }
});


/* exports ================================================================== */
module.exports = connect()(FeedbackScreen);
