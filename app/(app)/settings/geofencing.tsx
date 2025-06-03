import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Switch, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';
import MapView, { Circle } from 'react-native-maps';
import Slider from '@react-native-community/slider';
import * as Location from 'expo-location'; // Import Location

export default function GeofencingSetup() {
  const router = useRouter();
  const [isEnabled, setIsEnabled] = useState(false);
  const [radius, setRadius] = useState(2.8); // miles
  const [currentLocation, setCurrentLocation] = useState<{
  latitude: number;
  longitude: number;
  latitudeDelta: number;
  longitudeDelta: number;
} | null>(null);

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'Location permission is required to use this feature.');
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      setCurrentLocation({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.01, // Adjust for a closer view
        longitudeDelta: 0.01, // Adjust for a closer view
      });
    })();
  }, []);

  if (!currentLocation) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading current location...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <FontAwesome name="arrow-left" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>GeoFencing Setup</Text>
        <View style={styles.headerRight} />
      </View>

      <View style={styles.mapContainer}>
        <MapView style={styles.map} initialRegion={currentLocation}>
          {isEnabled && (
            <Circle
              center={currentLocation}
              radius={radius * 1609.34} // Convert miles to meters
              fillColor="rgba(255, 75, 85, 0.1)"
              strokeColor="#FF4B55"
              strokeWidth={1}
            />
          )}
        </MapView>
      </View>

      <View style={styles.settings}>
        <View style={styles.settingItem}>
          <Text style={styles.settingLabel}>Enable Geofencing</Text>
          <Switch
            value={isEnabled}
            onValueChange={setIsEnabled}
            trackColor={{ false: '#767577', true: '#FF4B55' }}
            thumbColor="#fff"
          />
        </View>

        <Text style={styles.subtitle}>Active Location based notifications</Text>

        <View style={styles.radiusContainer}>
          <Text style={styles.settingLabel}>Radius</Text>
          <Text style={styles.radiusValue}>{radius.toFixed(1)} miles</Text>
        </View>

        <Slider
          style={styles.slider}
          minimumValue={1}
          maximumValue={5}
          step={0.1}
          value={radius}
          onValueChange={setRadius}
          minimumTrackTintColor="#FF4B55"
          maximumTrackTintColor="#eee"
          thumbTintColor="#FF4B55"
        />

        <View style={styles.locationContainer}>
          <FontAwesome name="map-marker" size={24} color="#FF4B55" />
          <View style={styles.locationText}>
            <Text style={styles.currentLocation}>Current Location</Text>
            <Text style={styles.locationAddress}>
              Lat: {currentLocation.latitude.toFixed(4)}, Lng: {currentLocation.longitude.toFixed(4)}
            </Text>
          </View>
        </View>
      </View>

      <TouchableOpacity style={styles.saveButton} onPress={() => router.back()}>
        <Text style={styles.saveButtonText}>Save Settings</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingTop: 60,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  headerRight: {
    width: 24,
  },
  mapContainer: {
    height: 300,
    marginBottom: 20,
  },
  map: {
    flex: 1,
  },
  settings: {
    padding: 20,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  settingLabel: {
    fontSize: 16,
    fontWeight: '600',
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 20,
  },
  radiusContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  radiusValue: {
    fontSize: 16,
    color: '#FF4B55',
    fontWeight: '600',
  },
  slider: {
    width: '100%',
    height: 40,
    marginBottom: 30,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
  },
  locationText: {
    marginLeft: 15,
  },
  currentLocation: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 5,
  },
  locationAddress: {
    fontSize: 14,
    color: '#666',
  },
  saveButton: {
    margin: 20,
    backgroundColor: '#FF4B55',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
