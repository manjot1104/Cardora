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
  
  // If it's a relative path starting with /images/, it's a public Next.js asset - return as is
  if (imageUrl.startsWith('/images/')) {
    return imageUrl;
  }
  
  // If it's a relative path starting with /uploads/, it's from the backend
  if (imageUrl.startsWith('/uploads/')) {
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

/**
 * Get audio/music URL - handles both public and uploaded files
 */
export const getAudioUrl = (audioUrl) => {
  if (!audioUrl) return null;
  
  // If already an absolute URL, return as is
  if (audioUrl.startsWith('http://') || audioUrl.startsWith('https://')) {
    return audioUrl;
  }
  
  // If it's a data URL, return as is
  if (audioUrl.startsWith('data:')) {
    return audioUrl;
  }
  
  // If it's a public image path, return as is (Next.js serves it)
  if (audioUrl.startsWith('/images/')) {
    return audioUrl;
  }
  
  // If it's an uploaded file, prepend backend URL
  if (audioUrl.startsWith('/uploads/')) {
    const backendUrl = getBackendUrl();
    const cleanPath = audioUrl.startsWith('/') ? audioUrl.substring(1) : audioUrl;
    return `${backendUrl}/${cleanPath}`;
  }
  
  // For other relative paths, assume they're from the backend
  const backendUrl = getBackendUrl();
  const cleanPath = audioUrl.startsWith('/') ? audioUrl.substring(1) : audioUrl;
  return `${backendUrl}/${cleanPath}`;
};
