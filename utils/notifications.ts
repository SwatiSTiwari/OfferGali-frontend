import * as Device from "expo-device";
import { Platform } from "react-native";
import * as Notifications from "expo-notifications";
import AsyncStorage from "@react-native-async-storage/async-storage";

export async function registerForPushNotificationsAsync() {
  let token;
  if (Device.isDevice) {
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    console.log("Existing Status: ", existingStatus);
    console.log("Final Status: ", finalStatus);
    if (existingStatus !== "granted") {
      console.log("Requesting Permissions");
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== "granted") {
      console.log("failed to get push token for push notification!");
      alert("Failed to get push token for push notification!");
      return;
    }
    try {
      token = await Notifications.getExpoPushTokenAsync();
      token = token.data;
    } catch (e) {
      console.log("Error getting push token:", e);
    }
  } else {
    alert("Must use physical device for Push Notifications");
  }

  if (Platform.OS === "android") {
    Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#FF231F7C",
    });
  }

  if (token) {
    const authToken = await AsyncStorage.getItem("token");
    const userId = await AsyncStorage.getItem("userId");
    if (authToken && userId) {
      const response = await fetch(
        `${process.env.EXPO_PUBLIC_BACKEND_API_URL}/api/notifications/push-token`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
          body: JSON.stringify({ push_token: token }),
        }
      );
    }
  }
}
