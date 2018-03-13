import React, { Component } from "react";
import { View, Text, FlatList, ActivityIndicator, StyleSheet, Image, Alert } from "react-native";
import { List, ListItem, SearchBar, Avatar } from "react-native-elements";
import { refreshMsgs, setNavigator } from "../actions";
import { connect } from "react-redux";
import dateFormat from 'dateformat';
import ScreenComponent from './ScreenComponent';
import F8Colors from './F8Colors';

class MsgHistoryScreen extends ScreenComponent {
  constructor(props) {
    super(props);

    props.bLoading=false;

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

  RNNDidAppear = () => {
    this.makeRemoteRequest();
  }

  componentDidMount() {
    //this.makeRemoteRequest();
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

  onPress = (mailID) => {
    this.props.navigator.push({
      screen: 'CP.MsgDetailScreen', // unique ID registered with Navigation.registerScreen
      title: "邮件详情",
      passProps: {
        mailID
      },
    });
  }

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

  renderHeader = () => {
    return <SearchBar placeholder="Type Here..." lightTheme round />;
  };

  renderFooter = () => {
    return null;
    // if (!this.props.bLoading) return null;
    //
    // return (
    //   <View
    //     style={{
    //       //paddingVertical: 20,
    //       borderTopWidth: 1,
    //       borderColor: "#CED0CE"
    //     }}
    //   >
    //     <ActivityIndicator animating size="large" />
    //   </View>
    // );
  };

  renderItem = ({item}) => {
    let accessoryContent = item.items && item.items.length > 0 ? (
      <Avatar
        containerStyle={{marginRight:5, marginLeft:5}}
        overlayContainerStyle={{backgroundColor: 'transparent'}}
        width={20}
        height={20}
        source={require('./img/mail_x.png')}
      />
    ) : null;

    return (
      (
        <ListItem
          containerStyle={{borderTopWidth: 0, borderBottomWidth: 0}}
          //title={item.sender}
          title={item.title}
          titleStyle={{color: '#d1d3e8', fontSize: 17}}
          //subtitle={item.content}
          rightTitle={dateFormat(Date(item.sendTime), 'yyyy/mm/dd\nHH:MM')}
          //rightTitle={item.sendTime}
          rightTitleNumberOfLines={2}
          avatar={accessoryContent}
          leftIcon={
            <Image
            style={{width:20, height:20, marginRight:5, marginLeft:5}}
            source={item.mark ? require('./img/header/news.png') : require('./img/news_y.png')}/>
          }
          onPress={() => this.onPress(item.id)}
        />
      )
    )
  }

  render() {
    return (
      <List containerStyle={styles.container}>
        <FlatList
          data={this.props.msgs}
          renderItem={this.renderItem}
          keyExtractor={item => item.id}
          ItemSeparatorComponent={this.renderSeparator}
          //ListHeaderComponent={this.renderHeader}
          //ListFooterComponent={this.renderFooter}
          refreshControl={{tintColor:'white'}}
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
    borderTopWidth: 0,
    borderBottomWidth: 0,
    borderBottomColor: "#45474D",
    backgroundColor: F8Colors.mainBgColor,
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
