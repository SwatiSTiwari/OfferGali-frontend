import { useState, useEffect } from 'react';
import { ScrollView, View, Image, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { Link, useRouter } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';
import { registerUser } from '@/api/user/user';
import { useAuthRequest, } from 'expo-auth-session/build/providers/Google';
import Expo from "expo"

const GOOGLE_ANDROID_CLIENT_ID = process.env.EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID;
const GOOGLE_IOS_CLIENT_ID = process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID;

export default function RegisterUser() {
  const[register, setRegister] = useState({
    email: '',
    name: '',
    phone_number: '',
    password: ''
  })

  const handleChange = (key: keyof typeof register)=>(value: string)=>{
    setRegister((prev)=>({
       ...prev, [key]: value
    }))
  }
  const router = useRouter();

  const logo = require('../../assets/logo.png');

  const [userInfo, setUserInfo]  = useState('')

  const [request, response, promptAsync] = useAuthRequest({
    androidClientId: GOOGLE_ANDROID_CLIENT_ID,
    iosClientId: GOOGLE_IOS_CLIENT_ID
  })

  useEffect(()=>{
    handleSingInWithGoogle()
  }, [response])

  const handleSingInWithGoogle = async ()=>{
    console.log("In handleSingInWithGoogle")
    console.log(response)
    if(response?.type === "success"){
      console.log("suceess")
      await getUserInfo(response.authentication?.accessToken)
    }
  }

  const getUserInfo = async (token:any)=>{
    try{
      const response = await fetch("https://www.googleapis.com/userinfo/v2/me", {
        headers: {Authorization: `Bearer ${token}`}
      })
  
      const user = await response.json();
      console.log(user)
      setUserInfo(user)
    }catch(e){
      console.log(e)
    }
    
  }

    const handleRegister = async () => {
      if (!register.name || !register.email || !register.phone_number || !register.password) {
        Alert.alert("Error", "Please fill all fields");
        return { success: false };
      }
    
      try {
        const response = await registerUser(register.name, register.email, register.password, register.phone_number);
    
        if (response?.success) {
          Alert.alert("Success", "Registered successfully");
          setRegister({
            email: '',
            name: '',
            phone_number: '',
            password: ''
          })
          return { success: true };
        } else {
          console.log("Registration failed:", response?.message); // Log error details
          Alert.alert("Error", response?.message);
          return { success: false };
        }
      } catch (error) {
        console.error("Unexpected error during registration:", error);
        Alert.alert("Error", "Something went wrong. Please try again.");
        return { success: false };
      }
    };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.container}>
          <Image source={logo} style={styles.logo} />
        </View>
        <Text style={styles.title}>Hi!</Text>
        <Text style={styles.subtitle}>Register to continue</Text>
      </View>

      <View style={styles.form}>
        <View style={styles.inputContainer}>
          <FontAwesome name="user-o" size={20} color="#666" style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="Username"
            value={register.name}
            onChangeText={handleChange('name')}
            autoCapitalize="none"
            placeholderTextColor="#999"
          />
        </View>

        <View style={styles.inputContainer}>
          <FontAwesome name="envelope-o" size={20} color="#666" style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="Email"
            value={register.email}
            onChangeText={handleChange('email')}
            autoCapitalize="none"
            placeholderTextColor="#999"
          />
        </View>


        <View style={styles.inputContainer}>
          <FontAwesome name="phone" size={20} color="#666" style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="Mobile Number"
            value={register.phone_number}
            onChangeText={handleChange('phone_number')}
            keyboardType="phone-pad"
            placeholderTextColor="#999"
          />
        </View>

        <View style={styles.inputContainer}>
          <FontAwesome name="lock" size={20} color="#666" style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="*********"
            value={register.password}
            onChangeText={handleChange('password')}
            secureTextEntry
            placeholderTextColor="#999"
          />
        </View>

        <TouchableOpacity 
          style={styles.signupButton}
          onPress={async () => {
            const response = await handleRegister(); 
            if (response?.success) {
              router.push('/(auth)/login');  // Navigate only if registration succeeds
            }
          }}
        >
          <Text style={styles.signupButtonText}>Sign up</Text>
        </TouchableOpacity>

        <View style={styles.dividerContainer}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>or</Text>
          <View style={styles.dividerLine} />
        </View>

        <Text style={styles.socialTitle}>Social Media sign up</Text>

        <View style={styles.socialButtons}>
          <TouchableOpacity style={styles.socialButton}>
            <FontAwesome name="google" size={24} color="#1877F2" onAccessibilityAction={handleSingInWithGoogle}/>
          </TouchableOpacity>
          <TouchableOpacity style={styles.socialButton}>
            <FontAwesome name="apple" size={24} color="#000" />
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Already have an account? </Text>
          <Link href="/(auth)/login" style={styles.link}>Sign in</Link>
        </View>
      </View>
    </ScrollView>
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
  logo:{
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
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  signupButton: {
    backgroundColor: '#FF6B6B',
    height: 48,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
  },
  signupButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
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
  socialButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
  },
  socialButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#eee',
    justifyContent: 'center',
    alignItems: 'center',
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
