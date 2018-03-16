import React, { Component } from "react";
import { View, Text, FlatList, ActivityIndicator, StyleSheet, Image, Alert } from "react-native";
import { List, ListItem, SearchBar, Avatar } from "react-native-elements";
import { getAccountHistory } from "../actions";
import { connect } from "react-redux";
import dateFormat from 'dateformat';
import ScreenComponent from './ScreenComponent';
import F8Colors from './F8Colors';
import { getMachineName } from './../util';

class GameHistoryScreen extends ScreenComponent {
  constructor(props) {
    super(props);
    this.state = {
      bLoading: false,
      page: 1,
      error: null,
    };
  }

  static navigatorStyle = {
    navBarTextColor: '#ffffff',
    navBarBackgroundColor: F8Colors.mainBgColor2,
    navBarButtonColor: '#ffffff'
  };

  RNNDidAppear = () => {
    this.makeRemoteRequest();
  }

  componentDidMount() {
    //this.makeRemoteRequest();
  }

  async makeRemoteRequest() {
    try {
      this.props.dispatch(getAccountHistory());
    } catch (e) {

    } finally {
      this.setState({bLoading:false});
    }
  };

  handleRefresh = () => {
    this.setState(
      {
        page: 1
      },
      () => {
        this.makeRemoteRequest();
      }
    );
  };

  handleLoadMore = () => {
    console.log("handleLoadMore");
    // this.setState(
    //   {
    //     page: this.state.page + 1
    //   },
    //   () => {
    //     this.makeRemoteRequest();
    //   }
    // );
  };

  renderSeparator = () => {
    return (
      <View
        style={{
          height: 1,
          width: "100%",
          backgroundColor: "#45474d",
          opacity: 0.5,
        }}
      />
    );
  };

  renderItem = ({item}) => {
    return (
      (
        <ListItem
          containerStyle={{borderTopWidth: 0, borderBottomWidth: 0}}
          title={getMachineName(item.machine, true)}
          titleStyle={{color: '#d1d3e8', fontSize: 15}}
          subtitle={"获得" + item.integral + "积分"}
          subtitleStyle={{color: '#d1d3e8', fontSize: 17}}
          rightTitle={
            "始:" + dateFormat(new Date(item.enterTime * 1000), 'UTC:yyyy/mm/dd HH:MM') + '\n'
            + "终:" + dateFormat(new Date(item.leaveTime * 1000), 'UTC:yyyy/mm/dd HH:MM')
          }
          rightTitleNumberOfLines={2}
          hideChevron={true}
          // avatar={
          //   <Avatar
          //     rounded
          //     containerStyle={{marginRight:5, marginLeft:5}}
          //     overlayContainerStyle={{backgroundColor: 'transparent'}}
          //     width={20}
          //     height={20}
          //     source={{uri:item.}}
          //   />
          // }
        />
      )
    )
  }

  render() {
      if (this.props.items && this.props.items.length > 0) {
        return (
          <List containerStyle={styles.container}>
            <FlatList
              data={this.props.items}
              renderItem={this.renderItem}
              keyExtractor={item => item.id}
              ItemSeparatorComponent={this.renderSeparator}
              refreshControl={{tintColor:'white'}}
              onRefresh={this.handleRefresh}
              refreshing={this.state.bLoading}
            />
          </List>
        );
      }
      else {
        return (
          <View style={styles.emptyContainer}>
            <Text style={{color:'white', fontSize:20}}>
            {"无"}
            </Text>
          </View>
        )
      }
  }
}

/* StyleSheet
============================================================================= */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    //height: '100%',
    marginTop: 0,
    borderTopWidth: 0,
    borderBottomWidth: 0,
    borderBottomColor: "#45474D",
    backgroundColor: F8Colors.mainBgColor,
  },
  emptyContainer: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: F8Colors.mainBgColor,
  }
});

function select(store) {
  return {
    items: store.user.accountGameHistory
  };
}

/* exports ================================================================== */
module.exports = connect(select)(GameHistoryScreen);