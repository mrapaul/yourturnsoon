// src/api.js

import axios from 'axios';
import axiosRetry from 'axios-retry';

const api = axios.create({
  baseURL: 'https://pdxjuo9snk.execute-api.eu-north-1.amazonaws.com/', 
  timeout: 10000, // 10 seconds
  headers: {
    'x-api-key': 'lYS2gH0t4O9KXGmaZqPJW8JfxoaGPNaZ2p34zdZe' // Replace with your API Key
  }
});

axiosRetry(api, {
  retries: 3,
  retryDelay: (retryCount) => {
    return retryCount * 1000;
  },
  retryCondition: (error) => {
    return error.response.status >= 500 || !error.response;
  },
});

export default api;