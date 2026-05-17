export default function FinanceFilterBar({
  searchValue = '',
  onSearchChange,
  searchPlaceholder = 'Search...',
  leftSlot,
  rightSlot,
}) {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: 10,
      marginBottom: 16,
      flexWrap: 'wrap',
    }}>
      {leftSlot && <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>{leftSlot}</div>}
      {onSearchChange && (
        <input
          type="text"
          value={searchValue}
          onChange={e => onSearchChange(e.target.value)}
          placeholder={searchPlaceholder}
          style={{
            flex: 1,
            minWidth: 180,
            padding: '8px 12px',
            borderRadius: 6,
            border: '1px solid var(--border)',
            fontSize: 13,
            background: 'var(--bg-surface)',
            color: 'var(--text-primary)',
            outline: 'none',
          }}
        />
      )}
      {rightSlot && <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginLeft: 'auto' }}>{rightSlot}</div>}
    </div>
  );
}