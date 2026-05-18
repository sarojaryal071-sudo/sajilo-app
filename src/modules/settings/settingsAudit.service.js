import { API_URL } from '../../services/api.js';

function getToken() {
  return localStorage.getItem('sajilo_token');
}

export async function fetchAuditLogs() {
  const token = getToken();
  const res = await fetch(`${API_URL}/settings/audit`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await res.json();
  if (!data.success) throw new Error(data.error || 'Failed to fetch audit');
  return data.data;
}