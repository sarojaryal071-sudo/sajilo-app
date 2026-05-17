import controlDefaults from './controlRegistry';

function getNestedValue(obj, path) {
  let current = obj;
  for (const segment of path) {
    if (current == null || typeof current !== 'object') return undefined;
    current = current[segment];
  }
  return current;
}

/**
 * Resolve a control key (dot‑notation) against the published UI config.
 * Falls back to controlDefaults if the value is not found.
 */
export function resolveControl(key, uiConfig = {}) {
  const path = key.split('.');
  // Backend config (highest priority)
  const backendValue = getNestedValue(uiConfig, path);
  if (backendValue !== undefined) return backendValue;
  // Local defaults
  const defaultValue = getNestedValue(controlDefaults, path);
  return defaultValue !== undefined ? defaultValue : true; // safe fallback
}