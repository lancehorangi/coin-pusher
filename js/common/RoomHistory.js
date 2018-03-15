import React, { Component } from "react";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  Image,
  Alert,
  ScrollView,
  Dimensions
} from "react-native";
import { List, ListItem, SearchBar, Avatar } from "react-native-elements";
import { getRoomHistory } from "../actions";
import { connect } from "react-redux";
import dateFormat from 'dateformat';
import ScreenComponent from './ScreenComponent';
import F8Colors from './F8Colors';
import { getMachineName } from './../util';

class RoomHistory extends React.Component {
  props: {
    id: number
  }

  constructor(props) {
    super(props);

    this.state = {
      bLoading: false,
    };
  }

  componentDidMount() {
    this.makeRemoteRequest();
  }

  async makeRemoteRequest() {
    try {
      await this.setState({bLoading:true});

      console.log("makeRemoteRequest id=" + this.props.id)
      if (this.props.id) {
        this.props.dispatch(getRoomHistory(this.props.id));
      }
    } catch (e) {

    } finally {
      this.setState({bLoading:false});
    }
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

  renderItem = ({item, index}) => {
    return (
      (
        <ListItem
          containerStyle={{borderTopWidth: 0, borderBottomWidth: 0}}
          title={item.account}
          titleStyle={{color: '#d1d3e8', fontSize: 13}}
          subtitle={"获得" + item.integral + "积分"}
          subtitleStyle={{color: '#d1d3e8', fontSize: 13}}
          rightTitle={
            dateFormat(new Date(item.enterTime * 1000), 'UTC:yyyy/mm/dd HH:MM') + '\n'
             + dateFormat(new Date(item.leaveTime * 1000), 'UTC:yyyy/mm/dd HH:MM')
          }
          rightTitleStyle={{fontSize:13}}
          rightTitleNumberOfLines={2}
          hideChevron={true}
          key={index}
          avatar={
            <Avatar
              rounded
              containerStyle={{marginRight:5, marginLeft:5}}
              overlayContainerStyle={{backgroundColor: 'transparent'}}
              // width={20}
              // height={20}
              source={{uri:item.headUrl}}
            />
          }
        />
      )
    )
  }

  render() {
      if (this.state.bLoading) {
        return (
          <View style={[styles.loadingCotainer]}>
              <ActivityIndicator animating size="large" color='white'/>
          </View>
        )
      }
      else {
        if (this.props.items && this.props.items.length > 0) {
          return (
            <View style={[styles.container, this.props.style]}>
              <FlatList
                data={this.props.items}
                renderItem={this.renderItem}
                keyExtractor={item => item.id}
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
              <Text style={{color:'white', fontSize:20}}>
              {"无"}
              </Text>
            </View>
          )
        }
      }
  }
}

const WIN_WIDTH = Dimensions.get("window").width,
  WIN_HEIGHT = Dimensions.get("window").height;

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
  historyContainer: {
    height: WIN_HEIGHT,
    marginTop: 0,
    borderTopWidth: 0,
    borderBottomWidth: 0,
    borderBottomColor: "#45474D",
    backgroundColor: "transparent",
  },
  loadingCotainer: {
    flex: 1,
    height: 150,
    justifyContent: 'center',
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

function select(store) {
  return {
    items: store.room.roomGameHistory
  };
}

/* exports ================================================================== */
module.exports = connect(select)(RoomHistory);
