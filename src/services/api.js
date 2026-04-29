const API_URL = 'http://localhost:5000/api'

function getToken() {
  return localStorage.getItem('sajilo_token')
}

function setToken(token) {
  localStorage.setItem('sajilo_token', token)
}

function removeToken() {
  localStorage.removeItem('sajilo_token')
}

async function request(endpoint, options = {}) {
  const token = getToken()
  const headers = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  })

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.error || 'Request failed')
  }

  return data
}

export const api = {
  register: (body) => request('/auth/register', { method: 'POST', body: JSON.stringify(body) }),
  login: (body) => request('/auth/login', { method: 'POST', body: JSON.stringify(body) }),
  getMe: () => request('/auth/me'),
  getUserProfile: () => request('/users/me'),
  updateUserProfile: (body) => request('/users/me', { method: 'PUT', body: JSON.stringify(body) }),
  createBooking: (body) => request('/bookings', { method: 'POST', body: JSON.stringify(body) }),
  getMyBookings: () => request('/bookings/my'),
  getBooking: (id) => request(`/bookings/${id}`),
  getWorkerBookings: () => request('/bookings/worker/list'),
  acceptBooking: (id) => request(`/bookings/${id}/accept`, { method: 'PUT' }),
  rejectBooking: (id) => request(`/bookings/${id}/reject`, { method: 'PUT' }),
  updateBookingStatus: (id, status) => request(`/bookings/${id}/status`, { method: 'PUT', body: JSON.stringify({ status }) }),
  getAdminWorkers: () => request('/admin/workers'),
  approveWorker: (id) => request(`/admin/workers/${id}/approve`, { method: 'PUT' }),
  rejectWorker: (id) => request(`/admin/workers/${id}/reject`, { method: 'PUT' }),
  getAdminStats: () => request('/admin/stats'),
  getWorkerProfile: () => request('/users/worker/me'),
  updateWorkerProfile: (body) => request('/users/worker/me', { method: 'PUT', body: JSON.stringify(body) }),
  getWorkerEarnings: () => request('/users/worker/earnings'),
  getWorkerSchedule: () => request('/users/worker/schedule'),
  saveWorkerSchedule: (schedule) => request('/users/worker/schedule', { method: 'PUT', body: JSON.stringify({ schedule }) }),
  sendNotification: (body) => request('/notifications', { method: 'POST', body: JSON.stringify(body) }),
  getNotifications: () => request('/notifications'),
}

export { setToken, removeToken, getToken }