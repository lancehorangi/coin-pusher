"use strict";

import Sound from "react-native-sound";

let _bgm = new Sound(require("./bgm/bgm.mp3"));
_bgm.setNumberOfLoops(-1);

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
