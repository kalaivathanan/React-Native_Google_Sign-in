import React from "react";
import { View, Text, Button, StyleSheet } from "react-native";
import { StatusBar } from "expo-status-bar";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { makeRedirectUri, useAuthRequest } from "expo-auth-session";
import * as Google from "expo-auth-session/providers/google";

export default function App() {
  const [request, response, promptAsync] = Google.useAuthRequest({
    expoClientId: "88ba8abc-c3d0-424e-ad84-c821fa0dc053",
    webClientId: "512788798501-htpcobqiu1e90p5rjleu543n353m3mdb.apps.googleusercontent.com",
    androidClientId: "512788798501-m2c6mkuuqthofb51fclk2128d0la2gn4.apps.googleusercontent.com",
    redirectUri: makeRedirectUri({ useProxy: true }),
  });

  React.useEffect(() => {
    if (response?.type === "success") {
      getUserInfo(response.params.access_token);
    }
  }, [response]);

  const getUserInfo = async (accessToken) => {
    try {
      const response = await fetch("https://www.googleapis.com/oauth2/v1/userinfo", {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      const userInfo = await response.json();
      await AsyncStorage.setItem("@user", JSON.stringify(userInfo));
      console.log("User Info:", userInfo);
    } catch (error) {
      console.error("Error fetching user info:", error);
    }
  };

  return (
    <View style={styles.container}>
      <Text>Welcome to your app!</Text>
      <Button
        title="Sign in with Google"
        onPress={() => {
          promptAsync();
        }}
      />
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
