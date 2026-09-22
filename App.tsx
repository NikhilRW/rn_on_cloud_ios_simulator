import React from 'react';
import {StyleSheet, View} from 'react-native';
import MapView, {Marker, PROVIDER_DEFAULT, PROVIDER_GOOGLE} from 'react-native-maps';

const App = () => {
  return (
    <View style={styles.container}>
      <MapView
        provider={PROVIDER_DEFAULT}
        style={StyleSheet.absoluteFill}
        initialRegion={{
          latitude: 28.481,
          longitude: 77.079,
          latitudeDelta: 0.08,
          longitudeDelta: 0.08,
        }}>
        <Marker
          coordinate={{latitude: 28.495, longitude: 77.088}}
          title="DLF Cyber Hub"
          description="Gurgaon, Haryana"
        />
        <Marker
          coordinate={{latitude: 28.467, longitude: 77.069}}
          title="Kingdom of Dreams"
          description="Gurgaon, Haryana"
        />
      </MapView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default App;
