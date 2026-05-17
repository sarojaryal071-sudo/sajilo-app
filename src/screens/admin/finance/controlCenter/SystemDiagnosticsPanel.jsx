import FinanceSectionCard from '../../../../components/admin/finance/FinanceSectionCard';

export default function SystemDiagnosticsPanel() {
  // Static/system diagnostic – can be extended with API calls
  return (
    <FinanceSectionCard title="System Diagnostics">
      <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', fontSize: 12 }}>
        <div>
          <strong>API Status:</strong> <span style={{ color: 'var(--accent-green)' }}>Online</span>
        </div>
        <div>
          <strong>Finance Module:</strong> <span style={{ color: 'var(--accent-green)' }}>Active</span>
        </div>
        <div>
          <strong>Last Sync:</strong> {new Date().toLocaleTimeString()}
        </div>
      </div>
    </FinanceSectionCard>
  );
}