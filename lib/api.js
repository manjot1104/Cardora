import axios from 'axios';
import { getAuthHeaders, removeAuthToken } from './auth';

// Use local backend for development, production URL for production
// Force http:// for localhost (https:// doesn't work on localhost)
let API_URL = process.env.NEXT_PUBLIC_API_URL;

// If NEXT_PUBLIC_API_URL is not set, detect based on environment
if (!API_URL) {
  if (typeof window !== 'undefined') {
    const hostname = window.location.hostname;
    // Local development
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
      API_URL = 'http://localhost:5000';
    } 
    // Production - use Render backend
    else {
      API_URL = 'https://cardora.onrender.com';
    }
  } else {
    // Server-side rendering fallback
    API_URL = 'https://cardora.onrender.com';
  }
}

// Fix: If API_URL contains localhost but uses https://, change to http://
if (API_URL.includes('localhost') && API_URL.startsWith('https://')) {
  API_URL = API_URL.replace('https://', 'http://');
  console.warn('⚠️ Fixed: Changed https://localhost to http://localhost');
}

// Always log API URL for debugging (helps identify issues in production)
if (typeof window !== 'undefined') {
  console.log('🔗 API URL:', API_URL);
  console.log('📡 Full API Base:', `${API_URL}/api`);
  console.log('🌐 Current Hostname:', window.location.hostname);
  console.log('🔧 NEXT_PUBLIC_API_URL env:', process.env.NEXT_PUBLIC_API_URL || 'NOT SET');
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
      console.error('🌐 Full Request URL:', `${error.config?.baseURL}${error.config?.url}`);
      console.error('❌ Error Code:', error.code);
      console.error('❌ Error Details:', {
        message: error.message,
        code: error.code,
        config: {
          url: error.config?.url,
          baseURL: error.config?.baseURL,
          method: error.config?.method,
        }
      });
      
      if (typeof window !== 'undefined') {
        const attemptedUrl = error.config?.baseURL || 'unknown';
        const fullUrl = `${error.config?.baseURL}${error.config?.url}`;
        const isTimeout = error.code === 'ECONNABORTED' || error.message.includes('timeout');
        const isRender = attemptedUrl.includes('onrender.com');
        const isCorsError = error.message.includes('CORS') || error.message.includes('Failed to fetch');
        
        let errorMessage;
        if (isCorsError) {
          errorMessage = `CORS Error: Cannot connect to backend.\n\nAttempted: ${fullUrl}\n\n💡 Solutions:\n1. Check if backend CORS allows your domain\n2. Verify NEXT_PUBLIC_API_URL is set correctly in Vercel\n3. Check backend server is running on Render`;
        } else if (isTimeout && isRender) {
          errorMessage = `Backend server is taking too long to respond.\n\nThis usually happens when:\n1. Render free tier service is sleeping (cold start takes 30-60 seconds)\n2. Server is overloaded\n\n💡 Solutions:\n- Wait 30-60 seconds and try again\n- Visit Render dashboard to wake up the service\n- Consider upgrading to paid tier for faster response\n\nAttempted: ${fullUrl}`;
        } else if (error.code === 'ECONNREFUSED' || error.message.includes('ECONNREFUSED')) {
          errorMessage = `Backend server is not running.\nAttempted: ${fullUrl}\n\nPlease make sure:\n1. Backend server is running on port 5000\n2. Run: npm run dev`;
        } else if (error.message.includes('ERR_FAILED') || error.message.includes('Failed to fetch')) {
          errorMessage = `Cannot connect to backend server.\n\nAttempted: ${fullUrl}\n\n💡 Possible causes:\n1. Backend server is down or sleeping (Render free tier)\n2. CORS configuration issue\n3. Network connectivity problem\n4. Incorrect API URL configuration\n\n🔧 Check:\n- Vercel Environment Variables: NEXT_PUBLIC_API_URL should be https://cardora.onrender.com\n- Render dashboard: Ensure backend service is running\n- Wait 30-60 seconds if using Render free tier (cold start)`;
        } else {
          errorMessage = `Cannot connect to server.\nAttempted: ${fullUrl}\n\nPlease make sure:\n1. Backend server is running\n2. Check network connection\n3. Verify API URL configuration`;
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

