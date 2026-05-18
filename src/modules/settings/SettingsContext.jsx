// sajilo-app/src/modules/settings/SettingsContext.jsx
import { createContext, useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { getSettings as fetchSettings, updateSettings as patchSettings } from './settings.service';
import { validateField } from './utils/validateSetting';

export const SettingsContext = createContext(null);

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

function getNestedValue(obj, path) {
  return path.split('.').reduce((acc, key) => (acc || {})[key], obj);
}

function sectionFromPath(path) {
  return path.split('.')[0];
}

export function SettingsProvider({ children }) {
  const [settings, setSettings] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sectionSaveStates, setSectionSaveStates] = useState({});
  const [dirtySections, setDirtySections] = useState({});
  const lastPayloadRef = useRef({});
  const saveTimeoutsRef = useRef({});

  const pendingChanges = useRef({});
  const saveTimeout = useRef(null);

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

  const refreshSettings = useCallback(async () => {
    try {
      const data = await fetchSettings();
      setSettings(data);
    } catch (err) {
      console.error('Failed to refresh settings:', err);
    }
  }, []);

  const clearSaveStatus = useCallback((section) => {
    if (saveTimeoutsRef.current[section]) clearTimeout(saveTimeoutsRef.current[section]);
    saveTimeoutsRef.current[section] = setTimeout(() => {
      setSectionSaveStates(prev => {
        const next = { ...prev };
        if (next[section] === 'saved') delete next[section];
        return next;
      });
    }, 2000);
  }, []);

  const flushPending = useCallback(async () => {
    const changes = { ...pendingChanges.current };
    if (Object.keys(changes).length === 0) return;

    const sections = [...new Set(Object.keys(changes).map(sectionFromPath))];
    setSectionSaveStates(prev => {
      const next = { ...prev };
      sections.forEach(sec => { next[sec] = 'saving'; });
      return next;
    });

    pendingChanges.current = {};
    if (saveTimeout.current) {
      clearTimeout(saveTimeout.current);
      saveTimeout.current = null;
    }

    try {
      const updated = await patchSettings(changes);
      setSettings(updated);
      lastPayloadRef.current = { ...lastPayloadRef.current, ...changes };
      setSectionSaveStates(prev => {
        const next = { ...prev };
        sections.forEach(sec => { next[sec] = 'saved'; });
        return next;
      });
      setDirtySections(prev => {
        const next = { ...prev };
        sections.forEach(sec => { delete next[sec]; });
        return next;
      });
      sections.forEach(sec => clearSaveStatus(sec));
    } catch (err) {
      console.error('Failed to save settings:', err);
      pendingChanges.current = { ...changes, ...pendingChanges.current };
      setSectionSaveStates(prev => {
        const next = { ...prev };
        sections.forEach(sec => { next[sec] = 'error'; });
        return next;
      });
    }
  }, [clearSaveStatus]);

  const scheduleSave = useCallback(() => {
    if (saveTimeout.current) clearTimeout(saveTimeout.current);
    saveTimeout.current = setTimeout(() => flushPending(), 800);
  }, [flushPending]);

  const updateSetting = useCallback((path, value) => {
    // Validate against schema
    const section = sectionFromPath(path);
    const fieldKey = path.split('.').slice(1).join('.');
    const errorMsg = validateField(section, fieldKey, value);
    if (errorMsg) {
      // Don't update, and set error state (could be passed to field)
      console.warn(`Validation failed for ${path}: ${errorMsg}`);
      return;
    }

    const currentValue = getNestedValue(settings, path);
    if (JSON.stringify(currentValue) === JSON.stringify(value)) return;

    setSettings(prev => setNestedValue(prev, path, value));
    pendingChanges.current = setNestedValue(pendingChanges.current, path, value);
    setDirtySections(prev => ({ ...prev, [section]: true }));
    scheduleSave();
  }, [settings, scheduleSave]);

  const retrySection = useCallback((section) => {
    const sectionPayload = {};
    Object.keys(lastPayloadRef.current).forEach(key => {
      if (sectionFromPath(key) === section) sectionPayload[key] = lastPayloadRef.current[key];
    });
    if (Object.keys(sectionPayload).length === 0) return;
    pendingChanges.current = { ...pendingChanges.current, ...sectionPayload };
    scheduleSave();
  }, [scheduleSave]);

  const updateSettingsBatch = useCallback(async (updates) => {
    if (saveTimeout.current) { clearTimeout(saveTimeout.current); saveTimeout.current = null; }
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
    updateSettings,
    refreshSettings,
    updateSetting,
    updateSettingsBatch,
    flushPending,
    sectionSaveStates,
    dirtySections,
    retrySection,
  }), [
    settings, loading, error,
    updateSettings, refreshSettings,
    updateSetting, updateSettingsBatch, flushPending,
    sectionSaveStates, dirtySections, retrySection,
  ]);

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
}