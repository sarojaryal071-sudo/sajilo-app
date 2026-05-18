// sajilo-app/src/modules/settings/engine/fields/PasswordChangeField.jsx
import { useState } from 'react';
import { useSettings } from '../../useSettings';

function PasswordInput({ placeholder, value, onChange, autoComplete }) {
  const [show, setShow] = useState(false);

  return (
    <div style={{ position: 'relative', marginBottom: 12 }}>
      <input
        type={show ? 'text' : 'password'}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        autoComplete={autoComplete}
        style={{
          width: '100%',
          padding: '10px 40px 10px 12px',
          borderRadius: 8,
          border: '1px solid var(--border)',
          background: 'var(--bg-surface2)',
          color: 'var(--text-primary)',
          fontSize: 14,
          outline: 'none',
        }}
      />
      <button
        type="button"
        onClick={() => setShow(!show)}
        style={{
          position: 'absolute',
          right: 10,
          top: '50%',
          transform: 'translateY(-50%)',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          fontSize: 16,
          color: 'var(--text-secondary)',
          padding: 0,
          lineHeight: 1,
        }}
        tabIndex={-1}
      >
        {show ? '🙈' : '👁️'}
      </button>
    </div>
  );
}

export default function PasswordChangeField({ field }) {
  const { updateSettings } = useSettings();

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  // Determine if the form can be submitted
  const isFormValid =
    currentPassword.trim().length > 0 &&
    newPassword.trim().length > 0 &&
    confirmPassword.trim().length > 0 &&
    newPassword === confirmPassword;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    if (!currentPassword || !newPassword || !confirmPassword) {
      setMessage('All fields are required.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setMessage('New passwords do not match.');
      return;
    }

    setSaving(true);
    try {
      await updateSettings({
        security: {
          currentPassword,
          newPassword,
          confirmPassword,
        },
      });
      setMessage('Password changed successfully.');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      setMessage(err?.message || 'Failed to change password.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ padding: '8px 0' }}>
      <PasswordInput
        placeholder="Current password"
        value={currentPassword}
        onChange={setCurrentPassword}
        autoComplete="current-password"
      />
      <PasswordInput
        placeholder="New password"
        value={newPassword}
        onChange={setNewPassword}
        autoComplete="new-password"
      />
      <PasswordInput
        placeholder="Confirm new password"
        value={confirmPassword}
        onChange={setConfirmPassword}
        autoComplete="new-password"
      />

      {newPassword && confirmPassword && newPassword !== confirmPassword && (
        <div style={{ fontSize: 13, color: 'var(--accent-red)', marginBottom: 12 }}>
          Passwords do not match
        </div>
      )}

      {message && (
        <div style={{
          fontSize: 13,
          color: message.includes('success') ? 'var(--accent-green)' : 'var(--accent-red)',
          marginBottom: 12,
        }}>
          {message}
        </div>
      )}

      <button
        type="submit"
        disabled={!isFormValid || saving}
        style={{
          width: '100%',
          padding: '12px 0',
          borderRadius: 8,
          border: 'none',
          background: (!isFormValid || saving) ? '#cbd5e1' : 'var(--accent-blue)',
          color: '#fff',
          fontSize: 14,
          fontWeight: 600,
          cursor: (!isFormValid || saving) ? 'not-allowed' : 'pointer',
        }}
      >
        {saving ? 'Changing…' : 'Change Password'}
      </button>
    </form>
  );
}