import { useState, useEffect } from 'react';
import { fetchAuditLogs } from '../settingsAudit.service';

export default function SettingsAuditSection() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAuditLogs()
      .then(data => setLogs(data || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div style={{ padding: 16, textAlign: 'center' }}>Loading activity…</div>;
  if (logs.length === 0) return null;

  return (
    <div style={{ background: 'var(--bg-surface)', borderRadius: 12, border: '1px solid var(--border)', padding: 20, marginBottom: 24 }}>
      <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 12 }}>
        Recent Activity
      </h3>
      {logs.map(log => (
        <div key={log.id || log.created_at} style={{ padding: '8px 0', borderBottom: '1px solid var(--border)', fontSize: 13, color: 'var(--text-primary)' }}>
          <div style={{ fontWeight: 500 }}>{formatAction(log)}</div>
          <div style={{ fontSize: 11, color: 'var(--text-secondary)' }}>
            {new Date(log.created_at).toLocaleString()}
          </div>
        </div>
      ))}
    </div>
  );
}

function formatAction(log) {
  const field = log.field_path || '';
  if (log.action_type === 'PASSWORD_CHANGED') return 'Password changed';
  if (log.action_type === 'ACCOUNT_DEACTIVATED') return 'Account deactivated';
  if (log.action_type === 'ACCOUNT_DELETED_REQUESTED') return 'Account deletion requested';
  return `${field} updated`;
}