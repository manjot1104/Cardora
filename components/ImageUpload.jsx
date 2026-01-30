'use client';

import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import api from '@/lib/api';
import toast from 'react-hot-toast';
import { getImageUrl } from '@/lib/imageUtils';

export default function ImageUpload({ 
  imageType = 'card', 
  currentImage = null, 
  onImageUploaded,
  label = 'Upload Image',
  accept = 'image/*',
  maxSizeMB = 5
}) {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(currentImage);
  const fileInputRef = useRef(null);

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file size
    const maxSize = maxSizeMB * 1024 * 1024; // Convert MB to bytes
    if (file.size > maxSize) {
      toast.error(`Image size must be less than ${maxSizeMB}MB`);
      return;
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result);
    };
    reader.readAsDataURL(file);

    // Upload file
    uploadImage(file);
  };

  const uploadImage = async (file) => {
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('image', file);
      formData.append('imageType', imageType);

      const response = await api.post('/upload/image', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data.success) {
        setPreview(response.data.imageUrl);
        toast.success('Image uploaded successfully!');
        if (onImageUploaded) {
          onImageUploaded(response.data.imageUrl);
        }
      }
    } catch (error) {
      console.error('Upload error:', error);
      toast.error(error.response?.data?.error || 'Failed to upload image');
      setPreview(currentImage); // Reset to current image on error
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async () => {
    if (!preview || !preview.startsWith('/uploads/')) {
      setPreview(null);
      if (onImageUploaded) {
        onImageUploaded(null);
      }
      return;
    }

    try {
      await api.delete(`/upload/image/${encodeURIComponent(preview)}`);
      setPreview(null);
      toast.success('Image deleted successfully!');
      if (onImageUploaded) {
        onImageUploaded(null);
      }
    } catch (error) {
      console.error('Delete error:', error);
      toast.error(error.response?.data?.error || 'Failed to delete image');
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      const maxSize = maxSizeMB * 1024 * 1024;
      if (file.size > maxSize) {
        toast.error(`Image size must be less than ${maxSizeMB}MB`);
        return;
      }
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
      
      uploadImage(file);
    }
  };

  return (
    <div className="w-full">
      <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
        {label}
      </label>
      
      <div
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        className={`relative border-2 border-dashed rounded-lg p-6 transition-all ${
          uploading
            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
            : 'border-gray-300 dark:border-gray-600 hover:border-blue-400 dark:hover:border-blue-500 bg-gray-50 dark:bg-gray-800'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          onChange={handleFileSelect}
          className="hidden"
          disabled={uploading}
        />

        {preview ? (
          <div className="relative">
            <img
              src={preview.startsWith('data:') ? preview : getImageUrl(preview)}
              alt="Preview"
              className="w-full h-48 object-cover rounded-lg"
            />
            <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-30 transition-all rounded-lg flex items-center justify-center gap-2">
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium opacity-0 hover:opacity-100 transition-opacity disabled:opacity-50"
              >
                {uploading ? 'Uploading...' : 'Change'}
              </button>
              <button
                onClick={handleDelete}
                disabled={uploading}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium opacity-0 hover:opacity-100 transition-opacity disabled:opacity-50"
              >
                Delete
              </button>
            </div>
          </div>
        ) : (
          <div className="text-center">
            {uploading ? (
              <div className="flex flex-col items-center gap-3">
                <svg className="animate-spin h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <p className="text-sm text-gray-600 dark:text-gray-400">Uploading...</p>
              </div>
            ) : (
              <>
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                <div className="mt-4">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-all"
                  >
                    Select Image
                  </button>
                  <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                    or drag and drop
                  </p>
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-500">
                    PNG, JPG, GIF up to {maxSizeMB}MB
                  </p>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
