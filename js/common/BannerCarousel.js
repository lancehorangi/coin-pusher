//@flow

import {
  View,
  Image,
  StyleSheet,
  Dimensions,
  Text,
  TouchableOpacity,
  Alert,
  ActivityIndicator
} from 'react-native';
import Carousel, { Pagination } from 'react-native-snap-carousel';
import React, { Component } from "react";
import { connect } from "react-redux";

const WIN_WIDTH = Dimensions.get("window").width,
  WIN_HEIGHT = Dimensions.get("window").height;
const BANNER_HEIGHT = WIN_WIDTH * 0.25;

type navigatorType = {
  push: any => any,
}

type Props = {
  dispatch: (action: any) => Promise<any>,
  navigator: navigatorType
};

type state = {
  activeSlide: number,
  entries: Array<Object>
};

class BannerCarousel extends Component<Props, state> {
    constructor(props) {
      super(props);
      this.state = {
        activeSlide: 0,
        entries: [
          {
            image: require('./img/banner1.png'),
            press: _ => {
              this.props.navigator.push({
                screen: 'CP.IAPScreen', // unique ID registered with Navigation.registerScreen
                title: "商城",
              });
            }
          },
          {
            image: require('./img/banner2.png'),
            press: _ => {
              this.props.navigator.push({
                screen: 'CP.MallScreen', // unique ID registered with Navigation.registerScreen
                title: "积分商城",
              });
            }
          }
        ]
      };
    }

    _renderItem = ({item, index}) => {
      return (
          <TouchableOpacity
          style={styles.image}
          activeOpacity={1}
          onPress={item.press}>
              <Image style={{width:WIN_WIDTH, height:BANNER_HEIGHT, resizeMode: "stretch"}}
                source={ item.image }
                loadingIndicatorSource={<ActivityIndicator size='small' color='white' />}
              />
          </TouchableOpacity>
      );
    }

    pagination = () => {
        const { entries, activeSlide } = this.state;
        return (
          <View stule={{
            position: 'absolute',
            top:0,
            backgroundColor: 'transparent',
            justifyContent: 'center',
            alignItems: 'center',
            alignContent: 'center',
          }}>
            <Pagination
              dotsLength={entries.length}
              activeDotIndex={activeSlide}
              containerStyle={{
                backgroundColor: 'transparent',
                height:5,
                width:50,
                justifyContent: 'center',
                alignItems: 'center',
                alignContent: 'center',
              }}
              dotStyle={{
                  width: 10,
                  height: 10,
                  borderRadius: 5,
                  marginHorizontal: 2,
                  backgroundColor: 'rgba(0, 0, 0, 0.92)'
              }}
              inactiveDotStyle={{
                  // Define styles for inactive dots here
              }}
              inactiveDotOpacity={0.4}
              inactiveDotScale={0.6}
            />
          </View>
        );
    }

    render () {
        return (
            <View style={styles.container}>
                <Carousel
                  data={this.state.entries}
                  renderItem={this._renderItem}
                  sliderWidth={WIN_WIDTH}
                  itemWidth={WIN_WIDTH}
                  onSnapToItem={(index: number) => this.setState({ activeSlide: index }) }
                  loop={true}
                  autoplay={true}
                  autoplayInterval={5000}
                />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        height: BANNER_HEIGHT,
        backgroundColor: 'transparent',
        justifyContent: 'center'
    },
    pagination: {
      position: "absolute",
      width: 50,
      height: 20,
      resizeMode: "cover"
    },
    image: {
      height: BANNER_HEIGHT,
      backgroundColor: 'transparent',
      justifyContent: 'center'
    }
});

function select(store) {
  return {
    token: store.user.token,
    navigator: store.appNavigator.navigator,
  };
}

module.exports = connect(select)(BannerCarousel);
