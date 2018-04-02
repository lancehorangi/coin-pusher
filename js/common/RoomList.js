//@flow
"use strict";

import { View, StyleSheet, Dimensions, ActivityIndicator } from "react-native";
import React, { Component } from "react";
import { connect } from "react-redux";

import { showRoomList } from "./../actions";
import RoomThumbnail from "./RoomThumbnail";
import F8Colors from "./F8Colors";

const WIN_WIDTH = Dimensions.get("window").width;
const WIN_HEIGHT = Dimensions.get("window").height;

const THUMB_WIDTH = (WIN_WIDTH - 50) / 2;
const THUMB_HEIGHT = THUMB_WIDTH / 3 * 4;

type Props = {
  dispatch: (action: any) => Promise,
  displayRoomType: number,
  roomType: number,
  roomList: Array<Object>,
  baseCost: number
};


class RoomList extends Component<Props> {
  constructor(props: Object) {
    super(props);
    this.state = {
      bLoading: true,
    };
  }

  onEndReached() {
  }

  loadInfo = async (): void => {
    await this.setState({bLoading:true});
    try {
      await this.props.dispatch(showRoomList(this.props.displayRoomType));
    } catch (e) {
      //
    } finally {
      this.setState({bLoading:false});
    }
  }

  componentDidMount() {
    console.log("RoomList componentDidMount");
    this.loadInfo();
  }

  _renderRoomThumbnail(): Component {
    let { roomList } = this.props;

    if ( this.state.bLoading ) {
      return (
        <View style={{width:"100%", height:WIN_HEIGHT / 2, justifyContent:"center", alignContent:"center"}}>
          <ActivityIndicator animating size="large" color='white'/>
        </View>
      );
    }

    if (roomList) {
      return roomList.map((room: Object): Component => {
        return (
          <RoomThumbnail
            roomID={room.roomID}
            meetingName={room.nimName}
            key={room.roomID}
            integralRate={room.integralRate}
            currCost={room.coins}
            baseCost={this.props.baseCost}
            bPlaying={room.entityID !== 0}
            rmtpUrl={room.rtmpUrl}
            queueList={room.queueList}
            style={{width:THUMB_WIDTH, height:THUMB_HEIGHT, marginLeft:10}}
            picUrl={room.roomSnapshoot}
          />
        );
      });
    }

    return;
  }

  render (): Component {
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
    justifyContent: "flex-start",
    //alignItems: 'flex-start',
    //alignContent: 'space-around',
    flexWrap: "wrap",
    flexDirection: "row",
    backgroundColor: F8Colors.mainBgColor,
    paddingHorizontal: 10,
  }
});

function select(store: Object): Object {
  return {
    roomType: store.lobby.roomType,
    roomList: store.lobby.list,
    baseCost: store.lobby.baseCost,
  };
}

module.exports = connect(select, null, null, { withRef: true })(RoomList);
