import { createContext, useContext, useState, useEffect } from 'react';
import { designTokenRegistry } from '../config/designTokenRegistry.js';

const UIConfigContext = createContext();

/**
 * UIConfigProvider
 * Phase 19A — Fetches published UI config and applies CSS variables.
 * Falls back to registry defaults on any failure.
 */
export function UIConfigProvider({ children }) {
  const [config, setConfig] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    applyConfig();
  }, []);

  const applyConfig = async () => {
    try {
      const token = localStorage.getItem('sajilo_token');
      const scopes = ['global', 'worker', 'client', 'admin', 'auth', 'chat'];

      for (const scope of scopes) {
        try {
          const res = await fetch(`/api/ui-config/${scope}/tokens`, {
            headers: token ? { Authorization: `Bearer ${token}` } : {},
          });
          if (res.ok) {
            const data = await res.json();
            if (data.success && data.data) {
              applyTokensToDOM(data.data);
            }
          }
        } catch {
          // Scope may not have config — use defaults
        }
      }

      setConfig({ loaded: true });
    } catch (err) {
      console.warn('[UIConfig] Failed to load config, using defaults:', err.message);
      setError(err.message);
      applyFallbackTokens();
    } finally {
      setLoading(false);
    }
  };

  /**
   * Apply token values to CSS custom properties on :root.
   */
  const applyTokensToDOM = (tokens) => {
    const root = document.documentElement;
    for (const [category, values] of Object.entries(tokens)) {
      const mapping = designTokenRegistry.mappings[category];
      if (!mapping) continue;
      for (const [key, value] of Object.entries(values)) {
        const token = mapping[key];
        if (token) {
          root.style.setProperty(token.cssVar, value);
        }
      }
    }
  };

  /**
   * Apply all fallback defaults when API fails.
   */
  const applyFallbackTokens = () => {
    const root = document.documentElement;
    for (const category of Object.values(designTokenRegistry.mappings)) {
      for (const token of Object.values(category)) {
        root.style.setProperty(token.cssVar, token.fallback);
      }
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

  const value = { config, loading, error, getToken, refresh: applyConfig };

  return (
    <UIConfigContext.Provider value={value}>
      {children}
    </UIConfigContext.Provider>
  );
}

export function useUIConfig() {
  return useContext(UIConfigContext);
}