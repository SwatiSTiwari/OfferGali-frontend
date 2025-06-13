import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Modal,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Switch,
  ScrollView,
  Alert,
} from "react-native";
import {Image} from "expo-image"
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons, Feather } from "@expo/vector-icons";
import { Link } from "expo-router";
import { FontAwesome } from "@expo/vector-icons";
import {
  deleteProfile,
  deleteProfileImage,
  getProfile,
  updateProfile,
  updateProfileImage,
} from "@/api/user/user";
import { useRouter } from "expo-router";
import * as ImagePicker from "expo-image-picker";

export default function Profile() {
  const router = useRouter();
  const [modalVisible, setModalVisible] = useState(false);
  const [user, setUser] = useState({
    fullName: "John Doe",
    email: "",
    pushNotifications: true,
    profile: undefined,
    emailEdit: true,
    profileUpdateAt: Date.now(),
  });

  useEffect(() => {
    const fetchUserData = async () => {
      const user = await getProfile();
      if (user) {
        setUser({
          fullName: user.data.name || "John Doe",
          email: user.data.email || "Email not provided",
          pushNotifications: user.data.pushNotifications || true,
          profile: user.data.image || undefined,
          emailEdit: user.data.password ? true : false,
          profileUpdateAt: Date.now(),
        });
      } else {
        Alert.alert(
          "Error",
          "Failed to fetch user data. Please try again later."
        );
      }
    };
    fetchUserData();
  }, []);

  const uploadImage = async (image: any) => {
    if (!image) {
      Alert.alert("No Image Selected", "Please select an image to upload.");
      return;
    }

    const filename = image.split("/").pop();
    const match = /\.(\w+)$/.exec(filename || "");
    const ext = match ? `.${match[1]}` : ".jpg";
    const mimeType = `image/${ext.substring(1)}`;

    const formData = new FormData();
    formData.append("profile", {
      uri: image,
      name: filename || `profile${ext}`,
      type: mimeType,
    } as any);

    formData.append("email", user.email);
    formData.append("fullName", user.fullName);

    const response = await updateProfileImage(formData);
    if (response.success) {
      Alert.alert("Success", "Profile image updated successfully.");
      setUser((prev) => ({
        ...prev,
        profileUpdateAt: Date.now(),
        profile: response.image,
      }));
    } else {
      Alert.alert("Error", "Failed to upload image. Please try again later.");
    }
  };

  const handleTakePhoto = async () => {
    const cameraResult = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });
    if (!cameraResult.canceled) {
      uploadImage(cameraResult.assets[0].uri);
    }
    setModalVisible(false);
  };

  const handleChooseFromGallery = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
if (status !== 'granted') {
  Alert.alert('Permission required', 'Camera permission is needed to take a photo.');
  return;
}
    const galleryResult = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });
    if (!galleryResult.canceled) {
      uploadImage(galleryResult.assets[0].uri);
    }
    setModalVisible(false);
  };

  const handleRemoveProfile = async () => {
    const response = await deleteProfileImage();
    if (response.success) {
      Alert.alert("Success", "Profile image deleted successfully.");
      setUser((prev) => ({
        ...prev,
        profileUpdateAt: Date.now(),
        profile: undefined,
      }));
      setModalVisible(false);
    } else {
      Alert.alert("Error", "Failed to remove image. Please try again later.");
    }
  };

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
  };

  const handleUpdateAccount = async () => {
    const response = await updateProfile(user);
    if (response.success) {
      Alert.alert("Success", "Your account has been updated successfully.");
      router.push("/(app)/profile");
    } else {
      Alert.alert("Error", "Failed to delete account. Please try again later.");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollView}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity>
            <Ionicons name="arrow-back" size={24} color="#000" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Account Settings</Text>
          <TouchableOpacity></TouchableOpacity>
        </View>

        {/* Profile Section */}
        <View style={styles.profileSection}>
          <View style={styles.avatarContainer}>
            <View style={styles.avatar}>
              <Image
                source={
                  user.profile
                    ? { uri: user.profile }
                    : require("../../assets/user.png")
                }
                style={{ width: 70, height: 70, borderRadius: 100 }}
                cachePolicy={"none"}
              />
            </View>
            <>
              <TouchableOpacity
                style={styles.addButton}
                onPress={() => setModalVisible(true)}
              >
                <Ionicons name="add" size={20} color="#666" />
              </TouchableOpacity>

              <Modal
                visible={modalVisible}
                transparent
                animationType="fade"
                onRequestClose={() => setModalVisible(false)}
              >
                <TouchableOpacity
                  style={styles.modalOverlay}
                  onPress={() => setModalVisible(false)}
                >
                  <View style={styles.modalContent}>
                    <TouchableOpacity
                      style={styles.option}
                      onPress={handleTakePhoto}
                    >
                      <Ionicons name="camera" size={24} color="#666" />
                      <Text style={styles.optionText}>Take Photo</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.option}
                      onPress={handleChooseFromGallery}
                    >
                      <Ionicons name="images" size={24} color="#666" />
                      <Text style={styles.optionText}>Choose from Gallery</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.option}
                      onPress={handleRemoveProfile}
                    >
                      <Ionicons name="trash" size={24} color="red" />
                      <Text style={[styles.optionText, { color: "red" }]}>
                        Remove Profile
                      </Text>
                    </TouchableOpacity>
                  </View>
                </TouchableOpacity>
              </Modal>
            </>
          </View>
        </View>

        {/* Form Section */}
        <View style={styles.formSection}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Full Name</Text>
            <View style={styles.inputContainer}>
              <Feather name="user" size={20} color="#666" />
              <TextInput
                style={styles.input}
                value={user.fullName}
                onChangeText={handleChange("fullName")}
                placeholder="John Doe"
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email</Text>
            <View style={styles.inputContainer}>
              <Feather
                name="mail"
                size={20}
                color={user.emailEdit ? "#666" : "grey"}
              />
              <TextInput
                style={styles.input}
                value={user.email}
                onChangeText={handleChange("email")}
                keyboardType="email-address"
                placeholder="john@example.com"
                editable={user.emailEdit}
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
              onValueChange={(value) =>
                setUser((prev) => ({ ...prev, pushNotifications: value }))
              }
              trackColor={{ false: "#D1D1D1", true: "#34C759" }}
              thumbColor="#fff"
            />
          </View>
          <Text style={styles.notificationDescription}>
            Get notified about updates
          </Text>
        </View>

        <TouchableOpacity>
          <Text style={styles.saveButtonText} onPress={handleUpdateAccount}>
            Update Account
          </Text>
        </TouchableOpacity>
        {/* Delete Account Button */}
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={handleDeleteAccount}
        >
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
  saveButtonText: {
    backgroundColor: "#FF6B6B",
    color: "#fff",
    textAlign: "center",
    paddingVertical: 12,
    borderRadius: 8,
    fontWeight: "600",
    fontSize: 16,
    marginHorizontal: 16,
    marginTop: 24,
    marginBottom: 0,
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 24,
    minWidth: 250,
    alignItems: "flex-start",
  },
  option: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    width: "100%",
  },
  optionText: {
    marginLeft: 12,
    fontSize: 16,
    color: "#222",
  },
});
