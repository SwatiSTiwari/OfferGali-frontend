import React from 'react'
import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import { Link, usePathname } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';

const BottomNavUser = () => {
  const pathname = usePathname();
  
  const isActive = (path: string) => {
    return pathname === path;
  };

  return (
     <View style={styles.bottomNav}>
        <Link href="/(app)/home" asChild>
          <TouchableOpacity style={styles.navItem}>
            <FontAwesome 
              name="home" 
              size={24} 
              color={isActive('/(app)/home') ? "#FF6F61" : "#666"} 
            />
            <Text style={[
              styles.navText, 
              { color: isActive('/(app)/home') ? "#FF6F61" : "#666" }
            ]}>
              Home
            </Text>
          </TouchableOpacity>
        </Link>
        <Link href="/(app)/settings/geofencing" asChild>
          <TouchableOpacity style={styles.navItem}>
            <FontAwesome 
              name="compass" 
              size={24} 
              color={isActive('/(app)/settings/geofencing') ? "#FF6F61" : "#666"} 
            />
            <Text style={[
              styles.navText,
              { color: isActive('/(app)/settings/geofencing') ? "#FF6F61" : "#666" }
            ]}>
              Explore
            </Text>
          </TouchableOpacity>
        </Link>
        <Link href="/(app)/saved" asChild>
          <TouchableOpacity style={styles.navItem}>
            <FontAwesome 
              name="heart" 
              size={24} 
              color={isActive('/(app)/saved') ? "#FF6F61" : "#666"} 
            />
            <Text style={[
              styles.navText,
              { color: isActive('/(app)/saved') ? "#FF6F61" : "#666" }
            ]}>
              Saved
            </Text>
          </TouchableOpacity>
        </Link>
        <Link  href={{
            pathname: "/(app)/profile",
            params: { role: "users" }, // add your props here
          }} asChild>
          <TouchableOpacity style={styles.navItem}>
            <FontAwesome 
              name="user" 
              size={24} 
              color={isActive('/(app)/profile') ? "#FF6F61" : "#666"} 
            />
            <Text style={[
              styles.navText,
              { color: isActive('/(app)/profile') ? "#FF6F61" : "#666" }
            ]}>
              Profile
            </Text>
          </TouchableOpacity>
        </Link>
      </View>
  )
}

const styles = StyleSheet.create({
    bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 12,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#eee',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  navItem: {
    alignItems: 'center',
  },
  navText: {
    fontSize: 12,
    marginTop: 4,
    color: '#666',
  },
}
)

export default BottomNavUser;
