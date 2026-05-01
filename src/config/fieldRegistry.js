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

  // Signup form (will connect later)
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