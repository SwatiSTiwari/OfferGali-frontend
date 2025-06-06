import React, { useEffect, useState} from "react";
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Switch, ScrollView,Image, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons, Feather } from "@expo/vector-icons";
import { Link } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';
import {deleteProfile, getProfile} from "@/api/user/user";
import { useRouter } from "expo-router";


export default function Profile() {
  const router = useRouter();
  
  const [user, setUser] = useState({
    fullName: "John Doe",
    email: "",
    password: "********",
    pushNotifications: true,
    profile: "../../assets/logo.png"
  })
  useEffect(() => {
    const fetchUserData = async () => {
       const user = await getProfile();
      if (user) {
        setUser({
          fullName: user.data.name || "John Doe",
          email: user.data.email || "Email not provided",
          password: user.data.password || null,
          pushNotifications: user.data.pushNotifications || true,
          profile: user.data.image || "../../assets/logo.png"
        });

      }else{
        Alert.alert("Error", "Failed to fetch user data. Please try again later.");
      }
    }
    fetchUserData();

  }, [])

    const handleChange = (key: keyof typeof user) => (value: string) => {
    setUser((prev) => ({ ...prev, [key]: value }));
  };

  const handleDeleteAccount = async () => {
    const response = await deleteProfile();
    if (response.success) {
      Alert.alert("Success", "Your account has been deleted successfully.");
      router.push("/(auth)/register");
    } else {
      Alert.alert("Error", "Failed to delete account. Please try again later.");
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollView}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity>
            <Ionicons name="arrow-back" size={24} color="#000" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Account Settings</Text>
          <TouchableOpacity>
            
          </TouchableOpacity>
        </View>

        {/* Profile Section */}
        <View style={styles.profileSection}>
          <View style={styles.avatarContainer}>
            <View style={styles.avatar}>
              <Image source={{ uri: user.profile }} style={{ width: 40, height: 40, borderRadius: 20 }} />
            </View>
            <TouchableOpacity style={styles.addButton}>
              <Ionicons name="add" size={20} color="#666" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Form Section */}
        <View style={styles.formSection}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Full Name</Text>
            <View style={styles.inputContainer}>
              <Feather name="user" size={20} color="#666" />
              <TextInput style={styles.input} value={user.fullName} onChangeText={handleChange("fullName")} placeholder="John Doe" />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email</Text>
            <View style={styles.inputContainer}>
              <Feather name="mail" size={20} color="#666" />
              <TextInput
                style={styles.input}
                value={user.email}
                onChangeText={handleChange("email")}
                keyboardType="email-address"
                placeholder="john@example.com"
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Password</Text>
            <View style={styles.inputContainer}>
              <Feather name="lock" size={20} color="#666" />
              <TextInput
                style={styles.input}
                value={user.password}
                onChangeText={handleChange("password")}
                secureTextEntry
                placeholder="********"
              />
            </View>
          </View>
        </View>

        {/* Notifications Section */}
        <View style={styles.notificationSection}>
          <View style={styles.notificationHeader}>
            <Text style={styles.notificationTitle}>Push Notifications</Text>
            <Switch
              value={user.pushNotifications}
              onValueChange={(value) => setUser((prev) => ({ ...prev, pushNotifications: value }))}
              trackColor={{ false: "#D1D1D1", true: "#34C759" }}
              thumbColor="#fff"
            />
          </View>
          <Text style={styles.notificationDescription}>Get notified about updates</Text>
        </View>

        {/* Delete Account Button */}
        <TouchableOpacity style={styles.deleteButton} onPress={handleDeleteAccount}>
          <Feather name="trash-2" size={20} color="#FF4B55" />
          <Text style={styles.deleteButtonText}>Delete Account</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Bottom Navigation */}
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
            <FontAwesome name="user" size={24} color="#FF4855" />
            <Text style={styles.navText}>Profile</Text>
          </TouchableOpacity>
        </Link>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  scrollView: {
    paddingBottom: 80, // Ensures scroll space for bottom navigation
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
  },
  profileSection: {
    alignItems: "center",
    paddingVertical: 24,
  },
  avatarContainer: {
    position: "relative",
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#F0F0F0",
    alignItems: "center",
    justifyContent: "center",
  },
  addButton: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: "#fff",
    borderRadius: 12,
    width: 24,
    height: 24,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  formSection: {
    paddingHorizontal: 16,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    color: "#333",
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E6F4F1",
    borderRadius: 8,
    paddingHorizontal: 12,
    backgroundColor: "#fff",
  },
  input: {
    flex: 1,
    height: 44,
    marginLeft: 8,
    fontSize: 15,
  },
  notificationSection: {
    marginTop: 24,
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: "#F0F0F0",
  },
  notificationHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: "500",
  },
  notificationDescription: {
    fontSize: 14,
    color: "#666",
  },
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
  bottomNav: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: "#F0F0F0",
    backgroundColor: "#fff",
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
  },
  navItem: {
    alignItems: "center",
  },
  navText: {
    fontSize: 12,
    marginTop: 4,
    color: "#666",
  },
});
