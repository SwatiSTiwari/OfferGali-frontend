import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { useRouter } from 'expo-router';
import { useQuery } from '@tanstack/react-query';

// Mock API call
const fetchRetailerDeals = async () => {
  // Replace this with your actual API call
  return [
    { id: '1', title: 'Summer Sale', views: 120 },
    { id: '2', title: 'Back to School', views: 85 },
    { id: '3', title: 'Holiday Special', views: 200 },
  ];
};

export default function RetailerDashboardScreen() {
  const router = useRouter();
  const { data: deals, isLoading, error } = useQuery({ queryKey: ['retailerDeals'], queryFn: fetchRetailerDeals });

  if (isLoading) return <Text>Loading...</Text>;
  if (error) return <Text>An error occurred: {error.message}</Text>;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Retailer Dashboard</Text>
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => router.push('/(retailer)/deals/new')}
      >
        <Text style={styles.buttonText}>Add New Deal</Text>
      </TouchableOpacity>
      <FlatList
        data={deals}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.dealItem}>
            <Text style={styles.dealTitle}>{item.title}</Text>
            <Text>Views: {item.views}</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  addButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
    marginBottom: 20,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  dealItem: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  dealTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
});

