import { useState } from 'react';
import { useSettings } from '../useSettings';

export default function DangerZoneSection() {
  const { settings, updateSettings } = useSettings();
  const [showConfirm, setShowConfirm] = useState(null); // 'deactivate' | 'delete'
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  const handleDeactivate = async () => {
    setSaving(true);
    setMessage('');
    try {
      await updateSettings({
        system: {
          deactivatedAt: new Date().toISOString(),
        },
      });
      setMessage('Account deactivated successfully.');
    } catch (err) {
      setMessage('Failed to deactivate account.');
    } finally {
      setSaving(false);
      setShowConfirm(null);
    }
  };

  const handleDelete = async () => {
    setSaving(true);
    setMessage('');
    try {
      await updateSettings({
        system: {
          deletedAt: new Date().toISOString(),
        },
      });
      setMessage('Account deletion scheduled. This will be processed soon.');
    } catch (err) {
      setMessage('Failed to schedule account deletion.');
    } finally {
      setSaving(false);
      setShowConfirm(null);
    }
  };

  return (
    <div style={{ marginTop: 24 }}>
      <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--accent-red)', marginBottom: 12 }}>
        Danger Zone
      </h3>
      <div style={{
        background: 'var(--bg-surface)',
        borderRadius: 10,
        border: '1px solid var(--border)',
        padding: 20,
      }}>
        {/* Deactivate */}
        <div style={{ marginBottom: 20 }}>
          <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)' }}>
            Deactivate Account
          </div>
          <div style={{ fontSize: 12, color: 'var(--text-secondary)', margin: '4px 0 8px' }}>
            Temporarily deactivate your account. You can reactivate later.
          </div>
          {showConfirm === 'deactivate' ? (
            <div>
              <p style={{ fontSize: 12, color: 'var(--accent-red)' }}>Are you sure?</p>
              <button
                onClick={handleDeactivate}
                disabled={saving}
                style={{
                  padding: '6px 14px',
                  borderRadius: 6,
                  border: 'none',
                  background: 'var(--accent-red)',
                  color: '#fff',
                  cursor: 'pointer',
                  marginRight: 8,
                  fontWeight: 600,
                }}
              >
                {saving ? 'Deactivating…' : 'Confirm Deactivate'}
              </button>
              <button
                onClick={() => setShowConfirm(null)}
                disabled={saving}
                style={{
                  padding: '6px 14px',
                  borderRadius: 6,
                  border: '1px solid var(--border)',
                  background: 'transparent',
                  color: 'var(--text-primary)',
                  cursor: 'pointer',
                }}
              >
                Cancel
              </button>
            </div>
          ) : (
            <button
              onClick={() => setShowConfirm('deactivate')}
              style={{
                padding: '6px 14px',
                borderRadius: 6,
                border: '1px solid var(--accent-red)',
                background: 'transparent',
                color: 'var(--accent-red)',
                cursor: 'pointer',
                fontWeight: 600,
              }}
            >
              Deactivate
            </button>
          )}
        </div>

        {/* Delete */}
        <div>
          <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)' }}>
            Delete Account
          </div>
          <div style={{ fontSize: 12, color: 'var(--text-secondary)', margin: '4px 0 8px' }}>
            Permanently delete your account and all data. This action cannot be undone.
          </div>
          {showConfirm === 'delete' ? (
            <div>
              <p style={{ fontSize: 12, color: 'var(--accent-red)' }}>Are you sure you want to permanently delete your account?</p>
              <button
                onClick={handleDelete}
                disabled={saving}
                style={{
                  padding: '6px 14px',
                  borderRadius: 6,
                  border: 'none',
                  background: 'var(--accent-red)',
                  color: '#fff',
                  cursor: 'pointer',
                  marginRight: 8,
                  fontWeight: 600,
                }}
              >
                {saving ? 'Deleting…' : 'Confirm Delete'}
              </button>
              <button
                onClick={() => setShowConfirm(null)}
                disabled={saving}
                style={{
                  padding: '6px 14px',
                  borderRadius: 6,
                  border: '1px solid var(--border)',
                  background: 'transparent',
                  color: 'var(--text-primary)',
                  cursor: 'pointer',
                }}
              >
                Cancel
              </button>
            </div>
          ) : (
            <button
              onClick={() => setShowConfirm('delete')}
              style={{
                padding: '6px 14px',
                borderRadius: 6,
                border: '1px solid var(--accent-red)',
                background: 'transparent',
                color: 'var(--accent-red)',
                cursor: 'pointer',
                fontWeight: 600,
              }}
            >
              Delete Account
            </button>
          )}
        </div>

        {message && (
          <div style={{
            marginTop: 12,
            padding: '8px 12px',
            borderRadius: 6,
            background: message.includes('success') ? '#dcfce7' : '#fee2e2',
            color: message.includes('success') ? '#166534' : '#991b1b',
            fontSize: 13,
          }}>
            {message}
          </div>
        )}
      </div>
    </div>
  );
}