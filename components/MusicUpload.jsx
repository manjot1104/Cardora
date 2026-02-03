'use client';

import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import api from '@/lib/api';
import toast from 'react-hot-toast';
import { getImageUrl } from '@/lib/imageUtils';

export default function MusicUpload({ 
  currentMusic = null, 
  onMusicUploaded,
  label = 'Upload Background Music',
  accept = 'audio/*',
  maxSizeMB = 10
}) {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(currentMusic);
  const fileInputRef = useRef(null);
  const audioRef = useRef(null);

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file size
    const maxSize = maxSizeMB * 1024 * 1024; // Convert MB to bytes
    if (file.size > maxSize) {
      toast.error(`Audio file size must be less than ${maxSizeMB}MB`);
      return;
    }

    // Validate file type
    if (!file.type.startsWith('audio/')) {
      toast.error('Please select an audio file');
      return;
    }

    // Create preview URL
    const url = URL.createObjectURL(file);
    setPreview(url);
    if (audioRef.current) {
      audioRef.current.src = url;
    }

    // Upload file
    uploadMusic(file);
  };

  const uploadMusic = async (file) => {
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('audio', file);
      formData.append('audioType', 'wedding');

      const response = await api.post('/upload/audio', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data.success) {
        setPreview(response.data.audioUrl);
        toast.success('Music uploaded successfully!');
        if (onMusicUploaded) {
          onMusicUploaded(response.data.audioUrl);
        }
      }
    } catch (error) {
      console.error('Upload error:', error);
      toast.error(error.response?.data?.error || 'Failed to upload music');
      setPreview(currentMusic); // Reset to current music on error
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async () => {
    if (!preview || !preview.startsWith('/uploads/')) {
      setPreview(null);
      if (onMusicUploaded) {
        onMusicUploaded(null);
      }
      return;
    }

    try {
      await api.delete(`/upload/audio/${encodeURIComponent(preview)}`);
      setPreview(null);
      toast.success('Music deleted successfully!');
      if (onMusicUploaded) {
        onMusicUploaded(null);
      }
    } catch (error) {
      console.error('Delete error:', error);
      toast.error(error.response?.data?.error || 'Failed to delete music');
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
    if (file && file.type.startsWith('audio/')) {
      const maxSize = maxSizeMB * 1024 * 1024;
      if (file.size > maxSize) {
        toast.error(`Audio file size must be less than ${maxSizeMB}MB`);
        return;
      }
      
      const url = URL.createObjectURL(file);
      setPreview(url);
      if (audioRef.current) {
        audioRef.current.src = url;
      }
      
      uploadMusic(file);
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
            <div className="flex items-center gap-4 p-4 bg-gray-100 dark:bg-gray-700 rounded-lg">
              <div className="flex-shrink-0">
                <svg className="w-12 h-12 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                  {preview.startsWith('blob:') ? 'New Music File' : 'Background Music'}
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  {preview.startsWith('blob:') ? 'Ready to upload' : 'Uploaded'}
                </p>
              </div>
              <audio
                ref={audioRef}
                src={preview.startsWith('blob:') ? preview : getImageUrl(preview)}
                controls
                className="flex-1 max-w-xs"
                onLoadedMetadata={() => {
                  if (audioRef.current) {
                    const duration = audioRef.current.duration;
                    const minutes = Math.floor(duration / 60);
                    const seconds = Math.floor(duration % 60);
                    console.log(`Music duration: ${minutes}:${seconds.toString().padStart(2, '0')}`);
                  }
                }}
              />
            </div>
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
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                </svg>
                <div className="mt-4">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-all"
                  >
                    Select Audio File
                  </button>
                  <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                    or drag and drop
                  </p>
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-500">
                    MP3, WAV, OGG up to {maxSizeMB}MB
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
