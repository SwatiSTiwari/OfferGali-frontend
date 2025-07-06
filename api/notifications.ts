import axios from "axios";
import * as Location from 'expo-location'
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Alert } from "react-native";

const API_URL = `${process.env.EXPO_PUBLIC_BACKEND_API_URL}/api/notifications`;

// Type definitions based on your backend response structure
export interface Deal {
  id: string;
  title: string;
  description: string;
  images?: string[];
  category: string;
  expiration_date: string;
  redemption_instructions?: string;
  retailer_id: string;
  engagements?: number;
  views?: number;
}

export interface Notification {
  id: string;
  user_id: string;
  deal_id?: string;
  message: string;
  is_read: boolean;
  created_at: string;
  deals?: Deal; // Related deal data from the join
}

export interface NotificationResponse {
  success: boolean;
  data: {
    notifications: Notification[];
  };
  message: string;
}

export const fetchNotifications = async (): Promise<NotificationResponse> => {
  try {
    const token = await AsyncStorage.getItem("token");

    if (!token) {
      return { success: false, data: { notifications: [] }, message: "No token found" };
    }

    console.log('Fetching notifications from:', API_URL);
    console.log('Using token:', token ? 'Token exists' : 'No token');

    const response = await axios.get(API_URL, {
      headers: { 
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      timeout: 10000 // 10 second timeout
    });

    // Your backend returns { success: true, data: { notifications: [...] }, message: "..." }
    if (response.data.success) {
      return {
        success: true,
        data: response.data.data,
        message: response.data.message
      };
    } else {
      // Fallback handling
      return { 
        success: true, 
        data: { notifications: response.data || [] }, 
        message: "Notifications fetched successfully" 
      };
    }
  } catch (error: any) {
    console.error("Error fetching notifications:", error);
    
    if (error.code === 'ECONNABORTED') {
      return { success: false, data: { notifications: [] }, message: "Request timeout - please check your connection" };
    }
    
    if (error.response) {
      console.error("Error response:", error.response.data);
      console.error("Error status:", error.response.status);
      
      if (error.response.status === 404) {
        return { success: false, data: { notifications: [] }, message: "Notifications endpoint not found - please check backend setup" };
      }
      
      if (error.response.status === 401) {
        return { success: false, data: { notifications: [] }, message: "Unauthorized - please login again" };
      }
      
      return { 
        success: false, 
        data: { notifications: [] },
        message: error.response.data?.message || error.response.data?.error || "Failed to fetch notifications" 
      };
    }
    
    if (error.request) {
      return { success: false, data: { notifications: [] }, message: "No response from server - please check your connection" };
    }
    
    return { success: false, data: { notifications: [] }, message: "Failed to fetch notifications" };
  }
};

export const markNotificationAsRead = async (notificationId: string) => {
  try {
    const token = await AsyncStorage.getItem("token");

    if (!token) {
      return { success: false, message: "No token found" };
    }

    console.log('Marking notification as read:', notificationId);

    const response = await axios.patch(
      `${API_URL}/${notificationId}/read`,
      {}, // Empty body - notification ID is in URL
      { 
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        timeout: 10000
      }
    );

    console.log('Mark as read response:', response.data);

    // Your backend returns { success: true, data: updatedNotification, message: "..." }
    return response.data.success 
      ? response.data 
      : { success: true, data: response.data, message: "Notification marked as read" };

  } catch (error: any) {
    console.error("Error marking notification as read:", error);
    
    if (error.response) {
      return { 
        success: false, 
        message: error.response.data?.message || error.response.data?.error || "Failed to mark notification as read" 
      };
    }
    
    return { success: false, message: "Failed to mark notification as read" };
  }
};

// Get nearby deals for the user
export const getNearbyDeals = async (latitude: number, longitude: number) => {
  try {
    const token = await AsyncStorage.getItem("token");

    if (!token) {
      return { success: false, message: "No token found", deals: [] };
    }

    console.log('Fetching nearby deals for location:', { latitude, longitude });

    const response = await axios.get(`${API_URL}/nearby-deals`, {
      params: { latitude, longitude },
      headers: { 
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      timeout: 10000
    });

    console.log('Nearby deals response:', response.data);

    return {
      success: true,
      deals: response.data.deals || [],
      message: response.data.message || "Nearby deals fetched successfully"
    };

  } catch (error: any) {
    console.error("Error fetching nearby deals:", error);
    
    if (error.response) {
      return { 
        success: false, 
        deals: [],
        message: error.response.data?.message || error.response.data?.error || "Failed to fetch nearby deals" 
      };
    }
    
    return { success: false, deals: [], message: "Failed to fetch nearby deals" };
  }
};

// Notify user about nearby deals when entering a location
export const notifyNearbyDeals = async (latitude: number, longitude: number, locationName: string) => {
  try {
    const token = await AsyncStorage.getItem("token");

    if (!token) {
      return { success: false, message: "No token found" };
    }

    console.log('=== LOCATION-BASED NOTIFICATIONS DEBUG ===');
    console.log('Creating notifications for location entry:', { latitude, longitude, locationName });
    console.log('Mumbai coordinates for reference: ~19.0760, 72.8777');
    console.log('Distance from Mumbai (rough calc):', 
      Math.sqrt(Math.pow(latitude - 19.0760, 2) + Math.pow(longitude - 72.8777, 2)) * 111, 'km');
    
    const response = await axios.post(`${API_URL}/notify-nearby`, {
      latitude,
      longitude,
      location_name: locationName
    }, {
      headers: { 
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      timeout: 10000
    });

    console.log('=== BACKEND RESPONSE ===');
    console.log('Response status:', response.status);
    console.log('Response data:', JSON.stringify(response.data, null, 2));

    return {
      success: true,
      message: response.data.message || "Notifications created successfully",
      dealsCount: response.data.dealsCount || 0
    };

  } catch (error: any) {
    console.error("=== ERROR CREATING NEARBY NOTIFICATIONS ===");
    console.error("Error message:", error.message);
    
    if (error.response) {
      console.error("Response status:", error.response.status);
      console.error("Response data:", JSON.stringify(error.response.data, null, 2));
      
      return { 
        success: false, 
        message: error.response.data?.message || error.response.data?.error || "Failed to create notifications" 
      };
    }
    
    if (error.code === 'ECONNABORTED') {
      return { success: false, message: "Request timeout - server might be slow" };
    }
    
    return { success: false, message: "Failed to create notifications - network error" };
  }
};

// Helper function to get user's current location and trigger nearby deals notification
export const triggerLocationBasedNotifications = async (locationName?: string) => {
  try {
    console.log('=== TRIGGERING LOCATION-BASED NOTIFICATIONS ===');
    console.log('Provided location name:', locationName);
    
    // Request location permissions
    const { status } = await Location.requestForegroundPermissionsAsync();
    console.log('Location permission status:', status);
    
    if (status !== 'granted') {
      Alert.alert('Permission denied', 'Permission to access location was denied');
      return { success: false, message: "Location permission denied" };
    }

    // Get current location
    console.log('Getting current location...');
    const location = await Location.getCurrentPositionAsync({});
    const { latitude, longitude } = location.coords;

    console.log('=== CURRENT LOCATION ===');
    console.log('Latitude:', latitude);
    console.log('Longitude:', longitude);
    console.log('Accuracy:', location.coords.accuracy);

    // If no location name provided, try to get it from reverse geocoding
    let finalLocationName = locationName;
    if (!finalLocationName) {
      try {
        console.log('Getting location name from reverse geocoding...');
        const reverseGeocode = await Location.reverseGeocodeAsync({ latitude, longitude });
        console.log('Reverse geocode result:', reverseGeocode);
        
        if (reverseGeocode.length > 0) {
          const address = reverseGeocode[0];
          finalLocationName = address.city || address.district || address.subregion || 'Unknown Location';
          console.log('Detected location name:', finalLocationName);
        }
      } catch (geocodeError) {
        console.log('Reverse geocoding failed:', geocodeError);
        finalLocationName = 'Current Location';
      }
    }

    console.log('Final location name:', finalLocationName);

    // Trigger nearby deals notification
    return await notifyNearbyDeals(latitude, longitude, finalLocationName || 'Current Location');

  } catch (error: any) {
    console.error("=== ERROR TRIGGERING LOCATION NOTIFICATIONS ===");
    console.error("Error message:", error.message);
    console.error("Error code:", error.code);
    return { success: false, message: "Failed to get location or create notifications: " + error.message };
  }
};

// Test function to check API connectivity
export const testNotificationAPI = async () => {
  try {
    const token = await AsyncStorage.getItem("token");
    console.log('Testing API connectivity...');
    console.log('API URL:', API_URL);
    console.log('Token exists:', !!token);
    console.log('Full API URL:', API_URL);
    
    if (!token) {
      console.log('No authentication token found');
      return false;
    }
    
    const response = await axios.get(API_URL, {
      headers: { 
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      timeout: 10000
    });
    
    console.log('API test successful:', response.status);
    return true;
  } catch (error: any) {
    console.error('=== API TEST FAILED ===');
    console.error('Error message:', error.message);
    console.error('API URL:', API_URL);
    
    if (error.code === 'ECONNABORTED') {
      console.error('Request timeout - server might be down');
    } else if (error.code === 'ECONNREFUSED') {
      console.error('Connection refused - server not running on specified port');
    } else if (error.code === 'ENOTFOUND') {
      console.error('Host not found - check IP address');
    }
    
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
      
      // If we get a response, even an error response, it means the server is reachable
      if (error.response.status === 401) {
        console.log('Server is reachable but authentication failed');
        return false; // Authentication issue, not connectivity
      } else if (error.response.status === 404) {
        console.log('Server is reachable but endpoint not found');
        return false; // Endpoint issue
      }
    } else if (error.request) {
      console.error('No response received from server');
      console.error('This usually means:');
      console.error('1. Backend server is not running');
      console.error('2. Wrong IP address or port');
      console.error('3. Network connectivity issues');
      console.error('4. Firewall blocking the connection');
    }
    
    return false;
  }
};

// Network troubleshooting helper
export const diagnoseConnection = async () => {
  const baseUrl = process.env.EXPO_PUBLIC_BACKEND_API_URL;
  
  console.log('=== CONNECTION DIAGNOSIS ===');
  console.log('Base URL:', baseUrl);
  console.log('Full API URL:', API_URL);
  
  if (!baseUrl) {
    console.error('EXPO_PUBLIC_BACKEND_API_URL is not defined!');
    return {
      success: false,
      message: 'Backend API URL is not configured. Please check your .env file.'
    };
  }
  
  try {
    // Test basic connectivity to the base URL
    console.log('Testing base URL connectivity...');
    const baseResponse = await axios.get(baseUrl, { timeout: 5000 });
    console.log('Base URL is reachable:', baseResponse.status);
    
    return {
      success: true,
      message: 'Base URL is reachable. The issue might be with authentication or the specific endpoint.'
    };
  } catch (error: any) {
    console.error('Base URL test failed:', error.message);
    
    if (error.code === 'ECONNREFUSED') {
      return {
        success: false,
        message: `Cannot connect to ${baseUrl}. Please ensure your backend server is running on the correct port.`
      };
    } else if (error.code === 'ENOTFOUND') {
      return {
        success: false,
        message: `Cannot find server at ${baseUrl}. Please check if the IP address is correct.`
      };
    } else if (error.code === 'ECONNABORTED') {
      return {
        success: false,
        message: `Connection timeout to ${baseUrl}. Server might be slow or unreachable.`
      };
    }
    
    return {
      success: false,
      message: `Connection failed: ${error.message}`
    };
  }
};
