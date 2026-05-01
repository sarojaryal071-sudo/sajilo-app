export const services = [
  { id: 'electrician', name: 'Electrician', icon: '⚡', bg: '#EBF3FF' },
  { id: 'plumber', name: 'Plumber', icon: '🔧', bg: '#E3F8EF' },
  { id: 'cleaning', name: 'Cleaning', icon: '🧹', bg: '#FFF3E6' },
  { id: 'carpenter', name: 'Carpenter', icon: '🪚', bg: '#F3EEFF' },
  { id: 'moving', name: 'Moving', icon: '🚚', bg: '#FEF0F0' },
  { id: 'tutor', name: 'Tutor', icon: '📚', bg: '#FFF8E1' },
  { id: 'repair', name: 'Repair', icon: '🔩', bg: '#E6F4F1' },
  { id: 'more', name: 'More', icon: '＋', bg: '#F0F2F6' },
]

export const workers = [
  {
    id: 1,
    name: 'Sagar Kandel',
    role: 'Electrician',
    distance: '0.8 km',
    location: 'Kathmandu',
    rating: 4.9,
    eta: '12 min',
    icon: '⚡',
    bg: '#EBF3FF',
    photo: null,
    verified: true,
    approved: true,
    status: 'active'
  },
  {
    id: 2,
    name: 'Ankit Kharel',
    role: 'Plumber',
    distance: '1.2 km',
    location: 'Lalitpur',
    rating: 4.8,
    eta: '18 min',
    icon: '🔧',
    bg: '#E3F8EF',
    photo: null,
    verified: true,
    approved: true,
    status: 'active'
  },
  {
    id: 3,
    name: 'Bimal Sapkota',
    role: 'Cleaner',
    distance: '0.5 km',
    location: 'Bhaktapur',
    rating: 5.0,
    eta: '8 min',
    icon: '🧹',
    bg: '#FFF3E6',
    photo: null,
    verified: true,
    approved: true,
    status: 'pending'
  },
]

export const plans = [
  { id: 'basic', name: 'Basic', price: 'Rs 499', features: ['5 priority bookings/month', '10% discount', 'Chat support'], popular: false },
  { id: 'pro', name: 'Pro', price: 'Rs 999', features: ['Unlimited priority bookings', '15% discount', 'No surge pricing', 'Dedicated support'], popular: true },
  { id: 'business', name: 'Business', price: 'Rs 2999', features: ['Multi-user access', '20% discount + invoicing', 'Account manager', 'API access'], popular: false },
]

export const locations = [
  'Kathmandu',
  'Lalitpur',
  'Bhaktapur',
  'Pokhara',
  'Chitwan',
  'Biratnagar',
  'Birgunj',
  'Butwal',
  'Dhangadhi',
  'Nepalgunj',
]