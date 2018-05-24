//@flow
"use strict";

import React, { Component } from "react";
import {
  View,
  TouchableOpacity,
  Image,
  StyleSheet,
  Dimensions,
  Text
} from "react-native";
import Modal from "react-native-modal";
import { FIRST_HINT_PLAY, FIRST_HINT_QUEUE } from "../const";

const WIN_WIDTH = Dimensions.get("window").width,
  WIN_HEIGHT = Dimensions.get("window").height;

type Props = {
  visible: boolean,
  type: number,
  onPressClose: () => mixed
};

class ModalFirstHint extends Component<Props, States> {
  static defaultProps = {

  };

  constructor(props: Object) {
    super(props);
  }

  _renderModalContent = (): Component => {
    let imgSrc;
    if (this.props.type === FIRST_HINT_PLAY) {
      imgSrc = require("./img/newhand_2.png");
    }
    else if (this.props.type === FIRST_HINT_QUEUE) {
      imgSrc = require("./img/newhand_1.png");
    }

    return (
      <TouchableOpacity style={styles.modalContainer}
        onPress={this.props.onPressClose}>
        <Image source={imgSrc} style={styles.image} />
        <View style={styles.labelView}>
          <Text style={styles.label}>点击任意位置继续</Text>
        </View>
      </TouchableOpacity>
    );
  };

  render (): Component {
    //<View style={styles.container}>
    return (
      <Modal isVisible={this.props.visible}
        style={{margin:0}}
        animationIn={"fadeIn"}
        animationOut={"fadeOut"}>
        {this._renderModalContent()}
      </Modal>
    );
  }
}

const styles = StyleSheet.create({
  modalContainer: {
    width: WIN_WIDTH,
    height: WIN_HEIGHT
  },
  image: {
    width: "100%",
    height: "100%",
    resizeMode: "cover"
  },
  labelView: {
    position: "absolute",
    top: 50,
    height: 50,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    alignContent: "center"
  },
  label: {
    color: "red",
    textAlign: "center",
    fontSize: 25
  }
});

module.exports = ModalFirstHint;
