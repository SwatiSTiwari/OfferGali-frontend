import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet } from "react-native";
import { useLocalSearchParams, router } from "expo-router"; // Extract params from URL
import { resetPassword } from '@/api/retailer/retailer';

export default function Reset() {
  const { email } = useLocalSearchParams(); // Get email from URL params
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  //  Handle Reset Password
  const handleResetPassword = async () => {
    if (!newPassword || !confirmPassword) {
      Alert.alert("Error", "Please fill in both password fields.");
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match. Please try again.");
      return;
    }

    setLoading(true);
    const response = await resetPassword(email as string, newPassword);
    setLoading(false);

    if (response.success) {
      Alert.alert("Success", "Password reset successfully. Please login with your new password.");
      router.push("/login"); // Navigate back to login after reset
    } else {
      Alert.alert("Error", response.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Reset Password</Text>
      <Text style={styles.info}>Resetting password for: {email}</Text>

      <TextInput
        style={styles.input}
        placeholder="New Password"
        value={newPassword}
        onChangeText={setNewPassword}
        secureTextEntry
        placeholderTextColor="#999"
      />

      <TextInput
        style={styles.input}
        placeholder="Confirm Password"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
        placeholderTextColor="#999"
      />

      <TouchableOpacity style={styles.button} onPress={handleResetPassword} disabled={loading}>
        <Text style={styles.buttonText}>{loading ? "Resetting..." : "Reset Password"}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 20, backgroundColor: "#fff" },
  title: { fontSize: 24, fontWeight: "bold", textAlign: "center", marginBottom: 20 },
  info: { fontSize: 16, textAlign: "center", marginBottom: 10, color: "#666" },
  input: { width: "100%", height: 50, borderColor: "#ccc", borderWidth: 1, borderRadius: 8, paddingHorizontal: 10, marginBottom: 10 },
  button: { backgroundColor: "#FF6B6B", padding: 15, borderRadius: 8, alignItems: "center" },
  buttonText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
});
