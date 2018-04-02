//@flow
"use strict";

import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity
} from "react-native";
import Modal from "react-native-modal";
import { Button } from "react-native-elements";

type Props = {
  onPressYes: ?() => mixed,
  onPressNo: () => mixed,
  visible: boolean,
  label: string,
  yesLabel: string,
  noLabel: string
};

class ModalYesNo extends Component<Props, States> {
    static defaultProps = {

    };

    constructor(props: Object) {
      super(props);
    }

    _renderModalContent = (): Component => {
      return (
        <View style={styles.modalContent}>
          <View style={styles.labelContainer}>
            <Text
              style={styles.label}
              numberOfLines={5}>
              {this.props.label}
            </Text>
          </View>
          <View style={styles.buttonGroupContainer}>
            <Button
              title={this.props.yesLabel}
              titleStyle={{color:"white", fontSize:15}}
              buttonStyle={{backgroundColor:"red", borderRadius:10, width:150}}
              onPress={this.props.onPressYes}
            />
            <Button
              title={this.props.noLabel}
              titleStyle={{color:"white", fontSize:15}}
              buttonStyle={{backgroundColor:"blue", borderRadius:10, width:150}}
              onPress={this.props.onPressNo}
            />
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
  // container: {
  //   flex: 1,
  //   justifyContent: "center",
  //   alignItems: "center"
  // },
  labelContainer: {
    padding: 12,
    justifyContent: "center",
    alignItems: "center"
  },
  label: {
    fontSize: 15,
    color: "black"
  },
  buttonGroupContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center"
  },
  modalContent: {
    //backgroundColor: "white",
    padding: 22,
    // justifyContent: "center",
    // alignItems: "center",
    borderRadius: 14,
    borderColor: "rgba(0, 0, 0, 0.1)",
    backgroundColor: "white"
  }
});

module.exports = ModalYesNo;
