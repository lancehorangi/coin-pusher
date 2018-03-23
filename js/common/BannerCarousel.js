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
const BANNER_HEIGHT = WIN_WIDTH * 0.36;

class BannerCarousel extends Component {
    props: {
      dispatch: (action: any) => Promise,
    };
    state: {
      activeSlide: number,
      entries: Array<Object>
    };

    constructor() {
      super();
      this.state = {
        activeSlide: 0,
        entries: [
          {image: 'https://www.baidu.com/img/bd_logo1.png' },
          {image: 'https://www.baidu.com/img/bd_logo1.png' }
        ]
      };
    }

    _onPress = (index) => {
      Alert.alert("Press:" + index);
    }

    _renderItem = ({item, index}) => {
      return (
          <TouchableOpacity
          style={styles.image}
          activeOpacity={1}
          onPress={() => { this._onPress(index) }}>
              <Image style={{width:WIN_WIDTH, height:BANNER_HEIGHT, resizeMode: "stretch"}}
                source={{ uri: item.image }}
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
                  onSnapToItem={(index) => this.setState({ activeSlide: index }) }
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
    token: store.user.token
  };
}

module.exports = connect(select)(BannerCarousel);
