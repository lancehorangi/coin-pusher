import React, { Component } from "react";
import { View, Text, FlatList, ActivityIndicator, StyleSheet } from "react-native";
import { List, ListItem, SearchBar, Avatar } from "react-native-elements";
import { refreshMsgs, setNavigator } from "../actions";
import { connect } from "react-redux";
import dateFormat from 'dateformat';
import ScreenComponent from './ScreenComponent';

class MsgHistoryScreen extends ScreenComponent {
  constructor(props) {
    super(props);

    this.state = {
      page: 1,
      error: null
    };
  }

  static navigatorStyle = {
    navBarTextColor: '#ffffff',
    navBarBackgroundColor: '#373a41',
    navBarButtonColor: '#ffffff'
  };

  componentDidMount() {
    this.makeRemoteRequest();
  }

  makeRemoteRequest = () => {
    if( this.props.bLoading !== true){
        this.props.dispatch(refreshMsgs());
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

  onPress = (item) => {
    this.props.navigator.push({
      screen: 'CP.MsgDetailScreen', // unique ID registered with Navigation.registerScreen
      title: "邮件详情",
      passProps: {
        id: item.id,
        sendTime: item.sendTime,
        content: item.content,
        items: item.items,
      },
    });
  }

  renderSeparator = () => {
    return (
      <View
        style={{
          height: 1,
          width: "100%",
          backgroundColor: "#CED0CE",
        }}
      />
    );
  };

  renderHeader = () => {
    return <SearchBar placeholder="Type Here..." lightTheme round />;
  };

  renderFooter = () => {
    if (!this.props.bLoading) return null;

    return (
      <View
        style={{
          //paddingVertical: 20,
          borderTopWidth: 1,
          borderColor: "#CED0CE"
        }}
      >
        <ActivityIndicator animating size="large" />
      </View>
    );
  };

  render() {
    return (
      <List containerStyle={styles.container}>
        <FlatList
          data={this.props.msgs}
          renderItem={({ item }) => (
            <ListItem
              roundAvatar
              //title={item.sender}
              title={'系统消息'}
              subtitle={item.content}
              rightTitle={dateFormat(Date(item.sendTime), 'yyyy/mm/dd\nHH:MM')}
              //rightTitle={item.sendTime}
              rightTitleNumberOfLines={2}
              avatar={<Avatar
                rounded
                title={'消'}
              />}
              //containerStyle={{ borderBottomWidth: 0 }}
              onPress={() => this.onPress(item)}
            />
          )}
          keyExtractor={item => item.id}
          ItemSeparatorComponent={this.renderSeparator}
          //ListHeaderComponent={this.renderHeader}
          ListFooterComponent={this.renderFooter}
          onRefresh={this.handleRefresh}
          refreshing={this.props.bLoading}
          onEndReached={this.handleLoadMore}
          onEndReachedThreshold={0}
        />
      </List>
    );
  }
}

/* StyleSheet
============================================================================= */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    //height: '100%',
    marginTop: 0,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderBottomColor: "#cbd2d9"
  }
});

function select(store) {
  return {
    msgs: store.msgs.msgs,
    bLoading: store.msgs.bLoading,
  };
}

/* exports ================================================================== */
module.exports = connect(select)(MsgHistoryScreen);
