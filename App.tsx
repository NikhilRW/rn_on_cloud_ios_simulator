import React, {useEffect, useState} from 'react';
import {Platform, StyleSheet, Text, View} from 'react-native';
import MapView, {
  LatLng,
  MapPressEvent,
  Marker,
  Polyline,
  PROVIDER_GOOGLE,
} from 'react-native-maps';

const GOOGLE_ROUTES_API_KEY = 'AIzaSyD_utWRHx4SEusECwY5yq-GyspDkm38fyI';

const App = () => {
  const [locations, setLocations] = useState<LatLng[]>([]);
  const [route, setRoute] = useState<LatLng[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [routeError, setRouteError] = useState<string | null>(null);

  useEffect(() => {
    if (locations.length !== 2) {
      return;
    }

    let isActive = true;

    const loadRoute = async () => {
      setIsLoading(true);
      setRouteError(null);

      try {
        const coordinates = await loadGoogleRoute(locations[0], locations[1]);
        if (isActive) {
          setRoute(coordinates);
        }
      } catch (error) {
        if (isActive) {
          setRouteError(
            error instanceof Error ? error.message : 'Unable to load route',
          );
        }
      } finally {
        if (isActive) {
          setIsLoading(false);
        }
      }
    };

    loadRoute();

    return () => {
      isActive = false;
    };
  }, [locations]);

  const handleMapPress = ({nativeEvent}: MapPressEvent) => {
    setRoute([]);
    setRouteError(null);
    setIsLoading(false);
    setLocations(current =>
      current.length === 2
        ? [nativeEvent.coordinate]
        : [...current, nativeEvent.coordinate],
    );
  };

  const instruction = routeError
    ? 'Could not load the route. Tap to choose a new starting point.'
    : isLoading
      ? 'Loading two-wheeler route...'
      : locations.length === 0
        ? 'Tap the map to choose the starting point'
        : locations.length === 1
          ? 'Tap again to choose the destination'
          : 'Tap anywhere to start a new route';

  return (
    <View style={styles.container}>
      <MapView
        provider={PROVIDER_GOOGLE}
        mapType="standard"
        style={StyleSheet.absoluteFill}
        initialRegion={{
          latitude: 28.481,
          longitude: 77.079,
          latitudeDelta: 0.08,
          longitudeDelta: 0.08,
        }}
        onPress={handleMapPress}>
        {locations.map((location, index) => (
          <Marker
            key={`${index}-${location.latitude}-${location.longitude}`}
            coordinate={location}
            pinColor={index === 0 ? '#16A34A' : '#DC2626'}
            title={index === 0 ? 'Starting point' : 'Destination'}
          />
        ))}

        {route.length > 0 && (
          <Polyline coordinates={route} strokeColor="#2563EB" strokeWidth={5} />
        )}
      </MapView>
      <View style={styles.instruction} pointerEvents="none">
        <Text style={styles.instructionText}>{instruction}</Text>
      </View>
    </View>
  );
};

async function loadGoogleRoute(
  origin: LatLng,
  destination: LatLng,
): Promise<LatLng[]> {
  const applicationHeaders: Record<string, string> =
    Platform.OS === 'android'
      ? {
          'X-Android-Package': 'com.rn_on_cloud_ios_simulator',
          'X-Android-Cert':
            '5E:8F:16:06:2E:A3:CD:2C:4A:0D:54:78:76:BA:A6:F3:8C:AB:F6:25',
        }
      : {
          'X-Ios-Bundle-Identifier':
            'org.reactjs.native.example.rn-on-cloud-ios-simulator',
        };

  const response = await fetch(
    'https://routes.googleapis.com/directions/v2:computeRoutes',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Goog-Api-Key': GOOGLE_ROUTES_API_KEY,
        'X-Goog-FieldMask': 'routes.polyline.encodedPolyline',
        ...applicationHeaders,
      },
      body: JSON.stringify({
        origin: {location: {latLng: origin}},
        destination: {location: {latLng: destination}},
        travelMode: 'TWO_WHEELER',
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
  instruction: {
    position: 'absolute',
    top: 56,
    left: 20,
    right: 20,
    alignItems: 'center',
  },
  instructionText: {
    color: '#FFFFFF',
    backgroundColor: 'rgba(15, 23, 42, 0.88)',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    overflow: 'hidden',
    fontWeight: '600',
    textAlign: 'center',
  },
});

export default App;
