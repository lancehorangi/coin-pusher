//@flow
/* eslint no-undef: "off" */

import {
  View,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  ActivityIndicator,
  Image
} from "react-native";
import Carousel, { Pagination } from "react-native-snap-carousel";
import React, { Component } from "react";
import type { Element } from "react";
import { connect } from "react-redux";

const WIN_WIDTH = Dimensions.get("window").width;
const BANNER_HEIGHT = WIN_WIDTH * 0.25;

type navigatorType = {
  push: any => any
};

declare type itemType = {
	press: ?() => mixed,
	image: Object
};

type Props = {
  dispatch: (action: any) => Promise<any>,
  navigator: navigatorType,
  bannerList: Array<Object>
};

type state = {
  activeSlide: number
};

class BannerCarousel extends Component<Props, state> {
  constructor(props: Object) {
    super(props);
    this.state = {
      activeSlide: 0
    };
  }

_renderItem = ({
  item,
  //index: number
}: Object): Element<TouchableOpacity> => {
  return (
    <TouchableOpacity
      style={styles.image}
      activeOpacity={1}
      // onPress={item.press}
    >
      <Image style={{width:WIN_WIDTH, height:BANNER_HEIGHT, resizeMode: "stretch"}}
        source={ {uri:item} }
        loadingIndicatorSource={<ActivityIndicator size='small' color='white' />}
      />
    </TouchableOpacity>
  );
}

pagination = (): Element<typeof View> => {
  const { activeSlide } = this.state;
  const { bannerList } = this.props;
  return (
    <View stule={{
      position: "absolute",
      top:0,
      backgroundColor: "transparent",
      justifyContent: "center",
      alignItems: "center",
      alignContent: "center",
    }}>
      <Pagination
        dotsLength={bannerList.length}
        activeDotIndex={activeSlide}
        containerStyle={{
          backgroundColor: "transparent",
          height:5,
          width:50,
          justifyContent: "center",
          alignItems: "center",
          alignContent: "center",
        }}
        dotStyle={{
          width: 10,
          height: 10,
          borderRadius: 5,
          marginHorizontal: 2,
          backgroundColor: "rgba(0, 0, 0, 0.92)"
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

render (): Element<typeof View> {
  return (
    <View style={styles.container}>
      <Carousel
        data={this.props.bannerList}
        renderItem={this._renderItem}
        sliderWidth={WIN_WIDTH}
        itemWidth={WIN_WIDTH}
        onSnapToItem={(index: number): any => this.setState({ activeSlide: index }) }
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
    backgroundColor: "transparent",
    justifyContent: "center"
  },
  image: {
    height: BANNER_HEIGHT,
    backgroundColor: "transparent",
    justifyContent: "center"
  }
});

function select(store: Object): Object {
  return {
    token: store.user.token,
    navigator: store.appNavigator.navigator,
    bannerList: store.lobby.bannerList
  };
}

module.exports = connect(select)(BannerCarousel);
