// sajilo-app/src/modules/media-ui/media.service.js
import { API_URL } from '../../services/api.js';

function getToken() {
  return localStorage.getItem('sajilo_token');
}

async function request(endpoint, options = {}) {
  const token = getToken();
  const headers = {
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };
  // Don't set Content-Type for FormData; browser will set it with boundary
  const res = await fetch(`${API_URL}${endpoint}`, { ...options, headers });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Request failed');
  return data;
}

export async function uploadProfileImage(file) {
  const formData = new FormData();
  formData.append('file', file);
  return request('/users/profile-image', { method: 'POST', body: formData });
}

export async function replaceProfileImage(file) {
  const formData = new FormData();
  formData.append('file', file);
  return request('/files/profile-image', { method: 'PUT', body: formData });
}

export async function deleteProfileImage() {
  return request('/files/profile_image/any', { method: 'DELETE' });
}

export async function uploadDocument(file, type) {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('type', type);
  return request('/documents/upload', { method: 'POST', body: formData });
}

export async function getMyDocuments() {
  return request('/documents/me');
}

export async function deleteDocument(id) {
  return request(`/files/document/${id}`, { method: 'DELETE' });
}