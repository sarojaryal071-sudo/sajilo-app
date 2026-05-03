/*
 * Worker Service — handles all worker-related API calls
 * FUTURE: Connect to real backend endpoints
 * TEMP: Returns mock data
 */
import mockWorkerDetail from '../../mock/workers/mockWorkerDetail.js'

const API_URL = window.location.hostname === 'localhost'
  ? 'http://localhost:5000/api'
  : 'https://sajilo-backend-c7mi.onrender.com/api'

export async function getWorkerById(id) {
  // TEMP: Return mock until API is ready
  if (import.meta.env.DEV) return mockWorkerDetail

  const token = localStorage.getItem('sajilo_token')
  const res = await fetch(`${API_URL}/workers/${id}`, {
    headers: { Authorization: `Bearer ${token}` }
  })
  return res.json()
}

export async function getWorkerReviews(id) {
  const token = localStorage.getItem('sajilo_token')
  const res = await fetch(`${API_URL}/workers/${id}/reviews`, {
    headers: { Authorization: `Bearer ${token}` }
  })
  return res.json()
}