import { Redirect, Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StyleSheet } from 'react-native';

export default function AuthLayout() {
  return (
    <SafeAreaView style={styles.container}>
      <Stack screenOptions={{ headerShown: false }}>
        <StatusBar style="dark" />
        <Stack.Screen 
          name="login" 
          options={{ 
            title: 'Login'
          }} 
        />
        <Stack.Screen 
          name="register" 
          options={{ 
            title: 'Register'
          }} 
        />
        <Stack.Screen 
          name="profile-setup" 
          options={{ 
            title: 'Profile Setup'
          }} 
        />
        <Stack.Screen 
          name="dashboard" 
          options={{ 
            title: 'Dashboard'
          }} 
        />
        <Stack.Screen 
          name="auth-profile" 
          options={{ 
            title: 'Profile'
          }} 
        />
      </Stack>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff', // Optional: Set a background color
  },
});
