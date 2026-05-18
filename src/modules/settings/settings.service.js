// sajilo-app/src/modules/settings/settings.service.js
import { API_URL } from '../../services/api.js';

function getToken() {
  return localStorage.getItem('sajilo_token');
}

async function request(endpoint, options = {}) {
  const token = getToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };

  const res = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || 'Request failed');
  }

  return data;
}

export async function getSettings() {
  const result = await request('/settings');
  return result.data;
}

export async function updateSettings(updates) {
  const result = await request('/settings', {
    method: 'PATCH',
    body: JSON.stringify(updates),
  });
  return result.data;
}