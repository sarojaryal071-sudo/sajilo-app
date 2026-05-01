const fieldRegistry = {
  // Worker Application fields
  workerApplication: [
    { name: 'fullName', type: 'text', labelKey: 'auth.signup.name.label', placeholderKey: 'auth.signup.name.placeholder', required: true },
    { name: 'email', type: 'email', labelKey: 'auth.signup.email.label', placeholderKey: 'auth.signup.email.placeholder', required: true },
    { name: 'phone', type: 'text', labelKey: 'field.phone', placeholderKey: 'field.phonePlaceholder', required: false },
    { name: 'skills', type: 'text', labelKey: 'field.skills', placeholderKey: 'field.skillsPlaceholder', required: true },
    { name: 'experience', type: 'text', labelKey: 'field.experience', placeholderKey: 'field.experiencePlaceholder', required: false },
    { name: 'bio', type: 'textarea', labelKey: 'field.bio', placeholderKey: 'field.bioPlaceholder', required: false },
  ],

  // Worker Application — Multi-card form (admin-configurable)
  workerApplyCards: [
    {
      id: 'identity',
      titleKey: 'worker.apply.cardIdentity',
      fields: [
        { name: 'fullName', type: 'text', labelKey: 'auth.signup.name.label', placeholderKey: 'auth.signup.name.placeholder', required: true },
        { name: 'phone', type: 'text', labelKey: 'field.phone', placeholderKey: 'field.phonePlaceholder', required: true },
        { name: 'email', type: 'email', labelKey: 'auth.signup.email.label', placeholderKey: 'auth.signup.email.placeholder', required: true },
        { name: 'dob', type: 'date', labelKey: 'worker.apply.dob', placeholderKey: '', required: true },
      ],
    },
    {
      id: 'service',
      titleKey: 'worker.apply.cardService',
      fields: [
        { name: 'primaryRole', type: 'select', labelKey: 'worker.apply.primaryRole', required: true, options: [
          { value: 'electrician', labelKey: 'worker.role.electrician' },
          { value: 'plumber', labelKey: 'worker.role.plumber' },
          { value: 'cleaner', labelKey: 'worker.role.cleaner' },
          { value: 'painter', labelKey: 'worker.role.painter' },
          { value: 'carpenter', labelKey: 'worker.role.carpenter' },
        ]},
        { name: 'secondaryRoles', type: 'select', labelKey: 'worker.apply.secondaryRoles', required: false, options: [
          { value: 'electrician', labelKey: 'worker.role.electrician' },
          { value: 'plumber', labelKey: 'worker.role.plumber' },
          { value: 'cleaner', labelKey: 'worker.role.cleaner' },
        ]},
      ],
    },
    {
      id: 'location',
      titleKey: 'worker.apply.cardLocation',
      fields: [
        { name: 'address', type: 'textarea', labelKey: 'worker.apply.address', placeholderKey: 'worker.apply.addressPlaceholder', required: true },
        { name: 'serviceArea', type: 'text', labelKey: 'worker.apply.serviceArea', placeholderKey: 'worker.apply.serviceAreaPlaceholder', required: false },
      ],
    },
    {
      id: 'verification',
      titleKey: 'worker.apply.cardVerification',
      fields: [
        { name: 'govId', type: 'text', labelKey: 'worker.apply.govId', placeholderKey: 'worker.apply.govIdPlaceholder', required: true },
        { name: 'selfie', type: 'imageUpload', labelKey: 'worker.apply.selfie', placeholderKey: '', required: true },
      ],
    },
    {
      id: 'preferences',
      titleKey: 'worker.apply.cardPreferences',
      fields: [
        { name: 'availability', type: 'select', labelKey: 'worker.apply.availability', required: false, options: [
          { value: 'weekdays', labelKey: 'worker.avail.weekdays' },
          { value: 'weekends', labelKey: 'worker.avail.weekends' },
          { value: 'fulltime', labelKey: 'worker.avail.fulltime' },
        ]},
        { name: 'notifications', type: 'select', labelKey: 'worker.apply.notifications', required: false, options: [
          { value: 'email', labelKey: 'worker.notify.email' },
          { value: 'sms', labelKey: 'worker.notify.sms' },
          { value: 'app', labelKey: 'worker.notify.app' },
        ]},
      ],
    },
    {
      id: 'terms',
      titleKey: 'worker.apply.cardTerms',
      fields: [
        { name: 'acceptTerms', type: 'checkbox', labelKey: 'worker.apply.acceptTerms', required: true },
        { name: 'backgroundCheck', type: 'checkbox', labelKey: 'worker.apply.backgroundCheck', required: true },
        { name: 'safetyAgreement', type: 'checkbox', labelKey: 'worker.apply.safetyAgreement', required: true },
      ],
    },
  ],

  // Signup form
  signup: [
    { name: 'name', type: 'text', labelKey: 'auth.signup.name.label', placeholderKey: 'auth.signup.name.placeholder', required: true },
    { name: 'email', type: 'email', labelKey: 'auth.signup.email.label', placeholderKey: 'auth.signup.email.placeholder', required: true },
    { name: 'password', type: 'password', labelKey: 'auth.signup.password.label', placeholderKey: 'auth.signup.password.placeholder', required: true },
    { name: 'role', type: 'select', labelKey: 'auth.signup.role.label', options: [
      { value: 'customer', labelKey: 'auth.signup.role.customer' },
      { value: 'worker', labelKey: 'auth.signup.role.worker' },
    ], required: true },
  ],
}

export default fieldRegistry