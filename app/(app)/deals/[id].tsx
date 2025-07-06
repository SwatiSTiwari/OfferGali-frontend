import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';
import { getDealsById } from '@/api/deals/deals'; // Make sure to import the function
import { useSavedDeals } from '@/contexts/SavedDealsContext';

export default function DealDetails() {
  const { id } = useLocalSearchParams(); 
  const router = useRouter();
  const [deal, setDeal] = useState<any>(null);  // State to store the fetched deal
  const [loading, setLoading] = useState(true);  // Loading state for fetching data
  const { saveDeals, isDealSaved } = useSavedDeals();

  useEffect(() => {
    const fetchDealDetails = async () => {
      setLoading(true);  // Set loading to true while fetching data
      const response = await getDealsById(Array.isArray(id) ? id[0] : id);  // Ensure id is a string
        
      if (response.success) {
        setDeal(response.data.deal);  // Set the deal data in the state
      } else {
        Alert.alert('Error', response.message || 'Failed to load deal details');
      }
      setLoading(false);  // Set loading to false after fetching data
    };

    fetchDealDetails();  // Fetch the deal details when the component mounts
  }, [id]);  // Fetch when the `id` changes (i.e., when navigating to this screen)

  const handleSaveDeal = async () => {
    if (!deal) return;
    
    try {
      const savedDeal = {
        id: deal.id,
        title: deal.title,
        description: deal.description,
        category: deal.category || 'General',
        expiration_date: deal.expiration_date,
        redemption_instructions: deal.redemption_instructions,
        retailer_id: deal.retailer_id,
        price: deal.price,
        original_price: deal.original_price,
        image: deal.image,
        savedAt: new Date().toISOString(),
      };

      await saveDeals(savedDeal);
      
      Alert.alert(
        'Success',
        'Deal saved successfully!',
        [
          { text: 'OK' },
          { text: 'View Saved', onPress: () => router.push('/(app)/saved') }
        ]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to save deal. Please try again.');
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Loading deal details...</Text>
      </View>
    );
  }

  if (!deal) {
    return (
      <View style={styles.container}>
        <Text>No deal data available.</Text>
      </View>
    );
  }

  const dealAlreadySaved = isDealSaved(deal.id);

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
        source={
          deal.image
            ? typeof deal.image === "string"
              ? { uri: deal.image }
              : require('../../../assets/spa.png')
            : require('../../../assets/spa.png')
        }
        style={styles.image}
      />

        <View style={styles.content}>
          <Text style={styles.title}>{deal.title}</Text>
          
          <View style={styles.priceContainer}>
            <Text style={styles.price}>₹{deal.price}</Text>
            <Text style={styles.originalPrice}>₹{deal.original_price}</Text>
          </View>

          <Text style={styles.validUntil}>Valid until: {new Date(deal.expiration_date).toLocaleDateString()}</Text>

          <Text style={styles.description}>{deal.description}</Text>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>How to Redeem?</Text>
            {/* Here you can add a list of redemption steps if provided */}
            <View style={styles.bulletPoint}>
              <Text style={styles.bulletNumber}>1.</Text>
              <Text style={styles.bulletText}>Click the "Redeem" button below</Text>
            </View>
            <View style={styles.bulletPoint}>
              <Text style={styles.bulletNumber}>2.</Text>
              <Text style={styles.bulletText}>Show the updated code at checkout</Text>
            </View>
            <View style={styles.bulletPoint}>
              <Text style={styles.bulletNumber}>3.</Text>
              <Text style={styles.bulletText}>Complete your purchase with savings</Text>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Terms & Conditions</Text>
            <View style={styles.bulletPoint}>
              <Text style={styles.bullet}>•</Text>
              <Text style={styles.bulletText}>Limited to one redemption per customer</Text>
            </View>
            <View style={styles.bulletPoint}>
              <Text style={styles.bullet}>•</Text>
              <Text style={styles.bulletText}>Cannot be combined with other offers</Text>
            </View>
            <View style={styles.bulletPoint}>
              <Text style={styles.bullet}>•</Text>
              <Text style={styles.bulletText}>Valid until {new Date(deal.expiration_date).toLocaleDateString()}</Text>
            </View>
            <View style={styles.bulletPoint}>
              <Text style={styles.bullet}>•</Text>
              <Text style={styles.bulletText}>No cash value</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity 
          style={[styles.saveButton, dealAlreadySaved && styles.savedButton]} 
          onPress={handleSaveDeal}
          disabled={dealAlreadySaved}
        >
          <Text style={[styles.saveButtonText, dealAlreadySaved && styles.savedButtonText]}>
            {dealAlreadySaved ? 'Already Saved' : 'Save for Later'}
          </Text>
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
  savedButton: {
    backgroundColor: '#f0f0f0',
    borderColor: '#ccc',
  },
  savedButtonText: {
    color: '#666',
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



