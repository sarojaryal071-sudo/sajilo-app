import { useUIConfig } from '../contexts/UIConfigContext.jsx';
import defaultContentConfig from '../config/defaultContentConfig.js';

export default function useContentConfig() {
  const { content } = useUIConfig();
  // Merge backend content over defaults (shallow merge per section)
  const merged = { ...defaultContentConfig };
  if (content) {
    for (const section of Object.keys(merged)) {
      if (content[section]) {
        merged[section] = { ...merged[section], ...content[section] };
      }
    }
  }
  return merged;
}