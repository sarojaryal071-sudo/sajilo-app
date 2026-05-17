export default function FinanceDataTable({
  columns = [],
  rows = [],
  loading = false,
  emptyMessage = 'No data available',
  onRowClick,
}) {
  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: 24, color: 'var(--text-secondary)', fontSize: 13 }}>
        Loading...
      </div>
    );
  }

  if (!rows || rows.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: 24, color: 'var(--text-secondary)', fontSize: 13 }}>
        {emptyMessage}
      </div>
    );
  }

  return (
    <div style={{ overflowX: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 400 }}>
        <thead>
          <tr style={{
            position: 'sticky',
            top: 0,
            background: 'var(--bg-surface2)',
            borderBottom: '2px solid var(--border)',
            zIndex: 1,
          }}>
            {columns.map(col => (
              <th
                key={col.key}
                style={{
                  textAlign: 'left',
                  padding: '8px 12px',
                  fontSize: 11,
                  fontWeight: 600,
                  color: 'var(--text-secondary)',
                  whiteSpace: 'nowrap',
                }}
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr
              key={row.id || i}
              onClick={() => onRowClick && onRowClick(row)}
              style={{
                borderBottom: '1px solid var(--border)',
                cursor: onRowClick ? 'pointer' : 'default',
              }}
            >
              {columns.map(col => (
                <td
                  key={col.key}
                  style={{
                    padding: '8px 12px',
                    fontSize: 12,
                    color: 'var(--text-primary)',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {col.render ? col.render(row[col.key], row) : row[col.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}