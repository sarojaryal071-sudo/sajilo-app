/*
 * DATA CONTRACT — Worker Detail
 * Defines the expected data shape and API/socket sources for worker detail page
 */
export const WORKER_DETAIL_CONTRACT = {
  source: 'GET /api/workers/:id',
  temp: '../mock/workers/mockWorkerDetail.js',
  future_socket: ['worker_updated', 'worker_availability_changed'],
  owner: 'WorkerService',
}

export const WORKER_DETAIL_SHAPE = {
  id: 'number',
  client_id: 'string',
  name: 'string',
  photo_url: 'string | null',
  primary_role: 'string',
  skills: 'string[]',
  rating: 'number (0-5)',
  reviews_count: 'number',
  bio: 'string',
  location: 'string',
  hourly_rate: 'number',
  experience_years: 'number',
  completed_jobs: 'number',
  is_online: 'boolean',
  availability: 'object',
  verification_status: 'string',
}