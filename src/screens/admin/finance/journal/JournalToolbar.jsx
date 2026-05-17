export default function JournalToolbar({ onRefresh }) {
  return (
    <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 12 }}>
      {onRefresh && (
        <button
          onClick={onRefresh}
          style={{
            padding: '6px 14px',
            borderRadius: 6,
            border: '1px solid var(--border)',
            background: 'var(--bg-surface)',
            color: 'var(--text-secondary)',
            fontSize: 12,
            cursor: 'pointer',
          }}
        >
          🔄 Refresh
        </button>
      )}
      {/* Future: Export, bulk actions, etc. */}
    </div>
  );
}