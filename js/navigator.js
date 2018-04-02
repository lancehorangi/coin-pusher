import { Navigation } from "react-native-navigation";

let _modalArray = [];
let _lastActTime = 0;

let _bShowLoginModal = false;
const DelayTime = 100;

function _RealShowLoginModal() {
  _lastActTime = Date.now();
  Navigation.showModal({
    screen: "CP.LoginScreen", // unique ID registered with Navigation.registerScreen
    //title: '游戏', // title of the screen as appears in the nav bar (optional)
    passProps: {}, // simple serializable object that will pass as props to the modal (optional)
    navigatorStyle: { navBarHidden: true }, // override the navigator style for the screen, see "Styling the navigator" below (optional)
    navigatorButtons: {}, // override the nav buttons for the screen, see "Adding buttons to the navigator" below (optional)
    animationType: "slide-up" // 'none' / 'slide-up' , appear animation for the modal (optional, default 'slide-up')
  });
}

export function showLoginModal() {
  if (_bShowLoginModal) {
    return;
  }

  _modalArray = [];
  let diff = Date.now() - _lastActTime;
  if (diff > DelayTime) {
    _lastActTime = Date.now();
    _RealShowLoginModal();
  }
  else {
    setTimeout(_RealShowLoginModal, DelayTime - diff);
  }

  _bShowLoginModal = true;
}

export function hideLoginModal() {
  _bShowLoginModal = false;
  _lastActTime = Date.now();

  //Navigation.dismissAllModals();
  Navigation.dismissModal();
}


export function showModal(screenInfo)
// screen: string,
// title: string,
// passProps: Object,
// navigatorStyle: Object)
{
  if (_bShowLoginModal) {
    return;
  }

  let diff = Date.now() - _lastActTime;

  if (diff > DelayTime) {
    _lastActTime = Date.now();
    Navigation.showModal(
      screenInfo
    );
  }
  else {
    _modalArray.push(screenInfo);

    if (_modalArray.length == 1) {
      setTimeout(doNext, DelayTime - diff);
    }
  }
}

export function dismissModal() {
  if (_bShowLoginModal) {
    return;
  }

  let diff = Date.now() - _lastActTime;

  if (diff > DelayTime) {
    _lastActTime = Date.now();
    //Navigation.dismissAllModals();
    Navigation.dismissModal();
  }
  else {
    _modalArray.push({dismiss:true});

    if (_modalArray.length == 1) {
      setTimeout(doNext, DelayTime - diff + 100);
    }
  }
}

function doNext() {
  if (_modalArray.length == 0) {
    return;
  }

  let screenInfo = _modalArray.shift();

  _lastActTime = Date.now();
  if (screenInfo.dismiss) {
    //Navigation.dismissAllModals();
    Navigation.dismissModal();
  }
  else {
    Navigation.showModal(
      screenInfo
    );
  }

  if (_modalArray.length > 0) {
    setTimeout(doNext, DelayTime);
  }
}
