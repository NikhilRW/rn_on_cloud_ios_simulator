import React from 'react';
import {StatusBar, StyleSheet, Text, View} from 'react-native';

const App = () => (
  <View style={styles.screen}>
    <StatusBar hidden />

    <Text style={styles.eyebrow}>REACT NATIVE · iOS SIMULATOR</Text>

    <View style={styles.headline}>
      <Text style={styles.line}>RUNNING APPS</Text>
      <Text style={styles.line}>WITHOUT A</Text>
      <Text style={styles.accentLine}>MACBOOK.</Text>
      <Text style={styles.accentLine}>IPHONE.</Text>
    </View>

    <Text style={styles.footer}>YOUR APP. RUNNING ON iOS. FROM ANYWHERE.</Text>
  </View>
);

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#000000',
    justifyContent: 'space-between',
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
  },
  accentLine: {
    color: '#A3FF5F',
    fontSize: 56,
    fontWeight: '900',
    letterSpacing: -2,
    lineHeight: 62,
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
