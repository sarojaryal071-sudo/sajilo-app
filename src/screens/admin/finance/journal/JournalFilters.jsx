import { useState } from 'react';
import FinanceFilterBar from '../../../../components/admin/finance/FinanceFilterBar';

export default function JournalFilters({ filters = {}, onChange }) {
  const [localFilters, setLocalFilters] = useState(filters || {});

  const update = (key, value) => {
    const next = { ...localFilters, [key]: value };
    setLocalFilters(next);
    if (onChange) onChange(next);
  };

  const sourceTypes = [
    { key: '', label: 'All' },
    { key: 'ledger', label: 'Ledger' },
    { key: 'expense', label: 'Expenses' },
    { key: 'manual', label: 'Manual' },
    { key: 'backfill', label: 'Backfill' },
  ];

  return (
    <div>
      {/* Source type quick filter chips */}
      <div style={{ display: 'flex', gap: 6, marginBottom: 10, flexWrap: 'wrap' }}>
        {sourceTypes.map(st => {
          const isActive = st.key === ''
            ? !localFilters.sourceType
            : localFilters.sourceType === st.key;
          return (
            <button
              key={st.key}
              onClick={() => update('sourceType', st.key || '')}
              style={{
                padding: '4px 12px',
                borderRadius: 16,
                border: isActive ? '2px solid var(--accent-blue)' : '1px solid var(--border)',
                background: isActive ? 'var(--accent-blue-light)' : 'var(--bg-surface)',
                color: isActive ? 'var(--accent-blue)' : 'var(--text-secondary)',
                fontSize: 12,
                fontWeight: 500,
                cursor: 'pointer',
              }}
            >
              {st.label}
            </button>
          );
        })}
      </div>

      <FinanceFilterBar
        searchValue={localFilters.search || ''}
        onSearchChange={(val) => update('search', val)}
        searchPlaceholder="Search entries..."
        rightSlot={
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
            <input type="date" value={localFilters.from || ''} onChange={(e) => update('from', e.target.value)} style={inputStyle} placeholder="From" />
            <input type="date" value={localFilters.to || ''} onChange={(e) => update('to', e.target.value)} style={inputStyle} placeholder="To" />
            <select value={localFilters.sourceType || ''} onChange={(e) => update('sourceType', e.target.value)} style={selectStyle}>
              <option value="">All Sources</option>
              <option value="ledger">Ledger</option>
              <option value="expense">Expense</option>
              <option value="manual">Manual</option>
              <option value="backfill">Backfill</option>
            </select>
            <input type="number" value={localFilters.amountMin || ''} onChange={(e) => update('amountMin', e.target.value)} style={{ ...inputStyle, width: 80 }} placeholder="Min Rs" />
            <input type="number" value={localFilters.amountMax || ''} onChange={(e) => update('amountMax', e.target.value)} style={{ ...inputStyle, width: 80 }} placeholder="Max Rs" />
            <input type="text" value={localFilters.account || ''} onChange={(e) => update('account', e.target.value)} style={{ ...inputStyle, width: 120 }} placeholder="Account" />
            <select value={localFilters.reconciled || ''} onChange={(e) => update('reconciled', e.target.value)} style={selectStyle}>
              <option value="">All Reconcile Status</option>
              <option value="yes">Reconciled</option>
              <option value="no">Unreconciled</option>
            </select>
          </div>
        }
      />
    </div>
  );
}

const inputStyle = {
  padding: '6px 8px',
  borderRadius: 6,
  border: '1px solid var(--border)',
  fontSize: 12,
  background: 'var(--bg-surface)',
  color: 'var(--text-primary)',
  outline: 'none',
};

const selectStyle = {
  padding: '6px 8px',
  borderRadius: 6,
  border: '1px solid var(--border)',
  fontSize: 12,
  background: 'var(--bg-surface)',
  color: 'var(--text-primary)',
  outline: 'none',
  cursor: 'pointer',
};