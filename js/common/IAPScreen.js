import React, { Component } from "react";
import { View, Text, FlatList, ActivityIndicator, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { List, ListItem, SearchBar, Button, Avatar } from "react-native-elements";
import { refreshMsgs } from "../actions";
import { connect } from "react-redux";
import dateFormat from 'dateformat';
import ScreenComponent from './ScreenComponent';

// Our custom component we want as a button in the nav bar
const NormalItem = ({ text, price, describ, extraDescrib, onPress }) =>
  <TouchableOpacity
    style={[styles.card, { backgroundColor: '#ee4943' }]}
    onPress={() => onPress()}
  >
    <View style={{flex: 1, backgroundColor: "transparent", flexDirection: 'row'}}>
      <Text style={{ color: 'white', top: 10, left: 10, fontSize:13 }}>
        {text}
      </Text>
      <View style={{flex: 1, backgroundColor: "#ffdf00", borderRadius: 9, top:5, right:5}}>
        <Text style={{ color: 'white', alignItems: 'center', fontSize:13 }}>
          {price}
        </Text>
      </View>
    </View>
  </TouchableOpacity>;

const CardItem = ({ text }) =>
  <TouchableOpacity
    style={[styles.button, { backgroundColor: 'tomato' }]}
    onPress={() => console.log('pressed me!')}
  >
    <View style={styles.button}>
      <Text style={{ color: 'white' }}>
        {text}
      </Text>
    </View>
  </TouchableOpacity>;

class IAPScreen extends ScreenComponent {
  constructor(props) {
    super(props);

    this.state = {
    };
  }

  static navigatorStyle = {
    navBarTextColor: '#ffffff',
    navBarBackgroundColor: '#373a41',
    navBarButtonColor: '#ffffff'
  };

  componentDidMount() {
  }

  onPress = () => {

  }

  renderContent = () => {
    TEMP_DATA = [{
      text: "100",
      price: "50",
    }, {
      text: "100",
      price: "50",
    }, {
      text: "100",
      price: "50",
    }]

    return TEMP_DATA.map((data, idx) => {
      return (
        <NormalItem
          text={data.text}
          price={data.price}
          onPress={this.onPress}
          />
      );
    });
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.cardContainer}>
          {this.renderContent()}
        </View>
      </View>
    );
  }
}

/* StyleSheet
============================================================================= */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    backgroundColor: "#24272e"
  },
  header: {
    width: '100%',
    height: 150,
    backgroundColor: 'black',
    flexDirection: "row",
  },
  cardContainer: {
      flex: 1,
      justifyContent: 'space-around',
      //alignItems: 'flex-start',
      //alignContent: 'space-around',
      flexWrap: 'wrap',
      flexDirection: 'row',
      backgroundColor: "#24272e"
  },
  card: {
    width: 150,
    height: 100,
    borderRadius: 3,
  }
});

function select(store) {
  return {
    account:store.user.account,
  };
}

/* exports ================================================================== */
module.exports = connect(select)(IAPScreen);
