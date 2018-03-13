import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions
} from "react-native";
import { List, ListItem, SearchBar, Button, Avatar } from "react-native-elements";
import { refreshMsgs } from "../actions";
import { connect } from "react-redux";
import dateFormat from 'dateformat';
import ScreenComponent from './ScreenComponent';
import F8Colors from './F8Colors';

const WIN_WIDTH = Dimensions.get("window").width,
  WIN_HEIGHT = Dimensions.get("window").height;

// Our custom component we want as a button in the nav bar
const NormalItem = ({ text, price, unit, describ, onPress, bgColor, subBgColor }) =>
  <TouchableOpacity
    style={[styles.card, { backgroundColor: bgColor }]}
    onPress={() => onPress()}
  >
    <View style={{flex: 0, height:100, backgroundColor: "transparent"}}>
      <Text style={{ color: 'white', top: 10, left: 10, fontSize:30 }}>
        {text}
      </Text>
      <View style={{flex: 0, position: "absolute",
            backgroundColor: "#ffdf00", borderRadius: 13,
            marginTop:5, right:5, paddingHorizontal:10, height: 18 }}>
        <Text style={{ color: '#ee4943', fontSize:14 }}>
          {price}
        </Text>
      </View>
      <Text style={{ color: 'white', top: 10, left: 10, fontSize:15 }}>
        {unit}
      </Text>
      <View style={{position: "absolute", left:0, right:0, bottom:0, height:25, backgroundColor: subBgColor, borderBottomLeftRadius: 13,
                borderBottomRightRadius: 13}}>
        <Text style={{ color: 'white', fontSize:12, top:4, left:10 }}>
          {describ}
        </Text>
      </View>
    </View>
  </TouchableOpacity>;

const NormalCardItem = ({ text, price, unit, describ, describ2, onPress, bgColor, subBgColor }) =>
    <TouchableOpacity
      style={[styles.card, { backgroundColor: bgColor }]}
      onPress={() => onPress()}
    >
      <View style={{flex: 0, height:100, backgroundColor: "transparent"}}>
        <View style={{flexDirection: "row", height: 40}}>
          <Text style={{ color: 'white', marginTop: 10, marginLeft: 10, fontSize:30 }}>
            {text}
          </Text>
          <View style={{flex:0, justifyContent:'flex-end'}}>
            <Text style={{ color: 'white', marginLeft: 5, fontSize:12 }}>
              {unit}
            </Text>
          </View>
        </View>
        <View style={{flex: 0, position: "absolute",
              backgroundColor: "#ffdf00", borderRadius: 13,
              marginTop:5, right:5, paddingHorizontal:10, height: 18 }}>
          <Text style={{ color: '#ee4943', fontSize:14 }}>
            {price}
          </Text>
        </View>
        <Text style={{ color: 'white', marginLeft:10, marginTop: 3, fontSize:10 }} numberOfLines={2}>
          {describ2}
        </Text>
        <View style={{position: "absolute", left:0, right:0, bottom:0, height:25, backgroundColor: subBgColor, borderBottomLeftRadius: 13,
                  borderBottomRightRadius: 13}}>
          <Text style={{ color: 'white', fontSize:12, top:4, left:10 }}>
            {describ}
          </Text>
        </View>
      </View>
    </TouchableOpacity>;

const CardItem = ({ text }) =>
  <TouchableOpacity
    style={[styles.button, { backgroundColor: 'tomato' }]}
    onPress={() => console.log('pressed me!')}
  >
    <View style={styles.button}>
      <Text style={{ color: 'white' }}>
        {text}
      </Text>
    </View>
  </TouchableOpacity>;

class IAPScreen extends ScreenComponent {
  constructor(props) {
    super(props);

    this.state = {
    };
  }

  static navigatorStyle = {
    navBarTextColor: '#ffffff',
    navBarBackgroundColor: '#373a41',
    navBarButtonColor: '#ffffff'
  };

  componentDidMount() {
  }

  onPress = () => {

  }

