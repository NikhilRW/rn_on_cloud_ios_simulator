import React from 'react';
import {StatusBar, StyleSheet, Text, View} from 'react-native';

const App = () => (
  <View style={styles.screen}>
    <StatusBar hidden />
    <View style={styles.headline}>
      <Text style={styles.line}>RUN IOS Apps</Text>
      <Text style={styles.line}>WITHOUT</Text>
      <Text style={styles.line}>Any 🍎 Devices Really</Text>
    </View>
  </View>
);

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 28,
    paddingTop: 72,
    paddingBottom: 48,
  },
  eyebrow: {
    color: '#8A8A8A',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 3,
  },
  headline: {
    alignSelf: 'center',
    width: '100%',
  },
  line: {
    color: '#FFFFFF',
    fontSize: 42,
    fontWeight: '900',
    letterSpacing: -1.5,
    lineHeight: 48,
    textAlign: 'center',
    color:"black"
  },
  accentLine: {
    color: '#A3FF5F',
    fontSize: 56,
    fontWeight: '900',
    letterSpacing: -2,
    lineHeight: 62,
      textAlign: 'center',
  },
  footer: {
    color: '#8A8A8A',
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 2,
    textAlign: 'center',
  },
});

export default App;
