import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add request interceptor to add auth token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Donation API calls
export const getDonations = async () => {
  try {
    const response = await api.get('/donations');
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const getUserDonations = async () => {
  try {
    const response = await api.get('/donations/user');
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const getDonationById = async (id) => {
  try {
    const response = await api.get(`/donations/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const createDonation = async (donationData) => {
  try {
    const response = await api.post('/donations', donationData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const updateDonation = async (id, donationData) => {
  try {
    const response = await api.put(`/donations/${id}`, donationData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const deleteDonation = async (id) => {
  try {
    const response = await api.delete(`/donations/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const claimDonation = async (id) => {
  try {
    const response = await api.put(`/donations/${id}/claim`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export default api;
