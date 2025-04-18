import React, { useState } from 'react'
import * as WebBrowser from "expo-web-browser"
import * as Google from "expo-auth-session/providers/google"
import AsyncStorage from '@react-native-async-storage/async-storage'


const googlesignin = () => {
    const [userInfo, setUserInfo] = useState(null)
    const [request, response, promptAsync] = Google.useAuthRequest({
        androidClientId: process.env.EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID
    })
  return (
    <div>
      
    </div>
  )
}

export default googlesignin
