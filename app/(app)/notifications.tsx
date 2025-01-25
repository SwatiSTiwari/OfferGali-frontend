import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';
import { Link } from 'expo-router';

const notifications = [
  {
    id: '1',
    title: '50% Off on Electronics',
    description: 'Amazing Deals on Laptops and Smartphones',
    time: '2 hours ago',
    isRead: false,
  },
  {
    id: '2',
    title: 'Flash Sale: Home Appliances',
    description: 'Get upto off on home appliances',
    time: '7 hours ago',
    isRead: true,
  },
  {
    id: '3',
    title: 'New Fashion Collection',
    description: 'Spring collection now available',
    time: '11 hours ago',
    isRead: true,
  },
  {
    id: '4',
    title: 'Weekend Special Deals',
    description: "Don't miss out on these exclusive offers",
    time: 'Yesterday, 15:33',
    isRead: true,
    section: 'Yesterday'
  },
];

export default function NotificationScreen() {
  const router = useRouter();

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
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Today</Text>
          {notifications.slice(0, 3).map((notification) => (
            <TouchableOpacity
              key={notification.id}
              style={styles.notificationItem}
            >
              {renderNotificationDot(notification.isRead)}
              <View style={styles.notificationContent}>
                <Text style={styles.notificationTitle}>{notification.title}</Text>
                <Text style={styles.notificationDescription}>
                  {notification.description}
                </Text>
                <Text style={styles.notificationTime}>{notification.time}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Yesterday</Text>
          {notifications.slice(3).map((notification) => (
            <TouchableOpacity
              key={notification.id}
              style={styles.notificationItem}
            >
              {renderNotificationDot(notification.isRead)}
              <View style={styles.notificationContent}>
                <Text style={styles.notificationTitle}>{notification.title}</Text>
                <Text style={styles.notificationDescription}>
                  {notification.description}
                </Text>
                <Text style={styles.notificationTime}>{notification.time}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      <View style={styles.bottomNav}>
        <Link href="/home" asChild>
        <TouchableOpacity style={styles.navItem}>
          <FontAwesome name="home" size={24} color="#666" />
          <Text style={styles.navText}>Home</Text>
        </TouchableOpacity>
        </Link>
        <Link href="/home" asChild>
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
  section: {
    backgroundColor: '#E8F5E9',
    paddingBottom: 1,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    paddingHorizontal: 16,
    paddingVertical: 12,
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
  navItem: {
    alignItems: 'center',
  },
  navText: {
    fontSize: 12,
    marginTop: 4,
    color: '#666',
  },
});