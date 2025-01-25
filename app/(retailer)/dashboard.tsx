import React from "react"
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, SafeAreaView } from "react-native"
import { Ionicons, Feather } from "@expo/vector-icons"
import { router } from "expo-router"
import  { Link } from "expo-router"
import { FontAwesome } from '@expo/vector-icons';

export default function RetailerDashboard() {
  const metrics = [
    { label: "Views", value: "2.6K" },
    { label: "Clicks", value: "856" },
    { label: "Redeemed", value: "235" },
  ]

  const activeDeals = [
    {
      title: "20% Off on All Items",
      views: 565,
      redeemed: 72,
      expires: "Mar 15, 2025",
      status: "Active",
    },
    {
      title: "Buy 1 Get 1 Free",
      views: 321,
      redeemed: 38,
      expires: "June 9, 2025",
      status: "Active",
    },
  ]

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
        <View style={styles.metricsContainer}>
          {metrics.map((metric, index) => (
            <View key={index} style={styles.metricCard}>
              <Text style={styles.metricValue}>{metric.value}</Text>
              <Text style={styles.metricLabel}>{metric.label}</Text>
            </View>
          ))}
        </View>

        <View style={styles.actionButtons}>
          <TouchableOpacity style={styles.addButton} onPress={() => router.push("/(retailer)/deals/new")}>
            <Text style={styles.addButtonText}>+ Add Deal</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.editButton} onPress={()=>router.push("/(retailer)/deals/edit")}>
            <Ionicons name="create-outline" size={18} color="#333" />
            <Text style={styles.editButtonText}>Edit Deal</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.sectionTitle}>Active Deals</Text>

        {activeDeals.map((deal, index) => (
          <View key={index} style={styles.dealCard}>
            <View style={styles.dealHeader}>
              <Text style={styles.dealTitle}>{deal.title}</Text>
              <View style={styles.statusBadge}>
                <Text style={styles.statusText}>{deal.status}</Text>
              </View>
            </View>
            <View style={styles.dealStats}>
              <Text style={styles.dealInfo}>Views: {deal.views}</Text>
              <Text style={styles.dealInfo}>Redeemed: {deal.redeemed}</Text>
            </View>
            <Text style={styles.dealExpiry}>Expires: {deal.expires}</Text>
          </View>
        ))}
      </ScrollView>

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

        <Link href="/profile" asChild>
          <TouchableOpacity style={styles.navItem}>
            <FontAwesome name="user" size={24} color="#666" />
            <Text style={styles.navText}>Profile</Text>
          </TouchableOpacity>
        </Link>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
  },
  content: {
    flex: 1,
  },
  metricsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 16,
    gap: 12,
  },
  metricCard: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  metricValue: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 4,
  },
  metricLabel: {
    fontSize: 14,
    color: "#666",
  },
  actionButtons: {
    flexDirection: "row",
    padding: 16,
    gap: 12,
  },
  addButton: {
    flex: 1,
    backgroundColor: "#FF6B6B",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  addButtonText: {
    color: "#fff",
    fontWeight: "600",
  },
  editButton: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#e0e0e0",
    gap: 8,
  },
  editButtonText: {
    color: "#333",
    fontWeight: "600",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    padding: 16,
    paddingBottom: 8,
  },
  dealCard: {
    backgroundColor: "#fff",
    marginHorizontal: 16,
    marginBottom: 12,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  dealHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  dealTitle: {
    fontSize: 16,
    fontWeight: "600",
  },
  statusBadge: {
    backgroundColor: "#E8F5E9",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: "#2E7D32",
    fontSize: 12,
    fontWeight: "500",
  },
  dealStats: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  dealInfo: {
    color: "#666",
    fontSize: 14,
  },
  dealExpiry: {
    color: "#666",
    fontSize: 14,
  },
  navbar: {
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 12,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#eee",
  },

  bottomNav: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: "#F0F0F0",
    backgroundColor: "#fff",
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
  },
  navItem: {
    padding: 4,
  },

  navText: {
    fontSize: 12,
    marginTop: 4,
    color: "#666",
  },
})

