// bookingCommandDispatcher.js — centralized booking action execution
// Dispatcher owns the API binding internally — never receives api as argument

import { api } from '../services/api.js'

export async function dispatchBookingCommand({ action, bookingId }) {
  switch (action) {
    case 'accept':
      return api.acceptBooking(bookingId)
    case 'reject':
      return api.rejectBooking(bookingId)
    case 'onway':
      return api.updateBookingStatus(bookingId, 'onway')
    case 'working':
      return api.updateBookingStatus(bookingId, 'working')
    case 'completed':
      return api.updateBookingStatus(bookingId, 'completed')
    default:
      throw new Error(`Unknown booking action: ${action}`)
  }
}