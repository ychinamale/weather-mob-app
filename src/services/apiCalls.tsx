import api from './api';
import CONFIG from 'react-native-config';

export async function fetchWeather(lat: number, lon: number) {
  const response = await api.get('weather', {
    params: { appid: CONFIG.WEATHER_API_KEY, lat, lon },
  })

  return response?.data;
}