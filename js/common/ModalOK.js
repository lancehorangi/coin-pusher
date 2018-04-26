//@flow
"use strict";

import React, { Component } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet
} from "react-native";
import Modal from "react-native-modal";
import F8Colors from "./F8Colors";

type Props = {
  visible: boolean,
  label: string,
  onPressClose: ?() => mixed
};

class ModalOK extends Component<Props, States> {
    static defaultProps = {

    };

    constructor(props: Object) {
      super(props);
    }

    _renderModalContent = (): Component => {
      return (
        <View style={styles.modalContainer}>
          <View style={{flexDirection: "row", justifyContent: "flex-end"}}>
            <TouchableOpacity
              style={{justifyContent:"center", alignContent:"center"}}
              onPress={this.props.onPressClose}
            >
              <Image
                source={require("./img/close.png")}
                style={{width:30, height:30}}
              />
            </TouchableOpacity>
          </View>
          <View>
            <Text style={{color: "white", marginTop: 10}}>
              {this.props.label}
            </Text>
          </View>
        </View>
      );
    };

    render (): Component {
      //<View style={styles.container}>
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
    padding: 12,
    borderRadius: 14,
    borderColor: "rgba(0, 0, 0, 0.1)",
    backgroundColor: F8Colors.mainBgColor
  }
});

module.exports = ModalOK;