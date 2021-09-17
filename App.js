import 'expo-dev-client';

import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';

import Constants from 'expo-constants'
import * as Notifications from 'expo-notifications';

export default function App() {
  const [token, setToken] = React.useState(null);

  const sendNotificationAsync = React.useCallback(
    async (title, body) => {
      const message = {
        to: token,
        sound: 'default',
        title,
        body,
        data: {someData: 'goes here'}
      }
      console.log('token', token)
      console.log(`Sending notification: ${JSON.stringify(message)}`)

      const resp = await fetch('https://exp.host/--/api/v2/push/send', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Accept-encoding': 'gzip, deflate',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(message)
      })
      console.log(await resp.json())
    },
    [token]
  )

  const registerForPushNotificationsAsync = async () => {
    if (Constants.isDevice) {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      if (finalStatus !== 'granted') {
        alert('Failed to get push token for push notification!');
        return;
      }
      const token = (await Notifications.getExpoPushTokenAsync({ experienceId: '@exiasr/radar-kitten-test' })).data;
      console.log(token);
      setToken(token)
    } else {
      alert('Must use physical device for Push Notifications');
    }

  };

  return (
    <View style={styles.container}>
      <Text>Open up App.js to start working on your app!</Text>
      <Button title="Register Notification" onPress={registerForPushNotificationsAsync} />
      <Button title="Test Notification" onPress={() => sendNotificationAsync("hi", "this is a test")} />
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
