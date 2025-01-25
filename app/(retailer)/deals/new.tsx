import { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter, Link } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';

export default function NewDeal() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [expirationDate, setExpirationDate] = useState('');
  const [terms, setTerms] = useState('');
  const [redemptionMethod, setRedemptionMethod] = useState('');
  const router = useRouter();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <FontAwesome name="arrow-left" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Add New Deal</Text>
        <View style={styles.headerRight} />
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.form}>
          <View style={styles.formGroup}>
            <Text style={styles.label}>Deal Title*</Text>
            <TextInput
              style={styles.input}
              value={title}
              onChangeText={setTitle}
              placeholder="Enter deal title"
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Description*</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={description}
              onChangeText={setDescription}
              placeholder="Enter deal description"
              multiline
              numberOfLines={4}
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Upload Images</Text>
            <TouchableOpacity style={styles.uploadButton}>
              <FontAwesome name="cloud-upload" size={24} color="#666" />
              <Text style={styles.uploadText}>Tap to upload(max 5 images)</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Expiration Date*</Text>
            <TouchableOpacity style={styles.input}>
              <Text style={styles.dateText}>dd-mm-yyyy</Text>
              <FontAwesome name="calendar" size={20} color="#666" />
            </TouchableOpacity>
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Terms & Conditions</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={terms}
              onChangeText={setTerms}
              placeholder="Enter terms and conditions"
              multiline
              numberOfLines={4}
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Redemption Method*</Text>
            <TouchableOpacity style={styles.input}>
              <Text style={styles.selectText}>QR Code</Text>
              <FontAwesome name="chevron-down" size={16} color="#666" />
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity 
          style={styles.submitButton}
          onPress={() => router.back()}
        >
          <Text style={styles.submitButtonText}>Submit Deal</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.bottomNav}>
        <Link href="/home" asChild>
          <TouchableOpacity style={styles.navItem}>
            <FontAwesome name="home" size={24} color="#666" />
            <Text style={styles.navText}>Home</Text>
          </TouchableOpacity>
        </Link>

        <Link href="/analytics" asChild>
          <TouchableOpacity style={styles.navItem}>
            <FontAwesome name="bar-chart" size={24} color="#666" />
            <Text style={styles.navText}>Analytics</Text>
          </TouchableOpacity>
        </Link>

        <Link href="/dashboard" asChild>
          <TouchableOpacity style={styles.navItem}>
            <FontAwesome name="tag" size={24} color="#666" />
            <Text style={styles.navText}>Deal</Text>
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
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  headerRight: {
    width: 24,
  },
  content: {
    flex: 1,
  },
  form: {
    padding: 20,
  },
  formGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 15,
    fontSize: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  uploadButton: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 20,
    alignItems: 'center',
    borderStyle: 'dashed',
  },
  uploadText: {
    color: '#666',
    marginTop: 10,
  },
  dateText: {
    color: '#666',
  },
  selectText: {
    color: '#666',
  },
  footer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  submitButton: {
    backgroundColor: '#FF4B55',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  navItem: {
    alignItems: 'center',
  },
  navText: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
});
