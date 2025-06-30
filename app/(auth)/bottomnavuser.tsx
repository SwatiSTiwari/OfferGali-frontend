import React from 'react'
import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import { Link } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';

const BottomNavUser = () => {
  return (
     <View style={styles.bottomNav}>
        <Link href="/(app)/home" asChild>
          <TouchableOpacity style={styles.navItem}>
            <FontAwesome name="home" size={24} color="#FF6B6B" />
            <Text style={[styles.navText, { color: "#FF6B6B" }]}>Home</Text>
          </TouchableOpacity>
        </Link>
        <Link href="/(app)/settings/geofencing" asChild>
          <TouchableOpacity style={styles.navItem}>
            <FontAwesome name="compass" size={24} color="#666" />
            <Text style={styles.navText}>Explore</Text>
          </TouchableOpacity>
        </Link>
        <Link href="/(app)/saved" asChild>
          <TouchableOpacity style={styles.navItem}>
            <FontAwesome name="heart" size={24} color="#666" />
            <Text style={styles.navText}>Saved</Text>
          </TouchableOpacity>
        </Link>
        <Link  href={{
            pathname: "/(app)/profile",
            params: { role: "users" }, // add your props here
          }} asChild>
          <TouchableOpacity style={styles.navItem}>
            <FontAwesome name="user" size={24} color="#666" />
            <Text style={styles.navText}>Profile</Text>
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
  },
  navItem: {
    alignItems: 'center',
  },
  navText: {
    fontSize: 12,
    marginTop: 4,
    color: '#666',
  },
  navTextActive: {
    color: '#FF6B6B',
  },
}
)

export default BottomNavUser;
