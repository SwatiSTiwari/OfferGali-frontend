import { View, Text, StyleSheet } from 'react-native';
import { Link } from 'expo-router';
import { Image } from 'expo-image';

export default function OnboardingScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>OfferGali</Text>
      <Text style={styles.subtitle}>Discover Deals Near you</Text>

      <Image
        source={require('../assets/t.png')}
        style={styles.image}
        contentFit="contain"
      />
      <Text style={styles.text}>Personalize your deals</Text>

      <Image
        source={require('../assets/w.png')}
        style={styles.image}
        contentFit="contain"
      />
      <Text style={styles.text}>Find nearby offers</Text>

      <Image
        source={require('../assets/s.png')}
        style={styles.image}
        contentFit="contain"
      />
      <Text style={styles.text}>Save and enjoy!</Text>

      <View style={styles.buttonContainer}>
        <Link href="/(auth)/register" asChild>
          <Text style={styles.button}>Get Started as customer </Text>
        </Link>
      </View>

      <View style={styles.buttonContainer}>
        <Link href="/(retailer)/register" asChild>
          <Text style={styles.button}>Get Started as retailer</Text>
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
    justifyContent: 'space-between', // Ensures even spacing with button visible
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 16,
    color: 'gray',
    textAlign: 'center',
  },
  image: {
    width: 100,
    height: 100,
  },
  text: {
    fontSize: 16,
    textAlign: 'center',
  },
  buttonContainer: {
    width: '100%',
    alignItems: 'center',
  },
  button: {
    backgroundColor: '#FF6F61', // Fixed missing hash for color
    color: 'white',
    fontWeight: 'bold',
    paddingVertical: 12,
    paddingHorizontal: 24,
    fontSize: 16,
    borderRadius: 25,
    textAlign: 'center',
  },
});
