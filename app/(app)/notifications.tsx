import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { fetchNotifications, markNotificationAsRead } from '@/api/user/user';
import { router } from 'expo-router';

export default function NotificationScreen() {
  interface Notification {
    id: string;
    type: string;
    read: boolean;
    created_at: string;
    deals?: {
      title: string;
      description: string;
      expires_at: string;
    };
  }
  
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotificationsData = async () => {
      const result = await fetchNotifications();
      if (result.success) {
        console.log("Notifications:", result.data);
        setNotifications(result.data.notifications);  // Assuming this will give you the array
      }
      setLoading(false);
    };

    fetchNotificationsData();
  }, []);

  const handleNotificationClick = async (notificationId: string) => {
    const result = await markNotificationAsRead(notificationId);

    if (result.success) {
      setNotifications(prevNotifications =>
        prevNotifications.map(notification =>
          notification.id === notificationId ? { ...notification, read: true } : notification
        )
      );
    } else {
      console.error("Failed to mark notification as read:", result.message);
    }
  };

  const renderNotificationDot = (isRead: boolean) => (
    <View style={[styles.dot, !isRead && styles.unreadDot]} />
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <FontAwesome name="arrow-left" size={20} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Notifications</Text>
        <TouchableOpacity>
          <FontAwesome name="ellipsis-v" size={20} color="#333" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.notificationList}>
        {loading ? (
          <Text style={styles.loadingText}>Loading notifications...</Text>
        ) : (
          notifications.map((notification) => (
            <TouchableOpacity
              key={notification.id}
              style={styles.notificationItem}
              onPress={() => handleNotificationClick(notification.id)}  // Mark as read on click
            >
              {renderNotificationDot(notification.read)}
              <View style={styles.notificationContent}>
                <Text style={styles.notificationTitle}>{notification.type}</Text>

                {/* Only render deal information if it exists */}
                {notification.deals && (
                  <View>
                    <Text style={styles.notificationTitle}>{notification.deals.title}</Text>
                    <Text style={styles.notificationDescription}>{notification.deals.description}</Text>
                    <Text style={styles.notificationTime}>
                      Expires on: {new Date(notification.deals.expires_at).toLocaleString()}
                    </Text>
                  </View>
                )}

                <Text style={styles.notificationTime}>
                  {new Date(notification.created_at).toLocaleString()}
                </Text>
              </View>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>

      <View style={styles.bottomNav}>
        {/* Bottom navigation items */}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    paddingTop: 48,
    backgroundColor: '#fff',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  notificationList: {
    flex: 1,
  },
  loadingText: {
    fontSize: 14,
    color: '#666',
    padding: 16,
  },
  notificationItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 16,
    backgroundColor: '#fff',
    gap: 12,
  },
  dot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: '#666',
    marginTop: 2,
  },
  unreadDot: {
    backgroundColor: '#666',
    borderColor: '#666',
  },
  notificationContent: {
    flex: 1,
  },
  notificationTitle: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 4,
  },
  notificationDescription: {
    fontSize: 13,
    color: '#666',
    marginBottom: 4,
  },
  notificationTime: {
    fontSize: 12,
    color: '#999',
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 12,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
});
