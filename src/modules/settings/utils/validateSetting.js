import { settingsSchema } from '../schema/settings.schema';

/**
 * Validate a single field value against the schema.
 * Returns an error string if invalid, otherwise null.
 */
export function validateField(sectionKey, fieldKey, value) {
  const section = settingsSchema[sectionKey];
  if (!section) return null; // unknown section – ignore

  const rule = section[fieldKey];
  if (!rule) return null; // unknown field – ignore

  if (rule.required && (value === undefined || value === null || value === '')) {
    return 'This field is required';
  }

  if (rule.type === 'email' && typeof value === 'string' && value.length > 0) {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(value)) return 'Invalid email format';
  }

  if (rule.minLength && typeof value === 'string' && value.length < rule.minLength) {
    return `Must be at least ${rule.minLength} characters`;
  }

  return null;
}