// sajilo-app/src/modules/media-ui/useMediaUpload.js
import { useState } from 'react';
import * as mediaService from './media.service';

export function useMediaUpload() {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);

  const uploadProfileImage = async (file) => {
    setUploading(true);
    setError(null);
    try {
      const result = await mediaService.uploadProfileImage(file);
      return result.data?.profile_image_url;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setUploading(false);
    }
  };

  const replaceProfileImage = async (file) => {
    setUploading(true);
    setError(null);
    try {
      const result = await mediaService.replaceProfileImage(file);
      return result.data?.profile_image_url;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setUploading(false);
    }
  };

  const deleteProfileImage = async () => {
    setError(null);
    try {
      await mediaService.deleteProfileImage();
    } catch (err) {
      setError(err.message);
    }
  };

  const uploadDocument = async (file, type) => {
    setUploading(true);
    setError(null);
    try {
      const result = await mediaService.uploadDocument(file, type);
      return result.data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setUploading(false);
    }
  };

  const getMyDocuments = async () => {
    setError(null);
    try {
      const result = await mediaService.getMyDocuments();
      return result.data;
    } catch (err) {
      setError(err.message);
      return [];
    }
  };

  const deleteDocument = async (id) => {
    setError(null);
    try {
      await mediaService.deleteDocument(id);
    } catch (err) {
      setError(err.message);
    }
  };

  return {
    uploading,
    error,
    uploadProfileImage,
    replaceProfileImage,
    deleteProfileImage,
    uploadDocument,
    getMyDocuments,
    deleteDocument,
  };
}