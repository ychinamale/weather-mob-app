import React, { useCallback } from 'react';
import {
  SafeAreaView, StatusBar, Text, View,
} from 'react-native';
import CONFIG from 'react-native-config';
import { NavigationContainer, useFocusEffect } from '@react-navigation/native';
import Geolocation from 'react-native-geolocation-service';

function App() {

  useFocusEffect(
    useCallback(() => {
      // get the current location here
      // implement pull to refresh later
    }, [])
  );

  return (
    <NavigationContainer>
      <SafeAreaView>
        <StatusBar />
        <View>
          <Text>Weather app with the url as: {CONFIG.API_URL}</Text>
        </View>
      </SafeAreaView>
    </NavigationContainer>
  );
}

export default App;
