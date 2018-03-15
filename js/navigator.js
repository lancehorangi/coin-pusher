import { Navigation } from 'react-native-navigation';

let _modalArray = [];
let _lastShowTime = 0;

export function showModal(
                  screen: string,
                  title: string,
                  passProps: Object,
                  navigatorStyle: Object)
{
    var found = _modalArray.find(function(element) {
      return element === screen;
    });

    if (!found) {
      _lastShowTime = Date.now();
      _modalArray.push(screen);
      Navigation.showModal({
        screen,
        title,
        passProps,
        navigatorStyle,
        navigatorButtons: {}, // override the nav buttons for the screen, see "Adding buttons to the navigator" below (optional)
        animationType: 'slide-up' // 'none' / 'slide-up' , appear animation for the modal (optional, default 'slide-up')
      });
    }
}

export function dismissModal() {
  if (_modalArray.length > 0) {
    let diff = Date.now() - _lastShowTime;
    if (diff > 1500) {
      Navigation.dismissAllModals();
      _modalArray = [];
    }
    else {
      setTimeout(dismissModal, 1500 - diff + 100);
    }
  }
}
