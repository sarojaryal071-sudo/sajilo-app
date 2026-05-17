const STATUS_COLORS = {
  pending:   { bg: '#fef3c7', text: '#92400e', border: '#f59e0b' },
  approved:  { bg: '#dcfce7', text: '#166534', border: '#16a34a' },
  paid:      { bg: '#dbeafe', text: '#1e40af', border: '#2563eb' },
  closed:    { bg: '#f3f4f6', text: '#374151', border: '#6b7280' },
  healthy:   { bg: '#dcfce7', text: '#166534', border: '#16a34a' },
  warning:   { bg: '#fef3c7', text: '#92400e', border: '#f59e0b' },
  critical:  { bg: '#fee2e2', text: '#991b1b', border: '#dc2626' },
  success:   { bg: '#dcfce7', text: '#166534', border: '#16a34a' },
  failed:    { bg: '#fee2e2', text: '#991b1b', border: '#dc2626' },
  active:    { bg: '#dcfce7', text: '#166534', border: '#16a34a' },
  inactive:  { bg: '#f3f4f6', text: '#374151', border: '#6b7280' },
  suspended: { bg: '#fee2e2', text: '#991b1b', border: '#dc2626' },
  draft:     { bg: '#f3f4f6', text: '#374151', border: '#6b7280' },
};

export default function FinanceStatusPill({ status, label }) {
  const colors = STATUS_COLORS[status?.toLowerCase()] || { bg: '#f3f4f6', text: '#374151', border: '#6b7280' };
  const display = label || status;

  return (
    <span style={{
      display: 'inline-block',
      padding: '2px 10px',
      borderRadius: 12,
      fontSize: 11,
      fontWeight: 600,
      background: colors.bg,
      color: colors.text,
      border: `1px solid ${colors.border}`,
      whiteSpace: 'nowrap',
    }}>
      {display}
    </span>
  );
}