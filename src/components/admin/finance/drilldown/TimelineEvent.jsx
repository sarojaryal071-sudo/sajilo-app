import FinanceStatusPill from '../FinanceStatusPill';

export default function TimelineEvent({ timestamp, title, subtitle, status, actor, metadata, icon, compact = false }) {
  return (
    <div style={{ display: 'flex', gap: 12, padding: '10px 0', borderBottom: '1px solid var(--border)' }}>
      <div style={{ flexShrink: 0, width: 32, textAlign: 'center', fontSize: 16 }}>{icon || '●'}</div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>{title}</span>
          {status && <FinanceStatusPill status={status} />}
        </div>
        {!compact && subtitle && <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 2 }}>{subtitle}</div>}
        {!compact && timestamp && <div style={{ fontSize: 11, color: 'var(--text-secondary)', marginTop: 2 }}>{new Date(timestamp).toLocaleString()}</div>}
        {!compact && actor && <div style={{ fontSize: 11, color: 'var(--text-secondary)', marginTop: 2 }}>Actor: {actor}</div>}
        {!compact && metadata && Object.keys(metadata).length > 0 && (
          <div style={{ marginTop: 4, fontSize: 11, color: 'var(--text-secondary)', whiteSpace: 'pre-wrap' }}>
            {Object.entries(metadata).map(([k, v]) => `${k}: ${v}`).join(' · ')}
          </div>
        )}
      </div>
    </div>
  );
}