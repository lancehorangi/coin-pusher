import { Navigation } from 'react-native-navigation';

import LaunchScreen from './common/LaunchScreen';
import LoginScreen from './common/LoginScreen';

// register all screens of the app (including internal ones)
export default (store, Provider) => {
  Navigation.registerComponent('CP.LoginScreen', () => LoginScreen, store, Provider);
  Navigation.registerComponent('CP.LaunchScreen', () => LaunchScreen);
}
