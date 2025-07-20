import React from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from "react-native";
import { Link } from "expo-router";
import { FontAwesome } from "@expo/vector-icons";


const BottomRetailerNav = () => {
  return (
   <View style={styles.bottomNav}>
           {/* <Link href="/home" asChild>
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
           </Link> */}
   
           <Link href="/(retailer)/dashboard" asChild>
             <TouchableOpacity style={styles.navItem}>
               <FontAwesome name="tags" size={24} color="#666" />
               <Text style={styles.navText}>Deals</Text>
             </TouchableOpacity>
           </Link>
   
           <Link
             href={{
               pathname: "/(app)/profile",
               params: { role: "retailers" }, // add your props here
             }}
             asChild
           >
             <TouchableOpacity style={styles.navItem}>
               <FontAwesome name="user" size={24} color="#666" />
               <Text style={styles.navText}>Profile</Text>
             </TouchableOpacity>
           </Link>

           <Link href={{
            pathname: "/(app)/feedback",
            params: { role: "retailer" }, // add your props here
           }} asChild>
                     <TouchableOpacity style={{alignItems: 'center'}}>
                       <FontAwesome name="comment" size={24} color="#666"/>
               <Text style={styles.navText}>Feedback</Text>

                     </TouchableOpacity>
                   </Link>
         </View>
  )
}

const styles = StyleSheet.create({
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
  navItem: { padding: 4 },
  navText: { fontSize: 12, marginTop: 4, color: "#666" },
})

export default BottomRetailerNav
