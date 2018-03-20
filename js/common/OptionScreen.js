import React, { Component } from "react";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  ScrollView,
  Alert
} from "react-native";
import { List, ListItem, SearchBar, Button, Avatar } from "react-native-elements";
import { loggedOut } from "../actions";
import { connect } from "react-redux";
import dateFormat from 'dateformat';
import ScreenComponent from './ScreenComponent';
import F8Colors from './F8Colors';
import { isIphoneX } from './../util';
import codePush from "react-native-code-push";
import DeviceInfo from 'react-native-device-info';

class OptionScreen extends ScreenComponent {
  constructor(props) {
    super(props);

    this.state = {
      soundEnable: true,
      jsVersion: "",
    };
  }

  static navigatorStyle = {
    navBarTextColor: '#ffffff',
    navBarBackgroundColor: F8Colors.mainBgColor2,
    navBarButtonColor: '#ffffff'
  };

  componentDidMount() {
    codePush.getUpdateMetadata(codePush.UpdateState.RUNNING).then((update) => {
    if (update) {
        this.setState({jsVersion:update.label});
        }
    });
  }

  toggleSound = (soundEnable) => {
    this.setState({soundEnable});
  }

  pressLogout = () => {
    this.props.dispatch(loggedOut());
  }

  renderBtn = () => {
    return (
      <List containerStyle={styles.listContainer}>
        <ListItem
          containerStyle={{borderTopWidth: 0, borderBottomWidth: 1, borderBottomColor: F8Colors.mainBgColor2}}
          titleStyle={{color: '#d1d3e8', fontSize: 15}}
          key={1}
          title={"声音"}
          leftIcon={{name: "music"}}
          hideChevron={true}
          switchButton={true}
          onSwitch={this.toggleSound}
          switchDisabled={false}
          switched={this.state.soundEnable}
        />

        <ListItem
          containerStyle={{borderTopWidth: 0, borderBottomWidth: 1, borderBottomColor: F8Colors.mainBgColor2}}
          titleStyle={{color: '#d1d3e8', fontSize: 15}}
          key={2}
          title={"版本"}
          leftIcon={{name: "music"}}
          hideChevron={true}
          rightTitle={"有限公司\n版本:" + DeviceInfo.getReadableVersion() + " " + this.state.jsVersion}
          //rightTitle={item.sendTime}
          rightTitleNumberOfLines={2}
        />

        <ListItem
          containerStyle={{borderTopWidth: 0, borderBottomWidth: 1, borderBottomColor: F8Colors.mainBgColor2, backgroundColor:"#ee4943"}}
          titleStyle={{color: '#d1d3e8', fontSize: 15}}
          key={3}
          title={"退出登录"}
          leftIcon={{name: "music"}}
          hideChevron={true}
          onPress={this.pressLogout}
        />
    </List>
    )
  }

  render() {
    return (
      <View style={styles.container}>
          {this.renderBtn()}
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
    backgroundColor: F8Colors.mainBgColor,
    //height: '100%',
  },
  header: {
    width: '100%',
    //height: 150,
    paddingBottom: 15,
    backgroundColor: F8Colors.mainBgColor2,
    flexDirection: "row",
  },
  currContainer: {
    width: '100%',
    height: 50,
    flexDirection: "row",
    marginTop: 10,
    backgroundColor: F8Colors.mainBgColor2,
    //justifyContent: 'center',
    //alignContent: 'center',
    alignItems: 'center',
    justifyContent: "space-between",
  },
  listContainer: {
    flex: 1,
    //height: '100%',
    marginTop: 0,
    borderTopWidth: 0,
    borderBottomWidth: 0,
    borderBottomColor: "#45474D",
    backgroundColor: F8Colors.mainBgColor,
  }
});

function select(store) {
  return {

  };
}

/* exports ================================================================== */
module.exports = connect(select)(OptionScreen);
