//@flow
"use strict";

import { View, StyleSheet, Dimensions, ActivityIndicator, Text } from "react-native";
import React, { Component } from "react";
import { connect } from "react-redux";

import { showRoomList } from "./../actions";
import RoomThumbnail from "./RoomThumbnail";
import F8Colors from "./F8Colors";
import { API_ENUM } from "../api";
const WIN_WIDTH = Dimensions.get("window").width;
const WIN_HEIGHT = Dimensions.get("window").height;

const THUMB_WIDTH = (WIN_WIDTH - 50) / 2;
const THUMB_HEIGHT = THUMB_WIDTH / 3 * 4;

type Props = {
  dispatch: (action: any) => Promise,
  displayRoomType: number,
  roomType: number,
  roomList: Array<Object>,
  baseCost: number,
  entityID: number,
  status: number,
  roomID: number
};


class RoomList extends Component<Props> {
  constructor(props: Object) {
    super(props);
  }

  onEndReached() {
  }

  componentDidMount() {

  }

  _renderRoomThumbnail(): Component {
    let { roomList } = this.props;

    if ( !roomList ) {
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
            queuing={API_ENUM.ES_Queue == this.props.status && this.props.roomID == room.roomID}
            unavaible={room.state != 0}
          />
        );
      });
    }

    return;
  }

  getEmptyRoomNum(): number {
    let { roomList } = this.props;

    let emptyRoomNum = 0;

    if (roomList && roomList.length != 0) {
      for (let info of roomList) {
        if (info.entityID == 0) {
          emptyRoomNum += 1;
        }
      }
    }

    return emptyRoomNum;
  }

  getRoomCost(): string {
    let { baseCost } = this.props;

    if (baseCost) {
      return baseCost;
    }

    return "";
  }

  render (): Component {
    return (
      <View style={styles.container}>
        <View style={styles.describContainer}>
          <View style={styles.textContainer}>
            <Text style={styles.text}>{"房间消耗:" + this.getRoomCost() }</Text>
          </View>
          <View style={styles.textContainer}>
            <Text style={styles.text}>{"空闲房间:" + this.getEmptyRoomNum()}</Text>
          </View>
        </View>
        <View style={styles.listContainer}>
          {this._renderRoomThumbnail()}
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  listContainer: {
    flex: 1,
    justifyContent: "flex-start",
    //alignItems: 'flex-start',
    //alignContent: 'space-around',
    flexWrap: "wrap",
    flexDirection: "row",
    backgroundColor: F8Colors.mainBgColor,
    paddingHorizontal: 10,
  },
  describContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    alignContent: "center",
    //paddingHorizontal: 40,
    marginTop: 10
  },
  textContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    alignContent: "center"
  },
  text: {
    fontSize: 12,
    color: "white"
  }
});

function select(store: Object): Object {
  return {
    roomType: store.lobby.roomType,
    roomList: store.lobby.list,
    baseCost: store.lobby.baseCost,
    entityID: store.user.entityID,
    status: store.user.entityState,
    roomID: store.user.roomID
  };
}

module.exports = connect(select, null, null, { withRef: true })(RoomList);
