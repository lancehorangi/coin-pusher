import { View, Image, StyleSheet, Dimensions, ActivityIndicator } from 'react-native';
import React, { Component } from "react";
import { connect } from "react-redux";

import { showRoomList } from "./../actions";
import RoomThumbnail from "./RoomThumbnail";
import F8Colors from "./F8Colors";
import { HeaderTitle, Text } from "./F8Text";

const WIN_WIDTH = Dimensions.get("window").width,
  WIN_HEIGHT = Dimensions.get("window").height;

const THUMB_WIDTH = (WIN_WIDTH - 50) / 2;
const THUMB_HEIGHT = THUMB_WIDTH / 3 * 4;

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
          <View style={{width:"100%", height:"100%", justifyContent:'center', alignContent:'center'}}>
          <ActivityIndicator style={{alignSelf:'center', marginTop: 100}} animating size="large" color='white'/>
          </View>
        )
      }

      return roomList.map((room, idx) => {
        return (
          <RoomThumbnail
            roomID={room.roomID}
            meetingName={room.nimName}
            key={room.roomID}
            integralRate={room.integralRate}
            currCost={room.coins}
            baseCost={this.props.baseCost}
            bPlaying={room.entityID !== 0}
            queueList={room.queueList}
            style={{width:THUMB_WIDTH, height:THUMB_HEIGHT, marginLeft:10}}
            picUrl={room.roomSnapshoot}
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
        justifyContent: 'flex-start',
        //alignItems: 'flex-start',
        //alignContent: 'space-around',
        flexWrap: 'wrap',
        flexDirection: 'row',
        backgroundColor: F8Colors.mainBgColor,
        paddingHorizontal: 10,
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
    roomList: store.lobby.list,
    baseCost: store.lobby.baseCost,
  };
}

module.exports = connect(select, null, null, { withRef: true })(RoomList);
