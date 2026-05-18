// sajilo-app/src/modules/settings/SettingsContext.jsx
import { createContext, useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { getSettings as fetchSettings, updateSettings as patchSettings } from './settings.service';

export const SettingsContext = createContext(null);

// Helper: set a deeply nested value by dot‑separated path (e.g. "account.fullName")
function setNestedValue(obj, path, value) {
  const keys = path.split('.');
  const result = { ...obj };
  let current = result;
  for (let i = 0; i < keys.length - 1; i++) {
    const key = keys[i];
    current[key] = { ...(current[key] || {}) };
    current = current[key];
  }
  current[keys[keys.length - 1]] = value;
  return result;
}

export function SettingsProvider({ children }) {
  const [settings, setSettings] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ── Debounce state ──
  const pendingChanges = useRef({});
  const saveTimeout = useRef(null);

  // ── Initial fetch ──
  useEffect(() => {
    (async () => {
      try {
        const data = await fetchSettings();
        setSettings(data);
      } catch (err) {
        console.error('Failed to load settings:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // ── Refresh ──
  const refreshSettings = useCallback(async () => {
    try {
      const data = await fetchSettings();
      setSettings(data);
    } catch (err) {
      console.error('Failed to refresh settings:', err);
    }
  }, []);

  // ── Flush pending changes to the backend ──
  const flushPending = useCallback(async () => {
    const changes = { ...pendingChanges.current };
    if (Object.keys(changes).length === 0) return;

    // Clear pending before API call to prevent duplicate sends
    pendingChanges.current = {};
    if (saveTimeout.current) {
      clearTimeout(saveTimeout.current);
      saveTimeout.current = null;
    }

    try {
      const updated = await patchSettings(changes);
      setSettings(updated);
    } catch (err) {
      console.error('Failed to save settings:', err);
      // Restore pending changes on failure so they aren’t lost
      pendingChanges.current = { ...changes, ...pendingChanges.current };
    }
  }, []);

  // ── Debounced schedule ──
  const scheduleSave = useCallback(() => {
    if (saveTimeout.current) clearTimeout(saveTimeout.current);
    saveTimeout.current = setTimeout(() => {
      flushPending();
    }, 800); // 800 ms debounce
  }, [flushPending]);

  // ── Single‑field update (used by FieldRenderer) ──
  const updateSetting = useCallback((path, value) => {
    // Optimistic state update
    setSettings(prev => {
      const next = setNestedValue(prev, path, value);
      return next;
    });

    // Merge the change into pending and schedule save
    pendingChanges.current = setNestedValue(pendingChanges.current, path, value);
    scheduleSave();
  }, [scheduleSave]);

  // ── Batch update (explicit, non‑debounced) ──
  const updateSettingsBatch = useCallback(async (updates) => {
    // Clear any pending changes to avoid conflicts
    if (saveTimeout.current) {
      clearTimeout(saveTimeout.current);
      saveTimeout.current = null;
    }
    pendingChanges.current = {};

    try {
      const updated = await patchSettings(updates);
      setSettings(updated);
      return updated;
    } catch (err) {
      console.error('Failed to update settings batch:', err);
      throw err;
    }
  }, []);

  // ── Legacy updateSettings (still works as before) ──
  const updateSettings = useCallback(async (updates) => {
    try {
      const updated = await patchSettings(updates);
      setSettings(updated);
      return updated;
    } catch (err) {
      console.error('Failed to update settings:', err);
      throw err;
    }
  }, []);

  const value = useMemo(() => ({
    settings,
    loading,
    error,
    // legacy (backward‑compatible)
    updateSettings,
    refreshSettings,
    // new
    updateSetting,
    updateSettingsBatch,
    flushPending,
  }), [
    settings, loading, error,
    updateSettings, refreshSettings,
    updateSetting, updateSettingsBatch, flushPending,
  ]);

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
}