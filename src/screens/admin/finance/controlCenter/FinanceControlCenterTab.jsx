import ControlHealthOverview from './ControlHealthOverview';
import RiskScorePanel from './RiskScorePanel';
import AnomalyFeedPanel from './AnomalyFeedPanel';
import AlertsManagementPanel from './AlertsManagementPanel';
import ReconciliationStatusPanel from './ReconciliationStatusPanel';
import CashFlowRiskPanel from './CashFlowRiskPanel';
import AuditIntegrityPanel from './AuditIntegrityPanel';
import SystemDiagnosticsPanel from './SystemDiagnosticsPanel';

export default function FinanceControlCenterTab() {
  return (
    <div>
      <ControlHealthOverview />
      <RiskScorePanel />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <AnomalyFeedPanel />
        <AlertsManagementPanel />
      </div>
      <ReconciliationStatusPanel />
      <CashFlowRiskPanel />
      <AuditIntegrityPanel />
      <SystemDiagnosticsPanel />
    </div>
  );
}