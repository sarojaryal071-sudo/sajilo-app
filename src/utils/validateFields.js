// src/utils/validateFields.js
// Universal form validation — reads required flags from field definitions
// Each form passes its own fields + data. No cross-panel access.

export function allRequiredFilled(fields, formData) {
  if (!Array.isArray(fields) || !formData) return false
  const required = fields.filter(f => f.required)
  if (required.length === 0) return true
  return required.every(f => {
    const val = formData[f.name]
    if (f.type === 'checkbox') return val === true
    return !!val
  })
}

export function getEmptyRequiredFields(fields, formData) {
  if (!Array.isArray(fields) || !formData) return []
  return fields
    .filter(f => f.required)
    .filter(f => {
      const val = formData[f.name]
      if (f.type === 'checkbox') return val !== true
      return !val
    })
    .map(f => f.name)
}
