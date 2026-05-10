// src/utils/bookingActionResolver.js
// Centralized booking action resolution — NOT inside ElementRenderer
// Determines allowed actions, labels, variants, disabled states per booking status
// Now supports both worker and customer actions via the optional `role` parameter

import contentRegistry from '../config/contentRegistry.js'

// ── Worker actions ──
const WORKER_ACTIONS = {
  pending: [
    { id: 'accept', labelKey: 'worker.accept', action: 'accept', variant: 'success' },
    { id: 'reject', labelKey: 'worker.reject', action: 'reject', variant: 'danger' },
  ],
  accepted: [
    { id: 'onway', labelKey: 'worker.startTravel', action: 'onway', variant: 'primary' },
  ],
  onway: [
    { id: 'working', labelKey: 'worker.startWork', action: 'working', variant: 'primary' },
  ],
  working: [
    { id: 'completed', labelKey: 'worker.completeJob', action: 'completed', variant: 'success' },
  ],
}

// ── Customer actions ──
const CUSTOMER_ACTIONS = {
  pending: [
    { id: 'cancel', labelKey: 'booking.cancelBooking', action: 'cancel', variant: 'danger' },
  ],
  accepted: [
    { id: 'cancel', labelKey: 'booking.cancelBooking', action: 'cancel', variant: 'danger' },
  ],
  onway: [
    { id: 'cancel', labelKey: 'booking.cancelBooking', action: 'cancel', variant: 'danger' },
  ],
}

/**
 * @param {object} booking  – booking object with at least { status }
 * @param {string} [role]   – 'worker' | 'customer' (defaults to 'worker')
 * @returns {array}         – resolved actions
 */
export function resolveBookingActions(booking, role = 'worker') {
  if (!booking || !booking.status) return []

  const actionsByStatus = role === 'customer' ? CUSTOMER_ACTIONS : WORKER_ACTIONS
  const actions = actionsByStatus[booking.status] || []

  return actions.map(a => ({
    ...a,
    label: getContent(a.labelKey, a.action),
    disabled: false,
    visible: true,
  }))
}

function getContent(key, fallback = '') {
  const lang = localStorage.getItem('sajilo_lang') || 'en'
  const entry = contentRegistry[key]
  if (entry && entry[lang]) return entry[lang]
  if (entry && entry.en) return entry.en
  return fallback || key
}