import { useState, useEffect } from 'react';
import { API_URL } from '../../../../services/api.js';
import FinanceSectionCard from '../../../../components/admin/finance/FinanceSectionCard';
import FinanceStatusPill from '../../../../components/admin/finance/FinanceStatusPill';
import FinanceLoadingState from '../../../../components/admin/finance/FinanceLoadingState';
import FinanceEmptyState from '../../../../components/admin/finance/FinanceEmptyState';

export default function AlertsManagementPanel() {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem('sajilo_token');
  const headers = { Authorization: `Bearer ${token}` };

  const fetchAlerts = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/admin/control/alerts`, { headers }).then(r => r.json());
      if (res.success) setAlerts(res.data || []);
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  useEffect(() => { fetchAlerts(); }, []);

  const acknowledge = async (id) => {
    await fetch(`${API_URL}/admin/control/alerts/acknowledge/${id}`, { method: 'POST', headers }).then(r => r.json());
    fetchAlerts();
  };

  if (loading) return <FinanceLoadingState text="Loading alerts..." />;
  if (alerts.length === 0) {
    return (
      <FinanceSectionCard title="Active Alerts">
        <FinanceEmptyState icon="🔔" title="No active alerts" description="All clear." />
      </FinanceSectionCard>
    );
  }

  return (
    <FinanceSectionCard title={`Active Alerts (${alerts.length})`}>
      {alerts.slice(0, 10).map(a => (
        <div key={a.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '6px 0', borderBottom: '1px solid var(--border)' }}>
          <div>
            <FinanceStatusPill status={a.severity === 'HIGH' ? 'critical' : a.severity === 'MEDIUM' ? 'warning' : 'active'} label={a.title} />
            <span style={{ marginLeft: 8, fontSize: 12, color: 'var(--text-primary)' }}>{a.description}</span>
          </div>
          <button
            onClick={() => acknowledge(a.id)}
            style={{
              padding: '2px 10px', borderRadius: 4, border: '1px solid var(--border)',
              background: 'var(--bg-surface2)', color: 'var(--text-secondary)', fontSize: 11, cursor: 'pointer'
            }}
          >
            Acknowledge
          </button>
        </div>
      ))}
    </FinanceSectionCard>
  );
}