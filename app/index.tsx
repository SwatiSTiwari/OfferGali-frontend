import { View, Text, StyleSheet, Alert } from 'react-native';
import { Link } from 'expo-router';
import { Image } from 'expo-image';
import * as WebBrowser from "expo-web-browser"
import { useEffect } from 'react';
import axios from 'axios';

WebBrowser.maybeCompleteAuthSession()

export default function OnboardingScreen() {
  const logo = require('../assets/logo.png');

  useEffect(() => {
    const checkBackendConnection = async () => {
      try {
        const response = await axios.get('http://192.168.0.102:3000/');

        if (response.status === 200 && response.data?.message) {
          console.log('Backend Connected', response.data.message);
        } else {
          console.log('Backend Error', 'Unexpected response from backend.');
          console.log('Possibility->', 'The IP of your device is incorrect please check it and update');
        }
      } catch (error: any) {
        console.log('Backend Not Reachable', error.message || 'Could not connect to backend.');
      }
    };
    checkBackendConnection();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <View style={styles.logoContainer}>
          <Image source={logo} style={styles.logo} />
          <Text style={styles.logoText}>
            <Text style={styles.orangeText}>OfferGali</Text>
          </Text>
        </View>
        <Text style={styles.subtitle}>Discover Deals Near You</Text>
      </View>

      <View style={styles.imageContainer}>
        <Image
          source={require('../assets/s.png')} // Replace with your shopping/deals illustration
          style={styles.mainImage}
          contentFit="contain"
        />
      </View>

      {/* Buttons Side by Side */}
      <View style={styles.buttonContainer}>
        <Link href="/(auth)/register" asChild>
          <Text style={styles.button}>Get Started as Customer</Text>
        </Link>

        <Link href="/(retailer)/register" asChild>
          <Text style={styles.button}>Get Started as Retailer</Text>
        </Link>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    padding: 16,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerContainer: {
    alignItems: 'center',
    marginTop: 60,
  },
  logoContainer: {
    flexDirection: 'row', // Align logo and text horizontally
    alignItems: 'center',
  },
  logo: {
    width: 75,
    height: 50,
  },
  logoText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'black',
    marginLeft: -2, // Adjusts text closer to logo
  },
  orangeText: {
    color: '#FF6F61',
  },
  subtitle: {
    fontSize: 16,
    color: '#333',
    fontWeight: 'bold',
    marginTop: 8,
  },
  imageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mainImage: {
    width: 250,
    height: 250,
  },
  buttonContainer: {
    flexDirection: 'row', // Places buttons side by side
    justifyContent: 'space-evenly', // Distributes them evenly
    width: '100%', // Ensures full width
    gap: 6, // Adds space between buttons
    marginBottom: 40
  },
  button: {
    backgroundColor: '#FF6F61',
    color: 'white',
    fontWeight: 'bold',
    paddingVertical: 12,
    paddingHorizontal: 20,
    fontSize: 16,
    borderRadius: 25,
    textAlign: 'center',
    width: 180, // Adjusted for better spacing
  },
});
