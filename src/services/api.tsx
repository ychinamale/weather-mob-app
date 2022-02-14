import axios from 'axios';
import CONFIG from 'react-native-config';

const api = axios.create({
  baseURL: CONFIG.WEATHER_BASE_URL,
  timeout: 1000,
});

export default api;