import React, { Component } from "react";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert
} from "react-native";
import { List, ListItem, SearchBar, Button, Avatar } from "react-native-elements";
import { openMsg, getMailAccessory } from "../actions";
import { connect } from "react-redux";
import F8Colors from './F8Colors';
import dateFormat from 'dateformat';
import ScreenComponent from './ScreenComponent';

class MsgDetailScreen extends ScreenComponent {
  props:{
    mail: ?Object,
  }

  constructor(props) {
    super(props);
    this.props.mailID = null;
    this.state = {
    };
  }

  static navigatorStyle = {
    navBarTextColor: '#ffffff',
    navBarBackgroundColor: F8Colors.mainBgColor2,
    navBarButtonColor: '#ffffff'
  };

  componentDidMount() {
    if (this.props.mailID) {
      this.props.dispatch(openMsg(this.props.mailID));
    }
  }

  renderContent = () => {
    let { mail } = this.props;
    return (
      <View style={[styles.content, {flex:0}]}>
        <Text style={styles.contentText}> {mail.content} </Text>
      </View>
    )
  }

  renderItem = () => {
    let { mail } = this.props;
    if(mail.items && mail.items.length > 0) {
      return (
        <View style={styles.itemListContainer}>
        {
          mail.items.map((item, i) => (
            <View style={styles.itemContainer}>
              <Image
                source={{uri:item.url}}
                style={{
                  width: 60,
                  height: 60,
                  resizeMode: "stretch"
                }}/>
              <Text style={{color:'#d1d3e8', width:'100%'}} textAlign='center'>
                {item.name + ' X ' + item.num}
              </Text>
            </View>
          ))
        }
      </View>
      )
    }
    else {
      return;
    }
  }

  onPress = (item) => {
    if (this.props.mailID && !this.props.mail.mark) {
      let response = this.props.dispatch(getMailAccessory(this.props.mailID));
      //response.then(_ => Alert.alert('XX'), e => Alert.alert(e.message));
    }
  }

  renderBtn = () => {
    let { mail } = this.props;
    if(mail.items && mail.items.length > 0) {
      return (
        <TouchableOpacity
          style={{flex: 0, backgroundColor: "#ee4943", borderRadius: 13,
              marginTop:15, paddingHorizontal:10, paddingVertical:10,
              alignSelf:'center'}}
          onPress={mail.mark ? _ => {} : () => this.onPress()}>
          <Text style={{ color: 'white', fontSize:18 }}>
            {mail.mark ? '已领取' : '领取'}
          </Text>
        </TouchableOpacity>
      )
    }
    else {
      return;
    }
  }

  renderHeader = () => {
    let { mail } = this.props;

    let accessoryContent = mail.items && mail.items.length > 0 ? (
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
          title={mail.title}
          titleStyle={{color: '#d1d3e8', fontSize: 17}}
          //subtitle={item.content}
          rightTitle={dateFormat(new Date(mail.sendTime * 1000), 'UTC:yyyy/mm/dd\nHH:MM')}
          //rightTitle={item.sendTime}
          rightTitleNumberOfLines={2}
          avatar={accessoryContent}
          hideChevron={true}
          key={mail.id}
          leftIcon={
            <Image
            style={{width:20, height:20, marginRight:5, marginLeft:5}}
            source={mail.mark ? require('./img/header/news.png') : require('./img/news_y.png')}/>
          }
        />
      )
    )
  }

  render() {
    let { mail } = this.props;
    if (mail) {
      return (
        <ScrollView style={[styles.container]}>
            {this.renderHeader()}
            {this.renderContent()}
            {this.renderItem()}
            {this.renderBtn()}
        </ScrollView>
      );
    }
    else {
      return (
        <View style={[styles.loadingCotainer]}>
            <ActivityIndicator animating size="large" color='white'/>
        </View>
      );
    }
  }
}

/* StyleSheet
============================================================================= */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    backgroundColor: F8Colors.mainBgColor,
    //height: '100%',
  },
  content: {
    width: '100%',
    paddingHorizontal: 20,
    marginTop: 20,
  },
  contentText: {
    color: '#d1d3e8',
    fontSize: 17,
  },
  itemListContainer: {
    flex: 1,
    width: '100%',
    height: 75,
    marginTop: 30,
    flexDirection: "row",
    //alignItems: "center",
    justifyContent: "center",
  },
  itemContainer: {
    flex: 0,
    justifyContent: "center",
    width: 80,
  },
  loadingCotainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: F8Colors.mainBgColor,
  }
});

function select(store) {
  return {
    mail: store.msgs.openMail,
  };
}

/* exports ================================================================== */
module.exports = connect(select)(MsgDetailScreen);
