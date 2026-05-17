import { useUIConfig } from '../contexts/UIConfigContext.jsx';

export default function useUiConfig() {
  const { uiConfig, loading } = useUIConfig();
  return {
    uiConfig: uiConfig || {},
    design: uiConfig?.design || {},
    branding: uiConfig?.branding || {},
    features: uiConfig?.features || {},
    navigation: uiConfig?.navigation || {},
    loading,
  };
}