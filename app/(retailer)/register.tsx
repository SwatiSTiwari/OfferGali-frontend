import { useState, useEffect } from "react";
import {
  ScrollView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Image,
} from "react-native";
import { Link, useRouter } from "expo-router";
import { FontAwesome } from "@expo/vector-icons";
import * as Google from "expo-auth-session/providers/google";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { registerRetailer, registerRetailerFromGoogle } from "@/api/retailer/retailer";

interface GoogleUser {
  name: string,
  category: string,
  location: string,
  phone_number: string,
  email: string,
  picture: string,
}

export default function RetailerRegister() {
  const [form, setForm] = useState({
    businessName: "",
    category: "",
    location: "",
    contactNumber: "",
    email: "",
    password: "",
  });

  const router = useRouter();
  const logo = require("../../assets/logo.png");
  const [request, response, promptAsync] = Google.useAuthRequest({
    androidClientId: process.env.EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID,
    scopes: ["profile", "email"],
  });

  useEffect(() => {
    if (response?.type === "success") {
      getUserInfo(response.authentication?.accessToken);
    }
  }, [response]);

  const getUserInfo = async (token: string | undefined) => {
  if (!token) return;
  try {
    const res = await fetch("https://www.googleapis.com/oauth2/v2/userinfo", {
      headers: { Authorization: `Bearer ${token}` },
    });
    const user = await res.json();
    await handleRegisterGoogle(user);
  } catch (error) {
    console.error("Google User Info Fetch Error:", error);
  }
};

  const handleRegisterGoogle = async (user: GoogleUser) => {
  try {
    console.log("Attempting Google registration with user data:", user);

    const response = await registerRetailerFromGoogle(
      user.name,                    // business_name
      "General",                    // category (default value)
      "Not specified",              // location/address (default value)
      "Not provided",               // phone_number (default value)
      user.picture,                 // image (Google profile picture)
      user.email                    // email
    );


    if (response?.success) {
      Alert.alert("Success", "Registered via Google successfully!");
      router.push("/(retailer)/login");
    } else {
      Alert.alert("Error", response?.message || "Registration failed");
      if (response?.message === "User already Exist! Please Login") {
        router.push("/(retailer)/login");
      }
    }
  } catch (error) {
    console.error("Google Registration Error:", error);
    Alert.alert("Error", "Something went wrong. Please try again.");
  }
};

  const handleChange = (key: keyof typeof form) => (value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleRegister = async () => {
    const { businessName, category, location, contactNumber, email, password } = form;

    if (!businessName || !category || !location || !contactNumber || !email || !password) {
      Alert.alert("Error", "Please fill all fields");
      return;
    }

    try {
      const response = await registerRetailer(
        businessName,
        category,
        location,
        contactNumber,
        email,
        password
      );

      if (response?.success) {
        Alert.alert("Success", "Retailer Registered");
        await AsyncStorage.setItem("retailerId", response.retailer.id.toString());
        router.push("/(retailer)/login");
      } else {
        Alert.alert("Error", response?.message);
      }
    } catch (error) {
      console.error("Registration Error:", error);
      Alert.alert("Error", "Something went wrong. Please try again.");
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Image
          source={require("@/assets/logo.png")}
          style={styles.logo}
        />
        <Text style={styles.title}>Retailer Sign Up</Text>
        <Text style={styles.subtitle}>Register your business</Text>
      </View>

      <View style={styles.form}>
        <View style={styles.inputContainer}>
          <FontAwesome name="building-o" size={20} color="#666" style={styles.inputIcon} />
          <TextInput placeholder="Business Name" style={styles.input} value={form.businessName} onChangeText={handleChange("businessName")} />
        </View>

        <View style={styles.inputContainer}>
          <FontAwesome name="tag" size={20} color="#666" style={styles.inputIcon} />
          <TextInput placeholder="Category" style={styles.input} value={form.category} onChangeText={handleChange("category")} />
        </View>

        <View style={styles.inputContainer}>
          <FontAwesome name="map-marker" size={20} color="#666" style={styles.inputIcon} />
          <TextInput placeholder="Location" style={styles.input} value={form.location} onChangeText={handleChange("location")} />
        </View>

        <View style={styles.inputContainer}>
          <FontAwesome name="phone" size={20} color="#666" style={styles.inputIcon} />
          <TextInput placeholder="Contact Number" style={styles.input} value={form.contactNumber} onChangeText={handleChange("contactNumber")} keyboardType="phone-pad" />
        </View>

        <View style={styles.inputContainer}>
          <FontAwesome name="envelope-o" size={20} color="#666" style={styles.inputIcon} />
          <TextInput placeholder="Email" style={styles.input} value={form.email} onChangeText={handleChange("email")} keyboardType="email-address" />
        </View>

        <View style={styles.inputContainer}>
          <FontAwesome name="lock" size={20} color="#666" style={styles.inputIcon} />
          <TextInput placeholder="Password" style={styles.input} value={form.password} onChangeText={handleChange("password")} secureTextEntry />
        </View>

        <TouchableOpacity style={styles.signupButton} onPress={handleRegister}>
          <Text style={styles.signupButtonText}>Sign up</Text>
        </TouchableOpacity>

        <View style={styles.dividerContainer}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>or</Text>
          <View style={styles.dividerLine} />
        </View>

        <Text style={styles.socialTitle}>Sign up with Google</Text>

        <TouchableOpacity style={styles.googleButton} onPress={() => promptAsync()}>
          <FontAwesome name="google" size={24} color="#DB4437" />
        </TouchableOpacity>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Already have an account? </Text>
          <Link href="/(retailer)/login" style={styles.link}>Sign in</Link>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 20,
  },
  header: {
    alignItems: "center",
    marginTop: 40,
    marginBottom: 40,
  },
  logo: {
    width: 100,
    height: 40,
    resizeMode: "contain",
    marginBottom: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: "600",
  },
  subtitle: {
    fontSize: 14,
    color: "#666",
  },
  form: {
    flex: 1,
    paddingBottom: 20,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E8F5E9",
    borderRadius: 8,
    paddingHorizontal: 16,
    height: 48,
    marginBottom: 16,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: "#333",
  },
  signupButton: {
    backgroundColor: "#FF6B6B",
    height: 48,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 8,
  },
  signupButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "500",
  },
  dividerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: "#eee",
  },
  dividerText: {
    marginHorizontal: 16,
    color: "#666",
  },
  socialTitle: {
    textAlign: "center",
    color: "#666",
    marginBottom: 16,
  },
  googleButton: {
    alignSelf: "center",
    borderWidth: 1,
    borderColor: "#eee",
    borderRadius: 24,
    width: 48,
    height: 48,
    justifyContent: "center",
    alignItems: "center",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
    marginBottom: 40,
    paddingVertical: 10,
  },
  footerText: {
    color: "#666",
    fontSize: 14,
  },
  link: {
    color: "#2196F3",
    fontWeight: "500",
    fontSize: 14,
    marginLeft: 5,
  },
});
