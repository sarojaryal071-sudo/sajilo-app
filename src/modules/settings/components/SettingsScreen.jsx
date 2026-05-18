import { useState, useCallback } from 'react';
import { useSettings } from '../useSettings';
import { clientRegistry } from '../registries/clientRegistry';
import { workerRegistry } from '../registries/workerRegistry';
import { getCurrentUser } from '../../../config/auth';
import { useAppConfig } from '../../app-config/useAppConfig';
import SettingsEngine from '../engine/SettingsEngine';
import DangerZoneSection from './DangerZoneSection';
import SaveButton from './SaveButton';
import SettingsAuditSection from './SettingsAuditSection';

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
    sectionSaveStates,
    retrySection,
  } = useSettings();

  const { appConfig } = useAppConfig();
  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');

  const currentUser = getCurrentUser();
  const userRole = currentUser?.role || 'customer';
  const registryObject = userRole === 'worker' ? workerRegistry : clientRegistry;
  const registryArray = registryToArray(registryObject);

  const handleFieldChange = useCallback((sectionKey, fieldKey, value) => {
    const path = `${sectionKey}.${fieldKey}`;
    updateSetting(path, value);
  }, [updateSetting]);

  const handleSave = async () => {
    setSaving(true);
    setSaveMessage('');
    try {
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

      <SettingsEngine
        registry={registryArray}
        values={settings}
        onChange={handleFieldChange}
        saveStates={sectionSaveStates}
        onRetrySection={retrySection}
      />

      <DangerZoneSection />
      <SettingsAuditSection />

      {/* App Info Footer – now from deployment config */}
      <div style={{
        marginTop: 40,
        padding: '24px 0 16px',
        textAlign: 'center',
        color: 'var(--text-secondary)',
        borderTop: '1px solid var(--border)',
      }}>
        <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 6 }}>
          {appConfig?.app?.name || 'Sajilo'}
        </div>
        <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.8 }}>
          <div>Version {appConfig?.app?.version || '—'}</div>
          <div>Build {appConfig?.app?.build || '—'}</div>
          <div style={{ fontSize: 11, opacity: 0.7 }}>
            {appConfig?.app?.developer || '—'}
          </div>
        </div>
      </div>
    </div>
  );
}