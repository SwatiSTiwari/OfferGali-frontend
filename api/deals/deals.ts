import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const API_URL = `${process.env.EXPO_PUBLIC_BACKEND_API_URL}/api/deals`; // change ip in .env 

/**
 * Add a new deal for a retailer
 * @param deal - Object containing deal details
 * @returns API response
 */
export const addDeal = async (deal: {
  title: string;
  description: string;
  images: string[];
  category: string;
  expiration_date: string;
  redemption_instructions: string;
  engagements: number;
  views: number;
}) => {
  try {
    const token = await AsyncStorage.getItem("token");

    if (!token) {
      return { success: false, message: "Unauthorized. No token found" };
    }

    const response = await axios.post(`${API_URL}/add`, deal, {
      headers: { Authorization: `Bearer ${token}` },
    });

    return { success: true, deal: response.data };
  } catch (error: any) {
    return { success: false, message: error.response?.data?.error || "Failed to add deal" };
  }
};


export const fetchNearbyDeals = async ({ latitude, longitude }: { latitude: number, longitude: number }) => {
  try {
    const token = await AsyncStorage.getItem("token");

    if (!token) {
      return { success: false, message: "No token found" };
    }

    const response = await axios.get(
      // `${API_URL}/location?latitude=19.03582640&longitude=72.90765640`,
       `${API_URL}/location?latitude=${latitude}&longitude=${longitude}`,
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


export const editDeal = async (
  dealId: string, // Add dealId as a parameter
  deal: {
    title: string;
    description: string;
    images: string[];
    category: string;
    expiration_date: string;
    redemption_instructions: string;
    engagements: number;
    views: number;
  }
) => {
  try {
    const token = await AsyncStorage.getItem("token");

    if (!token) {
      return { success: false, message: "Unauthorized. No token found" };
    }

    const response = await axios.put(`${API_URL}/edit/${dealId}`, deal, {
      headers: { Authorization: `Bearer ${token}` },
    });

    return { success: true, deal: response.data };
  } catch (error: any) {
    return { success: false, message: error.response?.data?.error || "Failed to edit deal" };
  }
};


/**
 * Fetch all deals for a retailer
 * @returns API response with deals
 */
export const getAllDeals = async () => {
  try {
    const token = await AsyncStorage.getItem("token");

    if (!token) {
      console.error("No token found in AsyncStorage");
      return { success: false, message: "Unauthorized. No token found", deals: [] };
    }

    console.log("Fetching Deals...");

    const response = await axios.get(`${API_URL}/all`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    console.log("Deals API Response:", response.data);

    return { success: true, deals: response.data };
  } catch (error: any) {
    console.error("API Error:", error.response?.data || error.message);
    return { success: false, message: error.response?.data?.error || "Failed to fetch deals", deals: [] };
  }
};

/**
 * Fetch analytics data for a specific deal
 * @param dealId - ID of the deal
 * @returns API response with analytics data
 */
export const getDealAnalytics = async (dealId: string) => {
  try {
    const token = await AsyncStorage.getItem("token");

    if (!token) {
      return { success: false, message: "Unauthorized. No token found" };
    }

    const response = await axios.get(`${API_URL}/analytics/${dealId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    return { success: true, analytics: response.data };
  } catch (error: any) {
    return { success: false, message: error.response?.data?.error || "Failed to fetch analytics data" };
  }
};

/**
 * Fetch  data for a specific deal
 * @param dealId - ID of the deal
 */
export const getDealsById = async (dealId: string) => {
  try {
    const token = await AsyncStorage.getItem("token");

    if (!token) {
      return { success: false, message: "Unauthorized. No token found" };
    }

    const response = await axios.get(`${API_URL}/${dealId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    return { success: true, data: response.data };
  } catch (error: any) {
    return { success: false, message: error.response?.data?.error || "Failed to fetch analytics data" };
  }
};
