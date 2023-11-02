// src/api.js

import axios from 'axios';
import axiosRetry from 'axios-retry';

const api = axios.create({
  baseURL: 'https://pdxjuo9snk.execute-api.eu-north-1.amazonaws.com/', // Replace with your AWS API Gateway URL
  timeout: 10000, // 10 seconds
});

axiosRetry(api, {
  retries: 3, // Number of retry attempts
  retryDelay: (retryCount) => {
    return retryCount * 1000; // Time between retries increases by 1 second each attempt
  },
  retryCondition: (error) => {
    // Only retry if it's a network error or 5xx response
    return error.response.status >= 500 || !error.response;
  },
});

export default api;
