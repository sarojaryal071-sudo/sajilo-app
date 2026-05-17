import { ListRow, EmptyRow } from '../FinanceComponents';
import { FinanceSectionCard } from '../../../../components/admin/finance/index.js';

export default function FinanceSettlementsTab({ workerDues, onSettle }) {
  if (!workerDues) {
    return (
      <div style={{ textAlign: 'center', padding: 40, color: 'var(--text-secondary)' }}>
        No commission data available.
      </div>
    );
  }

  return (
    <FinanceSectionCard title="Worker Commission Dues">
      {workerDues.length === 0 ? (
        <EmptyRow text="No commission dues recorded yet" />
      ) : (
        workerDues.slice(0, 10).map((w, i) => (
          <ListRow
            key={w.workerId}
            rank={i + 1}
            left={w.workerName || w.workerClientId}
            right={
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span>Rs {(w.balanceDue || 0).toLocaleString()} due</span>
                {w.balanceDue > 0 && (
                  <button
                    onClick={() => onSettle({ workerId: w.workerId, workerName: w.workerName || w.workerClientId })}
                    style={{
                      padding: '2px 8px',
                      borderRadius: 4,
                      border: '1px solid var(--accent-green)',
                      background: 'transparent',
                      color: 'var(--accent-green)',
                      fontSize: 10,
                      fontWeight: 600,
                      cursor: 'pointer',
                    }}
                  >
                    Settle
                  </button>
                )}
              </div>
            }
            sub={`Gross: Rs ${(w.grossEarnings || 0).toLocaleString()} · Commission: Rs ${(w.commissionOwed || 0).toLocaleString()} · Paid: Rs ${(w.commissionPaid || 0).toLocaleString()}`}
          />
        ))
      )}
    </FinanceSectionCard>
  );
}