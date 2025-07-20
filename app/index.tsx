import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Link, router } from 'expo-router';
import { Image } from 'expo-image';
import * as WebBrowser from "expo-web-browser"
import { useEffect } from 'react';
import axios from 'axios';
import * as Notifications from 'expo-notifications';
import { FontAwesome } from '@expo/vector-icons';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true, // Show banner
    shouldPlaySound: true, // Play sound
    shouldSetBadge: false,
  }),
});

WebBrowser.maybeCompleteAuthSession()

export default function OnboardingScreen() {
  const logo = require('../assets/logo1.svg'); // Ensure the logo is in SVG format

useEffect(() => {
  const subscription = Notifications.addNotificationReceivedListener(notification => {
    // Handle notification received in foreground
    console.log('Notification received');
  });

  return () => subscription.remove();
}, []);

  useEffect(() => {
    const checkBackendConnection = async () => {
      try {
        console.log(`${process.env.EXPO_PUBLIC_BACKEND_API_URL}/`)
        const response = await axios.get(`${process.env.EXPO_PUBLIC_BACKEND_API_URL}/`);
        if (response.status === 200 && response.data?.message) {
          console.log('Backend Connected', response.data.message);
        } 
      } catch (error: any) {
        console.log(error)
        console.log('Backend Not Reachable', error.message || 'Could not connect to backend.');
        console.log('Backend Error', 'Unexpected response from backend.');
        console.log('Possibility->', 'The IP of your device is incorrect please check it and update');
      }
    };
    checkBackendConnection();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        {/* <View style={styles.topBar}>
          <TouchableOpacity 
            style={styles.feedbackButton}
            onPress={() => router.push('/(app)/feedback')}
          >
            <FontAwesome name="comment" size={20} color="#FF6F61" />
            <Text style={styles.feedbackButtonText}>Feedback</Text>
          </TouchableOpacity>
        </View> */}
        <View style={styles.logoContainer}>
          {/* <Image source={logo} style={styles.logo} /> */}
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
  topBar: {
    width: '100%',
    alignItems: 'flex-end',
    marginBottom: 20,
  },
  feedbackButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#FF6F61',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  feedbackButtonText: {
    color: '#FF6F61',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 6,
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
    width: 150, // Made smaller for better visual balance
  },
});
