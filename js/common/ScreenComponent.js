import React, { Component } from "react";
import { View, Text, FlatList, ActivityIndicator, StyleSheet, ScrollView } from "react-native";
import { List, ListItem, SearchBar, Button, Avatar } from "react-native-elements";
import { refreshMsgs, setNavigator } from "../actions";
import { connect } from "react-redux";
import dateFormat from 'dateformat';

class ScreenComponent extends Component {
  constructor(props) {
    super(props);
    this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));
  }

  onNavigatorEvent(event) {
    console.log(this.constructor.name + ':' + JSON.stringify(event));
    switch(event.id) {
      case 'willAppear':
       break;
      case 'didAppear':
        this.props.dispatch(setNavigator(this.props.navigator));
        break;
      case 'willDisappear':
        break;
      case 'didDisappear':
        break;
      case 'willCommitPreview':
        break;
    }
  }
}

/* exports ================================================================== */
module.exports = ScreenComponent;
