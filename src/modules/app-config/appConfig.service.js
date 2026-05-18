import { API_URL } from '../../services/api.js';

export async function fetchAppConfig() {
  const res = await fetch(`${API_URL}/app-config`);
  const data = await res.json();
  return data.data;
}