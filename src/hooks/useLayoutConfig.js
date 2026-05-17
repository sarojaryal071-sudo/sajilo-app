import { useUIConfig } from '../contexts/UIConfigContext.jsx';
import defaultLayouts from '../config/defaultLayouts.js';

export default function useLayoutConfig() {
  const { uiConfig } = useUIConfig();
  const layouts = uiConfig?.layouts || {};
  // Merge with defaults for safety
  const homepageLayout = layouts.homepage || defaultLayouts.homepage;
  return {
    homepageLayout,
    getBlockById: (id) => homepageLayout.find(b => b.id === id),
    isBlockEnabled: (id) => {
      const block = homepageLayout.find(b => b.id === id);
      return block ? block.enabled !== false : false;
    },
  };
}