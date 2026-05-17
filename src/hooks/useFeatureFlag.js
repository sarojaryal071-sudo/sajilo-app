import useControl from '../controlPlane/useControl.js';
import { defaultFeatures } from '../config/defaultFeatureFlags.js';

export function useFeatureFlag(flagKey) {
  const resolved = useControl(`features.${flagKey}.enabled`);
  // If the control plane returns a boolean, use it; otherwise fall back to local defaults.
  if (typeof resolved === 'boolean') return resolved;
  return defaultFeatures[flagKey] !== false;
}