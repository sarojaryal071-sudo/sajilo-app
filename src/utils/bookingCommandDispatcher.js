import { api } from '../services/api.js'

export async function dispatchBookingCommand({ action, bookingId, reason }) {
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
    case 'cancel':                        // ← Customer cancel
      return api.cancelBooking(bookingId, reason)
    default:
      throw new Error(`Unknown booking action: ${action}`)
  }
}