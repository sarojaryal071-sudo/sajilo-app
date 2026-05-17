import { useUIConfig } from '../contexts/UIConfigContext.jsx';

export default function useUiSystem() {
  const { uiConfig, tokens, branding, features, navigation, content, layouts, variants, assets, presets, loading } = useUIConfig();
  return {
    uiConfig,
    tokens,
    branding,
    features,
    navigation,
    content,
    layouts,
    variants,
    assets,
    presets,
    loading,
  };
}