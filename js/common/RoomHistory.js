//@flow
"use strict";

import React, { Component } from "react";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  Dimensions
} from "react-native";
import { ListItem, Avatar } from "react-native-elements";
import { getRoomHistory } from "../actions";
import { connect } from "react-redux";
import dateFormat from "dateformat";

type Props = {
  id: number
};

class RoomHistory extends React.Component<Props> {
  props: {
    id: number
  }

  constructor(props: Object) {
    super(props);

    this.state = {
      bLoading: false,
    };
  }

  componentDidMount() {
    this.makeRemoteRequest();
  }

  async makeRemoteRequest(): void {
    try {
      await this.setState({bLoading:true});

      console.log("makeRemoteRequest id=" + this.props.id);
      if (this.props.id) {
        this.props.dispatch(getRoomHistory(this.props.id));
      }
    } catch (e) {
      //
    } finally {
      this.setState({bLoading:false});
    }
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

  renderItem = ({item, index}: Object): Component => {
    return (
      (
        <ListItem
          containerStyle={{borderTopWidth: 0, borderBottomWidth: 0}}
          title={item.account}
          titleStyle={{color: "#d1d3e8", fontSize: 13}}
          subtitle={"获得" + item.integral + "积分"}
          subtitleStyle={{color: "#d1d3e8", fontSize: 13}}
          rightTitle={
            dateFormat(new Date(item.enterTime * 1000), "UTC:yyyy/mm/dd HH:MM") + "\n"
             + dateFormat(new Date(item.leaveTime * 1000), "UTC:yyyy/mm/dd HH:MM")
          }
          rightTitleStyle={{fontSize:13}}
          rightTitleNumberOfLines={2}
          hideChevron={true}
          key={index}
          avatar={
            <Avatar
              rounded
              containerStyle={{marginRight:5, marginLeft:5}}
              overlayContainerStyle={{backgroundColor: "transparent"}}
              // width={20}
              // height={20}
              source={{uri:item.headUrl}}
            />
          }
        />
      )
    );
  }

  render(): Component {
    if (this.state.bLoading) {
      return (
        <View style={[styles.loadingCotainer]}>
          <ActivityIndicator animating size="large" color='white'/>
        </View>
      );
    }
    else {
      if (this.props.items && this.props.items.length > 0) {
        return (
          <View style={[styles.container, this.props.style]}>
            <FlatList
              data={this.props.items}
              renderItem={this.renderItem}
              keyExtractor={(item: Object): number => item.id}
              ItemSeparatorComponent={this.renderSeparator}
              //refreshControl={{tintColor:'white'}}
              //onRefresh={this.handleRefresh}
              //refreshing={this.state.bLoading}
            />
          </View>
        );
      }
      else {
        return (
          <View style={[styles.emptyContainer, this.props.style, {height:150}]}>
            <Text style={{color:"white", fontSize:20}}>
              {"无"}
            </Text>
          </View>
        );
      }
    }
  }
}

const WIN_HEIGHT = Dimensions.get("window").height;

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
    backgroundColor: "transparent",
  },
  loadingCotainer: {
    flex: 1,
    height: 150,
    justifyContent: "center",
    backgroundColor: "transparent",
  },
  emptyContainer: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "transparent",
  }
});

function select(store: Object): Object {
  return {
    items: store.room.roomGameHistory
  };
}

/* exports ================================================================== */
module.exports = connect(select)(RoomHistory);
