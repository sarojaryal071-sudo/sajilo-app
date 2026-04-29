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
}

export { setToken, removeToken, getToken }