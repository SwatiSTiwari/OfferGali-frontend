import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Alert } from "react-native";
const API_URL = "http://192.168.0.102:3000/api/retailers"; // Change this to your backend URL if deployed

export const registerRetailer = async (
  business_name: string,
  category: string,
  location: string,
  phone_number: string,
  email: string,
  password: string
) => {
  try {
    const response = await axios.post(`${API_URL}/register`, {
        business_name,
        category,
        address: location, // Ensure this matches the backend field
        phone_number,
        email,
        password,
        latitude: 19.0358264, // Set defaults if you don't collect them
        longitude: 72.9076564,
      });

    const { token, retailer } = response.data;

    // Store token for authentication
    await AsyncStorage.setItem("token", token);

    return { success: true, retailer };
  } catch (error: any) {
    return { success: false, message: error.response?.data?.message || "Registration failed" };
  }
};

export const loginRetailer = async (email: string, password: string) => {
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


// register with Google
export const registerRetailerFromGoogle = async (
  business_name: string,
  category: string,
  location: string,
  phone_number: string,
  image: string,        // Changed from profile to image
  email: string
) => {
  try {
    const response = await axios.post(`${API_URL}/register/google`, {  // Updated endpoint
      email,
      password: "google_auth_placeholder",  // Add required password field
      business_name,
      phone_number: phone_number || "Not provided",  // Provide default if empty
      category: category || "General",               // Provide default if empty
      latitude: 19.0358264,
      longitude: 72.9076564,
      address: location || "Not specified",          // Provide default if empty
      image: image || null                           // Use image instead of profile
    });

    console.log("Google registration response:", response.data);

    const { token, retailer } = response.data;
    
    if (token && retailer) {
      // Store token for authentication
      await AsyncStorage.setItem("token", token);
      await AsyncStorage.setItem("retailerID", retailer.id.toString());
      
      return { success: true, retailer };
    } else {
      return { success: false, message: "Invalid response from server" };
    }
  } catch (error: any) {
    console.log("Google registration error:", error);
    console.log("Error response:", error.response?.data);
    
    return { 
      success: false, 
      message: error.response?.data?.message || "Google registration failed" 
    };
  }
};

// login with Google
export const loginRetailerFromGoogle= async (
  email: string, password: string
) => {
  try {
    const response = await axios.post(`${API_URL}/login/google`, {
        email,
        password,
      });
    const { token, retailer } = response.data;
    // Store token for authentication
    await AsyncStorage.setItem("token", token);
    await AsyncStorage.setItem("userId", retailer.id.toString());

    return { success: true, retailer };
  } catch (error: any) {
    console.log(error)
    return { success: false, message: error.response?.data?.message || "login failed" };
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
    return { success: false, message: error.response?.data?.message || "Failed to update profile" };
  }
};
