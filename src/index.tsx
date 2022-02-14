import React from 'react';
import {
  SafeAreaView, StatusBar, Text, View,
} from 'react-native';
import CONFIG from 'react-native-config';

function App() {
  return (
    <SafeAreaView>
      <StatusBar />
      <View>
        <Text>Weather app with the url as: {CONFIG.API_URL}</Text>
      </View>
    </SafeAreaView>
  );
}

export default App;
