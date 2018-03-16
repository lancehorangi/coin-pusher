import React, { Component } from "react";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  ScrollView,
  Alert,
  TextInput,
} from "react-native";
import { List, ListItem, SearchBar, Button, Avatar } from "react-native-elements";
import { loggedOut } from "../actions";
import { connect } from "react-redux";
import dateFormat from 'dateformat';
import ScreenComponent from './ScreenComponent';
import F8Colors from './F8Colors';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { isIphoneX } from './../util';

class FeedbackScreen extends ScreenComponent {
  constructor(props) {
    super(props);

    this.state = {
        text: "",
        phone: "",
    };
  }

  static navigatorStyle = {
    navBarTextColor: '#ffffff',
    navBarBackgroundColor: F8Colors.mainBgColor2,
    navBarButtonColor: '#ffffff'
  };

  componentDidMount() {
  }

  onTextChange = (text) => {
    this.setState({text});
  }

  onPhoneChange = (phone) => {
    this.setState({phone});
  }

  onSubmit = () => {
    let {text, phone} = this.state;

    let pattern = /^[1][3,4,5,6,7,8,9][0-9]{9}$/;
    if (pattern.test(phone)) {

    }
    else {
      Alert.alert("请输入正确的手机号");
    }
  }

  render() {
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
          />
          <Text style={[styles.input,  {borderWidth: 0, marginTop:10}]}>
            请留下你的电话:
          </Text>
          <TextInput
            style={[styles.input]}
            onChangeText={this.onPhoneChange}
            keyboardType={'numeric'}
          />
          <Button
              title="提交"
              // loading
              // loadingProps={{ size: "large", color: "rgba(111, 202, 186, 1)" }}
              //titleStyle={{ fontWeight: "700" }}
              buttonStyle={{
                backgroundColor: '#ee4943',
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
    width: '100%',
    backgroundColor: F8Colors.mainBgColor,
    //height: '100%',
  },
  label: {
    color: 'white',
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
    color: 'white',
  }
});

function select(store) {
  return {

  };
}

/* exports ================================================================== */
module.exports = connect(select)(FeedbackScreen);
