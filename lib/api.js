import axios from 'axios';
import { getAuthHeaders, removeAuthToken } from './auth';

// Use local backend for development, production URL for production
// Force http:// for localhost (https:// doesn't work on localhost)
let API_URL = process.env.NEXT_PUBLIC_API_URL || 
  (typeof window !== 'undefined' && window.location.hostname === 'localhost' 
    ? 'http://localhost:5000' 
    : 'https://cardora.onrender.com');

// Fix: If API_URL contains localhost but uses https://, change to http://
if (API_URL.includes('localhost') && API_URL.startsWith('https://')) {
  API_URL = API_URL.replace('https://', 'http://');
  console.warn('⚠️ Fixed: Changed https://localhost to http://localhost');
}

// Log API URL in development
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  console.log('🔗 API URL:', API_URL);
  console.log('📡 Full API Base:', `${API_URL}/api`);
}

const api = axios.create({
  baseURL: `${API_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // 30 second timeout (Render free tier needs more time for cold starts)
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle 401 errors (unauthorized) and network errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Network error - server not running or timeout
    if (!error.response) {
      console.error('❌ Network Error:', error.message);
      console.error('🔗 Attempted URL:', error.config?.url);
      console.error('📡 Base URL:', error.config?.baseURL);
      if (typeof window !== 'undefined') {
        const attemptedUrl = error.config?.baseURL || 'unknown';
        const isTimeout = error.code === 'ECONNABORTED' || error.message.includes('timeout');
        const isRender = attemptedUrl.includes('onrender.com');
        
        let errorMessage;
        if (isTimeout && isRender) {
          errorMessage = `Backend server is taking too long to respond.\n\nThis usually happens when:\n1. Render free tier service is sleeping (cold start takes 30-60 seconds)\n2. Server is overloaded\n\n💡 Solutions:\n- Wait 30-60 seconds and try again\n- Visit Render dashboard to wake up the service\n- Consider upgrading to paid tier for faster response\n\nAttempted: ${attemptedUrl}`;
        } else if (error.code === 'ECONNREFUSED' || error.message.includes('ECONNREFUSED')) {
          errorMessage = `Backend server is not running.\nAttempted: ${attemptedUrl}\n\nPlease make sure:\n1. Backend server is running on port 5000\n2. Run: npm run dev`;
        } else {
          errorMessage = `Cannot connect to server.\nAttempted: ${attemptedUrl}\n\nPlease make sure:\n1. Backend server is running\n2. Check network connection`;
        }
        console.error('💡 Solution:', errorMessage);
      }
    }
    
    // 401 Unauthorized
    if (error.response?.status === 401) {
      removeAuthToken();
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;

