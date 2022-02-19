import api from './api';
import CONFIG from 'react-native-config';

export async function fetchCurrentWeather(lat: number, lon: number) {
  const response = await api.get('weather', {
    params: { appid: CONFIG.WEATHER_API_KEY, lat, lon, units: 'metric' },
  });

  return response?.data;
}

export async function fetchForecast(lat: number, lon: number) {
  const response = await api.get('forecast', {
    params: { appid: CONFIG.WEATHER_API_KEY, lat, lon, units: 'metric' },
  });

  return response?.data;
}