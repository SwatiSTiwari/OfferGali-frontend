import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";
import { FontAwesome } from "@expo/vector-icons";
import { forgotPassword } from "@/api/retailer/retailer"; // API function

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  //  Handle Forgot Password Request
  const handleForgotPassword = async () => {
    if (!email) {
      Alert.alert("Error", "Please enter your email to reset your password.");
      return;
    }

    setLoading(true);
    const response = await forgotPassword(email);
    setLoading(false);

    if (response.success) {
      Alert.alert("Success", "Password reset link sent to your email.");
      router.push(`/reset?email=${email}`); // Navigate to reset page with email
    } else {
      Alert.alert("Error", response.message || "Failed to send reset link.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Forgot Password</Text>
      <Text style={styles.subtitle}>Enter your email to receive a reset link</Text>

      <View style={styles.inputContainer}>
        <FontAwesome name="envelope" size={20} color="#666" style={styles.inputIcon} />
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

      <TouchableOpacity style={styles.resetButton} onPress={handleForgotPassword} disabled={loading}>
        {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.resetButtonText}>Send Reset Link</Text>}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", padding: 20, backgroundColor: "#fff" },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 10 },
  subtitle: { fontSize: 14, color: "#666", marginBottom: 20 },
  inputContainer: { flexDirection: "row", alignItems: "center", borderWidth: 1, borderColor: "#E0E0E0", borderRadius: 8, paddingHorizontal: 12, width: "100%", backgroundColor: "#fff" },
  inputIcon: { marginRight: 10 },
  input: { flex: 1, height: 44, fontSize: 14, color: "#333" },
  resetButton: { marginTop: 20, backgroundColor: "#FF6B6B", padding: 12, borderRadius: 8, alignItems: "center", width: "100%" },
  resetButtonText: { color: "#fff", fontSize: 16, fontWeight: "500" },
});
