// src/api.js

import axios from 'axios';
import axiosRetry from 'axios-retry';

const api = axios.create({
  baseURL: 'https://pdxjuo9snk.execute-api.eu-north-1.amazonaws.com/dev',
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

export async function checkEmailExists(email) {
  try {
    const response = await api.get(`/businesses?email=${encodeURIComponent(email)}`);
    return response.data;
  } catch (error) {
    console.error('Error checking email existence:', error);
    throw error;
  }
}

export async function registerBusiness(businessDetails) {
  try {
    const response = await api.post('/businesses', businessDetails);
    return response.data;
  } catch (error) {
    console.error('Error registering business:', error);
    throw error;
  }
}

export async function signInBusiness(email, password) {
  try {
    const response = await api.get(`/businesses?email=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}`);
    return response.data;
  } catch (error) {
    console.error('Error signing in business:', error);
    throw error;
  }
}

export default api;
