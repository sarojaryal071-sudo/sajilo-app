import { useState, useCallback } from 'react';
import { defaultUiPresets } from '../../config/defaultUiPresets.js';

export function useColorGrading() {
  // Initialize from a default set (empty grading per color)
  const [grading, setGrading] = useState(() => {
    // We'll store grading per token key, e.g. 'primary', 'surface', etc.
    return {};
  });

  const setColorGrading = useCallback((tokenKey, field, value) => {
    setGrading(prev => ({
      ...prev,
      [tokenKey]: {
        ...(prev[tokenKey] || { saturation: 0, brightness: 0, warmth: 0, opacity: 100 }),
        [field]: value,
      },
    }));
  }, []);

  const resetGrading = useCallback((tokenKey) => {
    setGrading(prev => ({
      ...prev,
      [tokenKey]: { saturation: 0, brightness: 0, warmth: 0, opacity: 100 },
    }));
  }, []);

  return { grading, setColorGrading, resetGrading, setGrading };
}