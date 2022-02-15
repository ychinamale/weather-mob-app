import React, { useCallback } from 'react';
import {
  PermissionsAndroid, PermissionStatus, Permission,
  Platform, SafeAreaView, Text, View,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import Geolocation from 'react-native-geolocation-service';
import { fetchWeather } from 'src/services/apiCalls';

type tGranted = { [p in Permission]: PermissionStatus }

const locationPermissons = [
  PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
  PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
];

async function getLocationPermission() {
  if (Platform.OS === 'ios') {
    // handle later for ios
    return false;
  }
  try {
    const granted: tGranted = await PermissionsAndroid.requestMultiple(locationPermissons);
    if (granted['android.permission.ACCESS_FINE_LOCATION'] !== PermissionsAndroid.RESULTS.GRANTED) {
      console.log('No fine location permissions');
      return false;
    }

    if (granted['android.permission.ACCESS_COARSE_LOCATION'] !== PermissionsAndroid.RESULTS.GRANTED) {
      console.log('No coarse location permission');
      return false;
    }
  } catch (err) {
    console.log(`\n[Error] getLocationPermissions ${err}\n\n`);
    return false;
  }

  return true;
}

function getLatLonPromise() {
  return new Promise((resolve, reject) => {
    Geolocation.getCurrentPosition(
      (position) => {
        console.log(`Position is \n${JSON.stringify(position, null, 2)}\n\n`);
        resolve({ lat: position?.coords?.latitude, lon: position?.coords?.longitude });
      },
      (err) => {
        console.log(`\n[Error] getCurrentLocation\n${err}\n\n`);
        reject(err);
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 },
    );
  });
}

function DashboardScreen() {
  useFocusEffect(
    useCallback(() => {
      async function getCurrentWeather() {
        const hasLocationPermissions = await getLocationPermission();

        if (hasLocationPermissions) {
          try {
            // get latitude & longitude of current position
            const { lat, lon } = await getLatLonPromise();

            // get weather at current position
            const weather = await fetchWeather(lat, lon);
          } catch (err) {
            console.log(`[Error] getCurrentWeather \n${err}\n`)
          }
        } else {
          console.log('Sorry. No location permissions');
        }
      }

      getCurrentWeather();
    }, []),
  );

  return (
    <SafeAreaView>
      <View>
        <Text>Here we go: Dashboard</Text>
      </View>
    </SafeAreaView>
  );
}

export default DashboardScreen;
