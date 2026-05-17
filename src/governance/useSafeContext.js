import { useContext } from 'react';

/**
 * Safe context consumer – never throws if provider is missing.
 * Returns the provided fallback instead.
 */
export function useSafeContext(Context, fallback) {
  try {
    const ctx = useContext(Context);
    return ctx != null ? ctx : fallback;
  } catch {
    return fallback;
  }
}