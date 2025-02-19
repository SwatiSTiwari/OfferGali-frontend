import React from "react"
import { View, Text, ScrollView, TouchableOpacity, Image, StyleSheet } from "react-native"
import { Ionicons, Feather } from "@expo/vector-icons"
import { SafeAreaView } from "react-native-safe-area-context"
import { Link } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';

interface DealProps {
  title: string
  validUntil: string
  currentPrice: string
  originalPrice: string
  isFavorite?: boolean
}

const DealCard = ({ title, validUntil, currentPrice, originalPrice, isFavorite = true }: DealProps) => (
  <TouchableOpacity style={styles.dealCard}>
    <View style={styles.dealImageContainer}>
      <View style={styles.dealImage} />
    </View>
    <View style={styles.dealContent}>
      <View style={styles.dealHeader}>
        <Text style={styles.dealTitle}>{title}</Text>
        <TouchableOpacity>
          <Ionicons name={isFavorite ? "heart" : "heart-outline"} size={24} color={isFavorite ? "#FF4545" : "#000"} />
        </TouchableOpacity>
      </View>
      <Text style={styles.validUntil}>{validUntil}</Text>
      <View style={styles.priceContainer}>
        <Text style={styles.currentPrice}>{currentPrice}</Text>
        <Text style={styles.originalPrice}>{originalPrice}</Text>
      </View>
    </View>
  </TouchableOpacity>
)

export default function SavedDeals() {
  const deals = [
    {
      title: "Spa Day Package",
      validUntil: "Valid until Apr 15, 2025",
      currentPrice: "₹250",
      originalPrice: "₹500",
    },
    {
      title: "Spa Day Package",
      validUntil: "Valid until Apr 15, 2025",
      currentPrice: "₹250",
      originalPrice: "₹500",
    },
    {
      title: "Spa Day Package",
      validUntil: "Valid until Apr 15, 2025",
      currentPrice: "₹250",
      originalPrice: "₹500",
    },
  ]

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Saved Deals</Text>
        <TouchableOpacity>
          <Feather name="more-vertical" size={24} color="#000" />
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.clearButton}>
        <Feather name="trash-2" size={20} color="#fff" style={styles.trashIcon} />
        <Text style={styles.clearButtonText}>Clear Saved Deals</Text>
      </TouchableOpacity>

      <ScrollView style={styles.dealsContainer}>
        {deals.map((deal, index) => (
          <DealCard key={index} {...deal} />
        ))}
      </ScrollView>

      <View style={styles.bottomNav}>
      <Link href="/home" asChild>
          <TouchableOpacity style={styles.navItem}>
            <FontAwesome name="home" size={24} color="#FF4B55" />
            <Text style={[styles.navText, styles.activeNavText]}>Home</Text>
          </TouchableOpacity>
        </Link>
        <Link href="/saved" asChild>
          <TouchableOpacity style={styles.navItem}>
            <FontAwesome name="compass" size={24} color="#666" />
            <Text style={styles.navText}>Explore</Text>
          </TouchableOpacity>
        </Link>
        <Link href="/saved" asChild>
          <TouchableOpacity style={styles.navItem}>
            <FontAwesome name="heart" size={24} color="#666" />
            <Text style={styles.navText}>Saved</Text>
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
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
  },
  clearButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FF6B6B",
    marginHorizontal: 16,
    marginVertical: 12,
    padding: 12,
    borderRadius: 8,
  },
  trashIcon: {
    marginRight: 8,
  },
  clearButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  dealsContainer: {
    flex: 1,
    paddingHorizontal: 16,
  },
  dealCard: {
    flexDirection: "row",
    backgroundColor: "#FFF5EB",
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
  },
  dealImageContainer: {
    marginRight: 12,
  },
  dealImage: {
    width: 80,
    height: 80,
    backgroundColor: "#E0E0E0",
    borderRadius: 8,
  },
  dealContent: {
    flex: 1,
  },
  dealHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  dealTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  validUntil: {
    fontSize: 14,
    color: "#666",
    marginBottom: 4,
  },
  priceContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  currentPrice: {
    fontSize: 16,
    fontWeight: "600",
    marginRight: 8,
  },
  originalPrice: {
    fontSize: 14,
    color: "#666",
    textDecorationLine: "line-through",
  },
  bottomNav: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: "#F0F0F0",
    backgroundColor: "#fff",
  },
  navItem: {
    alignItems: "center",
  },
  navText: {
    fontSize: 12,
    marginTop: 4,
    color: "#666",
  },
  activeNavText: {
    color: "#000",
  },
})

