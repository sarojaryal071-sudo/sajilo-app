// Flattens a nested content object into dot-notation keys.
// e.g. { home: { hero: { title: 'Hi' } } } → { 'home.hero.title': 'Hi' }

export function flattenContentObject(obj, prefix = '') {
  const result = {};
  for (const [key, value] of Object.entries(obj || {})) {
    const path = prefix ? `${prefix}.${key}` : key;
    if (value && typeof value === 'object' && !Array.isArray(value)) {
      Object.assign(result, flattenContentObject(value, path));
    } else {
      result[path] = value || '';
    }
  }
  return result;
}