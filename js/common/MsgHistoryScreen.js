//@flow
"use strict";

import React, { Component } from "react";
import {
  View,
  FlatList,
  StyleSheet,
  Image,
  Text
} from "react-native";
import { List, ListItem, SearchBar, Avatar } from "react-native-elements";
import { refreshMsgs } from "../actions";
import { connect } from "react-redux";
import dateFormat from "dateformat";
import ScreenComponent from "./ScreenComponent";
import F8Colors from "./F8Colors";

type States = {
  page: number,
  error: null | Object,
  bRefreshing: boolean,
  bLoading: boolean
};

class MsgHistoryScreen extends ScreenComponent<{}, States> {
  constructor(props: Object) {
    super(props);

    this.state = {
      page: 1,
      error: null,
      bRefreshing:true,
      bLoading:false,
    };
  }

  static navigatorStyle = {
    navBarTextColor: "#ffffff",
    navBarBackgroundColor: F8Colors.mainBgColor2,
    navBarButtonColor: "#ffffff"
  };

  RNNDidAppear = () => {
    this.makeRemoteRequest();
  }

  componentDidMount() {
    //this.makeRemoteRequest();
  }

  makeRemoteRequest = async (): void => {
    this.setState({bRefreshing:true});

    try {
      await this.props.dispatch(refreshMsgs());
    } catch (e) {
      //
    } finally {
      this.setState({bRefreshing:false});
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

  onPress = (mailID: number) => {
    this.props.navigator.push({
      screen: "CP.MsgDetailScreen", // unique ID registered with Navigation.registerScreen
      title: "邮件详情",
      passProps: {
        mailID
      },
    });
  }

  renderSeparator = (): Component => {
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

  renderHeader = (): Component => {
    return <SearchBar placeholder="Type Here..." lightTheme round />;
  };

  renderFooter = (): Component => {
    return;
  };

  renderItem = ({item}: Object): Component => {
    let accessoryContent = item.items && item.items.length > 0 ? (
      <Avatar
        containerStyle={{marginRight:5, marginLeft:5}}
        overlayContainerStyle={{backgroundColor: "transparent"}}
        width={20}
        height={20}
        source={require("./img/mail_x.png")}
      />
    ) : null;

    return (
      (
        <ListItem
          containerStyle={{borderTopWidth: 0, borderBottomWidth: 0}}
          //title={item.sender}
          title={item.title}
          titleStyle={{color: "#d1d3e8", fontSize: 17}}
          //subtitle={item.content}
          rightTitle={dateFormat(new Date(item.sendTime * 1000), "UTC:yyyy/mm/dd\nHH:MM")}
          //rightTitle={item.sendTime}
          rightTitleNumberOfLines={2}
          avatar={accessoryContent}
          leftIcon={
            <Image
              style={{width:20, height:20, marginRight:5, marginLeft:5}}
              source={item.mark ? require("./img/header/news.png") : require("./img/news_y.png")}/>
          }
          onPress={(): any => this.onPress(item.id)}
        />
      )
    );
  }

  render(): Component {
    if (this.props.msgs.length == 0) {
      return (
        <View style={styles.emptyContainer}>
          <Text style={{color:"white", fontSize:20}}>
            {"无"}
          </Text>
        </View>
      );
    }
    else {
      return (
        <List containerStyle={styles.container}>
          <FlatList
            data={this.props.msgs}
            renderItem={this.renderItem}
            keyExtractor={(item: Object): number => item.id}
            ItemSeparatorComponent={this.renderSeparator}
            //ListHeaderComponent={this.renderHeader}
            //ListFooterComponent={this.renderFooter}
            refreshControl={{tintColor:"white"}}
            onRefresh={this.handleRefresh}
            refreshing={this.state.bLoading}
            onEndReached={this.handleLoadMore}
            onEndReachedThreshold={0}
          />
        </List>
      );
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

function select(store: Object): Object {
  return {
    msgs: store.msgs.msgs,
  };
}

/* exports ================================================================== */
module.exports = connect(select)(MsgHistoryScreen);
