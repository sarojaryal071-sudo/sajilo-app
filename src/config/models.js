// API-ready data models — mock data structured like real API responses

export const userModel = {
  id: '',          // string
  email: '',       // string
  role: '',        // 'customer' | 'worker' | 'admin'
  name: '',        // string
  phone: '',       // string
  status: '',      // 'active' | 'inactive' | 'suspended'
  createdAt: '',   // ISO date
}

export const workerModel = {
  id: '',          // string
  userId: '',      // string (link to user)
  name: '',        // string
  skills: [],      // string[]
  rating: 0,       // number
  totalJobs: 0,    // number
  hourlyRate: 0,   // number (in NPR)
  location: '',    // string
  availability: '',// 'now' | 'scheduled' | 'unavailable'
  photo: null,     // string (URL)
  verified: false, // boolean
  approved: false, // boolean
  status: '',      // 'active' | 'inactive' | 'pending'
}

export const bookingModel = {
  id: '',          // string
  userId: '',      // string (customer)
  workerId: '',    // string
  service: '',     // string
  jobSize: '',     // 'small' | 'medium' | 'large'
  status: '',      // 'pending' | 'accepted' | 'onway' | 'working' | 'done' | 'cancelled'
  schedule: {
    date: '',      // ISO date
    time: '',      // HH:MM
    isAM: true,    // boolean
  },
  price: 0,        // number (NPR)
  rating: 0,       // number (0-5)
  createdAt: '',   // ISO date
}

export const adminSectionModel = {
  id: '',
  labelKey: '',
  icon: '',
  route: '',
}