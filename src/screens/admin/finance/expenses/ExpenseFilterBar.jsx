import { useState } from 'react';
import FinanceFilterBar from '../../../../components/admin/finance/FinanceFilterBar';

export default function ExpenseFilterBar({ filters = {}, onChange, categories = [], vendors = [] }) {
  const [localFilters, setLocalFilters] = useState(filters);

  const update = (key, value) => {
    const next = { ...localFilters, [key]: value };
    setLocalFilters(next);
    if (onChange) onChange(next);
  };

  // Derive cost centers from categories (if they have a code we can use, or from expenses directly)
  const costCenters = [...new Set(categories.map(c => c.code).filter(Boolean))];

  return (
    <FinanceFilterBar
      searchValue={localFilters.search || ''}
      onSearchChange={(val) => update('search', val)}
      searchPlaceholder="Search expenses..."
      rightSlot={
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
          <input type="date" value={localFilters.from || ''} onChange={(e) => update('from', e.target.value)} style={inputStyle} />
          <input type="date" value={localFilters.to || ''} onChange={(e) => update('to', e.target.value)} style={inputStyle} />
          <select value={localFilters.vendor || ''} onChange={(e) => update('vendor', e.target.value)} style={selectStyle}>
            <option value="">All Vendors</option>
            {vendors.map(v => <option key={v.id} value={v.id}>{v.name}</option>)}
          </select>
          <select value={localFilters.category || ''} onChange={(e) => update('category', e.target.value)} style={selectStyle}>
            <option value="">All Categories</option>
            {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
          <select value={localFilters.costCenter || ''} onChange={(e) => update('costCenter', e.target.value)} style={selectStyle}>
            <option value="">All Cost Centers</option>
            {costCenters.map(cc => <option key={cc} value={cc}>{cc}</option>)}
          </select>
          <select value={localFilters.expenseType || ''} onChange={(e) => update('expenseType', e.target.value)} style={selectStyle}>
            <option value="">All Types</option>
            <option value="MANUAL">Manual</option>
            <option value="RECURRING">Recurring</option>
            <option value="AUTO_EXPENSE">Auto Expense</option>
          </select>
          <select value={localFilters.status || ''} onChange={(e) => update('status', e.target.value)} style={selectStyle}>
            <option value="">All Status</option>
            <option value="draft">Draft</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="paid">Paid</option>
            <option value="closed">Closed</option>
          </select>
          <input type="number" value={localFilters.amountMin || ''} onChange={(e) => update('amountMin', e.target.value)} style={{ ...inputStyle, width: 80 }} placeholder="Min Rs" />
          <input type="number" value={localFilters.amountMax || ''} onChange={(e) => update('amountMax', e.target.value)} style={{ ...inputStyle, width: 80 }} placeholder="Max Rs" />
        </div>
      }
    />
  );
}

const inputStyle = {
  padding: '6px 8px', borderRadius: 6, border: '1px solid var(--border)',
  fontSize: 12, background: 'var(--bg-surface)', color: 'var(--text-primary)', outline: 'none',
};
const selectStyle = {
  padding: '6px 8px', borderRadius: 6, border: '1px solid var(--border)',
  fontSize: 12, background: 'var(--bg-surface)', color: 'var(--text-primary)', outline: 'none', cursor: 'pointer',
};