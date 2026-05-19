// sajilo-app/src/modules/media-ui/mediaUrl.js
// Single source for all media URLs – change only this file when deploying.

const BASE_URL = import.meta.env.PROD
  ? 'https://sajilo-backend-c7mi.onrender.com'
  : 'http://localhost:5000';

export function getMediaUrl(path) {
  if (!path) return null;
  // If the path is already an absolute URL (e.g. Cloudinary), return it unchanged
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }
  // Otherwise, assume a local path like '/uploads/user/...'
  return `${BASE_URL}${path}`;
}