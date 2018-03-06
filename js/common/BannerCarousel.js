import { View, Image, StyleSheet, Dimensions, Text } from 'react-native';
import Carousel, { Pagination } from 'react-native-snap-carousel';
import React, { Component } from "react";
import { connect } from "react-redux";

const WIN_WIDTH = Dimensions.get("window").width,
  WIN_HEIGHT = Dimensions.get("window").height;
const BANNER_HEIGHT = 75;

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
        entries: [{image: 'https://www.baidu.com/img/bd_logo1.png' }, {image: 'https://www.baidu.com/img/bd_logo1.png' }]
      };
    }

    _renderItem ({item, index}) {
      return (
          <View style={styles.image}>
              <Image style={{width:WIN_WIDTH, height:BANNER_HEIGHT, resizeMode: "stretch"}} source={{ uri: item.image }} />
          </View>
      );
    }

    pagination = () => {
        const { entries, activeSlide } = this.state;
        return (
            <Pagination
              dotsLength={entries.length}
              activeDotIndex={activeSlide}
              containerStyle={{ backgroundColor: 'transparent', height:5, width:50}}
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
                  autoplayInterval={1000}
                />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        height: BANNER_HEIGHT,
        backgroundColor: 'white',
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
      backgroundColor: 'white',
      justifyContent: 'center'
    }
});

function select(store) {
  return {
    token: store.user.token
  };
}

module.exports = connect(select)(BannerCarousel);
