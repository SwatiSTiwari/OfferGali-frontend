import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Image, ActivityIndicator, Alert } from 'react-native';
import { Link } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';
import * as Location from 'expo-location';
import { fetchNearbyDeals } from '@/api/deals/deals';
import BottomNavUser from '@/app/(auth)/bottomnavuser';
import { registerForPushNotificationsAsync } from '@/utils/notifications';
import { useSavedDeals } from '@/contexts/SavedDealsContext';

const categories = [
  { id: 1, name: 'All Deals'},
  { id: 2, name: 'Clothing'},
  { id: 3, name: 'Groceries'},
  { id: 4, name: 'Beauty Products'},
  { id: 5, name: 'Sports & Fitness'},
  { id: 6, name: 'Home & Furniture'},
  { id: 7, name: 'Toys & Baby products'},
  { id: 8, name: 'Books & Stationery'},
  { id: 9, name: 'Electronics'},
];

const shopCategories = [
  {
    id: 1,
    name: 'Electronics',
    image: require('../../assets/bg.png'),
    backgroundColor: '#E8F5E9',
  },
  {
    id: 2,
    name: 'Groceries',
    image: require('../../assets/bg1.png'),
    backgroundColor: '#FCE4EC',
  },
];

export default function Home() {
 useEffect(() => {
    registerForPushNotificationsAsync();
  }, []);

  interface NearbyDeal {
    id: any;
    title: string;
    price: number;
    original_price: number;
    distance: string;
    category: string;
    image: string;
    expiration_date: string | number | Date;
    retailer_name: string;
    description?: string;
    retailer_id?: string;
  }

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Deals');
  const [nearbyDeals, setNearbyDeals] = useState<NearbyDeal[]>([]);
  const [loading, setLoading] = useState(true);
  const [userLocation, setUserLocation] = useState<Location.LocationObjectCoords | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [filteredDeals, setFilteredDeals] = useState<NearbyDeal[]>([]);
  const { saveDeals, isDealSaved } = useSavedDeals();
  
  const logo = require('../../assets/logo.png');

  const handleSaveDeal = async (deal: NearbyDeal, event: any) => {
    event.preventDefault(); // Prevent navigation when tapping save button
    
    try {
      const savedDeal = {
        id: deal.id.toString(),
        title: deal.title,
        description: deal.description || 'Great deal available!',
        category: deal.category || 'General',
        expiration_date: new Date(deal.expiration_date).toISOString(),
        redemption_instructions: '',
        retailer_id: deal.retailer_id || '',
        price: deal.price.toString(),
        original_price: deal.original_price.toString(),
        image: deal.image,
        savedAt: new Date().toISOString(),
      };

      await saveDeals(savedDeal);
      Alert.alert('Success', 'Deal saved successfully!');
    } catch (error) {
      Alert.alert('Error', 'Failed to save deal. Please try again.');
    }
  };

  const getNearbyDeals = async () => {
    // Get user's location
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      setErrorMsg('Permission to access location was denied');
      return;
    }

    let location = await Location.getCurrentPositionAsync({});
    setUserLocation(location.coords);

    if (!location.coords) {
      console.log('Unable to get user location');
      setErrorMsg('Unable to get user location');
      return;
    }

    // Fetch nearby deals using the location.coords directly
    const result = await fetchNearbyDeals({ latitude: location.coords.latitude, longitude: location.coords.longitude });
    if (result.success) {
      // If no deals returned, use mock data for testing
      if (result.data.deals && result.data.deals.length === 0) {
        console.log('No deals found, using mock data for testing');
        // setNearbyDeals([
        //   {
        //     deal_id: 1,
        //     title: '50% Off Pizza',
        //     retailer_name: 'Pizza Palace',
        //     price: 10.99,
        //     original_price: 21.98,
        //     distance: '0.5 miles',
        //     endsToday: false,
        //   },
        //   {
        //     deal_id: 2,
        //     title: 'Buy 1 Get 1 Free Coffee',
        //     retailer_name: 'Coffee Corner',
        //     price: 4.50,
        //     original_price: 9.00,
        //     distance: '1.2 miles',
        //     endsToday: true,
        //   },
        // ]);
      } else {
        setNearbyDeals(result.data.deals);
        setFilteredDeals(result.data.deals);
      }
    } else {
      setErrorMsg(result.message);
    }
    setLoading(false);
  }
  useEffect(() => {
    getNearbyDeals();
  }, []);

  useEffect(() => {
  filterDeals();
}, [nearbyDeals, searchQuery, selectedCategory]);

  // Helper function to parse PostGIS location string
  // const parsePostGISLocation = (locationString) => {
  //   try {
  //     // Simplified parsing - in a real app, use a proper GIS library
  //     const pattern = /POINT\((-?\d+\.?\d*) (-?\d+\.?\d*)\)/i;
  //     const match = locationString.match(pattern);
  //     if (match) {
  //       return { lng: parseFloat(match[1]), lat: parseFloat(match[2]) };
  //     }
  //     // Fallback parsing for the binary format
  //     return { lat: 37.7749, lng: -122.4194 }; // Default to San Francisco if parsing fails
  //   } catch (error) {
  //     console.error("Error parsing location:", error);
  //     return { lat: 37.7749, lng: -122.4194 };
  //   }
  // };

  // Check if deal is ending today
  // const isEndingToday = (expiresAt) => {
  //   if (!expiresAt) return false;

  //   const today = new Date();
  //   const expiryDate = new Date(expiresAt);

  //   return (
  //     today.getDate() === expiryDate.getDate() &&
  //     today.getMonth() === expiryDate.getMonth() &&
  //     today.getFullYear() === expiryDate.getFullYear()
  //   );
  // };

  // Calculate discount percentage
  const calculateDiscount = (originalPrice: number, currentPrice: number) => {
    if (!originalPrice || !currentPrice || originalPrice <= currentPrice) return null;
    const discount = ((originalPrice - currentPrice) / originalPrice) * 100;
    return `${Math.round(discount)}% Off`;
  };

  const filterDeals = () => {
  let deals = nearbyDeals;

  // Filter by category (if not "All Deals")
  if (selectedCategory !== "All Deals") {
    deals = deals.filter(deal =>
      deal.category?.toLowerCase() === selectedCategory.toLowerCase()
    );
  }

  // Filter by search query (title)
  if (searchQuery.trim() !== "") {
    deals = deals.filter(deal =>
      deal.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }

  setFilteredDeals(deals);
};

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Image source={logo} style={styles.logo} />
          <Text style={styles.headerTitle}>Nearby Deals</Text>
        </View>
        <View style={styles.headerLeft}>
        <Link href={{
            pathname: "/(app)/feedback",
            params: { role: "user" }, // add your props here
           }} asChild>
          <TouchableOpacity style={{alignItems: 'center'}}>
            <FontAwesome name="comment" size={24} color="#FF6F61" />
          </TouchableOpacity>
        </Link>
        <Link href="/(app)/notifications" asChild>
          <TouchableOpacity style={{alignItems: 'center'}}>
            <FontAwesome name="bell" size={24} color="#666" />
          </TouchableOpacity>
        </Link>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.searchContainer}>
          <FontAwesome name="search" size={20} color="#666" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search deals nearby..."
            placeholderTextColor="#666"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.categoriesScroll}
          contentContainerStyle={styles.categoriesContainer}
        >
          {categories.map((category) => (
            <TouchableOpacity
              key={category.id}
              style={[
                styles.categoryChip,
                selectedCategory === category.name && styles.categoryChipSelected,
              ]}
              onPress={() => setSelectedCategory(category.name)}
            >
              <Text style={[
                styles.categoryChipText,
                selectedCategory === category.name && styles.categoryChipTextSelected,
              ]}>
                {category.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Nearby Deals Section */}
        <View style={styles.spaDealsContainer}>
          <Text style={styles.sectionTitle}>Nearby Deals</Text>
          <Text style={styles.sectionSubtitle}>Special offers close to you</Text>
          
          <View style={styles.dealsGrid}>
            {filteredDeals.map((deal, index) => (
              <Link href={`/deals/${deal.id}`} key={deal.id} asChild>
                <TouchableOpacity style={styles.spaDealCard}>
                  <TouchableOpacity 
                    style={styles.heartButton}
                    onPress={(event) => handleSaveDeal(deal, event)}
                  >
                    <FontAwesome 
                      name={isDealSaved(deal.id.toString()) ? "heart" : "heart-o"} 
                      size={16} 
                      color="#FF6F61" 
                    />
                  </TouchableOpacity>
                  <Image
                    source={
                      deal.image && typeof deal.image === 'string'? {uri: deal.image} : require('../../assets/spa.png')
                    }
                    style={styles.spaDealImage}
                    />
                  <View style={styles.spaDealOverlay}>
                    {calculateDiscount(deal.original_price, deal.price) && (
                      <Text style={styles.spaDealDiscount}>
                        {calculateDiscount(deal.original_price, deal.price)}
                      </Text>
                    )}
                  </View>
                  <View style={styles.spaDealInfo}>
                    <View style={styles.spaDealMeta}>
                      <View style={styles.spaDealMetaItem}>
                        <FontAwesome name="map-marker" size={10} color="#666" />
                        <Text style={styles.spaDealMetaText}>{deal.distance}</Text>
                      </View>
                      {new Date(deal.expiration_date).getTime() > new Date().getTime() && (
                        <View style={styles.spaDealMetaItem}>
                          <FontAwesome name="clock-o" size={10} color="#666" />
                          <Text style={styles.spaDealMetaText}>Ends Today</Text>
                        </View>
                      )}
                    </View>
                    <Text style={styles.spaDealTitle} numberOfLines={2}>
                      {deal.title}
                    </Text>
                    <Text style={styles.spaDealRetailer} numberOfLines={1}>
                      {deal.retailer_name}
                    </Text>
                    <Text style={styles.spaDealPrice}>
                      ${deal.price} {deal.original_price > deal.price && (
                        <Text style={styles.originalPrice}>${deal.original_price}</Text>
                      )}
                    </Text>
                  </View>
                </TouchableOpacity>
              </Link>
            ))}
          </View>
        </View>
      </ScrollView>

      <BottomNavUser></BottomNavUser>
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingBottom: 80, // Add space for bottom navigation
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    paddingTop: 50,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  logo: {
    width: 40,
    height: 30,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 16,
    marginTop: 12,
    marginBottom: 12,
    padding: 10,
    backgroundColor: '#f5f5f5',
    borderRadius: 20,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
  },
  categoriesScroll: {
    marginBottom: 16,
  },
  categoriesContainer: {
    paddingHorizontal: 16,
    gap: 8,
  },
  categoryChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f5f5f5',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  categoryChipSelected: {
    backgroundColor: '#FF6F61',
    borderColor: '#FF6F61',
  },
  categoryChipText: {
    color: '#666',
    fontSize: 14,
  },
  categoryChipTextSelected: {
    color: '#fff',
    fontWeight: '500',
  },
  featuredDeal: {
    margin: 16,
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  featuredContent: {
    flex: 1,
    marginRight: 16,
  },
  featuredTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  featuredDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
  },
  featuredImage: {
    width: 120,
    height: 120,
    borderRadius: 8,
  },
  viewButton: {
    backgroundColor: '#FF6B6B',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  viewButtonText: {
    color: '#fff',
    fontWeight: '500',
  },
  spaDealsScroll: {
    marginBottom: 24,
  },
  spaDealsContainer: {
    paddingHorizontal: 16,
  },
  dealsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
  },
  spaDealCard: {
    width: '48%',
    backgroundColor: '#f2faf2',
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  spaDealImage: {
    width: '100%',
    height: 120,
  },
  heartButton: {
    position: 'absolute',
    right: 8,
    top: 8,
    zIndex: 1,
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  spaDealOverlay: {
    position: 'absolute',
    left: 8,
    top: 8,
    backgroundColor: '#FF6F61',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  spaDealDiscount: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 12,
  },
  spaDealInfo: {
    padding: 10,
  },
  spaDealTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
    color: '#333',
  },
  spaDealRetailer: {
    fontSize: 12,
    color: '#666',
    marginBottom: 6,
  },
  spaDealMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  spaDealMetaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  spaDealMetaText: {
    fontSize: 10,
    color: '#666',
  },
  spaDealPrice: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FF6F61',
  },
  originalPrice: {
    fontSize: 11,
    color: '#888',
    textDecorationLine: 'line-through',
    marginLeft: 4,
  },
  shopCategories: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
  },
  categoryGrid: {
    flexDirection: 'row',
    gap: 16,
  },
  categoryCard: {
    flex: 1,
    aspectRatio: 1,
    borderRadius: 12,
    padding: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  categoryImage: {
    width: '60%',
    height: '60%',
    marginBottom: 8,
  },
  categoryName: {
    fontSize: 16,
    fontWeight: '500',
  }
});
