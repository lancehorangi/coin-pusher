import { View, Image, StyleSheet, Dimensions, Text, TouchableOpacity} from 'react-native';
import Carousel, { Pagination } from 'react-native-snap-carousel';
import React, { Component } from "react";
import { connect } from "react-redux";

const WIN_WIDTH = Dimensions.get("window").width,
  WIN_HEIGHT = Dimensions.get("window").height;
const BANNER_HEIGHT = WIN_WIDTH / 4;

class CustomMainScreenTabButton extends Component {
    props: {
      dispatch: (action: any) => Promise,
    };
    state: {
    };

    constructor() {
      super();
    }

    onPress = () => {
      console.log('pressed me!')
    }

    render () {
        return (
          <TouchableOpacity
            style={[styles.button, { backgroundColor: 'tomato' }]}
            onPress={this.onPress}
          >
            <View style={styles.button}>
              <Image
                source={require('./img/header/add.png')}
                style={styles.img}
                />
              <Text style={styles.label}>
                {this.props.gold}
              </Text>
            </View>
          </TouchableOpacity>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        height: BANNER_HEIGHT,
        backgroundColor: 'white',
        justifyContent: 'center'
    },
    button: {
      overflow: 'hidden',
      width: 34,
      height: 34,
      //borderRadius: 34 / 2,
      justifyContent: 'center',
      alignItems: 'center',
    },
    img: {
      width: "100%",
      height: "100%",
      resizeMode: "stretch"
    },
    label: {
      position: "absolute",
      top: 5,
      left: 20
    }
});

function select(store) {
  return {
    gold: store.user.account
  };
}

module.exports = connect(select)(CustomMainScreenTabButton);
