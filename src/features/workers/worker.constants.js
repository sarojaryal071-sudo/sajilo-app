/*
 * Worker Constants — soft-coded configuration
 * Admin-configurable: add/remove categories without code changes
 */
export const WORKER_CATEGORIES = [
  { code: 'PL', role: 'plumber', label: 'Plumber', enabled: true },
  { code: 'EL', role: 'electrician', label: 'Electrician', enabled: true },
  { code: 'CL', role: 'cleaner', label: 'Cleaner', enabled: true },
  { code: 'PT', role: 'painter', label: 'Painter', enabled: true },
  { code: 'CP', role: 'carpenter', label: 'Carpenter', enabled: true },
]

export const PRICING_TYPES = [
  { value: 'hourly', label: 'Per Hour' },
  { value: 'fixed', label: 'Fixed Price' },
]