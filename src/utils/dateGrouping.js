/**
 * Returns a human‑readable label for a date:
 *   - "Today" for the current day
 *   - "Yesterday" for the previous day
 *   - "Mon, 5 May" for older dates
 *
 * @param {string|Date} dateInput – ISO string or Date object
 * @returns {string}
 */
export function formatDateSeparator(dateInput) {
  const date = new Date(dateInput)
  const now = new Date()

  // Midnight of today in local timezone
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const yesterdayStart = new Date(todayStart)
  yesterdayStart.setDate(yesterdayStart.getDate() - 1)

  const dayStart = new Date(date.getFullYear(), date.getMonth(), date.getDate())

  if (dayStart.getTime() === todayStart.getTime()) {
    return 'Today'
  }
  if (dayStart.getTime() === yesterdayStart.getTime()) {
    return 'Yesterday'
  }

  // Older dates: "Mon, 5 May"
  return date.toLocaleDateString('en-US', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  })
}

/**
 * Groups bookings by the date they were completed (updated_at),
 * and returns a flat array that interleaves date‑separator objects
 * and the original booking objects.
 *
 * @param {Array} bookings – completed job objects (each must have `updated_at`)
 * @returns {Array}
 */
export function groupBookingsByCompletedDate(bookings) {
  if (!bookings || bookings.length === 0) return []

  const groups = new Map()

  // Group by date portion of updated_at
  bookings.forEach((b) => {
    const date = new Date(b.updated_at)
    const key = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`
    if (!groups.has(key)) {
      groups.set(key, { date: date.toISOString(), bookings: [] })
    }
    groups.get(key).bookings.push(b)
  })

  // Sort groups by date descending (newest first)
  const sortedGroups = Array.from(groups.values()).sort(
    (a, b) => new Date(b.date) - new Date(a.date)
  )

  // Flatten: separator → booking list
  const result = []
  sortedGroups.forEach((group) => {
    result.push({ type: 'dateSeparator', date: group.date })
    result.push(...group.bookings)
  })

  return result
}