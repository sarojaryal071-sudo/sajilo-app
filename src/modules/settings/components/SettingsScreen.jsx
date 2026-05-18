import { useState, useEffect, useCallback } from 'react';
import { useSettings } from '../useSettings';
import { clientRegistry } from '../registries/clientRegistry';
import { workerRegistry } from '../registries/workerRegistry';
import { getCurrentUser } from '../../../config/auth';
import SettingsEngine from '../engine/SettingsEngine';
import DangerZoneSection from './DangerZoneSection';
import SaveButton from './SaveButton';

/**
 * Convert a section map (e.g. { account: { label, fields } })
 * into an array of { key, title, fields } for the engine.
 */
function registryToArray(registry) {
  return Object.entries(registry).map(([key, section]) => ({
    key,
    title: section.label,
    fields: section.fields,
  }));
}

export default function SettingsScreen() {
  const {
    settings,
    loading,
    error,
    updateSettings,
    updateSetting,
    refreshSettings,
  } = useSettings();

  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');

  // Choose the correct registry based on role
  const currentUser = getCurrentUser();
  const userRole = currentUser?.role || 'customer';
  const registryObject = userRole === 'worker' ? workerRegistry : clientRegistry;
  const registryArray = registryToArray(registryObject);

  // ── Handle field changes (live, debounced save) ──
  const handleFieldChange = useCallback((sectionKey, fieldKey, value) => {
    const path = `${sectionKey}.${fieldKey}`;
    updateSetting(path, value);
  }, [updateSetting]);

  // ── Manual save (full save, flushes any pending debounced changes) ──
  const handleSave = async () => {
    setSaving(true);
    setSaveMessage('');
    try {
      // We call the legacy updateSettings with the current settings to force a sync.
      // Alternatively, we can flush pending via flushPending, but the old method is safe.
      await updateSettings(settings);
      setSaveMessage('Settings saved successfully!');
      await refreshSettings();
    } catch (err) {
      setSaveMessage('Failed to save settings.');
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div style={{ padding: 40, textAlign: 'center' }}>Loading settings…</div>;
  }
  if (error) {
    return <div style={{ padding: 40, textAlign: 'center', color: 'var(--accent-red)' }}>Error loading settings.</div>;
  }

  return (
    <div style={{ maxWidth: 640, margin: '0 auto', padding: '20px 16px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h2 style={{ fontSize: 20, fontWeight: 700, color: 'var(--text-primary)' }}>Settings</h2>
        <SaveButton onClick={handleSave} loading={saving} disabled={false} />
      </div>

      {saveMessage && (
        <div style={{
          padding: '8px 16px',
          borderRadius: 6,
          background: saveMessage.includes('success') ? '#dcfce7' : '#fee2e2',
          color: saveMessage.includes('success') ? '#166534' : '#991b1b',
          fontSize: 13,
          marginBottom: 16,
        }}>
          {saveMessage}
        </div>
      )}

      {/* Registry‑driven engine */}
      <SettingsEngine
        registry={registryArray}
        values={settings}
        onChange={handleFieldChange}
      />

      {/* Danger Zone (account actions) */}
      <DangerZoneSection />
            {/* App Info Footer */}
      <div style={{
        marginTop: 32,
        padding: '16px 0',
        textAlign: 'center',
        color: 'var(--text-secondary)',
        fontSize: 12,
        borderTop: '1px solid var(--border)',
      }}>
        <div>App Version {settings?.appInfo?.version || '—'}</div>
        <div style={{ marginTop: 4 }}>Build {settings?.appInfo?.build || '—'}</div>
        <div style={{ marginTop: 4 }}>Developer {settings?.appInfo?.developer || '—'}</div>
      </div>
      
    </div>
  );
}