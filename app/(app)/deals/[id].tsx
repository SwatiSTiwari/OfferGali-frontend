import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';

export default function DealDetails() {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  // Mock deal data - replace with actual API call
  const deal = {
    id,
    title: '50% Off Premium Coffee Bundle',
    price: '₹250',
    originalPrice: '₹500',
    validUntil: 'May 15, 2025',
    description: 'Get our premium coffee bundle at half price. Includes 2 jars of single origin coffee beans, a premium coffee grinder, and our signature coffee mug.',
    image: '',
    terms: [
      'Limited to one redemption per customer',
      'Cannot be combined with other offers',
      'Valid until May 15, 2025',
      'No cash value'
    ],
    howToRedeem: [
      'Click the "Redeem" button below',
      'Show the updated code at checkout',
      'Complete your purchase with savings'
    ]
  };

  return (
    <View style={styles.container}>
      <ScrollView>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <FontAwesome name="arrow-left" size={20} color="#333" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Deal Details</Text>
          <TouchableOpacity>
            <FontAwesome name="bell" size={20} color="#333" />
          </TouchableOpacity>
        </View>

        <Image
          source={{ uri: deal.image }}
          style={styles.image}
        />

        <View style={styles.content}>
          <Text style={styles.title}>{deal.title}</Text>
          
          <View style={styles.priceContainer}>
            <Text style={styles.price}>{deal.price}</Text>
            <Text style={styles.originalPrice}>{deal.originalPrice}</Text>
          </View>

          <Text style={styles.validUntil}>Valid until: {deal.validUntil}</Text>

          <Text style={styles.description}>{deal.description}</Text>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>How to Redeem?</Text>
            {deal.howToRedeem.map((step, index) => (
              <View key={index} style={styles.bulletPoint}>
                <Text style={styles.bulletNumber}>{index + 1}.</Text>
                <Text style={styles.bulletText}>{step}</Text>
              </View>
            ))}
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Terms & Conditions</Text>
            {deal.terms.map((term, index) => (
              <View key={index} style={styles.bulletPoint}>
                <Text style={styles.bullet}>•</Text>
                <Text style={styles.bulletText}>{term}</Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.saveButton}>
          <Text style={styles.saveButtonText}>Save for Later</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.redeemButton}>
          <Text style={styles.redeemButtonText}>Redeem Now</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingTop: 60,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  image: {
    width: '100%',
    height: 300,
    resizeMode: 'cover',
  },
  content: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  price: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FF4B55',
    marginRight: 10,
  },
  originalPrice: {
    fontSize: 20,
    color: '#666',
    textDecorationLine: 'line-through',
  },
  validUntil: {
    fontSize: 14,
    color: '#666',
    marginBottom: 20,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 20,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 10,
  },
  bulletPoint: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  bullet: {
    marginRight: 8,
    fontSize: 16,
  },
  bulletNumber: {
    marginRight: 8,
    fontSize: 16,
    fontWeight: '500',
  },
  bulletText: {
    flex: 1,
    fontSize: 16,
  },
  footer: {
    flexDirection: 'row',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  saveButton: {
    flex: 1,
    backgroundColor: '#fff',
    paddingVertical: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#FF4B55',
    marginRight: 10,
  },
  saveButtonText: {
    color: '#FF4B55',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '600',
  },
  redeemButton: {
    flex: 1,
    backgroundColor: '#FF4B55',
    paddingVertical: 15,
    borderRadius: 8,
  },
  redeemButtonText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '600',
  },
});



