import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import MapView, {
  LatLng,
  Marker,
  Polyline,
  PROVIDER_GOOGLE,
} from 'react-native-maps';

const cyberHub = {
  latitude: 28.495,
  longitude: 77.088,
};

const kingdomOfDreams = {
  latitude: 28.467,
  longitude: 77.069,
};

const App = () => {
  const [route, setRoute] = useState<LatLng[]>([]);

  useEffect(() => {
    const loadRoute = async () => {
      const response = await fetch(
        'https://routes.googleapis.com/directions/v2:computeRoutes',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Goog-Api-Key': 'AIzaSyAOVYRIgupAurZup5y1PRh8Ismb1A3lLao',
            'X-Goog-FieldMask': 'routes.polyline.encodedPolyline',
          },
          body: JSON.stringify({
            origin: {
              location: {
                latLng: {
                  latitude: cyberHub.latitude,
                  longitude: cyberHub.longitude,
                },
              },
            },
            destination: {
              location: {
                latLng: {
                  latitude: kingdomOfDreams.latitude,
                  longitude: kingdomOfDreams.longitude,
                },
              },
            },
            travelMode: 'DRIVE',
          }),
        },
      );

      if (!response.ok) {
        throw new Error(`Routes request failed: ${response.status}`);
      }

      const data = await response.json();
      const encoded = data.routes?.[0]?.polyline?.encodedPolyline;

      if (encoded) {
        setRoute(decodePolyline(encoded));
      }
    };

    loadRoute().catch(console.error);
  }, []);

  return (
    <View style={styles.container}>
      <MapView
        provider={PROVIDER_GOOGLE}
        style={StyleSheet.absoluteFill}
        initialRegion={{
          latitude: 28.481,
          longitude: 77.079,
          latitudeDelta: 0.08,
          longitudeDelta: 0.08,
        }}
      >
        <Marker coordinate={cyberHub} title="DLF Cyber Hub" />

        <Marker coordinate={kingdomOfDreams} title="Kingdom of Dreams" />

        {route.length > 0 && (
          <Polyline coordinates={route} strokeColor="#2563EB" strokeWidth={5} />
        )}
      </MapView>
    </View>
  );
};

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
