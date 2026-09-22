import React, { useEffect, useState } from 'react';
import { NativeModules, Platform, StyleSheet, View } from 'react-native';
import MapView, {
  LatLng,
  Marker,
  Polyline,
  PROVIDER_DEFAULT,
  PROVIDER_GOOGLE,
} from 'react-native-maps';
import Config from 'react-native-superconfig';

const MAP_PROVIDER =
  Platform.OS === 'android' ? PROVIDER_GOOGLE : PROVIDER_DEFAULT;

const GOOGLE_ROUTES_API_KEY = Config.GOOGLE_ROUTES_API_KEY;

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
      if (Platform.OS === 'ios') {
        const result = await AppleDirections.getRoute(
          firstLocation,
          secondLocation,
        );
        setRoute(result.coordinates);
        return;
      }

      setRoute(await loadGoogleRoute(firstLocation, secondLocation));
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

async function loadGoogleRoute(
  origin: LatLng,
  destination: LatLng,
): Promise<LatLng[]> {
  const response = await fetch(
    'https://routes.googleapis.com/directions/v2:computeRoutes',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Goog-Api-Key': GOOGLE_ROUTES_API_KEY,
        'X-Goog-FieldMask': 'routes.polyline.encodedPolyline',
        'X-Android-Package': 'com.rn_on_cloud_ios_simulator',
        'X-Android-Cert':
          '5E:8F:16:06:2E:A3:CD:2C:4A:0D:54:78:76:BA:A6:F3:8C:AB:F6:25',
      },
      body: JSON.stringify({
        origin: {location: {latLng: origin}},
        destination: {location: {latLng: destination}},
        travelMode: 'DRIVE',
      }),
    },
  );

  if (!response.ok) {
    const details = await response.text();
    throw new Error(`Routes request failed (${response.status}): ${details}`);
  }

  const data = await response.json();
  const encoded = data.routes?.[0]?.polyline?.encodedPolyline;
  return encoded ? decodePolyline(encoded) : [];
}

function decodePolyline(encoded: string): LatLng[] {
  const coordinates: LatLng[] = [];
  let index = 0;
  let latitude = 0;
  let longitude = 0;

  while (index < encoded.length) {
    const latitudeResult = decodeValue(encoded, index);
    index = latitudeResult.index;
    latitude += latitudeResult.value;

    const longitudeResult = decodeValue(encoded, index);
    index = longitudeResult.index;
    longitude += longitudeResult.value;

    coordinates.push({
      latitude: latitude / 1e5,
      longitude: longitude / 1e5,
    });
  }

  return coordinates;
}

function decodeValue(encoded: string, start: number) {
  let index = start;
  let result = 0;
  let shift = 0;
  let byte: number;

  do {
    byte = encoded.charCodeAt(index++) - 63;
    result |= (byte & 0x1f) << shift;
    shift += 5;
  } while (byte >= 0x20);

  return {
    index,
    value: result & 1 ? ~(result >> 1) : result >> 1,
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default App;
