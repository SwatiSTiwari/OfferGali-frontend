import { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';
import { loginUser, loginUserFromGoogle } from '@/api/user/user';
import { forgotPassword } from '@/api/user/user';
import * as Google from "expo-auth-session/providers/google";

interface GoogleUser {
  email: string;
}

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [request, response, promptAsync] = Google.useAuthRequest({
    androidClientId: process.env.EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID,
    scopes: [
      "email", 
    ],
  });

  useEffect(() => {
    if (response?.type === "success") {
      getUserInfo(response.authentication?.accessToken);
    }
  }, [response]);

  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const logo = require('../../assets/logo.png');

  const getUserInfo = async (token: string | undefined) => {
    if (!token) return;
    try {
      const res = await fetch("https://www.googleapis.com/oauth2/v2/userinfo", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const user: GoogleUser = await res.json();
      await handleLoginGoogle(user);
    } catch (error) {
      console.error("Google User Info Fetch Error:", error);
    }
  };
   const handleLoginGoogle = async (user: GoogleUser) => {
      try {
        const response = await loginUserFromGoogle(user.email);
        if (response?.success) {
          Alert.alert("Success", "Login successfully");
          router.push("/(app)/home");
        } else {
          console.log("Registration failed:", response?.message);
          Alert.alert("Error", response?.message);
          router.push(response?.message === "User already Exist! Please Login" ? "/(auth)/login" : "/(auth)/register");
        }
      } catch (error) {
        console.error("Unexpected error during registration:", error);
        Alert.alert("Error", "Something went wrong. Please try again.");
      }
  };

  const handleLogin = async () => {
    if (!email  || !password) {
      Alert.alert("Error", "Please fill all fields");
      return { success: false };
    }
  
    try {
      const response = await loginUser(email, password);
      if (response?.success) {
        Alert.alert("Success", "Login successfully");
        console.log("Login successful: User->", email);
        router.push("/(app)/home");
      } else {
        console.log("Login failed:", response?.message); // Log error details
        Alert.alert("Error", response?.message);
        return { success: false };
      }
    } catch (error) {
      console.error("Unexpected error during registration:", error);
      Alert.alert("Error", "Something went wrong. Please try again.");
      return { success: false };
    }
  };

   const handleForgotPassword = async () => {
      if (!email) {
        Alert.alert("Enter Email", "Please enter your email to reset your password.");
        return;
      }
  
      setLoading(true);
      const response = await forgotPassword(email);
      setLoading(false);
  
      if (response.success) {
        Alert.alert("Success, Check your mail to get reset password link", response.message);
        // Navigate to the Reset Password screen and pass email as a parameter
        router.push(`/reset?email=${email}`);
      } else {
        Alert.alert("Error", response.message);
      }
    };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image 
          source={logo}
          style={styles.logo}
        />
        <Text style={styles.title}>Welcome!</Text>
        <Text style={styles.subtitle}>Sign in to continue</Text>
      </View>

      <View style={styles.form}>
      <View style={styles.inputContainer}>
          <FontAwesome name="envelope-o" size={20} color="#666" style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            placeholderTextColor="#999"
          />
        </View>

        <View style={styles.inputContainer}>
          <FontAwesome name="lock" size={20} color="#666" style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor="***********"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
        </View>

        <TouchableOpacity 
          style={styles.button}
          onPress={handleLogin}
        >
          <Text style={styles.buttonText}>Sign in</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.forgotPassword} onPress={handleForgotPassword}>
          <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
        </TouchableOpacity>
        <Text style={styles.orText}>or</Text>

        <View style={styles.socialButtons}>
          <TouchableOpacity style={styles.socialButton} onPress={() => promptAsync()}>
            <FontAwesome name="google" size={20} color="#DB4437" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.socialButton}>
            <FontAwesome name="facebook" size={20} color="#4267B2" />
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
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginTop: 60,
    marginBottom: 40,
  },
  
  logo: {
    width: 150,
    height: 60,
    marginBottom: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: '600',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
  form: {
    flex: 1,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E8F5E9',
    borderRadius: 8,
    paddingHorizontal: 16,
    height: 48,
    marginBottom: 16,
  },
  icon: {
    marginRight: 12,
  },
  inputIcon:{
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  button: {
    backgroundColor: '#FF4B55',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  orText: {
    textAlign: 'center',
    marginVertical: 20,
    color: '#666',
  },
  socialButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 20,
    marginBottom: 20,
  },
  socialButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: '#ddd',
    justifyContent: 'center',
    alignItems: 'center',
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
    marginTop: 'auto',
    marginBottom: 20,
  },
  footerText: {
    color: '#666',
  },
  link: {
    color: '#2196F3',
    fontWeight: '500',
  },
});
