import React from 'react';
import {StyleSheet, View, Text, Dimensions, Button} from 'react-native';

class Notification extends React.Component {

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>{this.props.text}</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    height: 50,
    width: 200,
    backgroundColor: 'blue',
    padding: 16,
    margin: 20,
  },
  title: {
    fontSize: 13,
    textAlign: 'center',
  },
  content: {
    textAlign: 'center',
    marginTop: 10,
  },
});

export default Notification;
