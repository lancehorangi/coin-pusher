import { View, Image, StyleSheet, Dimensions, TouchableOpacity, Alert } from 'react-native';
import React, { Component } from "react";
import { connect } from "react-redux";
import F8Colors from "./F8Colors";
import { HeaderTitle, Text } from "./F8Text";
import { Navigation } from 'react-native-navigation';

const WIN_WIDTH = Dimensions.get("window").width,
  WIN_HEIGHT = Dimensions.get("window").height;
const THUMB_WIDTH = 140;
const THUMB_HEIGHT = 140;

class RoomThumbnail extends Component {
    props: {
      dispatch: (action: any) => Promise,
      roomID: number,
      meetingName: string,
    };
    state: {

    };

    constructor() {
      super();
    }

    onPress = () => {
      //Alert.alert("Press MeetingName=" + this.props.meetingName);
      Navigation.showModal({
        screen: 'CP.GameScreen', // unique ID registered with Navigation.registerScreen
        title: '游戏', // title of the screen as appears in the nav bar (optional)
        passProps: {roomID:this.props.roomID, meetingName: this.props.meetingName}, // simple serializable object that will pass as props to the modal (optional)
        navigatorStyle: { navBarHidden: true }, // override the navigator style for the screen, see "Styling the navigator" below (optional)
        navigatorButtons: {}, // override the nav buttons for the screen, see "Adding buttons to the navigator" below (optional)
        animationType: 'slide-up' // 'none' / 'slide-up' , appear animation for the modal (optional, default 'slide-up')
      });
    }

    render () {
        return (
          <TouchableOpacity
            accessibilityTraits="button"
            onPress={this.onPress}
            activeOpacity={0.5}
            style={[styles.container, this.props.style]}
          >
              <Image style={styles.bg} source={require('./img/launchscreen.png')}/>
              <HeaderTitle style={ styles.label }> 机台:{ this.props.roomID } </HeaderTitle>
              <HeaderTitle style={ styles.label }> MeetingName:{ this.props.meetingName } </HeaderTitle>
          </TouchableOpacity>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        //flex: 0,
        width: THUMB_WIDTH,
        height: THUMB_HEIGHT,
        backgroundColor: 'white',
        //justifyContent: 'center',
        marginTop: 10
    },
    bg: {
      position: "absolute",
      top: 0,
      left: 0,
      width: THUMB_WIDTH,
      height: THUMB_HEIGHT,
      resizeMode: "stretch"
    },
    label: {
      position: "absolute",
      top: 0,
      left: 0
    }
});

module.exports = RoomThumbnail;
