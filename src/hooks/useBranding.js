import { useUIConfig } from '../contexts/UIConfigContext.jsx';
import defaultBranding from '../config/defaultBranding.js';

export default function useBranding() {
  const { branding } = useUIConfig();
  // Deep merge: backend branding overrides defaults
  return deepMerge(defaultBranding, branding || {});
}

function deepMerge(target, source) {
  const output = { ...target };
  for (const key of Object.keys(source)) {
    if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
      output[key] = deepMerge(target[key] || {}, source[key]);
    } else {
      output[key] = source[key];
    }
  }
  return output;
}