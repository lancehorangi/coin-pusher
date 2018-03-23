import { Navigation } from 'react-native-navigation';

import LaunchScreen from './common/LaunchScreen';
import LoginScreen from './common/LoginScreen';
import Notification from './common/Notification';
import GameScreen from './common/gameScreen';
import MainScreen from './common/MainScreen';
import RoomThumbnail from './common/RoomThumbnail';
import MsgHistoryScreen from './common/MsgHistoryScreen';
import MsgDetailScreen from './common/MsgDetailScreen';
import MineScreen from './common/MineScreen';
import IAPScreen from './common/IAPScreen';
import MallScreen from './common/MallScreen';
import SignScreen from './common/SignScreen';
import OptionScreen from './common/OptionScreen';
import GameHistoryScreen from './common/GameHistoryScreen';
import FeedbackScreen from './common/FeedbackScreen';
import ImageSwiperScreen from './common/ImageSwiperScreen';

// register all screens of the app (including internal ones)
export default (store, Provider) => {
  Navigation.registerComponent('CP.MainScreen', () => MainScreen, store, Provider);
  Navigation.registerComponent('CP.LoginScreen', () => LoginScreen, store, Provider);
  Navigation.registerComponent('CP.LaunchScreen', () => LaunchScreen, store, Provider);
  Navigation.registerComponent('CP.GameScreen', () => GameScreen, store, Provider);
  Navigation.registerComponent('CP.MsgHistoryScreen', () => MsgHistoryScreen, store, Provider);
  Navigation.registerComponent('CP.MsgDetailScreen', () => MsgDetailScreen, store, Provider);
  Navigation.registerComponent('CP.MineScreen', () => MineScreen, store, Provider);
  Navigation.registerComponent('CP.IAPScreen', () => IAPScreen, store, Provider);
  Navigation.registerComponent('CP.MallScreen', () => MallScreen, store, Provider);
  Navigation.registerComponent('CP.SignScreen', () => SignScreen, store, Provider);
  Navigation.registerComponent('CP.OptionScreen', () => OptionScreen, store, Provider);
  Navigation.registerComponent('CP.GameHistoryScreen', () => GameHistoryScreen, store, Provider);
  Navigation.registerComponent('CP.FeedbackScreen', () => FeedbackScreen, store, Provider);
  Navigation.registerComponent('CP.Notification', () => Notification);
  Navigation.registerComponent('CP.ImageSwiperScreen', () => ImageSwiperScreen, store, Provider);


  Navigation.registerComponent('CP.Sub.RoomThumbnail', () => RoomThumbnail);
}
