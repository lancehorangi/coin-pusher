//@flow
"use strict";

import {
  StyleSheet,
  View,
} from "react-native";
import React, { Component } from "react";
import ProfitAnimation from "./ProfitAnimation";

type Props = {
  style: ?Object
};

type States = {
  list: Array<Object>,
  id: number
};


class ProfitAnimationMgr extends Component<Props, States> {
    state = {
      list: [],
      id: 1
    };

    constructor(props: Object) {
      super(props);
    }

    componentDidMount() {

    }

    addInfo = async (count: number): any => {
      let {id, list} = this.state;
      id += 1;
      list.push({count, id});
      await this.setState({list, id});
      console.log("ProfitAnimationMgr addInfo:" + JSON.stringify(list));
    }

    removeInfo = async (): any => {
      let {list} = this.state;
      list.shift();
      await this.setState({list});
      console.log("ProfitAnimationMgr removeInfo:" + JSON.stringify(list));
    }

    renderInfo = (): Component => {
      let {list} = this.state;
      return list.map((item: Object): Component => {
        return (
          <ProfitAnimation
            count={item.count}
            id={item.id}
            key={item.id}
            onFinish={this.removeInfo}
          />
        );
      });
    }

    render (): Component {
      return (
        <View
          style={[styles.container, this.props.style]}>
          {this.renderInfo()}
        </View>
      );
    }
}

const styles = StyleSheet.create({
  container: {
    flex: 0,
    //width: "100%",
    //justifyContent: "space-between",
    alignContent: "center",
    alignItems: "center",
    // backgroundColor: "#ee494388",
    // height: 80
    //paddingHorizontal: 10,
    //flexDirection: "row",
  }
});

module.exports = ProfitAnimationMgr;
