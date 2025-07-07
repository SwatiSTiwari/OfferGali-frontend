import React from "react"
import { View, Text, ScrollView, TouchableOpacity, Image, StyleSheet, Alert } from "react-native"
import { Ionicons, Feather } from "@expo/vector-icons"
import { SafeAreaView } from "react-native-safe-area-context"
import BottomNavUser from "../(auth)/bottomnavuser";
import { useSavedDeals, SavedDeal } from "../../contexts/SavedDealsContext";

interface DealProps {
  deal: SavedDeal;
  onRemove: (dealId: string) => void;
}

const DealCard = ({ deal, onRemove }: DealProps) => {
  const formatExpiryDate = (expiryDate: string) => {
    try {
      const date = new Date(expiryDate);
      const now = new Date();
      const todayOnly = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      
      let expiryDateOnly;
      if (expiryDate.includes('T')) {
        const datePart = expiryDate.split('T')[0];
        const parts = datePart.split('-');
        if (parts.length === 3) {
          const year = parseInt(parts[0]);
          const month = parseInt(parts[1]) - 1;
          const day = parseInt(parts[2]);
          expiryDateOnly = new Date(year, month, day);
        } else {
          expiryDateOnly = new Date(date.getFullYear(), date.getMonth(), date.getDate());
        }
      } else {
        expiryDateOnly = new Date(date.getFullYear(), date.getMonth(), date.getDate());
      }
      
      if (isNaN(expiryDateOnly.getTime())) {
        return `Valid until ${expiryDate}`;
      }
      
      const diffTime = expiryDateOnly.getTime() - todayOnly.getTime();
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays < 0) {
        return "Expired";
      } else if (diffDays === 0) {
        return "Expires today";
      } else if (diffDays === 1) {
        return "Expires tomorrow";
      } else {
        return `Valid until ${expiryDateOnly.toLocaleDateString()}`;
      }
    } catch (error) {
      return `Valid until ${expiryDate}`;
    }
  };

  const handleRemove = () => {
    Alert.alert(
      "Remove Deal",
      "Are you sure you want to remove this deal from saved?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Remove", style: "destructive", onPress: () => onRemove(deal.id) }
      ]
    );
  };

  return (
    <TouchableOpacity style={styles.dealCard}>
      <View style={styles.dealImageContainer}>
        <View style={styles.dealImage} />
      </View>
      <View style={styles.dealContent}>
        <View style={styles.dealHeader}>
          <Text style={styles.dealTitle} numberOfLines={2}>{deal.title}</Text>
          <TouchableOpacity onPress={handleRemove}>
            <Ionicons name="heart" size={20} color="#FF4545" />
          </TouchableOpacity>
        </View>
        <Text style={styles.validUntil}>{formatExpiryDate(deal.expiration_date)}</Text>
        <Text style={styles.category} numberOfLines={1}>🏷️ {deal.category}</Text>
        <View style={styles.priceContainer}>
          <Text style={styles.currentPrice}>
            {deal.price ? `₹${deal.price}` : 'N/A'}
          </Text>
          {deal.original_price && (
            <Text style={styles.originalPrice}>₹{deal.original_price}</Text>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default function SavedDeals() {
  console.log("Rendering Saved");
  const { savedDeals, removeDeal, clearAllDeals, loading } = useSavedDeals();

  const handleClearAll = () => {
    Alert.alert(
      "Clear All Deals",
      "Are you sure you want to remove all saved deals?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Clear All", style: "destructive", onPress: clearAllDeals }
      ]
    );
  };

  if (loading) {
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
        <View style={styles.loadingContainer}>
          <Text>Loading saved deals...</Text>
        </View>
        <BottomNavUser />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Saved Deals ({savedDeals.length})</Text>
        <TouchableOpacity>
          <Feather name="more-vertical" size={24} color="#000" />
        </TouchableOpacity>
      </View>

      {savedDeals.length > 0 && (
        <TouchableOpacity style={styles.clearButton} onPress={handleClearAll}>
          <Feather name="trash-2" size={20} color="#fff" style={styles.trashIcon} />
          <Text style={styles.clearButtonText}>Clear All Saved Deals</Text>
        </TouchableOpacity>
      )}

      <ScrollView style={styles.dealsContainer}>
        {savedDeals.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="heart-outline" size={64} color="#ccc" />
            <Text style={styles.emptyTitle}>No Saved Deals Yet</Text>
            <Text style={styles.emptySubtitle}>
              Save deals you're interested in by tapping the "Save for Later" button
            </Text>
          </View>
        ) : (
          <View style={styles.dealsGrid}>
            {savedDeals.map((deal) => (
              <DealCard key={deal.id} deal={deal} onRemove={removeDeal} />
            ))}
          </View>
        )}
      </ScrollView>

      <BottomNavUser />
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
  dealsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingBottom: 80,
  },
  dealCard: {
    width: '48%',
    backgroundColor: "#FFF5EB",
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
  },
  dealImageContainer: {
    alignItems: 'center',
    marginBottom: 8,
  },
  dealImage: {
    width: '100%',
    height: 100,
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
    marginBottom: 4,
  },
  dealTitle: {
    fontSize: 14,
    fontWeight: "600",
    flex: 1,
    marginRight: 8,
  },
  validUntil: {
    fontSize: 12,
    color: "#666",
    marginBottom: 4,
  },
  priceContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },
  currentPrice: {
    fontSize: 14,
    fontWeight: "600",
    marginRight: 8,
  },
  originalPrice: {
    fontSize: 12,
    color: "#666",
    textDecorationLine: "line-through",
  },
  category: {
    fontSize: 11,
    color: "#666",
    marginBottom: 4,
  },
  savedAt: {
    fontSize: 11,
    color: "#999",
    marginTop: 4,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 60,
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#333",
    marginTop: 20,
    marginBottom: 10,
  },
  emptySubtitle: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    lineHeight: 24,
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

