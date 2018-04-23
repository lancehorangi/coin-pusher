"use strict";

import Sound from "react-native-sound";

//let _bgm = new Sound(require("./bgm/bgm.mp3"));
let _bgm = new Sound("bgm.mp3", Sound.MAIN_BUNDLE, (error) => {
  if (error) {
    console.log("PlayBGM failed to load the sound", error);
    return;
  }
  // loaded successfully
  console.log("PlayBGM duration in seconds: " + _bgm.getDuration() + "number of channels: " + _bgm.getNumberOfChannels());
});
_bgm.setNumberOfLoops(99999);

export function PlayBGM() {
  if (_bgm) {
    _bgm.stop();
    _bgm.play((success) => {
      if (success) {
        console.log("PlayBGM successfully finished playing");
      } else {
        console.log("PlayBGM playback failed due to audio decoding errors");
        _bgm.reset();
      }
    });
  }
}

export function StopBGM() {
  _bgm.stop();
}

let _coinSound = new Sound("insertCoin.wav", Sound.MAIN_BUNDLE);
_coinSound.setNumberOfLoops(1);

export function PlayCoinSound() {
  if (_coinSound) {
    _coinSound.play();
  }
}

let _getCoinSound = new Sound("collectCoin.wav", Sound.MAIN_BUNDLE);
_getCoinSound.setNumberOfLoops(1);

export function PlayGetCoinSound() {
  if (_getCoinSound) {
    _getCoinSound.play();
  }
}
