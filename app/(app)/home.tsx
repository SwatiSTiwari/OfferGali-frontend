// import { useState } from 'react';
// import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Image } from 'react-native';
// import { Link } from 'expo-router';
// import { FontAwesome } from '@expo/vector-icons';

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
//     image: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-liVRndZod8g56wS47PgZlwjLB7yX69.png',
//     discount: '50% Off',
//   },
//   {
//     id: 2,
//     title: '50% Off Premium Coffee Bundle',
//     description: 'Get our premium coffee bundle at half price',
//     image: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-KZqOK0JWZEc1xyL3YHoBYnMewFjKhz.png',
//     discount: '50% Off',
//   },
// ];

// export default function Home() {
//   const [searchQuery, setSearchQuery] = useState('');

//   return (
//     <View style={styles.container}>
//       <View style={styles.header}>
//         <Text style={styles.headerTitle}>Nearby Deals</Text>
//         <FontAwesome name="bell" size={24} color="#333" />
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
//         <TouchableOpacity style={styles.navItem}>
//           <FontAwesome name="home" size={24} color="#FF4B55" />
//           <Text style={[styles.navText, styles.navTextActive]}>Home</Text>
//         </TouchableOpacity>
//         <TouchableOpacity style={styles.navItem}>
//           <FontAwesome name="compass" size={24} color="#666" />
//           <Text style={styles.navText}>Explore</Text>
//         </TouchableOpacity>
//         <TouchableOpacity style={styles.navItem}>
//           <FontAwesome name="heart" size={24} color="#666" />
//           <Text style={styles.navText}>Saved</Text>
//         </TouchableOpacity>
//         <TouchableOpacity style={styles.navItem}>
//           <FontAwesome name="user" size={24} color="#666" />
//           <Text style={styles.navText}>Profile</Text>
//         </TouchableOpacity>
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

const bg=require('../../assets/bg.png')

const categories = [
  { id: 1, name: 'Food', icon: 'cutlery' },
  { id: 2, name: 'Shopping', icon: 'shopping-bag' },
  { id: 3, name: 'Entertainment', icon: 'film' },
  { id: 4, name: 'Electronics', icon: 'laptop' },
];

const deals = [
  {
    id: 1,
    title: 'Buy 1 Get 1 Free',
    description: 'Double your delights from the top stores in town',
    image:  {bg},
    discount: '50% Off',
  },
  {
    id: 2,
    title: '50% Off Premium Coffee Bundle',
    description: 'Get our premium coffee bundle at half price',
    image: {bg},
    discount: '50% Off',
  },
];

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Nearby Deals</Text>
        <FontAwesome name="bell" size={24} color="#333" />
      </View>

      <View style={styles.searchContainer}>
        <FontAwesome name="search" size={20} color="#666" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search deals nearby..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.categoriesContainer}>
          <Text style={styles.sectionTitle}>Shop by categories</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {categories.map((category) => (
              <TouchableOpacity key={category.id} style={styles.categoryCard}>
                <FontAwesome name={category.icon as keyof typeof FontAwesome.glyphMap} size={24} color="#FF4B55" />
                <Text style={styles.categoryName}>{category.name}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <View style={styles.dealsContainer}>
          {deals.map((deal) => (
            <Link href={`/deals/${deal.id}`} key={deal.id} asChild>
              <TouchableOpacity style={styles.dealCard}>
                <Image source={{ uri: deal.image }} style={styles.dealImage} />
                <View style={styles.dealContent}>
                  <View style={styles.discountBadge}>
                    <Text style={styles.discountText}>{deal.discount}</Text>
                  </View>
                  <Text style={styles.dealTitle}>{deal.title}</Text>
                  <Text style={styles.dealDescription}>{deal.description}</Text>
                </View>
              </TouchableOpacity>
            </Link>
          ))}
        </View>
      </ScrollView>

      <View style={styles.bottomNav}>
        <Link href="/home" asChild>
          <TouchableOpacity style={styles.navItem}>
            <FontAwesome name="home" size={24} color="#FF4B55" />
            <Text style={[styles.navText, styles.navTextActive]}>Home</Text>
          </TouchableOpacity>
        </Link>
        <Link href="/saved" asChild>
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
    padding: 20,
    paddingTop: 60,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    marginHorizontal: 20,
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    marginBottom: 20,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
  },
  categoriesContainer: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 15,
  },
  categoryCard: {
    alignItems: 'center',
    marginRight: 20,
    backgroundColor: '#f5f5f5',
    padding: 15,
    borderRadius: 10,
    width: 100,
  },
  categoryName: {
    marginTop: 8,
    fontSize: 14,
  },
  dealsContainer: {
    padding: 20,
  },
  dealCard: {
    backgroundColor: '#fff',
    borderRadius: 15,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  dealImage: {
    width: '100%',
    height: 200,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
  },
  dealContent: {
    padding: 15,
  },
  discountBadge: {
    position: 'absolute',
    top: -20,
    right: 15,
    backgroundColor: '#FF4B55',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
  },
  discountText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  dealTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  dealDescription: {
    fontSize: 14,
    color: '#666',
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 15,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  navItem: {
    alignItems: 'center',
  },
  navText: {
    fontSize: 12,
    marginTop: 5,
    color: '#666',
  },
  navTextActive: {
    color: '#FF4B55',
  },
});
