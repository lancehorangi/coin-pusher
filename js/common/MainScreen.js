import * as React from 'react';
import { View, StyleSheet, Dimensions, Animated, Platform, ScrollView,
  Image, Alert, FlatView, AlertIOS, StatusBar } from 'react-native';
import { TabViewAnimated, TabBar, SceneMap } from 'react-native-tab-view';
import { connect } from "react-redux";
import { Text, HeaderTitle } from "./F8Text";
import LaunchScreen from './LaunchScreen';
import BannerCarousel from './BannerCarousel';
import RoomList from './RoomList';
import { loggedOut } from './../actions';
import GridButton from './GridButton';

const initialLayout = {
  height: 0,
  width: Dimensions.get('window').width,
};

// const {width: SCREEN_WIDTH} = Dimensions.get("window");
// const HEADER_HEIGHT = Platform.OS === "ios" ? 64 : 50;

const HeadComponent = () => (
            <View style={{backgroundColor: "#24272e"}}>
            <StatusBar barStyle="light-content"/>
              <BannerCarousel/>
              <View style={styles.gridContainer}>
                <GridButton
                  icon={require('./img/buttons/sign.png')}
                  caption={'签到'}
                  onPress={_ => Alert.alert('签到')}/>
                <GridButton
                  icon={require('./img/buttons/course.png')}
                  caption={'教程'}
                  onPress={_ => Alert.alert('教程')}/>
                <GridButton
                  icon={require('./img/buttons/more.png')}
                  caption={'敬请期待'}/>
              </View>
            </View>
          );

export class MainScreen extends React.Component {
  nScroll = new Animated.Value(0);
  _refs = {}
  state = {
    index: 0,
    routes: [
      { key: 'first', title: '金币1倍场' },
      { key: 'second', title: '金币10倍场' },
    ],
    tabY: 0,
    index: 0,
    bInitFinish: false
  };

  static navigatorButtons = {
    rightButtons: [
      {
        //title: '金币', // for a textual button, provide the button title (label)
        id: 'add', // id for this button, given in onNavigatorEvent(event) to help understand which button was clicked
        buttonColor: '#ffffff', // Optional, iOS only. Set color for the button (can also be used in setButtons function to set different button style programatically)
        //buttonFontSize: 14, // Set font size for the button (can also be used in setButtons function to set different button style programatically)
        //buttonFontWeight: '600', // Set font weight for the button (can also be used in setButtons function to set different button style programatically)
        icon: require('./img/header/add.png'),
        disableIconTint: true,
      }
    ],
    leftButtons: [
      {
        //title: '消息', // for a textual button, provide the button title (label)
        id: 'message', // id for this button, given in onNavigatorEvent(event) to help understand which button was clicked
        buttonColor: '#ffffff', // Optional, iOS only. Set color for the button (can also be used in setButtons function to set different button style programatically)
        //buttonFontSize: 14, // Set font size for the button (can also be used in setButtons function to set different button style programatically)
        //buttonFontWeight: '600', // Set font weight for the button (can also be used in setButtons function to set different button style programatically)
        icon: require('./img/header/news.png'),
        disableIconTint: true,
      }
    ]
  };

  static navigatorStyle = {
    navBarTextColor: '#ffffff',
    navBarBackgroundColor: '#373a41'
  };

  constructor(props) {
    super(props);
    // if you want to listen on navigator events, set this up
    this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));
  }

  onNavigatorEvent(event) { // this is the onPress handler for the two buttons together
    if (event.type == 'NavBarButtonPress') { // this is the event type for button presses
      if (event.id == 'add') { // this is the same id field from the static navigatorButtons definition
        Alert.alert('充值');
      }
      if (event.id == 'message') {
        Alert.alert('消息');
      }
    }
  }

  _handleIndexChange = index => {
    this.setState({ index });
  }

  _renderHeader = props => {
      return <TabBar style={{
                              transform: [{translateY: this.state.tabY}],
                              backgroundColor: '#292d36'
                            }}
                            labelStyle={{color: '#d1d3e8', margin:1}}
                            scrollEnabled={false}
                            { ...props }/>;
  }

  _renderScene = ({ route }) => {
    switch (route.key) {
    case 'first':
      return <RoomList ref={(tabScene) => {
            if(tabScene){
              this._refs[route.key] = tabScene.getWrappedInstance();
            }}}/>;
    case 'second':
      return <RoomList ref={(tabScene) => {
            if(tabScene){
              this._refs[route.key] = tabScene.getWrappedInstance();
            }}}/>;
    default:
      return null;
    }
  }

  componentDidMount() {
    if(this.props.loggedIn === false){
      this.props.dispatch(loggedOut());
    }
  }

  _onEndReached = () => {
    let {routes, index} = this.state;

    routes.map((route, refIndex) => {
      if(refIndex == index){
        let key = route['key']
        this._refs[key].onEndReached();
        return;
      }
    });
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
            bounces={false}
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

const GRID_HEIGHT = 62;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#24272e",
  },
  gridContainer: {
    flex: 1,
    width: "100%",
    height:GRID_HEIGHT,
    flexDirection: "row",
  },
  image: {
    left: 0,
    top: 0,
    width: initialLayout.width,
    height: initialLayout.width,
    resizeMode: "cover"
  },
});

function select(store) {
  return {
    token: store.user.token
  };
}

module.exports = connect(select)(MainScreen);
