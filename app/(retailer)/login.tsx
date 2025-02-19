
import { useEffect, useState } from 'react';
import { View, Image, Text, StyleSheet, TextInput, TouchableOpacity, Alert } from 'react-native';
import { Link, useRouter } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';
import { loginRetailer, forgotPassword } from '@/api/retailer/retailer';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function RetailerLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const logo = require('../../assets/logo.png');

  // ✅ Clear AsyncStorage only ONCE when app starts
  useEffect(() => {
    const clearStorage = async () => {
      try {
        await AsyncStorage.clear();
        console.log("✅ AsyncStorage cleared on app start!");
      } catch (error) {
        console.error("❌ Error clearing AsyncStorage:", error);
      }
    };
    clearStorage();
  }, []);

  // ✅ Handle Login
  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please enter both email and password");
      return;
    }
  
    console.log("📩 Sending login data:", { email, password });
  
    try {
      const response: { success: boolean; retailer?: any; message?: string; token?: string } = await loginRetailer(email, password);
      console.log("✅ Login response:", response);
  
      if (response?.success) {
        Alert.alert("Success", "Login successful");
        console.log("✅ Navigating to Dashboard...");
  
        // ✅ Store token in AsyncStorage
        if (response.token) {
          await AsyncStorage.setItem("token", response.token);
          console.log("✅ Token stored in AsyncStorage.");
        } else {
          console.warn("⚠️ No token found in login response.");
        }
  
        // ✅ Store retailer ID in AsyncStorage
        const retailerId = response.retailer?.id;
        if (retailerId !== undefined) {
          await AsyncStorage.setItem("retailer_id", JSON.stringify(retailerId));
          console.log("✅ Stored Retailer ID in AsyncStorage:", retailerId);
        } else {
          console.warn("⚠️ No retailer ID found in login response.");
        }
  
        router.push("/(retailer)/dashboard");
      } else {
        console.error("❌ Login Failed:", response?.message || "Unknown error");
        Alert.alert("Error", response?.message || "Login failed. Please try again.");
      }
    } catch (error) {
      console.error("❌ Login Error:", error);
      Alert.alert("Error", "Something went wrong. Please try again.");
    }
  };
  

  // ✅ Handle Forgot Password
  const handleForgotPassword = async () => {
    if (!email) {
      Alert.alert("Enter Email", "Please enter your email to reset your password.");
      return;
    }

    setLoading(true);
    const response = await forgotPassword(email);
    setLoading(false);

    if (response.success) {
      Alert.alert("Success", response.message);
      router.push(`/reset?email=${email}`);
    } else {
      Alert.alert("Error", response.message);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Retailer Sign In</Text>
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
          style={styles.loginButton}
          onPress={handleLogin} // ✅ Directly call handleLogin
        >
          <Text style={styles.loginButtonText}>Login</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.forgotPassword} onPress={handleForgotPassword}>
          <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
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
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '600',
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

  logo:{
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
    backgroundColor: '#FF6B6B',
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
  forgotPassword: {
    alignItems: 'center',
    marginTop: 16,
  },
  forgotPasswordText: {
    color: '#666',
    fontSize: 14,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 16,
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