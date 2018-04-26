//@flow
"use strict";

import React, { Component } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet
} from "react-native";
import Modal from "react-native-modal";
import { Button } from "react-native-elements";
import F8Colors from "./F8Colors";

type Props = {
  visible: boolean,
  onPressClose: ?() => mixed
};

class ModalRoomNotify extends Component<Props, States> {
    static defaultProps = {

    };

    constructor(props: Object) {
      super(props);
    }

    _renderModalContent = (): Component => {
      return (
        <View style={styles.modalContainer}>
          <Image style={styles.titleImg} source={require("./img/background.png")}/>
          <Text style={styles.text}>{"金主爸爸挥金如土的持续游戏感动了\"好运之神\"特别赠与您1880钻石"}</Text>
          <Button
            title={"打开消息中心领取"}
            titleStyle={{color:"white", fontSize:10}}
            buttonStyle={{backgroundColor:"red", borderRadius:15, marginTop: 50, padding: 10}}
            onPress={this.props.onPressClose}
          />
        </View>
      );
    };

    render (): Component {
      return (
        <Modal isVisible={this.props.visible}
          animationIn={"fadeIn"}
          animationOut={"fadeOut"}>
          {this._renderModalContent()}
        </Modal>
      );
    }
}

const styles = StyleSheet.create({
  modalContainer: {
    minHeight: 200,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "rgba(0, 0, 0, 0.1)",
    backgroundColor: F8Colors.mainBgColor,
    justifyContent: "center",
    alignItems: "center"
  },
  titleImg: {
    marginTop: -50,
    width: 50,
    height: 50
  },
  text: {
    marginLeft: 30,
    marginRight: 30,
    color: "white"
  }
});

module.exports = ModalRoomNotify;
