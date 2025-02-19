import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, Image, Alert, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons, Feather } from "@expo/vector-icons";
import { deleteProfile, getProfile, updateProfile } from "@/api/user/user";
import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function RetailerProfile() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // 🔹 Fetch profile when the component loads
  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      const response = await getProfile();
      setLoading(false);

      if (response.success) {
        setName(response.data.name || "");
        setEmail(response.data.email || "");
        setProfileImage(response.data.profileImage || null);
      } else {
        Alert.alert("Error", response.message);
      }
    };

    fetchProfile();
  }, []);

  // 🔹 Pick an image and update profile
  const pickImage = async () => {
    let permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert("Permission Required", "Please enable permission to access images.");
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      const selectedImageUri = result.assets[0].uri;
      setProfileImage(selectedImageUri); // Show image in UI
      handleSaveProfile(selectedImageUri); // Save image URL to profile
    }
  };

  // 🔹 Update Profile Data with Image URL
  const handleSaveProfile = async (imageUri: string | null = profileImage) => {
    setLoading(true);
    const response = await updateProfile({ name, email, profileImage: imageUri });
    setLoading(false);

    if (response.success) {
      Alert.alert("Success", "Profile updated successfully!");
    } else {
      Alert.alert("Error", response.message);
    }
  };

  const handleDeleteProfile = async () => {
    setLoading(true);
    const response = await deleteProfile();
    setLoading(false);

    if (response.success) {
      Alert.alert("Success", "Profile delted successfully!");
      AsyncStorage.removeItem("token")
      router.push("/(auth)/login")
    } else {
      Alert.alert("Error", response.message);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollView}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Account Settings</Text>
        </View>

        {/* Profile Section */}
        <View style={styles.profileSection}>
          <TouchableOpacity style={styles.avatarContainer} onPress={pickImage}>
            {profileImage ? (
              <Image source={{ uri: profileImage }} style={styles.avatar} />
            ) : (
              <View style={styles.avatar}>
                <Ionicons name="person-outline" size={40} color="#666" />
              </View>
            )}
            <TouchableOpacity style={styles.addButton} onPress={pickImage}>
              <Ionicons name="camera" size={20} color="#666" />
            </TouchableOpacity>
          </TouchableOpacity>
        </View>

        {/* Form Section */}
        <View style={styles.formSection}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Name</Text>
            <TextInput style={styles.input} value={name} onChangeText={setName} />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email</Text>
            <TextInput style={styles.input} value={email} onChangeText={setEmail} keyboardType="email-address" />
          </View>
        </View>

        {/* Save Profile Button */}
        <TouchableOpacity style={styles.saveButton} onPress={() => handleSaveProfile()} disabled={loading}>
          {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.saveButtonText}>Save Changes</Text>}
        </TouchableOpacity>

        <TouchableOpacity style={styles.deleteButton} onPress={() => handleDeleteProfile()}>
                <Feather name="trash-2" size={20} color="#FF4B55" />
                <Text style={styles.deleteButtonText}>Delete Account</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  scrollView: { padding: 16 },
  container: { flex: 1, backgroundColor: "#fff" },
  header: { alignItems: "center", padding: 16 },
  headerTitle: { fontSize: 18, fontWeight: "600" },
  profileSection: { alignItems: "center", paddingVertical: 24 },
  avatarContainer: { position: "relative" },
  avatar: { width: 100, height: 100, borderRadius: 50, backgroundColor: "#F0F0F0", alignItems: "center", justifyContent: "center" },
  addButton: { position: "absolute", bottom: 0, right: 0, backgroundColor: "#fff", borderRadius: 12, padding: 5 },
  formSection: { paddingHorizontal: 16 },
  inputGroup: { marginBottom: 16 },
  input: { borderWidth: 1, borderColor: "#ddd", borderRadius: 8, padding: 10 },
  label: { fontSize: 16, fontWeight: "500", marginBottom: 8 },
  saveButton: { backgroundColor: "#FF6B6B", padding: 15, borderRadius: 8, alignItems: "center" },
  saveButtonText: { color: "#fff", fontWeight: "bold" },
  deleteButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 24,
    marginHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#FF4B55",
  },
  deleteButtonText: {
    marginLeft: 8,
    fontSize: 16,
    color: "#FF4B55",
    fontWeight: "500",
  },
});
