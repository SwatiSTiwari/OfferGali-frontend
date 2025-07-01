import { View, Text, StyleSheet, Alert } from 'react-native';
import { Link } from 'expo-router';
import { Image } from 'expo-image';
import * as WebBrowser from "expo-web-browser"
import { useEffect, useState } from 'react';
import axios from 'axios';

WebBrowser.maybeCompleteAuthSession()

export default function OnboardingScreen() {
  const [backendStatus, setBackendStatus] = useState<string>('checking');
  const [imageError, setImageError] = useState<boolean>(false);
  const [renderError, setRenderError] = useState<boolean>(false);

  // Safely require assets with error handling
  let logo, mainImage;
  try {
    logo = require('../assets/logo.png');
    mainImage = require('../assets/s.png');
  } catch (error) {
    console.log('Asset loading error:', error);
    setRenderError(true);
  }

  useEffect(() => {
    const checkBackendConnection = async () => {
      try {
        // Check if backend URL is available
        const backendUrl = process.env.EXPO_PUBLIC_BACKEND_API_URL;
        if (!backendUrl) {
          console.log('Backend URL not configured');
          setBackendStatus('not_configured');
          return;
        }

        // Add timeout to prevent hanging
        const axiosConfig = {
          timeout: 5000,
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
        };

        const response = await axios.get(`${backendUrl}/`, axiosConfig);

        if (response.status === 200 && response.data?.message) {
          console.log('Backend Connected', response.data.message);
          setBackendStatus('connected');
        } else {
          console.log('Backend responded but with unexpected data');
          setBackendStatus('connected');
        }
      } catch (error: any) {
        console.log('Backend connection failed:', error.message || 'Unknown error');
        setBackendStatus('disconnected');
        
        // Only log detailed error in development
        if (__DEV__) {
          console.log('Error details:', error);
        }
      }
    };

    // Use a small delay to prevent immediate crash on app start
    const timer = setTimeout(() => {
      checkBackendConnection();
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  // Error fallback component
  if (renderError) {
    return (
      <View style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>⚠️</Text>
          <Text style={styles.errorMessage}>Something went wrong</Text>
          <Text style={styles.errorSubMessage}>Please restart the app</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <View style={styles.logoContainer}>
          {logo ? (
            <Image source={logo} style={styles.logo} />
          ) : (
            <View style={[styles.logo, { backgroundColor: '#f0f0f0', justifyContent: 'center', alignItems: 'center' }]}>
              <Text style={{ fontSize: 20 }}>🏪</Text>
            </View>
          )}
          <Text style={styles.logoText}>
            <Text style={styles.orangeText}>OfferGali</Text>
          </Text>
        </View>
        <Text style={styles.subtitle}>Discover Deals Near You</Text>
      </View>

      <View style={styles.imageContainer}>
        {!imageError ? (
          <Image
            source={mainImage}
            style={styles.mainImage}
            contentFit="contain"
            placeholder="Loading..."
            onError={(error) => {
              console.log('Image loading error:', error);
              setImageError(true);
            }}
          />
        ) : (
          <View style={[styles.mainImage, styles.imageFallback]}>
            <Text style={styles.fallbackText}>📱</Text>
            <Text style={styles.fallbackSubText}>Image not available</Text>
          </View>
        )}
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

      {/* Debug info - remove in production */}
      {__DEV__ && (
        <View style={styles.debugContainer}>
          <Text style={styles.debugText}>Backend: {backendStatus}</Text>
        </View>
      )}
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
    paddingVertical: 10,
    paddingHorizontal: 16,
    fontSize: 14,
    borderRadius: 20,
    textAlign: 'center',
    width: 150, // Made smaller
  },
  debugContainer: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    backgroundColor: 'rgba(0,0,0,0.1)',
    padding: 5,
    borderRadius: 5,
  },
  debugText: {
    fontSize: 12,
    color: '#666',
  },
  imageFallback: {
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
  fallbackText: {
    fontSize: 48,
    marginBottom: 8,
  },
  fallbackSubText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 48,
    marginBottom: 16,
  },
  errorMessage: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FF6F61',
    marginBottom: 8,
  },
  errorSubMessage: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
});
