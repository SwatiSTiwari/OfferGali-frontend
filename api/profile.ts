import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
const API_URL = `${process.env.EXPO_PUBLIC_BACKEND_API_URL}/api/profile`; // Change ip in .env

// 🔹 Fetch Profile
export const getProfile = async (role: string) => {
  try {
    const token = await AsyncStorage.getItem("token");

    if (!token) {
      return { success: false, message: "No token found" };
    }

    const response = await axios.get(`${API_URL}/get`, {
      headers: { Authorization: `Bearer ${token}` },
      params: { table: role }, 
    });

    return { success: true, data: response.data };
  } catch (error: any) {
    console.log(error)
    return { success: false, message: error.response?.data?.message || "Failed to fetch profile" };
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

    return { success: true,  message: "Profile updated successfully" };
  } catch (error: any) {
    console.log(error)
    return { success: false, message: error.response?.data?.message || "Failed to update profile" };
  }
};

export const updateProfileImage = async (updatedDataForm: any) => {
  try {
    const token = await AsyncStorage.getItem("token");

    if (!token) {
      return { success: false, message: "No token found" };
    }

     const response = await axios.put(`${API_URL}/profileimageupdate`, updatedDataForm, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    });

    return { success: true, message: response.data.message || "Profile image updated successfully" , image: response.data.image};
  } catch (error: any) {
    console.log(error)
    return { success: false, message: error.response?.data?.message || "Failed to update profile" };
  }
};

export const deleteProfileImage = async (role: string) => {
  try {
    const token = await AsyncStorage.getItem("token");

    if (!token) {
      return { success: false, message: "No token found" };
    }

     const response = await axios.delete(`${API_URL}/profileimagedelete`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: { table: role }, 
    });

    return { success: true, message: response.data.message || "Profile image deleted successfully"};
  } catch (error: any) {
    console.log(error)
    return { success: false, message: error.response?.data?.message || "Failed to update image" };
  }
};

export const deleteProfile = async (role: string) => {
  try {
    const token = await AsyncStorage.getItem("token");

    if (!token) {
      return { success: false, message: "No token found" };
    }

    const response = await axios.delete(`${API_URL}/deleteuser`, {
      headers: { Authorization: `Bearer ${token}` },
      params: { table: role }, 
    });

    return { success: true, data: response.data, message: "Profile Deleted successfully" };
  } catch (error: any) {
    console.log(error)
    return { success: false, message: error.response?.data?.message || "Failed to update profile" };
  }
};

