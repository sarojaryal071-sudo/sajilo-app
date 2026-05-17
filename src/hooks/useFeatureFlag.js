import { useUIConfig } from '../contexts/UIConfigContext.jsx';
import { defaultFeatures } from '../config/defaultFeatureFlags.js';

export function useFeatureFlag(flagKey) {
  const { features } = useUIConfig();
  const flags = { ...defaultFeatures, ...(features || {}) };
  return !!flags[flagKey];
}