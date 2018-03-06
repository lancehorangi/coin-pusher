import * as React from 'react';
import { View, StyleSheet, Dimensions, Animated, Platform, ScrollView, Image, Alert, FlatView } from 'react-native';
import { TabViewAnimated, TabBar, SceneMap } from 'react-native-tab-view';

import { Text, HeaderTitle } from "./F8Text";
import LaunchScreen from './LaunchScreen';
import BannerCarousel from './BannerCarousel';

const initialLayout = {
  height: 0,
  width: Dimensions.get('window').width,
};

// const {width: SCREEN_WIDTH} = Dimensions.get("window");
// const HEADER_HEIGHT = Platform.OS === "ios" ? 64 : 50;

const FirstRoute = () => (
              <View style={[ styles.container, { backgroundColor: '#ff4081' } ]}>
              <Image
                source={require("./img/launchscreen.png")}
                style={styles.image}
              />
              <Image
                source={require("./img/launchscreen.png")}
                style={styles.image}
              />
              <Image
                source={require("./img/launchscreen.png")}
                style={styles.image}
              />
              </View>
            );

const SecondRoute = () => (
              <View style={[ styles.container, { backgroundColor: '#673ab7' } ]}>
              <Image
                source={require("./img/launchscreen.png")}
                style={styles.image}
              />
              <Image
                source={require("./img/launchscreen.png")}
                style={styles.image}
              />
              <Image
                source={require("./img/launchscreen.png")}
                style={styles.image}
              />
              </View>
            );

const HeadComponent = () => (
            <View>
            <HeaderTitle numberOfLines={1}>
              测试Banner
            </HeaderTitle>
            <BannerCarousel/>
            </View>
);

export default class TabViewExample extends React.Component {
  nScroll = new Animated.Value(0);
  state = {
    index: 0,
    routes: [
      { key: 'first', title: '金币1倍场' },
      { key: 'second', title: '金币10倍场' },
    ],
    tabY: 0,
    bInitFinish: false
  };

  _handleIndexChange = index => {
    this.setState({ index });
  }

  _renderHeader = props => {
      return <TabBar style={{transform: [{translateY: this.state.tabY}]}} { ...props }/>;
  }

  _renderScene = SceneMap({
    first: LaunchScreen,
    second: SecondRoute,
  });

  _onEndReached = () => {
    //Alert.alert('reach end');
  }

  _renderTabView = () => {
    if (this.state.bInitFinish) {
      return <TabViewAnimated
        style={styles.container}
        navigationState={this.state}
        renderScene={this._renderScene}
        renderHeader={this._renderHeader}
        onIndexChange={this._handleIndexChange}
        initialLayout={initialLayout}
        onLayout={this.onScrollViewLayout}
      />;
    }
    else {
      return null;
    }
  }

  onHeaderLayout = (e: any) =>
  {
    //Alert.alert('layout height:' + e.nativeEvent.layout.height);
    let offsetY = e.nativeEvent.layout.height;
    if(this.nScroll){
      this.setState({ tabY:
        this.nScroll.interpolate({
          inputRange: [-offsetY + 1, offsetY - 1, offsetY, offsetY * 2],
          outputRange: [0, 0, offsetY - offsetY, offsetY * 2 - offsetY]
        })
      });
      this.setState({ bInitFinish: true });
    }
  }

  isReachEnd = ({layoutMeasurement, contentOffset, contentSize}) => {
                      const paddingToBottom = 0;
                      return layoutMeasurement.height + contentOffset.y >=
                        contentSize.height - paddingToBottom;
                    };

  render() {
      return (
        <Animated.ScrollView
            alwaysBounceVertical={false}
            alwaysBounceHorizontal={false}
            scrollEventThrottle={5}
            showsVerticalScrollIndicator={false}
            onScroll={Animated.event([{nativeEvent: {contentOffset: {y: this.nScroll}}}], {useNativeDriver: true,
            listener: (event) => {
              if(this.isReachEnd(event.nativeEvent))
                this._onEndReached();
            }})}
            style={styles.container}>
            <View onLayout={this.onHeaderLayout}>
              <HeadComponent/>
            </View>
            {this._renderTabView()}
        </Animated.ScrollView>
      );
    }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  image: {
    left: 0,
    top: 0,
    width: initialLayout.width,
    height: initialLayout.width,
    resizeMode: "cover"
  },
});
