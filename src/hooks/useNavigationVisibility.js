import { useUIConfig } from '../contexts/UIConfigContext.jsx';
import { defaultNavigation } from '../config/defaultFeatureFlags.js';

export default function useNavigationVisibility(navKey) {
  const { navigation } = useUIConfig();
  // Merge backend navigation over defaults
  const nav = { ...defaultNavigation, ...(navigation || {}) };
  return nav[navKey] !== false; // default true
}