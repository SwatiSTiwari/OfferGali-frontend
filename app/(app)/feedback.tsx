import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { router } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import { submitFeedback } from '@/api/profile';
import { useLocalSearchParams } from 'expo-router';

interface FeedbackForm {
  role: 'user' | 'retailer';
  message: string;
  rating: number;
}

export default function FeedbackScreen() {
  const params = useLocalSearchParams();
    const currrole = params.role as string;
 
  const [form, setForm] = useState<FeedbackForm>({
    role: currrole === 'retailer' ? 'retailer' : 'user',
    message: '',
    rating: 0,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!form.message.trim()) {
      Alert.alert('Error', 'Please enter your feedback message');
      return;
    }

    if (form.rating === 0) {
      Alert.alert('Error', 'Please select a rating');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await submitFeedback(form);
      if (response.success) {
        Alert.alert('Success', 'Thank you for your feedback!');
        setForm({ role: currrole === 'retailer' ? 'retailer' : 'user', message: '', rating: 0 }); // Reset form
        router.back(); // Navigate back after submission
      } else {
        Alert.alert('Error', response.message || 'Failed to submit feedback');
      }     
    } catch (error) {
      Alert.alert('Error', 'Failed to submit feedback. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStars = () => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <TouchableOpacity
          key={i}
          onPress={() => setForm({ ...form, rating: i })}
          style={styles.starButton}
        >
          <FontAwesome
            name={i <= form.rating ? 'star' : 'star-o'}
            size={32}
            color={i <= form.rating ? '#FFD700' : '#ccc'}
          />
        </TouchableOpacity>
      );
    }
    return stars;
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <FontAwesome name="arrow-left" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.title}>Feedback</Text>
      </View>

      <View style={styles.form}>
        {/* Role Selection */}
        {/* <View style={styles.formGroup}>
          <Text style={styles.label}>Your Role</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={form.role}
              onValueChange={(itemValue) => setForm({ ...form, role: itemValue })}
              style={styles.picker}
            >
              <Picker.Item label="User" value="user" />
              <Picker.Item label="Retailer" value="retailer" />
            </Picker>
          </View>
        </View> */}

        {/* Rating */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>Rating</Text>
          <View style={styles.starsContainer}>
            {renderStars()}
          </View>
          <Text style={styles.ratingText}>
            {form.rating === 0 ? 'Tap to rate' : `${form.rating} out of 5 stars`}
          </Text>
        </View>

        {/* Message */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>Your Message</Text>
          <TextInput
            style={styles.messageInput}
            multiline
            numberOfLines={6}
            placeholder="Tell us about your experience..."
            placeholderTextColor="#999"
            value={form.message}
            onChangeText={(text) => setForm({ ...form, message: text })}
            textAlignVertical="top"
          />
        </View>

        {/* Submit Button */}
        <TouchableOpacity
          style={[styles.submitButton, isSubmitting && styles.submitButtonDisabled]}
          onPress={handleSubmit}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.submitButtonText}>Submit Feedback</Text>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    paddingTop: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  backButton: {
    padding: 8,
    marginRight: 16,
  },
  title: {
    fontSize: 21,
    fontWeight: '600',
    color: '#333',
  },
  form: {
    padding: 16,
  },
  formGroup: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  pickerContainer: {
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    overflow: 'hidden',
  },
  picker: {
    height: 50,
  },
  starsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 8,
  },
  starButton: {
    padding: 4,
    marginHorizontal: 4,
  },
  ratingText: {
    textAlign: 'center',
    fontSize: 14,
    color: '#666',
  },
  messageInput: {
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    padding: 16,
    fontSize: 16,
    color: '#333',
    minHeight: 120,
  },
  submitButton: {
    backgroundColor: '#FF6B6B',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
  },
  submitButtonDisabled: {
    backgroundColor: '#ccc',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
