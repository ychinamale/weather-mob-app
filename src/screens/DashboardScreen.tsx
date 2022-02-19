import React from 'react';
import {
  ImageBackground,
  PermissionsAndroid, PermissionStatus, Permission,
  Platform, SafeAreaView, Text, useWindowDimensions, View, ScrollView, Image, StyleSheet,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import Geolocation from 'react-native-geolocation-service';
import dayjs from 'dayjs';
import { tWeatherData } from 'src/constants/entities';
import { backgrounds, icons } from 'src/constants/images';
import { fetchCurrentWeather, fetchForecast } from 'src/services/apiCalls';
import colors from 'src/constants/colors';
import { scale, width as screenWidth } from 'src/constants/scaling';


type tGranted = { [p in Permission]: PermissionStatus }
type tImageKey = 'sunny' | 'cloudy' | 'rainy'

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

const getWeatherImages = (imageKey:tImageKey) => {
  return {
    icon: icons[imageKey],
    background: backgrounds[imageKey]
  }
}

function getWeatherDescKey(description:string) {
  if (description?.toLowerCase()?.includes('cloud')) { 
    return 'cloudy'
  } else if (description?.toLowerCase()?.includes('rain')) {
    return 'rainy'
  } // else if (description.toLowerCase().includes('sun') || description.toLowerCase().includes('clear')) { 
    // return 'sunny'
  // } 
  else {
    return 'sunny'
  }
}

function getWeatherIcons(description:string) {
  let imageKey:tImageKey = getWeatherDescKey(description)
  return getWeatherImages(imageKey);
}

function getCurrentSummary(currentData) {
  return {
    date: dayjs().format('YYYY-MM-DD'),
    day: dayjs().format('dddd'),
    desc: [currentData.weather[0].main],
    temp: currentData.main.temp.toFixed(),
    min: currentData.main.temp_min.toFixed(),
    max: currentData.main.temp_max.toFixed(),
  }
}

function getForecastSummary(forecast) {
  let forecastSummary = {};

  for (const entry of forecast) {
    const date = entry?.dt_txt.split(" ")[0]

    if (!forecastSummary[date]) {
      forecastSummary[date] = {
        day: dayjs(date).format('dddd'),
        desc: [entry.weather[0].main],
        temp: entry.main.temp.toFixed(),
        min: entry.main.temp_min.toFixed(),
        max: entry.main.temp_max.toFixed() 
      }
    } else {
      // update list of weather descriptions
      forecastSummary[date].desc.push(entry.weather[0].main);

      // update lowest temp
      if (entry.main.temp_min < forecastSummary[date].min) { 
        forecastSummary[date].min = entry.main.temp_min;
      }

      // update highest temp
      if (entry.main.temp_max > forecastSummary[date].max) {
        forecastSummary[date].max = entry.main.temp_max;
      }
    }
  }

  // convert to array
  return Object.entries(forecastSummary).map(([date, value]) => {
    return { 
      date,
      ...value,
    }
  })
}


function DashboardScreen() {
  const [weather, setWeather] = React.useState<tWeatherData>();
  const { width: screenWidth } = useWindowDimensions();

  useFocusEffect(
    React.useCallback(() => {
      async function getCurrentWeather() {
        const hasLocationPermissions = await getLocationPermission();

        if (hasLocationPermissions) {

          try {
            // get latitude & longitude of current position
            const { lat, lon } = await getLatLonPromise();

            // get weather at current position
            const weatherData = await fetchCurrentWeather(lat, lon);
            const weatherSummary = getCurrentSummary(weatherData);

            // get weather forecast
            const forecastData = await fetchForecast(lat, lon);
            const forecastSummary = getForecastSummary(forecastData.list);

            setWeather({
              current: weatherSummary,
              forecast: forecastSummary,
            })

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

  const weatherDesc = weather?.current?.desc[0].toLowerCase()

  return (
    <SafeAreaView style={s.layout}>
      <ScrollView
        contentContainerStyle={s.container}
        style={{ backgroundColor: colors[getWeatherDescKey(weatherDesc) || 'cloudy']}}
      >
        {
          !weather?.current?.desc
          ? <View style={s.headerBackdrop}>
              <Text>Loading current</Text>
          </View>
          : <>
            <ImageBackground
              style={s.headerBackdrop}
              source={getWeatherIcons(weatherDesc).background}
              resizeMode='cover'
            >
              <View style={s.headerArea}>
                <Text style={[ s.text, s.h1 ]}>{weather?.current?.temp}&deg;</Text>
                <Text style={[ s.text, s.h2 ]}>{weatherDesc?.toUpperCase()}</Text>
              </View>
            </ImageBackground>
            <View style={[s.weatherRow, s.topMargin ]}>
              <View style={s.detailSection}>
                <Text style={[ s.text, s.h3 ]}>{weather?.current?.min}&deg;</Text>
                <Text style={[ s.text, s.h4 ]}>min</Text>
              </View>
              <View style={[s.detailSection, s.center ]}>
                <Text style={[ s.text, s.h3 ]}>{weather?.current?.temp}&deg;</Text>
                <Text style={[ s.text, s.h4 ]}>Current</Text>
              </View>
              <View style={[s.detailSection, s.sendToEnd]}>
                <Text style={[ s.text, s.h3 ]}>{weather?.current?.max}&deg;</Text>
                <Text style={[ s.text, s.h4 ]}>max</Text>
              </View>
            </View>
          </>
        }
        <View style={[ s.separator, s.topMargin, s.bottomMargin ]} />
        { weather?.forecast?.length > 0
          ? <>
            { weather?.forecast.map((entry) => (
              <View key={entry.date} style={s.weatherRow}>
                <View style={s.detailSection}>
                  <Text style={[ s.text, s.h3 ]}>{entry.day}</Text>
                </View>
                <View style={[s.detailSection, s.center ]}>
                  <Image
                    source={getWeatherIcons(entry.desc[0]).icon}
                    style={s.weatherIcon}
                    resizeMode='cover'  
                  />
                </View>
                <View style={[s.detailSection, s.sendToEnd]}>
                  <Text style={[ s.text, s.h3 ]}>{entry?.temp}&deg;</Text>
                </View>
              </View>
            ))}
          </>
          : <View>
              <Text>Loading forecast ...</Text>
            </View>
        }
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  center: { alignItems: 'center', justifyContent: 'center' },
  sendToEnd: { alignItems: 'flex-end' },
  bottomMargin: { marginBottom: scale(8) },
  topMargin: { marginTop: scale(12) },
  separator: { borderBottomWidth: 1, borderBottomColor: '#fff' },
  container: { flexGrow: 1 },
  layout: { flex: 1 },
  headerBackdrop: { height: scale(321), width: screenWidth },
  headerArea: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1
  },
  h1: { fontSize: scale(64), fontWeight: 'bold' },
  h2: { fontSize: scale(26), fontWeight: 'bold' },
  h3: { fontSize: scale(20) },
  h4: { fontSize: scale(18) },
  text: { color: '#fff', letterSpacing: 1.15 },
  weatherIcon: { height: scale(28), width: scale(28) },
  weatherRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    height: scale(42),
    paddingHorizontal: scale(12)
  },
  detailSection: {
    justifyContent: 'center',
    flex: 1,
  }
})

export default DashboardScreen;
