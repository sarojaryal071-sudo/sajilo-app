// sajilo-app/src/modules/media-ui/mediaUrl.js
// Single source for all media URLs – change only this file when deploying.

const BASE_URL = import.meta.env.PROD
  ? 'https://sajilo-backend-c7mi.onrender.com'   // production backend URL
  : 'http://localhost:5000';                      // development

export function getMediaUrl(path) {
  if (!path) return null;
  // path is expected to start with '/' (e.g. '/uploads/user/...')
  return `${BASE_URL}${path}`;
}