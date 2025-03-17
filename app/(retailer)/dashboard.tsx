import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, SafeAreaView, ActivityIndicator, Alert, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Link } from "expo-router";
import { FontAwesome } from '@expo/vector-icons';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getAllDeals } from "@/api/deals/deals";

interface Deal {
  id: number;
  title: string;
  views: number;
  engagements: number;
  expiration_date: string;
  images?: string[];
  retailer_id: number;
}

export default function RetailerDashboard() {
  const [deals, setDeals] = useState<Deal[]>([]);
  const [loading, setLoading] = useState(true);
  const [retailerId, setRetailerId] = useState<number | null>(null);

  useEffect(() => {
    const fetchRetailerId = async () => {
      try {
        const id = await AsyncStorage.getItem("retailer_id");
        console.log("Retrieved Retailer ID:", id); // Debugging
    
        if (id) {
          setRetailerId(parseInt(id));
        } else {
          Alert.alert("Error", "Retailer ID not found. Please log in again.");
        }
      } catch (error) {
        console.error("Error fetching Retailer ID:", error);
      }
    };

    fetchRetailerId();
  }, []);

  useEffect(() => {
    if (retailerId === null) {
      console.log("Retailer ID not available yet, skipping fetchDeals");
      return;
    }
  
    const fetchDeals = async () => {
      setLoading(true);
      try {
        const response = await getAllDeals();
        console.log("API Response:", response); // Debugging
  
        if (response.success) {
          // Fix: Access the correct array inside `response.deals`
          const filteredDeals = response.deals.deals.filter((deal: Deal) => 
            deal.retailer_id === retailerId &&
            new Date(deal.expiration_date) > new Date()
          );
  
          console.log("Filtered Deals:", filteredDeals); // Debugging
          setDeals(filteredDeals);
        } else {
          Alert.alert("Error", response.message || "Failed to fetch deals");
        }
      } catch (error) {
        Alert.alert("Error", "Failed to fetch deals");
        console.error("Fetch Deals Error:", error);
      }
      setLoading(false);
    };
  
    fetchDeals();
  }, [retailerId]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Ionicons name="location" size={24} color="#FF6B6B" />
          <Text style={styles.headerTitle}>Retailer Dashboard</Text>
        </View>
        <TouchableOpacity>
          <Ionicons name="notifications-outline" size={24} color="#333" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        {/* Loading Indicator */}
        {loading ? (
          <ActivityIndicator size="large" color="#FF6B6B" style={{ marginTop: 20 }} />
        ) : (
          <>
            <View style={styles.actionButtons}>
              <TouchableOpacity style={styles.addButton} onPress={() => router.push("/(retailer)/deals/new")}>
                <Text style={styles.addButtonText}>+ Add Deal</Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.sectionTitle}>Active Deals</Text>

            {deals.length > 0 ? (
              deals.map((deal, index) => (
                <View key={index} style={styles.dealCard}>
                  <View style={styles.dealHeader}>
                    <Text style={styles.dealTitle}>{deal.title}</Text>
                    <View style={styles.statusBadge}>
                      <Text style={styles.statusText}>Active</Text>
                    </View>
                  </View>
                  <View style={styles.dealStats}>
                    <Text style={styles.dealInfo}>Views: {deal.views}</Text>
                    <Text style={styles.dealInfo}>Redeemed: {deal.engagements}</Text>
                  </View>
                  <Text style={styles.dealExpiry}>Expires: {deal.expiration_date}</Text>
                  <TouchableOpacity
                    style={styles.editButton}
                    onPress={() => router.push({ pathname: "/(retailer)/deals/edit", params: { id: deal.id.toString() } })}
                  >
                    <Ionicons name="create-outline" size={18} color="#333" />
                    <Text style={styles.editButtonText}>Edit Deal</Text>
                  </TouchableOpacity>
                </View>
              ))
            ) : (
              <Text style={styles.noDeals}>No active deals available.</Text>
            )}
          </>
        )}
      </ScrollView>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <Link href="/home" asChild>
          <TouchableOpacity style={styles.navItem}>
            <FontAwesome name="home" size={24} color="#FF4855" />
            <Text style={styles.navText}>Home</Text>
          </TouchableOpacity>
        </Link>

        <Link href="/analytics" asChild>
          <TouchableOpacity style={styles.navItem}>
            <FontAwesome name="bar-chart" size={24} color="#666" />
            <Text style={styles.navText}>Analytics</Text>
          </TouchableOpacity>
        </Link>

        <Link href="/dashboard" asChild>
          <TouchableOpacity style={styles.navItem}>
            <FontAwesome name="tags" size={24} color="#666" />
            <Text style={styles.navText}>Deals</Text>
          </TouchableOpacity>
        </Link>

        <Link href="/reatailer-profile" asChild>
          <TouchableOpacity style={styles.navItem}>
            <FontAwesome name="user" size={24} color="#666" />
            <Text style={styles.navText}>Profile</Text>
          </TouchableOpacity>
        </Link>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f5f5" },
  header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", padding: 16, backgroundColor: "#fff", borderBottomWidth: 1, borderBottomColor: "#eee" },
  headerContent: { flexDirection: "row", alignItems: "center", gap: 8 },
  headerTitle: { fontSize: 18, fontWeight: "600" },
  content: { flex: 1 },
  actionButtons: { flexDirection: "row", padding: 16, gap: 12 },
  addButton: { flex: 1, backgroundColor: "#FF6B6B", padding: 12, borderRadius: 8, alignItems: "center" },
  addButtonText: { color: "#fff", fontWeight: "600" },
  editButton: { flexDirection: "row", backgroundColor: "#fff", padding: 12, borderRadius: 8, alignItems: "center", justifyContent: "center", borderWidth: 1, borderColor: "#e0e0e0", gap: 8, marginTop: 10 },
  editButtonText: { color: "#333", fontWeight: "600" },
  sectionTitle: { fontSize: 18, fontWeight: "600", padding: 16, paddingBottom: 8 },
  dealCard: { backgroundColor: "#fff", marginHorizontal: 16, marginBottom: 12, padding: 16, borderRadius: 12, borderWidth: 1, borderColor: "#e0e0e0" },
  dealHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 12 },
  dealTitle: { fontSize: 16, fontWeight: "600" },
  statusBadge: { backgroundColor: "#E8F5E9", paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12 },
  statusText: { color: "#2E7D32", fontSize: 12, fontWeight: "500" },
  dealStats: { flexDirection: "row", justifyContent: "space-between", marginBottom: 8 },
  dealInfo: { color: "#666", fontSize: 14 },
  dealExpiry: { color: "#666", fontSize: 14 },
  noDeals: { textAlign: "center", marginTop: 20, fontSize: 16, color: "#666" },
  bottomNav: { flexDirection: "row", justifyContent: "space-around", paddingVertical: 12, borderTopWidth: 1, borderTopColor: "#F0F0F0", backgroundColor: "#fff", position: "absolute", bottom: 0, left: 0, right: 0 },
  navItem: { padding: 4 },
  navText: { fontSize: 12, marginTop: 4, color: "#666" },
});