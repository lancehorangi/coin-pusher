import * as React from 'react';
import { View,
  StyleSheet,
  Dimensions,
  Animated,
  Platform,
  ScrollView,
  Image,
  Alert,
  StatusBar } from 'react-native';
import { TabViewAnimated, TabBar, SceneMap } from 'react-native-tab-view';
import { connect } from "react-redux";
import { Navigation } from 'react-native-navigation';
import { NimSession } from 'react-native-netease-im';
import { loggedOut, setNavigator, showRoomList,
  refreshMsgs, getAccountInfo, getCheckinInfo, freshItems, freshMoney } from './../actions';

import { toastShow } from './../util';
import LaunchScreen from './LaunchScreen';
import BannerCarousel from './BannerCarousel';
import RoomList from './RoomList';
import GridButton from './GridButton';
import CustomMainScreenTabButton from './CustomMainScreenTabButton';
import { showModal } from './../navigator';

import F8Colors from './F8Colors';
import { Text, HeaderTitle } from "./F8Text";


const initialLayout = {
  height: 0,
  width: Dimensions.get('window').width,
};

// const {width: SCREEN_WIDTH} = Dimensions.get("window");
// const HEADER_HEIGHT = Platform.OS === "ios" ? 64 : 50;
Navigation.registerComponent('CP.CustomMainScreenTabButton', () => CustomMainScreenTabButton);

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
        id: 'add', // id for this button, given in onNavigatorEvent(event) to help understand which button was clicked
        buttonColor: '#ffffff', // Optional, iOS only. Set color for the button (can also be used in setButtons function to set different button style programatically)
        //icon: require('./img/header/add.png'),
        component: 'CP.CustomMainScreenTabButton',
        disableIconTint: true,
        passProps: {}
      }
    ],
    leftButtons: [
      {
        id: 'message', // id for this button, given in onNavigatorEvent(event) to help understand which button was clicked
        buttonColor: '#ffffff', // Optional, iOS only. Set color for the button (can also be used in setButtons function to set different button style programatically)
        icon: require('./img/header/news.png'),
        disableIconTint: true,
      }
    ]
  };

  static navigatorStyle = {
    navBarTextColor: '#ffffff',
    navBarBackgroundColor: F8Colors.mainBgColor2
  };

  constructor(props) {
    super(props);
    // if you want to listen on navigator events, set this up
    this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));
  }

  onNavigatorEvent(event) {
    //console.log('MainScreen:' + JSON.stringify(event));
    switch(event.id) {
      case 'willAppear':
       break;
      case 'didAppear':
        this.props.dispatch(setNavigator(this.props.navigator));
        this.props.dispatch(freshMoney());
        this.props.dispatch(freshItems());
        break;
      case 'willDisappear':
        break;
      case 'didDisappear':
        break;
      case 'willCommitPreview':
        break;
    }

    if (event.type == 'NavBarButtonPress') { // this is the event type for button presses
      if (event.id == 'add') { // this is the same id field from the static navigatorButtons definition
        this.props.navigator.push({
          screen: 'CP.IAPScreen', // unique ID registered with Navigation.registerScreen
          title: "商城",
        });
      }
      if (event.id == 'message') {
        this.props.navigator.push({
          screen: 'CP.MsgHistoryScreen', // unique ID registered with Navigation.registerScreen
          title: "邮件",
        });
      }
    }
  }

  _handleIndexChange = index => {
    this.setState({ index });
    this.props.dispatch(showRoomList(this.state.index));
  }

  _renderHeaderTabBar = props => {
      return <TabBar style={{
                              transform: [{translateY: this.state.tabY}],
                              backgroundColor: '#292d36'
                            }}
                            labelStyle={{color: '#d1d3e8', margin:1}}
                            scrollEnabled={false}
                            useNativeDriver={true}
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

  _onPressSign = () => {
    this.props.navigator.push({
      screen: 'CP.SignScreen', // unique ID registered with Navigation.registerScreen
      title: "签到",
    });
  }

  _onPressTutorial = () => {
    showModal({
      screen: 'CP.ImageSwiperScreen', // unique ID registered with Navigation.registerScreen
      title: "教程",
      passProps: {
        images: [
          require("./img/tutorial1.png"),
          require("./img/tutorial2.png"),
        ]
      },
      navigatorStyle: { navBarHidden: true },
      //animationType: 'fade',
    });

  }

  _renderHeader = () => { return (
      <View style={{backgroundColor: F8Colors.mainBgColor}}>
      <StatusBar barStyle="light-content"/>
        <BannerCarousel/>
        <View style={styles.gridContainer}>
          <GridButton
            icon={require('./img/buttons/sign.png')}
            caption={'签到'}
            onPress={_ => this._onPressSign()}/>
          <GridButton
            icon={require('./img/buttons/course.png')}
            caption={'教程'}
            onPress={_ => this._onPressTutorial()}/>
          <GridButton
            icon={require('./img/buttons/more.png')}
            caption={'敬请期待'}/>
        </View>
      </View>
    )
  }

  async initInfo() {
    try {
      await NimSession.login(this.props.account, this.props.token);
      this.props.dispatch(showRoomList(this.state.index));
      this.props.dispatch(refreshMsgs());
      this.props.dispatch(getAccountInfo());
      this.props.dispatch(getCheckinInfo());
      this.props.dispatch(freshItems());

    } catch (e) {
      Alert.alert("account:" + this.props.account + ', token:' + this.props.token + ', err=' + e.message);
    } finally {

    }

  }

  componentDidMount() {
    if(this.props.loggedIn){
      this.initInfo();
      //Alert.alert("MainScreen componentDidMount loggedIn:" + this.props.loggedIn)

    }
    else {
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
        renderHeader={this._renderHeaderTabBar}
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
              {this._renderHeader()}
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
    backgroundColor: F8Colors.mainBgColor,
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
    account: store.user.account,
    token: store.user.token
  };
}

module.exports = connect(select)(MainScreen);
