import axios from "axios";
import * as Location from 'expo-location'
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Alert } from "react-native";
const API_URL = "http://192.168.0.104:3000/api/users"; // Change this to your backend URL if deployed

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
    await AsyncStorage.setItem("userId", user.id.toString());

    return { success: true, retailer };
  } catch (error: any) {
    return { success: false, message: error.response?.data?.message || "Login failed" };
  }
};

export const registerUserFromGoogle= async (
  name: string,
  email: string,
  phone_number: string,
  profile: string
) => {
  try {
    const {status} = await Location.requestForegroundPermissionsAsync();

    if(status !== 'granted'){
      Alert.alert("Permission Denied", "location permission is required");
      return;
    }

    const location = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.Highest,
    })

    let latitude = location.coords.latitude
    let longitude = location.coords.longitude

    const response = await axios.post(`${API_URL}/register/google`, {
        name,
        phone_number,
        email,
        profile,
        latitude: latitude, 
        longitude: longitude,
      });
    const { token, user} = response.data;

    // Store token for authentication
    await AsyncStorage.setItem("token", token);
    await AsyncStorage.setItem("userId", user.id.toString());

    return { success: true, user };
  } catch (error: any) {
    console.log(error)
    return { success: false, message: error.response?.data?.message || "Registration failed" };
  }
};

export const loginUserFromGoogle= async (
  email: string,
) => {
  try {
    const response = await axios.post(`${API_URL}/login/google`, {
        email,
      });
    const { token, user} = response.data;
    // Store token for authentication
    await AsyncStorage.setItem("token", token);
    await AsyncStorage.setItem("userId", user.id.toString());

    return { success: true, user };
  } catch (error: any) {
    console.log(error)
    return { success: false, message: error.response?.data?.message || "Registration failed" };
  }
};

// Forgot Password
export const forgotPassword = async (email: string) => {
  try {
    const response = await axios.post(`${API_URL}/api/users/sendpasswordmail`, { email });
    return { success: true, message: response.data.message || "Check your email for reset link" };
  } catch (error: any) {
    console.log(error)
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

export interface LocationDeal {
  deal_id: string;
  title: string;
  description: string;
  price: number;
  original_price: number;
  url: string;
  category: string;
  expires_at: string;
  retailer_name: string;
  retailer_location: string;
}

export const fetchNearbyDeals = async () => {
  try {
    const token = await AsyncStorage.getItem("token");

    if (!token) {
      return { success: false, message: "No token found" };
    }
    
    const response = await axios.get(
      `${API_URL}/api/deals/location`,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    return { 
      success: true, 
      data: response.data, 
      message: "Nearby deals fetched successfully" 
    };
  } catch (error: any) {
    console.log("Error fetching nearby deals:", error);
    return { 
      success: false, 
      message: error.response?.data?.message || "Failed to fetch nearby deals" 
    };
  }
};

// Function to parse the retailer_location field from the PostGIS format
export const parseLocation = (locationString: string) => {
  try {
    // The format is something like: "0101000020E61000006EC9607B1C345240CC24EA059F743340"
    // This is a PostGIS EWKB (Extended Well-Known Binary) format
    // For a simple app, we'll just extract the latitude and longitude
    // In a real-world app, you might want to use a GIS library to parse this properly
    
    // This is a simplified approach - you might need a better parser in production
    const coords = locationString.substring(18);
    const x = coords.substring(0, 16);
    const y = coords.substring(16, 32);
    
    // Convert hex to decimal (simplified example)
    const lat = parseFloat(parseInt(y, 16).toString()) / 1000000;
    const lng = parseFloat(parseInt(x, 16).toString()) / 1000000;
    
    return { lat, lng };
  } catch (error) {
    console.error("Error parsing location:", error);
    return { lat: 0, lng: 0 };
  }
};

// Calculate distance between two coordinates (in miles)
export const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
  const R = 3958.8; // Radius of the Earth in miles
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  const d = R * c;
  return d;
};

const toRad = (value: number) => {
  return value * Math.PI / 180;
};