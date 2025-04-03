import axios from "axios";
import * as Location from 'expo-location'
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Alert } from "react-native";
const API_URL = "https://spx239g8-4001.inc1.devtunnels.ms"; // Change this to your backend URL if deployed

export const registerUser = async (
  name: string,
  email: string,
  password: string,
  phone_number: string,
) => {
  try {
    const { status } = await Location.requestForegroundPermissionsAsync();

    if (status !== 'granted') {
      Alert.alert("Permission Denied", "location permission ia required");
      return;
    }

    const location = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.Highest,
    })

    let latitude = location.coords.latitude
    let longitude = location.coords.longitude

    const response = await axios.post(`${API_URL}/api/users/register`, {
      name,
      phone_number,
      email,
      password,
      latitude: latitude,
      longitude: longitude,
    });
    const { token, user } = response.data;

    // Store token for authentication
    await AsyncStorage.setItem("token", token);

    return { success: true, user };
  } catch (error: any) {
    console.log(error)
    return { success: false, message: error.response?.data?.message || "Registration failed" };
  }
};

export const loginUser = async (email: string, password: string) => {
  try {
    const response = await axios.post(`${API_URL}/api/users/login`, {
      email,
      password,
    });

    console.log("Login response:", response.data);

    const { token, retailer } = response.data;

    // Store token for authentication
    await AsyncStorage.setItem("token", token);

    return { success: true, retailer };
  } catch (error: any) {
    return { success: false, message: error.response?.data?.message || "Login failed" };
  }
};

// Forgot Password
export const forgotPassword = async (email: string) => {
  try {
    const response = await axios.post(`${API_URL}/api/users/sendpasswordmail`, { email });
    return { success: true, message: response.data.message || "Check your email for reset link" };
  } catch (error: any) {
    return { success: false, message: error.response?.data?.message || "Failed to send reset email" };
  }
};

// Reset Password
export const resetPassword = async (token: string, newPassword: string) => {
  try {
    const response = await axios.post(`${API_URL}/api/users/setpassword`, { token, newPassword });
    return { success: true, message: response.data.message || "Password reset successfully" };
  } catch (error: any) {
    return { success: false, message: error.response?.data?.message || "Failed to reset password" };
  }
};


// 🔹 Fetch Profile
export const getProfile = async () => {
  try {
    const token = await AsyncStorage.getItem("token");

    if (!token) {
      return { success: false, message: "No token found" };
    }

    const response = await axios.get(`${API_URL}/api/users/profile`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    return { success: true, data: response.data };
  } catch (error: any) {
    return { success: false, message: "Unauthorized" };
  }
};

// 🔹 Update Profile (Including Image URL)
export const updateProfile = async (updatedData: any) => {
  try {
    const token = await AsyncStorage.getItem("token");

    if (!token) {
      return { success: false, message: "No token found" };
    }

    const response = await axios.put(`${API_URL}/api/users/profileupdate`, updatedData, {
      headers: { Authorization: `Bearer ${token}` },
    });

    return { success: true, data: response.data, message: "Profile updated successfully" };
  } catch (error: any) {
    console.log(error)
    return { success: false, message: error.response?.data?.message || "Failed to update profile" };
  }
};

export const deleteProfile = async () => {
  try {
    const token = await AsyncStorage.getItem("token");

    if (!token) {
      return { success: false, message: "No token found" };
    }

    const response = await axios.delete(`${API_URL}/api/users/deleteuser`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    return { success: true, data: response.data, message: "Profile updated successfully" };
  } catch (error: any) {
    console.log(error)
    return { success: false, message: error.response?.data?.message || "Failed to update profile" };
  }
};


export const fetchNotifications = async () => {
  try {
    const token = await AsyncStorage.getItem("token");

    if (!token) {
      return { success: false, message: "No token found" };
    }

    const response = await axios.get(`${API_URL}/api/notifications`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    return { success: true, data: response.data, message: "Notifications fetched successfully" };
  } catch (error: any) {
    console.log("Error fetching notifications:", error);
    return { success: false, message: error.response?.data?.message || "Failed to fetch notifications" };
  }
};

// Function to mark a notification as read
export const markNotificationAsRead = async (notificationId: string) => {
  try {
    const token = await AsyncStorage.getItem("token");

    if (!token) {
      return { success: false, message: "No token found" };
    }
    
    const response = await axios.patch(
      `${API_URL}/api/notifications/${notificationId}/read`,
      { notification_id: notificationId },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    return { success: true, data: response.data, message: "Notification marked as read" };
  } catch (error: any) {
    console.log("Error marking notification as read:", error);
    return { success: false, message: error.response?.data?.message || "Failed to mark notification as read" };
  }
};