  renderContent = () => {
    TEMP_DATA = [{
      text: "100",
      price: "5000",
      unit: '钻石',
      describ: "额外赠送20钻石",
    }, {
      text: "100",
      price: "50",
      unit: '钻石',
      describ: "额外赠送20钻石",
    }, {
      text: "100",
      price: "50",
      unit: '钻石',
      describ: "额外赠送20钻石",
    }, {
      text: "100",
      price: "50",
      unit: '钻石',
      describ: "额外赠送20钻石",
    }, {
      text: "100",
      price: "50",
      unit: '钻石',
      describ: "额外赠送20钻石",
    }, {
      text: "100",
      price: "50",
      unit: '钻石',
      describ: "额外赠送20钻石",
    }]

    return TEMP_DATA.map((data, idx) => {
      return (
        <NormalItem
          text={data.text}
          price={data.price}
          describ={data.describ}
          unit={data.unit}
          onPress={this.onPress}
          bgColor={'#ee4943'}
          subBgColor={'#3b94e6'}
          />
      );
    });
  }

  renderCard = () => {
    TEMP_DATA = [{
      text: "10000",
      price: "5000",
      unit: '钻石',
      describ: "额外赠送20钻石",
      describ2: "额外赠送20钻石\n20钻石",
    }, {
      text: "1000",
      price: "50",
      unit: '钻石',
      describ: "额外赠送20钻石",
      describ2: "额外赠送20钻石\n20钻石",
    }, {
      text: "100",
      price: "50",
      unit: '钻石',
      describ: "额外赠送20钻石",
      describ2: "额外赠送20钻石",
    }, {
      text: "100",
      price: "50",
      unit: '钻石',
      describ: "额外赠送20钻石",
      describ2: "额外赠送20钻石",
    }, {
      text: "100",
      price: "50",
      unit: '钻石',
      describ: "额外赠送20钻石",
      describ2: "额外赠送20钻石",
    }, {
      text: "100",
      price: "50",
      unit: '钻石',
      describ: "额外赠送20钻石",
      describ2: "额外赠送20钻石",
    }]

    return TEMP_DATA.map((data, idx) => {
      return (
        <NormalCardItem
          text={data.text}
          price={data.price}
          describ={data.describ}
          describ2={data.describ2}
          unit={data.unit}
          onPress={this.onPress}
          bgColor={'#ee4943'}
          subBgColor={'#3b94e6'}
          />
      );
    });
  }

  renderTitle = (icon, label) => {
    return (
    <View style={styles.titleContainer}>
      <Image source={icon}/>
      <Text style={{color:'#d3d3e8'}}> {label} </Text>
    </View>
    )
  }

  render() {
    return (
      <ScrollView style={styles.container}>
        {this.renderTitle(require('./img/Recharge1.png'), '超值充值')}
        <View style={styles.cardContainer}>
          {this.renderContent()}
        </View>
        {this.renderTitle(require('./img/Recharge2.png'), '周卡月卡')}
        <View style={styles.cardContainer}>
          {this.renderCard()}
        </View>
      </ScrollView>
    );
  }
}

/* StyleSheet
============================================================================= */
let cardWidth = 170;
if(WIN_WIDTH < 3200) {
  cardWidth = (WIN_WIDTH - 50) / 2;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    backgroundColor: F8Colors.mainBgColor
  },
  cardContainer: {
      flex: 1,
      justifyContent: 'space-around',
      //alignItems: 'flex-start',
      //alignContent: 'space-around',
      flexWrap: 'wrap',
      flexDirection: 'row',
      backgroundColor: F8Colors.mainBgColor,
      marginLeft: 10,
      marginRight: 10,
  },
  card: {
    width: cardWidth,
    height: 100,
    borderRadius: 13,
    marginTop:15
  },
  titleContainer: {
    flex: 1,
    height: 40,
    marginLeft: 20,
    marginTop: 10,
    flexDirection: "row",
    alignItems: 'center',
    backgroundColor: F8Colors.mainBgColor,
  }
});

function select(store) {
  return {
    account:store.user.account,
  };
}

/* exports ================================================================== */
module.exports = connect(select)(IAPScreen);
