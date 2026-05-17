// sajilo-app/src/screens/admin/finance/FinanceComponents.jsx

export function StatCard({ label, value }) {
  return (
    <div style={{
      background: 'var(--bg-surface)',
      border: '1px solid var(--border)',
      borderRadius: 'var(--radius-md)',
      padding: 16,
      textAlign: 'center',
    }}>
      <div style={{ fontSize: 'var(--font-body-sm)', color: 'var(--text-secondary)', marginBottom: 4 }}>
        {label}
      </div>
      <div style={{ fontSize: 'var(--font-title)', fontWeight: 800, color: 'var(--accent-blue)' }}>
        {value}
      </div>
    </div>
  );
}

export function ListRow({ rank, left, sub, right }) {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '10px 0',
      borderBottom: '1px solid var(--border)',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, flex: 1, minWidth: 0 }}>
        {rank && (
          <span style={{
            width: 20, height: 20, borderRadius: '50%',
            background: 'var(--accent-blue-light)',
            color: 'var(--accent-blue)', fontSize: 11, fontWeight: 700,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0,
          }}>
            {rank}
          </span>
        )}
        <div style={{ minWidth: 0 }}>
          <div style={{ fontSize: 'var(--font-body-sm)', fontWeight: 600, color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {left}
          </div>
          {sub && <div style={{ fontSize: 'var(--font-caption)', color: 'var(--text-secondary)' }}>{sub}</div>}
        </div>
      </div>
      <div style={{ fontSize: 'var(--font-body-sm)', fontWeight: 600, color: 'var(--text-primary)', marginLeft: 12, flexShrink: 0 }}>
        {right}
      </div>
    </div>
  );
}

export function SectionTitle({ title }) {
  return (
    <h3 style={{
      fontSize: 'var(--font-body)',
      fontWeight: 700,
      color: 'var(--text-primary)',
      marginBottom: 8,
      borderBottom: '2px solid var(--accent-blue)',
      paddingBottom: 4,
    }}>
      {title}
    </h3>
  );
}

export function EmptyRow({ text }) {
  return (
    <div style={{ padding: '10px 0', color: 'var(--text-secondary)', fontSize: 'var(--font-body-sm)' }}>
      {text}
    </div>
  );
}