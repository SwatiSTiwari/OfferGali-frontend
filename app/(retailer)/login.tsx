import { useEffect, useState } from 'react';
import { View, Image, Text, StyleSheet, TextInput, TouchableOpacity, Alert } from 'react-native';
import { Link, useRouter } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';
import { loginRetailer, forgotPassword, loginRetailerFromGoogle } from '@/api/retailer/retailer';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Google from "expo-auth-session/providers/google";

interface GoogleUser {
  id: string;
  email: string;
  name: string;
  picture: string;
  given_name?: string;
  family_name?: string;
}

export default function RetailerLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const logo = require('../../assets/logo.png');

  // Google OAuth setup
  const [request, response, promptAsync] = Google.useAuthRequest({
    androidClientId: process.env.EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID,
    scopes: ["profile", "email"],
  });

  // Clear AsyncStorage only ONCE when app starts
  // useEffect(() => {
  //   const clearStorage = async () => {
  //     try {
  //       await AsyncStorage.clear();
  //       console.log("AsyncStorage cleared on app start!");
  //     } catch (error) {
  //       console.error("Error clearing AsyncStorage:", error);
  //     }
  //   };
  //   clearStorage();
  // }, []);

  // Handle Google OAuth response
  useEffect(() => {
    if (response?.type === "success") {
      getUserInfo(response.authentication?.accessToken);
    }
  }, [response]);

  // Get user info from Google
  const getUserInfo = async (token: string | undefined) => {
    if (!token) return;
    try {
      const res = await fetch("https://www.googleapis.com/oauth2/v2/userinfo", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const user: GoogleUser = await res.json();
      await handleGoogleLogin(user);
    } catch (error) {
      console.error("Google User Info Fetch Error:", error);
      Alert.alert("Error", "Failed to get user information from Google");
    }
  };

  // Handle Google Login
  const handleGoogleLogin = async (user: GoogleUser) => {
    try {
      setLoading(true);
      console.log("Attempting Google login with email:", user.email);

      const response: { success: boolean; retailer?: any; message?: string; token?: string } = await loginRetailerFromGoogle(user.email, "google_auth_user");

      if (response?.success) {
        Alert.alert("Success", "Login successful via Google!");

        // Store token in AsyncStorage
        if (response.token) {
          await AsyncStorage.setItem("token", response.token);
          console.log("Token stored in AsyncStorage.");
        }

        // Store retailer ID in AsyncStorage
        const retailerId = response.retailer?.id;
        if (retailerId !== undefined) {
          await AsyncStorage.setItem("retailer_id", JSON.stringify(retailerId));
          console.log("Stored Retailer ID in AsyncStorage:", retailerId);
        }

        router.push("/(retailer)/dashboard");
      } else {
        console.log("Google login failed:", response?.message);
        if (response?.message === "Retailer not found") {
          Alert.alert(
            "Account Not Found", 
            "No account found with this Google email. Would you like to register?",
            [
              { text: "Cancel", style: "cancel" },
              { 
                text: "Register", 
                onPress: () => router.push("/(retailer)/register") 
              }
            ]
          );
        } else {
          Alert.alert("Error", response?.message || "Google login failed");
        }
      }
    } catch (error) {
      console.error("Google Login Error:", error);
      Alert.alert("Error", "Something went wrong with Google login. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Handle regular email/password login
  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please enter both email and password");
      return;
    }

    console.log("Sending login data:", { email, password });

    try {
      setLoading(true);
      const response: { success: boolean; retailer?: any; message?: string; token?: string } = await loginRetailer(email, password);

      if (response?.success) {
        Alert.alert("Success", "Login successful");

        // Store token in AsyncStorage
        if (response.token) {
          await AsyncStorage.setItem("token", response.token);
          console.log("Token stored in AsyncStorage.");
        } else {
          console.warn("No token found in login response.");
        }

        // Store retailer ID in AsyncStorage
        const retailerId = response.retailer?.id;
        if (retailerId !== undefined) {
          await AsyncStorage.setItem("retailer_id", JSON.stringify(retailerId));
          console.log("Stored Retailer ID in AsyncStorage:", retailerId);
        } else {
          console.warn("No retailer ID found in login response.");
        }

        router.push("/(retailer)/dashboard");
      } else {
        console.error("Login Failed:", response?.message || "Unknown error");
        Alert.alert("Error", response?.message || "Login failed. Please try again.");
      }
    } catch (error) {
      console.error("Login Error:", error);
      Alert.alert("Error", "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Handle Forgot Password
  const handleForgotPassword = () => {
    console.log("Redirecting to Forgot Password Page...");
    router.push("/forgetpass");
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <FontAwesome name="arrow-left" size={20} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Retailer Sign In</Text>
        <View style={{ width: 20 }} />
      </View>

      <View style={styles.iconContainer}>
        <Image source={logo} style={styles.logo} />
      </View>

      <View style={styles.formContainer}>
        <Text style={styles.formTitle}>Sign in to your retail account</Text>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Email</Text>
          <View style={styles.inputContainer}>
            <FontAwesome name="envelope-o" size={20} color="#666" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Enter your email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              placeholderTextColor="#999"
            />
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Password</Text>
          <View style={styles.inputContainer}>
            <FontAwesome name="lock" size={20} color="#666" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Enter your password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              placeholderTextColor="#999"
            />
          </View>
        </View>

        <TouchableOpacity 
          style={[styles.loginButton, loading && styles.buttonDisabled]}
          onPress={handleLogin}
          disabled={loading}
        >
          <Text style={styles.loginButtonText}>
            {loading ? "Signing in..." : "Login"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.forgotPassword} onPress={handleForgotPassword}>
          <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
        </TouchableOpacity>

        {/* Google Sign In Section */}
        <View style={styles.dividerContainer}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>or</Text>
          <View style={styles.dividerLine} />
        </View>

        <Text style={styles.socialTitle}>Sign in with Google</Text>

        <TouchableOpacity 
          style={[styles.googleButton, loading && styles.buttonDisabled]} 
          onPress={() => promptAsync()}
          disabled={loading}
        >
          <FontAwesome name="google" size={24} color="#FF6F61" />
        </TouchableOpacity>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Don't have an account? </Text>
          <TouchableOpacity onPress={() => router.push("/(retailer)/register")}>
            <Text style={styles.link}>Sign up</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    paddingTop: 50,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  iconContainer: {
    alignItems: 'center',
    marginTop: 40,
    marginBottom: 24,
  },
  formContainer: {
    margin: 20,
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E8F5E9',
    backgroundColor: '#fff',
  },
  logo: {
    width: 150,
    height: 60,
  },
  formTitle: {
    fontSize: 14,
    color: '#333',
    marginBottom: 24,
    textAlign: 'center',
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    color: '#333',
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E8F5E9',
    borderRadius: 8,
    paddingHorizontal: 12,
    backgroundColor: '#fff',
  },
  inputIcon: {
    marginRight: 10,
    width: 20,
    textAlign: 'center',
  },
  input: {
    flex: 1,
    height: 44,
    fontSize: 14,
    color: '#333',
  },
  loginButton: {
    backgroundColor: '#FF6F61',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  forgotPassword: {
    alignItems: 'center',
    marginTop: 16,
  },
  forgotPasswordText: {
    color: '#666',
    fontSize: 14,
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#eee',
  },
  dividerText: {
    marginHorizontal: 16,
    color: '#666',
  },
  socialTitle: {
    textAlign: 'center',
    color: '#666',
    marginBottom: 16,
  },
  googleButton: {
    alignSelf: 'center',
    borderWidth: 1,
    borderColor: '#eee',
    borderRadius: 24,
    width: 48,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  footerText: {
    color: '#666',
    fontSize: 14,
  },
  link: {
    color: '#2196F3',
    fontSize: 14,
    fontWeight: '500',
  },
});
