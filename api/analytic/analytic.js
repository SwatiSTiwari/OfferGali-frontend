import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const API_URL = "http://192.168.0.103:3000/api/analytics"; // Your backend API URL

// Helper to get the auth token
const getAuthHeader = async () => {
  const token = await AsyncStorage.getItem("token");
  return { Authorization: `Bearer ${token}` };
};

export const recordInteraction = async (dealId, interactionType) => {
  try {
    const userId = await AsyncStorage.getItem("userId");
    
    if (!userId) {
      return { success: false, message: "User not logged in" };
    }
    
    const headers = await getAuthHeader();c
    const response = await axios.post(
      `${API_URL}/analytics/interactions`,
      {
        user_id: userId,
        deal_id: dealId,
        interaction_type: interactionType
      },
      { headers }
    );
    
    return { success: true, data: response.data };
  } catch (error) {
    console.error("Error recording interaction:", error);
    return { 
      success: false, 
      message: error.response?.data?.error || "Failed to record interaction"
    };
  }
};

export const getUserAnalytics = async () => {
  try {
    const headers = await getAuthHeader();
    const response = await axios.get(
      `${API_URL}/analytics/user`,
      { headers }
    );
    
    return { success: true, data: response.data };
  } catch (error) {
    console.error("Error fetching user analytics:", error);
    return { 
      success: false, 
      message: error.response?.data?.error || "Failed to fetch analytics"
    };
  }
};

export const getRetailerAnalytics = async () => {
  try {
    const headers = await getAuthHeader();
    const response = await axios.get(
      `${API_URL}/analytics/retailer`,
      { headers }
    );
    
    return { success: true, data: response.data };
  } catch (error) {
    console.error("Error fetching retailer analytics:", error);
    return { 
      success: false, 
      message: error.response?.data?.error || "Failed to fetch analytics"
    };
  }
};

export const getDealAnalytics = async (dealId) => {
  try {
    const headers = await getAuthHeader();
    const response = await axios.get(
      `${API_URL}/analytics/deals/${dealId}`,
      { headers }
    );
    
    return { success: true, data: response.data };
  } catch (error) {
    console.error("Error fetching deal analytics:", error);
    return { 
      success: false, 
      message: error.response?.data?.error || "Failed to fetch analytics"
    };
  }
};

export const getTrendingDeals = async () => {
  try {
    const response = await axios.get(`${API_URL}/analytics/trending`);
    return { success: true, data: response.data };
  } catch (error) {
    console.error("Error fetching trending deals:", error);
    return { 
      success: false, 
      message: error.response?.data?.error || "Failed to fetch trending deals"
    };
  }
};