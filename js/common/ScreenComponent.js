//@flow
"use strict";

import { Component } from "react";
import {  setNavigator } from "../actions";

type navigatorType = {
  setOnNavigatorEvent: any => any,
  switchToTab: any => any
};

type Props = {
  dispatch: (action: any) => Promise<any>,
  navigator: navigatorType
};

class ScreenComponent extends Component<Props> {
  constructor(props: Props) {
    super(props);

    if (this.props.navigator) {
      this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));
    }
  }

  RNNDidAppear = () => {}
  RNNWillDisappear = () => {}

  onNavigatorEvent(event: any) {
    //console.log(this.constructor.name + ":" + JSON.stringify(event));
    switch(event.id) {
    case "willAppear":
      // this.props.dispatch(setNavigator(this.props.navigator));
      // this.RNNDidAppear();
      break;
    case "didAppear":
      this.props.dispatch(setNavigator(this.props.navigator));
      this.RNNDidAppear();
      break;
    case "willDisappear":
      this.RNNWillDisappear();
      break;
    case "didDisappear":
      break;
    case "willCommitPreview":
      break;
    }
  }
}

declare class React$ScreenComponent<Props, State = void>
  extends React$Component<Props, State> {
  props: Props;
  state: State
}

/* exports ================================================================== */
module.exports = ScreenComponent;

declare module.exports: typeof React$ScreenComponent;
