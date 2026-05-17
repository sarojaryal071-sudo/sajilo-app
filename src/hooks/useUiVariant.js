import { useUIConfig } from '../contexts/UIConfigContext.jsx';
import defaultUiVariants from '../config/defaultUiVariants.js';

export default function useUiVariant() {
  const { uiConfig } = useUIConfig();
  const variants = uiConfig?.variants || {};

  /**
   * Get the merged variant config for a component type.
   * Falls back to defaults if nothing is published.
   */
  const getVariant = (componentType) => {
    const defaults = defaultUiVariants[componentType] || {};
    const overrides = variants[componentType] || {};
    return { ...defaults, ...overrides };
  };

  /**
   * Get a specific behavior value (e.g. hover style).
   */
  const getBehavior = (componentType, key) => {
    const v = getVariant(componentType);
    return v[key] !== undefined ? v[key] : null;
  };

  return { getVariant, getBehavior, variants };
}