import { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { applyUiTokens } from '../utils/applyUiTokens.js';
import { API_URL } from '../services/api.js';
import defaultBranding from '../config/defaultBranding.js';
import { defaultUiContent } from '../config/defaultUiContent.js';
import { defaultUiAssets } from '../config/defaultUiAssets.js';
import { defaultUiPresets } from '../config/defaultUiPresets.js';
import { buildUiConfig } from '../utils/buildUiConfig.js';

const UIConfigContext = createContext();

/**
 * UIConfigProvider
 * Phase 19A — Fetches published UI config and applies CSS variables.
 * Falls back to registry defaults on any failure.
 */
export function UIConfigProvider({ children }) {
  const [config, setConfig] = useState(null);
  const [branding, setBranding] = useState({});
  const [features, setFeatures] = useState({});
  const [navigation, setNavigation] = useState({});
  const [content, setContent] = useState(defaultUiContent);
  const [layouts, setLayouts] = useState({});
  const [variants, setVariants] = useState({});
  const [colorsGrading, setColorsGrading] = useState({});
  const [assets, setAssets] = useState(defaultUiAssets);
  const [presets, setPresets] = useState(defaultUiPresets);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const scope = getUserScope();
    applyConfig(scope);
  }, []);

    useEffect(() => {
    if (config) {
      applyUiTokens(config, colorsGrading);
    }
  }, [config, colorsGrading]);

  /**
   * Determine the UI config scope based on the current user.
   */
  const getUserScope = () => {
    try {
      const user = JSON.parse(localStorage.getItem('sajilo_user') || 'null');
      if (!user) return 'global';
      if (user.role === 'worker') return 'worker';
      if (user.role === 'admin') return 'global'; // admin panel uses global tokens for now
      return 'global';
    } catch {
      return 'global';
    }
  };

  const applyConfig = async (scope) => {
    try {
      const token = localStorage.getItem('sajilo_token');
      const res = await fetch(`${API_URL}/ui-config/${scope}/published`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });

      if (res.ok) {
        const data = await res.json();
                if (data.success && data.data && data.data.config) {
          const fullConfig = data.data.config;
          applyUiTokens(fullConfig, colorsGrading);
          setConfig(fullConfig);
          if (fullConfig.branding) {
            const mergedBranding = deepMerge(defaultBranding, fullConfig.branding);
            setBranding(mergedBranding);
          } else {
            setBranding(defaultBranding);
          }
          if (fullConfig.features) {
            setFeatures(fullConfig.features);
          }
          if (fullConfig.navigation) {
            setNavigation(fullConfig.navigation);
          }

            if (fullConfig.content) {
            setContent(fullConfig.content);
          }
          if (fullConfig.layouts) {
            setLayouts(fullConfig.layouts);
          }
          if (fullConfig.variants) {
            setVariants(fullConfig.variants);
          }
          if (fullConfig.colorsGrading) {
            setColorsGrading(fullConfig.colorsGrading);
          } else {
            setColorsGrading({});
          }
          if (fullConfig.assets) {
            setAssets(fullConfig.assets);
          } else {
            setAssets(defaultUiAssets);
          }
          if (fullConfig.presets) {
            setPresets(fullConfig.presets);
          } else {
            setPresets(defaultUiPresets);
          }
        }
      }
    } catch (err) {
      console.warn('[UIConfig] Failed to load tokens, using existing styles:', err.message);
      setError(err.message);
      // Do nothing – keep existing global.css variables
    } finally {
      setLoading(false);
    }
  };

  /**
   * Get a specific token value (live from DOM or fallback).
   */
  const getToken = (category, key) => {
    const token = designTokenRegistry.mappings[category]?.[key];
    if (!token) return '';
    const live = getComputedStyle(document.documentElement).getPropertyValue(token.cssVar).trim();
    return live || token.fallback;
  };

  const uiConfig = useMemo(() => buildUiConfig({
    design: config,
    branding,
    features,
    navigation,
    content,
    layouts,
    variants,
    assets,
    presets,
    colorsGrading,
  }), [config, branding, features, navigation, content, layouts, variants, assets, presets, colorsGrading]);

  const value = {
    tokens: config,
    branding,
    features,
    navigation,
    content,
    layouts,
    variants,
    assets,
    presets,
    colorsGrading,
    uiConfig,
    controlConfig: uiConfig,
    loading,
    error,
    getToken,
    refresh: () => applyConfig(getUserScope()),
  };

  return (
    <UIConfigContext.Provider value={value}>
      {children}
    </UIConfigContext.Provider>
  );
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

export function useUIConfig() {
  return useContext(UIConfigContext);
}