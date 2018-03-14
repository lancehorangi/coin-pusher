import { View, Image, StyleSheet, Dimensions, ActivityIndicator } from 'react-native';
import React, { Component } from "react";
import { connect } from "react-redux";

import { showRoomList } from "./../actions";
import RoomThumbnail from "./RoomThumbnail";
import F8Colors from "./F8Colors";
import { HeaderTitle, Text } from "./F8Text";

const WIN_WIDTH = Dimensions.get("window").width,
  WIN_HEIGHT = Dimensions.get("window").height;

class RoomList extends Component {
    props: {
      dispatch: (action: any) => Promise,
      displayRoomType: number,
    };
    state: {

    };

    constructor() {
      super();
      this.state = {

      };
    }

    onEndReached() {
    }

    componentDidMount() {
      //this.props.dispatch(showRoomList());
    }

    _renderRoomThumbnail() {
      let { roomList } = this.props;

      if (!roomList || roomList.length == 0) {
        return (
          <ActivityIndicator style={{alignSelf:'center', marginTop: 100}} animating size="large" color='white'/>
        )
      }

      return roomList.map((room, idx) => {
        return (
          <RoomThumbnail
            roomID={room.roomID}
            meetingName={room.nimName}
            key={room.roomID}
            />
        );
      });
    }

    render () {
        return (
            <View style={styles.container}>
              {this._renderRoomThumbnail()}
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'space-around',
        //alignItems: 'flex-start',
        //alignContent: 'space-around',
        flexWrap: 'wrap',
        flexDirection: 'row',
        backgroundColor: F8Colors.mainBgColor
    },
    bg: {
      position: "absolute",
      top: 0,
      left: 0,
      width: WIN_WIDTH,
      height: WIN_HEIGHT,
      resizeMode: "stretch"
    }
});

function select(store) {
  return {
    roomType: store.lobby.roomType,
    roomList: store.lobby.list
  };
}

module.exports = connect(select, null, null, { withRef: true })(RoomList);
