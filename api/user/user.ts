import axios from "axios";
import * as Location from 'expo-location'
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Alert } from "react-native";
const API_URL = "http://192.168.0.106:3000/api/users"; // Change this to your backend URL if deployed

export const registerUser= async (
  name: string,
  email: string,
  password: string,
  phone_number: string,
) => {
  try {
    const {status} = await Location.requestForegroundPermissionsAsync();

    if(status !== 'granted'){
      Alert.alert("Permission Denied", "location permission ia required");
      return;
    }

    const location = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.Highest,
    })

    let latitude = location.coords.latitude
    let longitude = location.coords.longitude

    const response = await axios.post(`${API_URL}/register`, {
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
    const response = await axios.post(`${API_URL}/login`, {
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
    const response = await axios.post(`${API_URL}/sendpasswordmail`, { email });
    return { success: true, message: response.data.message || "Check your email for reset link" };
  } catch (error: any) {
    return { success: false, message: error.response?.data?.message || "Failed to send reset email" };
  }
};

// Reset Password
export const resetPassword = async (token: string, newPassword: string) => {
  try {
    const response = await axios.post(`${API_URL}/setpassword`, { token, newPassword });
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

    const response = await axios.get(`${API_URL}/profile`, {
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

    const response = await axios.put(`${API_URL}/profileupdate`, updatedData, {
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

    const response = await axios.delete(`${API_URL}/deleteuser`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    return { success: true, data: response.data, message: "Profile updated successfully" };
  } catch (error: any) {
    console.log(error)
    return { success: false, message: error.response?.data?.message || "Failed to update profile" };
  }
};
