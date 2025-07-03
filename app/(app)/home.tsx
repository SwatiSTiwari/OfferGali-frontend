import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import { Link } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';
import * as Location from 'expo-location';
import { fetchNearbyDeals } from '@/api/deals/deals';
import BottomNavUser from '@/app/(auth)/bottomnavuser';
import { registerForPushNotificationsAsync } from '@/utils/notifications';

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
  }

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Deals');
  const [nearbyDeals, setNearbyDeals] = useState<NearbyDeal[]>([]);
  const [loading, setLoading] = useState(true);
  const [userLocation, setUserLocation] = useState<Location.LocationObjectCoords | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [filteredDeals, setFilteredDeals] = useState<NearbyDeal[]>([]);
  
  const logo = require('../../assets/logo.png');

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
        <Link href="/(app)/notifications" asChild>
          <TouchableOpacity style={{alignItems: 'center'}}>
            <FontAwesome name="bell" size={24} color="#666" />
          </TouchableOpacity>
        </Link>
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
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.spaDealsScroll}
            contentContainerStyle={styles.spaDealsContainer}
          >
            {filteredDeals.map((deal) => (
              <Link href={`/deals/${deal.id}`} key={deal.id} asChild>
                <TouchableOpacity style={styles.spaDealCard}>
                  <View style={styles.heartButton}>
                    <FontAwesome name="heart-o" size={20} color="#FF6B6B" />
                  </View>
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
                        <FontAwesome name="map-marker" size={12} color="#666" />
                        <Text style={styles.spaDealMetaText}>{deal.distance}</Text>
                      </View>
                      {new Date(deal.expiration_date).getTime() > new Date().getTime() && (
                        <View style={styles.spaDealMetaItem}>
                          <FontAwesome name="clock-o" size={12} color="#666" />
                          <Text style={styles.spaDealMetaText}>Ends Today</Text>
                        </View>
                      )}
                    </View>
                    <Text style={styles.spaDealTitle}>
                      {deal.title}
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
          </ScrollView>
        </View>

          <View style={styles.featuredDeal}>
          <View style={styles.featuredContent}>
            <Text style={styles.featuredTitle}>Buy 1 Get 1 Free</Text>
            <Text style={styles.featuredDescription}>
              Double your delights from the top restos in town
            </Text>
            <TouchableOpacity style={styles.viewButton}>
              <Text style={styles.viewButtonText}>View</Text>
            </TouchableOpacity>
          </View>
          <Image
            source={require('../../assets/pizza.png')}
            style={styles.featuredImage}
          />
        </View>

        <View style={styles.shopCategories}>
          <Text style={styles.sectionTitle}>Shop by categories</Text>
          <Text style={styles.sectionSubtitle}>Awesome deals near you</Text>
          <View style={styles.categoryGrid}>
            {shopCategories.map((category) => (
              <TouchableOpacity
                key={category.id}
                style={[styles.categoryCard, { backgroundColor: category.backgroundColor }]}
              >
                <Image source={category.image} style={styles.categoryImage} />
                <Text style={styles.categoryName}>{category.name}</Text>
              </TouchableOpacity>
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
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    paddingTop: 60,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',

  },
  logo: {
    width: 50,
    height: 80,
    borderRadius: 20,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 16,
    padding: 12,
    backgroundColor: '#f5f5f5',
    borderRadius: 25,
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
    backgroundColor: '#f2faf2',
    marginRight: 8,

  },
  categoryChipSelected: {
    backgroundColor: '#d2f7d2',



  },
  categoryChipText: {
    color: '#666',
    fontSize: 14,
  },
  categoryChipTextSelected: {
    color: '#2E7D32',
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
    paddingHorizontal: 10,
    gap: 10,
  },
  spaDealCard: {
    width: 200,
    backgroundColor: '#f2faf2',
    borderRadius: 12,
    overflow: 'hidden',
    marginRight: 16,

    shadowColor: '#fff',
    shadowOffset: { width: 0, height: 4 }, // Increased shadow height for better visibility
    shadowOpacity: 0.3, // Slightly higher opacity for a more prominent shadow
    shadowRadius: 6, // Increased shadow radius

    // Shadow for Android
    elevation: 8,

  },
  spaDealImage: {
    width: '100%',
    height: 180,
  },
  heartButton: {
    position: 'absolute',
    right: 12,
    top: 12,
    zIndex: 1,
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 8,
  },
  spaDealOverlay: {
    position: 'absolute',
    left: 12,
    top: 12,
    backgroundColor: '#FF6B6B',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
  },
  spaDealDiscount: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
  spaDealInfo: {
    padding: 12,
  },
  spaDealTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  spaDealMeta: {
    flexDirection: 'row',
    gap: 16,
  },
  spaDealMetaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  spaDealMetaText: {
    fontSize: 12,
    color: '#666',
  },
  spaDealPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2E7D32',
    marginBottom: 4,
  },
  originalPrice: {
    fontSize: 12,
    color: '#888',
    textDecorationLine: 'line-through',
    marginLeft: 6,
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
