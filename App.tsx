import React, { useEffect, useState } from 'react';
import { NativeModules, StyleSheet, View } from 'react-native';
import MapView, {
  LatLng,
  Marker,
  Polyline,
  PROVIDER_DEFAULT,
  // PROVIDER_GOOGLE,
} from 'react-native-maps';

// Google Maps version:
// const MAP_PROVIDER = PROVIDER_GOOGLE;
const MAP_PROVIDER = PROVIDER_DEFAULT;

type AppleRoute = {
  coordinates: LatLng[];
  distance: number;
  expectedTravelTime: number;
};

const { AppleDirections } = NativeModules as {
  AppleDirections: {
    getRoute(origin: LatLng, destination: LatLng): Promise<AppleRoute>;
  };
};

const firstLocation = {
  latitude: 28.495,
  longitude: 77.088,
};

const secondLocation = {
  latitude: 28.467,
  longitude: 77.069,
};

const App = () => {
  const [route, setRoute] = useState<LatLng[]>([]);

  useEffect(() => {
    const loadRoute = async () => {
      const result = await AppleDirections.getRoute(
        firstLocation,
        secondLocation,
      );
      setRoute(result.coordinates);
    };

    loadRoute().catch(console.error);
  }, []);

  return (
    <View style={styles.container}>
      <MapView
        provider={MAP_PROVIDER}
        mapType="standard"
        style={StyleSheet.absoluteFill}
        initialRegion={{
          latitude: 28.481,
          longitude: 77.079,
          latitudeDelta: 0.08,
          longitudeDelta: 0.08,
        }}
      >
        <Marker coordinate={firstLocation} title="DLF Cyber Hub" />

        <Marker coordinate={secondLocation} title="Kingdom of Dreams" />

        {route.length > 0 && (
          <Polyline coordinates={route} strokeColor="#2563EB" strokeWidth={5} />
        )}
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
