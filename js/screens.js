import { Navigation } from 'react-native-navigation';

import LaunchScreen from './common/LaunchScreen';

// register all screens of the app (including internal ones)
export function registerScreens() {
  Navigation.registerComponent('CP.LaunchScreen', () => LaunchScreen);
}
