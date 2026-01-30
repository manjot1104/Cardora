// Utility functions for handling image URLs in production

/**
 * Get the backend API URL
 */
export const getBackendUrl = () => {
  if (typeof window === 'undefined') {
    // Server-side: use environment variable or default
    return process.env.NEXT_PUBLIC_API_URL || 'https://cardora.onrender.com';
  }
  
  // Client-side: use the same logic as api.js
  const API_URL = process.env.NEXT_PUBLIC_API_URL;
  if (API_URL) {
    return API_URL;
  }
  
  const hostname = window.location.hostname;
  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    return 'http://localhost:5000';
  }
  
  return 'https://cardora.onrender.com';
};

/**
 * Convert relative image URL to absolute URL
 * Handles both local development and production
 */
export const getImageUrl = (imageUrl) => {
  if (!imageUrl) return null;
  
  // If already an absolute URL (http:// or https://), return as is
  if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
    return imageUrl;
  }
  
  // If it's a data URL (base64), return as is
  if (imageUrl.startsWith('data:')) {
    return imageUrl;
  }
  
  // If it's a relative path starting with /uploads or /images
  if (imageUrl.startsWith('/uploads/') || imageUrl.startsWith('/images/')) {
    const backendUrl = getBackendUrl();
    // Remove leading slash from imageUrl to avoid double slashes
    const cleanPath = imageUrl.startsWith('/') ? imageUrl.substring(1) : imageUrl;
    return `${backendUrl}/${cleanPath}`;
  }
  
  // For other relative paths, assume they're from the backend
  const backendUrl = getBackendUrl();
  const cleanPath = imageUrl.startsWith('/') ? imageUrl.substring(1) : imageUrl;
  return `${backendUrl}/${cleanPath}`;
};

/**
 * Get image URL for CSS background-image
 */
export const getBackgroundImageUrl = (imageUrl) => {
  const url = getImageUrl(imageUrl);
  return url ? `url(${url})` : 'none';
};
