import { Navigation } from "react-native-navigation";

let _modalArray = [];

let _bShowLoginModal = false;
const DelayTime = 100;

setInterval(tick, DelayTime);

// function _RealShowLoginModal() {
//   _lastActTime = Date.now();
//   Navigation.showModal({
//     screen: "CP.LoginScreen", // unique ID registered with Navigation.registerScreen
//     //title: '游戏', // title of the screen as appears in the nav bar (optional)
//     passProps: {}, // simple serializable object that will pass as props to the modal (optional)
//     navigatorStyle: { navBarHidden: true }, // override the navigator style for the screen, see "Styling the navigator" below (optional)
//     navigatorButtons: {}, // override the nav buttons for the screen, see "Adding buttons to the navigator" below (optional)
//     animationType: "slide-up" // 'none' / 'slide-up' , appear animation for the modal (optional, default 'slide-up')
//   });
// }

export function showLoginModal() {
  if (_bShowLoginModal) {
    return;
  }

  _modalArray = [];
  _modalArray.push({dismiss:true});
  _modalArray.push({
    screen: "CP.LoginScreen", // unique ID registered with Navigation.registerScreen
    //title: '游戏', // title of the screen as appears in the nav bar (optional)
    passProps: {}, // simple serializable object that will pass as props to the modal (optional)
    navigatorStyle: { navBarHidden: true }, // override the navigator style for the screen, see "Styling the navigator" below (optional)
    navigatorButtons: {}, // override the nav buttons for the screen, see "Adding buttons to the navigator" below (optional)
    animationType: "none" // 'none' / 'slide-up' , appear animation for the modal (optional, default 'slide-up')
  });

  _bShowLoginModal = true;
}

export function hideLoginModal() {
  _bShowLoginModal = false;
  dismissModal();
}


export function showModal(screenInfo)
{
  if (_bShowLoginModal) {
    return;
  }

  _modalArray.push({dismiss:true});
  _modalArray.push(screenInfo);
}

export function dismissModal() {
  if (_bShowLoginModal) {
    return;
  }

  _modalArray.push({dismiss:true});
}

function tick() {
  if (_modalArray.length == 0) {
    return;
  }

  let screenInfo = _modalArray.shift();
  console.log("Navigator tick:" + JSON.stringify(screenInfo));
  if (screenInfo.dismiss) {
    Navigation.dismissModal({
      animationType: "none"
    });
  }
  else {
    console.log("Navigator showModal");
    Navigation.showModal(
      screenInfo
    );
  }
}
