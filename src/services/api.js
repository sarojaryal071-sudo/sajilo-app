export const API_URL = import.meta.env.PROD 
  ? 'https://sajilo-backend-c7mi.onrender.com/api'
  : 'http://localhost:5000/api'

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
cancelBooking: (id, reason) => request(`/bookings/${id}/cancel`, {
  method: 'PUT',
  body: JSON.stringify({ reason: reason || null }),
}),

  updateBookingStatus: (id, status) => request(`/bookings/${id}/status`, { method: 'PUT', body: JSON.stringify({ status }) }),
  getAdminWorkers: (params = {}) => {
    const query = new URLSearchParams(params).toString()
    return request(`/admin/workers${query ? '?' + query : ''}`)
  },
  getUnacknowledgedCancellations: () => request('/workers/cancellations/unacknowledged'),
acknowledgeCancellation: (id) => request(`/workers/cancellations/${id}/acknowledge`, { method: 'PUT' }),
  getAdminCustomers: () => request('/admin/customers'),
  approveWorker: (id) => request(`/admin/workers/${id}/approve`, { method: 'PUT' }),
  rejectWorker: (id) => request(`/admin/workers/${id}/reject`, { method: 'PUT' }),
  getAdminStats: () => request('/admin/stats'),
  getWorkerProfile: () => request('/users/worker/me'),
  getMyWorkerApplication: () => request('/users/worker/application'),
  setWelcomed: () => request('/users/worker/welcomed', { method: 'PUT' }),
  updateWorkerProfile: (body) => request('/users/worker/me', { method: 'PUT', body: JSON.stringify(body) }),
  getWorkerEarnings: () => request('/users/worker/earnings'),
  getWorkerSchedule: () => request('/users/worker/schedule'),
  saveWorkerSchedule: (schedule) => request('/users/worker/schedule', { method: 'PUT', body: JSON.stringify({ schedule }) }),

  // Worker services
      getMyServices: () => request('/workers/me/services'),
    updateWorkerService: (id, body) => request(`/workers/me/services/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
    createWorkerCustomService: (body) => request('/workers/me/services/custom', { method: 'POST', body: JSON.stringify(body) }),
    activateWorkerService: (serviceId, professionId) => request('/workers/me/services/activate', {
      method: 'POST',
      body: JSON.stringify({ service_id: serviceId, profession_id: professionId, is_active: true }),
    }),
    deleteWorkerService: (id) => request(`/workers/me/services/${id}`, { method: 'DELETE' }),
        getJobSizeRanges: () => request('/workers/me/job-size-ranges'),
    saveJobSizeRanges: (body) => request('/workers/me/job-size-ranges', { method: 'PUT', body: JSON.stringify(body) }),
    getWorkerPublicServices: (workerId) => request(`/workers/${workerId}/services`),
  sendNotification: (body) => request('/notifications', { method: 'POST', body: JSON.stringify(body) }),
  submitWorkerApplication: (body) => request('/auth/worker/apply', { method: 'POST', body: JSON.stringify(body) }),
  searchWorkers: (params = {}) => {
    const query = new URLSearchParams(params).toString()
    return request(`/workers/search${query ? '?' + query : ''}`)
  },
      getWorkerById: (id) => request(`/workers/${id}`),
    getWorkerReviews: (workerId) => request(`/reviews/worker/${workerId}`),
    createReview: (bookingId, rating, reviewText) => request('/reviews', {
      method: 'POST',
      body: JSON.stringify({ booking_id: bookingId, rating, review_text: reviewText || null }),
    }),
    getPaymentByBooking: (bookingId) => request(`/payments/booking/${bookingId}`),
    confirmInvoice: (bookingId, body = {}) => request(`/payments/booking/${bookingId}/confirm-invoice`, {
      method: 'PUT',
      body: JSON.stringify(body),
    }),
       confirmCashPayment: (bookingId) => request(`/payments/booking/${bookingId}/confirm`, { method: 'PUT' }),
    markCashPaid: (bookingId) => request(`/payments/booking/${bookingId}/mark-cash-paid`, { method: 'PUT' }),
    getWorkerPayments: (workerId) => request(`/payments/worker/${workerId}`),
    getCustomerPayments: (customerId) => request(`/payments/customer/${customerId}`),

    // Notifications
    getNotifications: () => request('/notifications'),
    getUnreadNotifications: () => request('/notifications/unread'),
    getUnreadCount: () => request('/notifications/count'),
    markNotificationRead: (id) => request(`/notifications/${id}/read`, { method: 'PUT' }),
    markAllNotificationsRead: () => request('/notifications/read-all', { method: 'PUT' }),

    // Admin analytics
    getAdminAnalytics: () => request('/admin/analytics'),
    getFinancialOverview: () => request('/ledger/financial/overview'),
    getWorkerDueList: () => request('/ledger/financial/worker-dues'),

    // Live Operations (Phase 12H)
    getLiveOperations: () => request('/admin/live-operations'),

    // Activity Timeline (Phase 13B)
    getActivity: (params = {}) => {
      const query = new URLSearchParams(params).toString();
      return request(`/admin/activity${query ? '?' + query : ''}`);
    },

    // Global Admin Search (Phase 13B Module 5)
    searchAdmin: (q) => request(`/admin/search?q=${encodeURIComponent(q)}`),

    // Staff Management (Phase 13C Module 1)
    getStaff: () => request('/admin/staff'),
    createStaff: (body) => request('/admin/staff', { method: 'POST', body: JSON.stringify(body) }),
    toggleStaff: (id, active) => request(`/admin/staff/${id}/toggle`, { method: 'PUT', body: JSON.stringify({ active }) }),

    // Platform Policies (Phase 13C Module 2)
    getPolicies: () => request('/admin/policies'),
    updatePolicy: (key, value, description) => request(`/admin/policies/${key}`, {
      method: 'PUT',
      body: JSON.stringify({ value, description }),
    }),

    // Feature Flags (Phase 13C Module 3)
    getFeatureFlags: () => request('/admin/feature-flags'),
    toggleFeatureFlag: (flagName, enabled) => request(`/admin/feature-flags/${flagName}`, {
      method: 'PUT',
      body: JSON.stringify({ enabled }),
    }),

    // Simulation Tools (Phase 13C Module 5)
    simulateBooking: (body) => request('/admin/simulate/booking', { method: 'POST', body: JSON.stringify(body) }),
    simulateAccept: (body) => request('/admin/simulate/accept', { method: 'POST', body: JSON.stringify(body) }),
    simulateComplete: (body) => request('/admin/simulate/complete', { method: 'POST', body: JSON.stringify(body) }),
    simulateCancel: (body) => request('/admin/simulate/cancel', { method: 'POST', body: JSON.stringify(body) }),
    simulatePayment: (body) => request('/admin/simulate/payment', { method: 'POST', body: JSON.stringify(body) }),
    simulateNotification: (body) => request('/admin/simulate/notification', { method: 'POST', body: JSON.stringify(body) }),

    // Profession management
    getAdminProfessions: () => request('/admin/professions'),
    getAdminProfession: (id) => request(`/admin/professions/${id}`),
    createAdminProfession: (body) => request('/admin/professions', { method: 'POST', body: JSON.stringify(body) }),
    updateAdminProfession: (id, body) => request(`/admin/professions/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
    deleteAdminProfession: (id) => request(`/admin/professions/${id}`, { method: 'DELETE' }),

    // Profession Services
    getProfessionServices: (professionId) => request(`/admin/professions/${professionId}/services`),
    createProfessionService: (body) => request('/admin/professions/services', { method: 'POST', body: JSON.stringify(body) }),
    updateProfessionService: (id, body) => request(`/admin/professions/services/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
    deleteProfessionService: (id) => request(`/admin/professions/services/${id}`, { method: 'DELETE' }),

    // Performance (Phase 14F)
    getMyPerformance: () => request('/performance/worker/me'),
    getWorkerDashboardMetrics: () => request('/workers/view/me/dashboard'),

    // Verification (Phase 17)
    getMyVerification: () => request('/verification/me'),
    submitVerification: (documents) => request('/verification/submit', { method: 'POST', body: JSON.stringify({ documents }) }),
    checkVerification: (workerId) => request(`/verification/check/${workerId}`),

    // Admin Verification Queue (Phase 17)
    getVerificationQueue: () => request('/verification/admin/queue'),
    approveVerification: (workerId) => request(`/verification/admin/${workerId}/approve`, { method: 'PUT' }),
    rejectVerification: (workerId, reason, note) => request(`/verification/admin/${workerId}/reject`, { method: 'PUT', body: JSON.stringify({ reason, note }) }),

    // Verification Review (Phase 17.2)
    createDocumentReview: (body) => request('/verification/review/document', { method: 'POST', body: JSON.stringify(body) }),
    getWorkerReviews: (workerId) => request(`/verification/review/worker/${workerId}`),
    getMyReviewStatus: () => request('/verification/review/me'),
    getPendingReviewDocuments: () => request('/verification/review/pending'),
    getMyPerformanceMetrics: () => request('/performance/worker/me/metrics'),
    getWorkerPublicPerformance: (workerId) => request(`/performance/worker/${workerId}/public`),
    getFlaggedWorkers: () => request('/admin/analytics/performance/flagged'),
    getTopPerformers: (limit = 10) => request(`/admin/analytics/performance/top-performers?limit=${limit}`),
    getPaymentChannels: () => request('/payment-channels'),
    addPaymentChannel: (body) => request('/payment-channels', { method: 'POST', body: JSON.stringify(body) }),
    updatePaymentChannel: (id, body) => request(`/payment-channels/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
    deletePaymentChannel: (id) => request(`/payment-channels/${id}`, { method: 'DELETE' }),
    }
  

export { setToken, removeToken, getToken }