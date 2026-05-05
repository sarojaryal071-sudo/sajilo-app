// src/utils/bookingActionResolver.js
// Centralized booking action resolution — NOT inside ElementRenderer
// Determines allowed actions, labels, variants, disabled states per booking status

import contentRegistry from '../config/contentRegistry.js'

const STAGE_ACTIONS = {
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

export function resolveBookingActions(booking) {
  if (!booking || !booking.status) return []
  
  const actions = STAGE_ACTIONS[booking.status] || []
  
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
