
// import { useState } from 'react';
// import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Image } from 'react-native';
// import { Link } from 'expo-router';
// import { FontAwesome } from '@expo/vector-icons';

// const bg= require('../../assets/bg.png')

// const categories = [
//   { id: 1, name: 'Food', icon: 'cutlery' },
//   { id: 2, name: 'Shopping', icon: 'shopping-bag' },
//   { id: 3, name: 'Entertainment', icon: 'film' },
//   { id: 4, name: 'Electronics', icon: 'laptop' },
// ];

// const deals = [
//   {
//     id: 1,
//     title: 'Buy 1 Get 1 Free',
//     description: 'Double your delights from the top stores in town',
//     image: bg,
//     discount: '50% Off',
//   },
//   {
//     id: 2,
//     title: '50% Off Premium Coffee Bundle',
//     description: 'Get our premium coffee bundle at half price',
//     image: {bg},
//     discount: '50% Off',
//   },
// ];

// export default function Home() {
//   const [searchQuery, setSearchQuery] = useState('');

//   return (
//     <View style={styles.container}>
//       <View style={styles.header}>
//         <Text style={styles.headerTitle}>Nearby Deals</Text>
//         <Link href="/(app)/notifications" asChild>
//         <TouchableOpacity style={styles.navItem}>
//         <FontAwesome name="bell" size={24} color="#666" />
//         <Text style={styles.navText}>Profile</Text>
//         </TouchableOpacity>
//         </Link>
//       </View>

//       <View style={styles.searchContainer}>
//         <FontAwesome name="search" size={20} color="#666" style={styles.searchIcon} />
//         <TextInput
//           style={styles.searchInput}
//           placeholder="Search deals nearby..."
//           value={searchQuery}
//           onChangeText={setSearchQuery}
//         />
//       </View>

//       <ScrollView showsVerticalScrollIndicator={false}>
//         <View style={styles.categoriesContainer}>
//           <Text style={styles.sectionTitle}>Shop by categories</Text>
//           <ScrollView horizontal showsHorizontalScrollIndicator={false}>
//             {categories.map((category) => (
//               <TouchableOpacity key={category.id} style={styles.categoryCard}>
//                 <FontAwesome name={category.icon as keyof typeof FontAwesome.glyphMap} size={24} color="#FF4B55" />
//                 <Text style={styles.categoryName}>{category.name}</Text>
//               </TouchableOpacity>
//             ))}
//           </ScrollView>
//         </View>

//         <View style={styles.dealsContainer}>
//           {deals.map((deal) => (
//             <Link href={`/deals/${deal.id}`} key={deal.id} asChild>
//               <TouchableOpacity style={styles.dealCard}>
//                 <Image source={{ uri: deal.image }} style={styles.dealImage} />
//                 <View style={styles.dealContent}>
//                   <View style={styles.discountBadge}>
//                     <Text style={styles.discountText}>{deal.discount}</Text>
//                   </View>
//                   <Text style={styles.dealTitle}>{deal.title}</Text>
//                   <Text style={styles.dealDescription}>{deal.description}</Text>
//                 </View>
//               </TouchableOpacity>
//             </Link>
//           ))}
//         </View>
//       </ScrollView>

//       <View style={styles.bottomNav}>
//         <Link href="/home" asChild>
//           <TouchableOpacity style={styles.navItem}>
//             <FontAwesome name="home" size={24} color="#FF4B55" />
//             <Text style={[styles.navText, styles.navTextActive]}>Home</Text>
//           </TouchableOpacity>
//         </Link>
//         <Link href="/saved" asChild>
//           <TouchableOpacity style={styles.navItem}>
//             <FontAwesome name="compass" size={24} color="#666" />
//             <Text style={styles.navText}>Explore</Text>
//           </TouchableOpacity>
//         </Link>
//         <Link href="/saved" asChild>
//           <TouchableOpacity style={styles.navItem}>
//             <FontAwesome name="heart" size={24} color="#666" />
//             <Text style={styles.navText}>Saved</Text>
//           </TouchableOpacity>
//         </Link>
//         <Link href="/profile" asChild>
//           <TouchableOpacity style={styles.navItem}>
//             <FontAwesome name="user" size={24} color="#666" />
//             <Text style={styles.navText}>Profile</Text>
//           </TouchableOpacity>
//         </Link>
//       </View>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#fff',
//   },
//   header: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     padding: 20,
//     paddingTop: 60,
//   },
//   headerTitle: {
//     fontSize: 24,
//     fontWeight: 'bold',
//   },
//   searchContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     padding: 10,
//     marginHorizontal: 20,
//     backgroundColor: '#f5f5f5',
//     borderRadius: 10,
//     marginBottom: 20,
//   },
//   searchIcon: {
//     marginRight: 10,
//   },
//   searchInput: {
//     flex: 1,
//     fontSize: 16,
//   },
//   categoriesContainer: {
//     padding: 20,
//   },
//   sectionTitle: {
//     fontSize: 18,
//     fontWeight: '600',
//     marginBottom: 15,
//   },
//   categoryCard: {
//     alignItems: 'center',
//     marginRight: 20,
//     backgroundColor: '#f5f5f5',
//     padding: 15,
//     borderRadius: 10,
//     width: 100,
//   },
//   categoryName: {
//     marginTop: 8,
//     fontSize: 14,
//   },
//   dealsContainer: {
//     padding: 20,
//   },
//   dealCard: {
//     backgroundColor: '#fff',
//     borderRadius: 15,
//     marginBottom: 20,
//     shadowColor: '#000',
//     shadowOffset: {
//       width: 0,
//       height: 2,
//     },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//     elevation: 3,
//   },
//   dealImage: {
//     width: '100%',
//     height: 200,
//     borderTopLeftRadius: 15,
//     borderTopRightRadius: 15,
//   },
//   dealContent: {
//     padding: 15,
//   },
//   discountBadge: {
//     position: 'absolute',
//     top: -20,
//     right: 15,
//     backgroundColor: '#FF4B55',
//     paddingHorizontal: 10,
//     paddingVertical: 5,
//     borderRadius: 5,
//   },
//   discountText: {
//     color: '#fff',
//     fontWeight: 'bold',
//   },
//   dealTitle: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     marginBottom: 5,
//   },
//   dealDescription: {
//     fontSize: 14,
//     color: '#666',
//   },
//   bottomNav: {
//     flexDirection: 'row',
//     justifyContent: 'space-around',
//     padding: 15,
//     backgroundColor: '#fff',
//     borderTopWidth: 1,
//     borderTopColor: '#eee',
//   },
//   navItem: {
//     alignItems: 'center',
//   },
//   navText: {
//     fontSize: 12,
//     marginTop: 5,
//     color: '#666',
//   },
//   navTextActive: {
//     color: '#FF4B55',
//   },
// });


import { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Image } from 'react-native';
import { Link } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';

const categories = [
  { id: 1, name: 'All Deals', icon: 'tags' },
  { id: 2, name: 'Food', icon: 'cutlery' },
  { id: 3, name: 'Shopping', icon: 'shopping-bag' },
  { id: 4, name: 'Entertainment', icon: 'film' },
];

const spaDeals = [
  {
    id: 1,
    title: 'Spa Day Package',
    views: '0.8 miles',
    endsToday: true,
    image: require('../../assets/spa.png'),
  },
  {
    id: 2,
    title: 'Spa Day Package',
    views: '0.8 miles',
    endsToday: true,
    image: require('../../assets/spa.png'),
  },
  {
    id: 3,
    title: 'Spa Day Package',
    views: '0.8 miles',
    endsToday: true,
    image: require('../../assets/spa.png'),
  },
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
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Deals');

  const logo = require('../../assets/logo.png');

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Image source={logo} style={styles.logo} />
          <Text style={styles.headerTitle}>Nearby Deals</Text>
        </View>
         <Link href="/(app)/notifications" asChild>
                  <TouchableOpacity style={styles.navItem}>
                    <FontAwesome name="bell" size={24} color="#666" />
                    <Text style={styles.navText}>Home</Text>
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

        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={styles.spaDealsScroll}
          contentContainerStyle={styles.spaDealsContainer}
        >
          {spaDeals.map((deal) => (
            <Link href={`/deals/${deal.id}`} key={deal.id} asChild>
  <View key={deal.id} style={styles.spaDealCard}>
    <TouchableOpacity style={styles.heartButton}>
      <FontAwesome name="heart-o" size={20} color="#FF6B6B" />
    </TouchableOpacity>
    <Image source={deal.image} style={styles.spaDealImage} />
    <View style={styles.spaDealOverlay}>
      <Text style={styles.spaDealDiscount}>50% Off</Text>
    </View>
    <View style={styles.spaDealInfo}>
      {/* Add distance and deal end info before the title */}
      <View style={styles.spaDealMeta}>
        <View style={styles.spaDealMetaItem}>
          <FontAwesome name="map-marker" size={12} color="#666" />
          <Text style={styles.spaDealMetaText}>{deal.views}</Text>
        </View>
        {deal.endsToday && (
          <View style={styles.spaDealMetaItem}>
            <FontAwesome name="clock-o" size={12} color="#666" />
            <Text style={styles.spaDealMetaText}>Ends Today</Text>
          </View>
        )}
      </View>
      {/* Title comes after meta info */}
      <Text style={styles.spaDealTitle}>{deal.title}</Text>
    </View>
  </View>
  </Link>
))}

        </ScrollView>

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

      <View style={styles.bottomNav}>
      <Link href="/home" asChild>
        <TouchableOpacity style={styles.navItem}>
          <FontAwesome name="home" size={24} color="#666" />
          <Text style={styles.navText}>Home</Text>
        </TouchableOpacity>
        </Link>
        <Link href="/(app)/settings/geofencing" asChild>
        <TouchableOpacity style={styles.navItem}>
          <FontAwesome name="compass" size={24} color="#666" />
          <Text style={styles.navText}>Explore</Text>
        </TouchableOpacity>
        </Link>
        <Link href="/saved" asChild>
        <TouchableOpacity style={styles.navItem}>
          <FontAwesome name="heart" size={24} color="#666" />
          <Text style={styles.navText}>Saved</Text>
        </TouchableOpacity>
        </Link>

        <Link href="/profile" asChild>
        <TouchableOpacity style={styles.navItem}>
          <FontAwesome name="user" size={24} color="#666" />
          <Text style={styles.navText}>Profile</Text>
        </TouchableOpacity>
        </Link> 
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
    padding: 16,
    paddingTop: 60,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',

  },
  logo:{
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
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 12,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  navItem: {
    alignItems: 'center',
  },
  navText: {
    fontSize: 12,
    marginTop: 4,
    color: '#666',
  },
  navTextActive: {
    color: '#FF6B6B',
  },
});
