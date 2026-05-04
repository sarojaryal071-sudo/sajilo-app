const componentDictionary = {
  // ── INPUTS ──────────────────────────
  textInput: {
    type: 'input',
    inputType: 'text',
    accepts: 'any text',
    validation: { minLength: 1, maxLength: 100 },
    renderAs: 'input',
  },
  emailInput: {
    type: 'input',
    inputType: 'email',
    accepts: 'email format',
    validation: { pattern: 'email' },
    renderAs: 'input',
  },
  phoneInput: {
    type: 'input',
    inputType: 'tel',
    accepts: 'phone number',
    validation: { pattern: 'nepalPhone' },
    renderAs: 'input',
  },
  passwordInput: {
    type: 'input',
    inputType: 'password',
    accepts: 'any text',
    validation: { minLength: 6 },
    renderAs: 'input',
  },
  numberInput: {
    type: 'input',
    inputType: 'number',
    accepts: 'numbers only',
    validation: { min: 0 },
    renderAs: 'input',
  },
  textArea: {
    type: 'input',
    inputType: 'textarea',
    accepts: 'multiline text',
    validation: { maxLength: 500 },
    renderAs: 'textarea',
  },

  // ── SELECTORS ───────────────────────
  dropdown: {
    type: 'select',
    accepts: 'array of { value, labelKey }',
    multiple: false,
    renderAs: 'select',
  },
  multiSelect: {
    type: 'select',
    accepts: 'array of { value, labelKey }',
    multiple: true,
    renderAs: 'multiselect',
  },

  // ── MEDIA ───────────────────────────
  photoUpload: {
    type: 'media',
    accepts: 'image/*',
    maxSize: '5MB',
    formats: ['jpg', 'jpeg', 'png', 'webp'],
    multiple: false,
    renderAs: 'imageUpload',
  },
  documentUpload: {
    type: 'media',
    accepts: '.pdf,.doc,.docx',
    maxSize: '10MB',
    formats: ['pdf', 'doc', 'docx'],
    multiple: true,
    renderAs: 'fileUpload',
  },

  // ── BUTTONS ─────────────────────────
  primaryButton: {
    type: 'button',
    variant: 'primary',
    behavior: 'submit',
    styleRef: 'primaryButton',
    renderAs: 'button',
  },
  secondaryButton: {
    type: 'button',
    variant: 'secondary',
    behavior: 'action',
    styleRef: 'secondaryButton',
    renderAs: 'button',
  },
  dangerButton: {
    type: 'button',
    variant: 'danger',
    behavior: 'confirm',
    styleRef: 'dangerButton',
    renderAs: 'button',
  },

  // ── DISPLAY ─────────────────────────
  textDisplay: {
    type: 'display',
    accepts: 'text or contentKey',
    renderAs: 'text',
  },
  imageDisplay: {
    type: 'display',
    accepts: 'image URL',
    renderAs: 'image',
  },
  badge: {
    type: 'display',
    variant: 'pill',
    accepts: '{ label, color }',
    renderAs: 'badge',
  },
  avatar: {
    type: 'display',
    accepts: 'image URL or initials',
    renderAs: 'avatar',
  },
  divider: {
    type: 'display',
    accepts: 'none',
    renderAs: 'divider',
  },
  requiredStar: {
  type: 'display',
  accepts: 'none',
  renderAs: 'star',
  style: { color: 'var(--accent-red)', marginLeft: '2px' },
},

  // ── CONTAINERS ──────────────────────
  card: {
    type: 'container',
    accepts: 'array of child components',
    styleRef: 'card',
    renderAs: 'card',
  },
  grid: {
    type: 'container',
    accepts: 'array of child components',
    styleRef: 'grid',
    renderAs: 'grid',
  },
  flexRow: {
    type: 'container',
    accepts: 'array of child components',
    styleRef: 'flexRow',
    renderAs: 'flexRow',
  },
  flexColumn: {
    type: 'container',
    accepts: 'array of child components',
    styleRef: 'flexColumn',
    renderAs: 'flexColumn',
  },

    // Chart types for analytics
  barChart: {
    type: 'chart',
    chartType: 'bar',
    accepts: 'array of { label, value }',
    renderAs: 'barChart',
    styleRef: 'analytics.chart',
  },
  lineChart: {
    type: 'chart',
    chartType: 'line',
    accepts: 'array of { label, value }',
    renderAs: 'lineChart',
    styleRef: 'analytics.chart',
  },
  pieChart: {
    type: 'chart',
    chartType: 'pie',
    accepts: 'array of { label, value, color }',
    renderAs: 'pieChart',
    styleRef: 'analytics.chart',
  },

    // Calendar date picker — dropdown only, no typing
  datepicker: {
    type: 'input',
    inputType: 'datepicker',
    accepts: 'date selection only',
    validation: { minAge: 18 },
    renderAs: 'datepicker',
    styleRef: 'calendar',
  },
}

export function getComponent(type) {
  return componentDictionary[type] || null
}

export function getInputComponents() {
  return Object.entries(componentDictionary)
    .filter(([_, def]) => def.type === 'input' || def.type === 'select' || def.type === 'media')
    .map(([key, def]) => ({ key, ...def }))
}

export function getDisplayComponents() {
  return Object.entries(componentDictionary)
    .filter(([_, def]) => def.type === 'display' || def.type === 'container' || def.type === 'button')
    .map(([key, def]) => ({ key, ...def }))
}



export default componentDictionary