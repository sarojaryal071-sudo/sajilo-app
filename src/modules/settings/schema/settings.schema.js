// Central data contract – not the UI registry.
export const settingsSchema = {
  account: {
    fullName: { type: 'string', required: true, minLength: 2 },
    email:    { type: 'email', required: true },
    phone:    { type: 'string', required: false },
  },
  payment: {
    methods: { type: 'array', required: false },
  },
  bookingPreferences: {
    autoHideCompleted:          { type: 'boolean', required: false },
    bookingHistoryVisibilityDays: { type: 'number', required: false },
  },
  notification: {
    emailNotifications: { type: 'boolean', required: false },
    pushNotifications:  { type: 'boolean', required: false },
    smsNotifications:   { type: 'boolean', required: false },
  },
  security: {
    deactivateAccount: { type: 'boolean', required: false },
    deleteAccount:     { type: 'boolean', required: false },
  },
  legal: {
    privacyPolicy: { type: 'string', required: false },
    terms:        { type: 'string', required: false },
  },
};