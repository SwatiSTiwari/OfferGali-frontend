import { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Checkbox } from 'expo-checkbox';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { updateProfile } from '@/api/profile';

const interests = [
  'Clothing',
  'Groceries',
  'Electronics',
  'Beauty Products',
  'Sports & Fitness',
  'Home & Furniture',
  'Toys & Baby products',
  'Books & Stationery'
];

export default function ProfileSetup() {
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [notifications, setNotifications] = useState({
    push: true,
    email: true,
    sms: false,
  });
  const router = useRouter();

  const toggleInterest = (interest: string) => {
    setSelectedInterests(prev => 
      prev.includes(interest)
        ? prev.filter(i => i !== interest)
        : [...prev, interest]
    );
  };

  const savePreferences = async () => {
    try {
      // Get user token from AsyncStorage
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        console.log('No token found');
        return;
      }

      // Prepare the updated preferences object
      const updatedData = {
        preferences: {
          interests: selectedInterests,
          notifications: notifications,
        },
      };

      // Call the updateProfile function to update the user profile
      const response = await updateProfile(updatedData);

      if (response.success) {
        router.push('/home');  // Navigate to home or any other screen on success
      } else {
        console.log('Error updating preferences:', response.message);
      }
    } catch (error) {
      console.log('Error saving preferences:', error);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Profile Setup</Text>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Choose your Interest</Text>
        {interests.map((interest) => (
          <TouchableOpacity
            key={interest}
            style={styles.checkboxContainer}
            onPress={() => toggleInterest(interest)}
          >
            <Checkbox
              value={selectedInterests.includes(interest)}
              onValueChange={() => toggleInterest(interest)}
              color={selectedInterests.includes(interest) ? '#FF4B55' : undefined}
            />
            <Text style={styles.checkboxLabel}>{interest}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Notification Preferences</Text>
        <TouchableOpacity
          style={styles.checkboxContainer}
          onPress={() => setNotifications(prev => ({ ...prev, push: !prev.push }))}>
          <Checkbox
            value={notifications.push}
            onValueChange={(value) => setNotifications(prev => ({ ...prev, push: value }))}
            color={notifications.push ? '#FF4B55' : undefined}
          />
          <Text style={styles.checkboxLabel}>Push Notifications</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.checkboxContainer}
          onPress={() => setNotifications(prev => ({ ...prev, email: !prev.email }))}>
          <Checkbox
            value={notifications.email}
            onValueChange={(value) => setNotifications(prev => ({ ...prev, email: value }))}
            color={notifications.email ? '#FF4B55' : undefined}
          />
          <Text style={styles.checkboxLabel}>Email Updates</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.checkboxContainer}
          onPress={() => setNotifications(prev => ({ ...prev, sms: !prev.sms }))}>
          <Checkbox
            value={notifications.sms}
            onValueChange={(value) => setNotifications(prev => ({ ...prev, sms: value }))}
            color={notifications.sms ? '#FF4B55' : undefined}
          />
          <Text style={styles.checkboxLabel}>SMS alerts</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={styles.button}
        onPress={savePreferences}>
        <Text style={styles.buttonText}>Save</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
    textAlign: 'center',
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 15,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    paddingVertical: 8,
  },
  checkboxLabel: {
    marginLeft: 12,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#FF4B55',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 40,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

