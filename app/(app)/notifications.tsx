import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  RefreshControl,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import {
  fetchNotifications,
  markNotificationAsRead,
  testNotificationAPI,
  triggerLocationBasedNotifications,
  getNearbyDeals,
  diagnoseConnection,
} from "@/api/notifications";
import { router } from "expo-router";

export default function NotificationScreen() {
  interface Deal {
    id: string;
    title: string;
    description: string;
    images?: string[];
    category: string;
    expiration_date: string;
    redemption_instructions?: string;
    retailer_id: string;
    engagements?: number;
    views?: number;
  }

  interface Notification {
    id: string;
    user_id: string;
    deal_id?: string;
    message: string;
    read: boolean; // Updated to match backend field name
    created_at: string;
    deals?: Deal; // This comes from the Supabase join
  }

  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const fetchNotificationsData = async (showLoader = true) => {
    try {
      if (showLoader) setLoading(true);
      setError(null); // Test API connectivity first
      const isConnected = await testNotificationAPI();

      if (!isConnected) {
        const diagnosis = await diagnoseConnection();
        setError(diagnosis.message);
        return;
      }
      const result = await fetchNotifications();

      if (result.success) {
        const notificationData = result.data.notifications || result.data || [];
        
        // ADD COMPREHENSIVE DEBUGGING
        console.log('=== COMPREHENSIVE NOTIFICATION DEBUG ===');
        console.log('Current date:', new Date().toISOString());
        console.log('Current date string:', new Date().toDateString());
        console.log('Total notifications received:', notificationData.length);
        
        // notificationData.forEach((notification, index) => {
        //   console.log(`\n=== Notification ${index + 1} ===`);
        //   console.log('Notification ID:', notification.id);
        //   console.log('Message:', notification.message);
        //   console.log('Has deal:', !!notification.deals);
          
        //   if (notification.deals) {
        //     console.log('Deal title:', notification.deals.title);
        //     console.log('Deal category:', notification.deals.category);
        //     console.log('Deal expiration RAW:', notification.deals.expiration_date);
        //     console.log('Deal expiration TYPE:', typeof notification.deals.expiration_date);
            
        //     // Parse and check expiry
        //     if (notification.deals.expiration_date) {
        //       const expiryDate = notification.deals.expiration_date;
        //       console.log('Testing expiry parsing...');
              
        //       // Test different parsing methods
        //       console.log('Method 1 - Direct new Date():', new Date(expiryDate));
              
        //       if (expiryDate.includes('T')) {
        //         const datePart = expiryDate.split('T')[0];
        //         console.log('Method 2 - Extract date part:', datePart);
                
        //         const parts = datePart.split('-');
        //         if (parts.length === 3) {
        //           const year = parseInt(parts[0]);
        //           const month = parseInt(parts[1]) - 1;
        //           const day = parseInt(parts[2]);
        //           const localDate = new Date(year, month, day);
        //           console.log('Method 3 - Local date creation:', localDate);
        //           console.log('Method 3 - Local date string:', localDate.toDateString());
                  
        //           // Compare with today
        //           const today = new Date();
        //           const todayOnly = new Date(today.getFullYear(), today.getMonth(), today.getDate());
        //           console.log('Today only:', todayOnly.toDateString());
        //           console.log('Is expired?', localDate < todayOnly);
        //           console.log('Days difference:', Math.floor((localDate.getTime() - todayOnly.getTime()) / (1000 * 60 * 60 * 24)));
        //         }
        //       }
        //     }
        //   }
        // });
        
        // Ensure all notifications have proper structure
        
        const validNotifications= notificationData.filter(notification => 
          notification && 
          typeof notification === 'object' && 
          notification.id
        );
        setNotifications(validNotifications);
        setError(null);
      } else {
        console.error("Failed to fetch notifications:", result.message);
        setError(result.message || "Failed to fetch notifications");
      }
    } catch (err) {
      console.error("Error fetching notifications:", err);
      setError("An unexpected error occurred while fetching notifications");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchNotificationsData();
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchNotificationsData(false);
  };

  const handleNotificationClick = async (notificationId: string) => {
    try {
      const result = await markNotificationAsRead(notificationId);

      if (result.success) {
        setNotifications((prevNotifications) =>
          prevNotifications.map((notification) =>
            notification.id === notificationId
              ? { ...notification, read: true }
              : notification,
          ),
        );
      } else {
        console.error("Failed to mark notification as read:", result.message);
        Alert.alert(
          "Error",
          result.message || "Failed to mark notification as read",
        );
      }
    } catch (err) {
      console.error("Error marking notification as read:", err);
      Alert.alert("Error", "An error occurred while updating notification");
    }
  };
  const handleTroubleshoot = async () => {
    setLoading(true);
    setError(null);

    console.log("Running connection diagnosis...");
    const diagnosis = await diagnoseConnection();

    Alert.alert(
      diagnosis.success ? "Diagnosis Complete" : "Connection Issue",
      diagnosis.message,
      [{ text: "OK" }],
    );

    setLoading(false);
  };

  const handleLocationBasedNotifications = async () => {
    try {
      setLoading(true);
      const result = await triggerLocationBasedNotifications();

      if (result.success) {
        Alert.alert(
          "Success",
          result.message || "Location-based notifications created!",
          [
            {
              text: "OK",
              onPress: () => fetchNotificationsData(false), // Refresh notifications
            },
          ],
        );
      } else {
        Alert.alert(
          "Error",
          result.message || "Failed to create location-based notifications",
        );
      }
    } catch (error) {
      console.error("Error with location notifications:", error);
      Alert.alert("Error", "Failed to process location-based notifications");
    } finally {
      setLoading(false);
    }
  };

  const renderNotificationDot = (isRead: boolean) => (
    <View style={[styles.dot, !isRead && styles.unreadDot]} />
  );
  const formatExpiryDate = (expiryDate: string) => {
    try {
      const date = new Date(expiryDate);
      const now = new Date();
      const diffTime = date.getTime() - now.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays < 0) {
        return "Expired";
      } else if (diffDays === 0) {
        return "Expires today";
      } else if (diffDays === 1) {
        return "Expires tomorrow";
      } else {
        return `Expires in ${diffDays} days`;
      }
    } catch (error) {
      return "Invalid date";
    }
  };

  const renderDealContent = (notification: Notification) => {
    const deal = notification.deals;
    if (deal) {
      return (
        <View style={styles.dealContainer}>
          <Text style={styles.dealTitle}>{deal.title || "Untitled Deal"}</Text>

          {deal.description && (
            <Text style={styles.dealDescription}>{deal.description}</Text>
          )}

          <View style={styles.dealMeta}>
            <Text style={styles.categoryText}>
              🏷️ {deal.category || "General"}
            </Text>
          </View>

          {deal.expiration_date && (
            <Text
              style={[
                styles.expiryText,
                new Date(deal.expiration_date) < new Date() &&
                  styles.expiredText,
              ]}
            >
              ⏰ {formatExpiryDate(deal.expiration_date)}
            </Text>
          )}
        </View>
      );
    }

    return null;
  };

  const getNotificationIcon = (hasDeals: boolean) => {
    if (hasDeals) {
      return "🔥"; // Deal notification
    }
    return "📢"; // General notification
  };

  const renderNotificationContent = (notification: Notification) => {
    // Safety check to ensure notification exists and has required properties
    if (!notification || !notification.id) {
      return (
        <View style={styles.notificationContent}>
          <Text style={styles.notificationMessage}>Invalid notification data</Text>
        </View>
      );
    }

    return (
      <View style={styles.notificationContent}>
        <View style={styles.notificationHeader}>
          <Text style={styles.notificationIcon}>
            {getNotificationIcon(!!notification.deals)}
          </Text>
          <Text style={styles.notificationTitle}>
            {notification.deals ? "New Deal Alert" : "Notification"}
          </Text>
        </View>

        {/* Display the notification message */}
        <Text style={styles.notificationMessage}>
          {notification.message || "No message"}
        </Text>

        {/* Render deal content */}
        {renderDealContent(notification)}
        <Text style={styles.notificationTime}>
          {notification.created_at
            ? `${new Date(
                notification.created_at,
              ).toLocaleDateString()} at ${new Date(
                notification.created_at,
              ).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`
            : "Unknown time"}
        </Text>
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <FontAwesome name="arrow-left" size={20} color="#333" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Notifications</Text>
          <TouchableOpacity onPress={handleRefresh}>
            <FontAwesome name="refresh" size={20} color="#333" />
          </TouchableOpacity>
        </View>
        <View style={styles.centerContainer}>
          <FontAwesome name="spinner" size={32} color="#FF6F61" />
          <Text style={styles.loadingText}>Loading notifications...</Text>
        </View>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <FontAwesome name="arrow-left" size={20} color="#333" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Notifications</Text>
          <TouchableOpacity onPress={handleRefresh}>
            <FontAwesome name="refresh" size={20} color="#333" />
          </TouchableOpacity>
        </View>
        <View style={styles.centerContainer}>
          <FontAwesome name="exclamation-triangle" size={48} color="#e74c3c" />
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={() => fetchNotificationsData()}
          >
            <Text style={styles.retryButtonText}>Try Again</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.troubleshootButton}
            onPress={handleTroubleshoot}
          >
            <Text style={styles.troubleshootButtonText}>
              Diagnose Connection
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <FontAwesome name="arrow-left" size={20} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          Notifications
          {notifications.length > 0
            ? ` (${notifications.filter((n) => !n.read).length})`
            : ""}
        </Text>
        <View style={styles.headerActions}>
          <TouchableOpacity
            style={styles.locationButton}
            onPress={handleLocationBasedNotifications}
          >
            <FontAwesome name="location-arrow" size={16} color="#FF6F61" />
          </TouchableOpacity>
          <TouchableOpacity onPress={handleRefresh}>
            <FontAwesome name="refresh" size={20} color="#333" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        style={styles.notificationList}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={["#FF6F61"]}
            tintColor="#FF6F61"
          />
        }
      >
        {notifications.length === 0 ? (
          <View style={styles.centerContainer}>
            <FontAwesome name="bell-slash" size={64} color="#bdc3c7" />
            <Text style={styles.emptyText}>No notifications yet</Text>
            <Text style={styles.emptySubText}>
              We'll notify you when there are new deals and updates available in
              your area
            </Text>
            <TouchableOpacity
              style={styles.refreshButton}
              onPress={handleRefresh}
            >
              <FontAwesome name="refresh" size={16} color="#FF6F61" />
              <Text style={styles.refreshButtonText}>Refresh</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.locationNotifyButton}
              onPress={handleLocationBasedNotifications}
            >
              <FontAwesome name="location-arrow" size={16} color="#fff" />
              <Text style={styles.locationNotifyButtonText}>
                Check nearby deals
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            {/* Unread notifications first */}
            {notifications
              .filter((n) => !n.read)
              .map((notification) => (
                <TouchableOpacity
                  key={notification.id}
                  style={[styles.notificationItem, styles.unreadNotification]}
                  onPress={() => handleNotificationClick(notification.id)}
                  activeOpacity={0.7}
                >
                  {renderNotificationDot(notification.read)}
                  {renderNotificationContent(notification)}
                </TouchableOpacity>
              ))}

            {/* Read notifications */}
            {notifications
              .filter((n) => n.read)
              .map((notification) => (
                <TouchableOpacity
                  key={notification.id}
                  style={styles.notificationItem}
                  onPress={() => handleNotificationClick(notification.id)}
                  activeOpacity={0.7}
                >
                  {renderNotificationDot(notification.read)}
                  {renderNotificationContent(notification)}
                </TouchableOpacity>
              ))}
          </>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    paddingTop: 48,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#e9ecef",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#2c3e50",
  },
  headerActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  locationButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: "#fff5f4",
  },
  categoryText: {
    fontSize: 13,
    color: "#7f8c8d",
    marginBottom: 4,
  },
  notificationList: {
    flex: 1,
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 32,
    minHeight: 400,
  },
  loadingText: {
    fontSize: 16,
    color: "#7f8c8d",
    marginTop: 12,
  },
  errorText: {
    fontSize: 16,
    color: "#e74c3c",
    textAlign: "center",
    marginTop: 16,
    marginBottom: 20,
    lineHeight: 24,
  },
  retryButton: {
    backgroundColor: "#FF6F61",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    shadowColor: "#FF6F61",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  retryButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  troubleshootButton: {
    backgroundColor: "#f39c12",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 12,
    shadowColor: "#f39c12",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  troubleshootButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  emptyText: {
    fontSize: 20,
    fontWeight: "600",
    color: "#7f8c8d",
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubText: {
    fontSize: 14,
    color: "#95a5a6",
    textAlign: "center",
    lineHeight: 20,
    marginBottom: 24,
    paddingHorizontal: 20,
  },
  refreshButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ecf0f1",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 8,
  },
  refreshButtonText: {
    color: "#FF6F61",
    fontSize: 14,
    fontWeight: "500",
  },
  locationNotifyButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FF6F61",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
    gap: 8,
    marginTop: 12,
    shadowColor: "#FF6F61",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  locationNotifyButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  notificationItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    padding: 16,
    backgroundColor: "#fff",
    gap: 12,
    marginHorizontal: 8,
    marginVertical: 4,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  unreadNotification: {
    backgroundColor: "#fff5f4",
    borderLeftWidth: 4,
    borderLeftColor: "#FF6F61",
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: "#bdc3c7",
    marginTop: 6,
    flexShrink: 0,
  },
  unreadDot: {
    backgroundColor: "#FF6F61",
    borderColor: "#FF6F61",
  },
  notificationContent: {
    flex: 1,
  },
  notificationHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
    gap: 8,
  },
  notificationIcon: {
    fontSize: 16,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#2c3e50",
  },
  notificationMessage: {
    fontSize: 14,
    color: "#7f8c8d",
    marginBottom: 12,
    lineHeight: 20,
  },
  dealContainer: {
    backgroundColor: "#fff5f4",
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
    borderLeftWidth: 3,
    borderLeftColor: "#FF6F61",
  },
  dealTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#2c3e50",
    marginBottom: 6,
  },
  dealDescription: {
    fontSize: 14,
    color: "#7f8c8d",
    lineHeight: 20,
    marginBottom: 8,
  },
  dealMeta: {
    marginBottom: 8,
  },
  retailerName: {
    fontSize: 13,
    color: "#7f8c8d",
    marginBottom: 4,
  },
  priceContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  currentPrice: {
    fontSize: 16,
    fontWeight: "700",
    color: "#27ae60",
  },
  originalPrice: {
    fontSize: 14,
    color: "#95a5a6",
    textDecorationLine: "line-through",
  },
  expiryText: {
    fontSize: 12,
    color: "#f39c12",
    fontWeight: "500",
    backgroundColor: "#fef9e7",
    padding: 4,
    borderRadius: 4,
    alignSelf: "flex-start",
  },
  expiredText: {
    color: "#e74c3c",
    backgroundColor: "#fdf2f2",
  },
  notificationTime: {
    fontSize: 12,
    color: "#bdc3c7",
    marginTop: 4,
  },
});
