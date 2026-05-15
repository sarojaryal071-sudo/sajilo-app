import { useState, useEffect, useMemo } from 'react'
import { useWorker } from '../../contexts/WorkerContext.jsx'
import ElementRenderer from '../../components/ElementRenderer.jsx'
import { api } from '../../services/api.js'
import { groupBookingsByCompletedDate } from '../../utils/dateGrouping.js'
import { getSocket } from '../../services/realtime/socketClient'

const FILTERS = [
  { key: 'all', label: 'All' },
  { key: 'today', label: 'Today' },
  { key: 'week', label: 'This Week' },
  { key: 'month', label: 'This Month' },
  { key: 'statement', label: 'Statement' },
]

export default function WorkerEarnings() {
  const { profile, bookings, earnings, loading, paymentMap } = useWorker()
  const [filter, setFilter] = useState('all')
  const [ledgerEntries, setLedgerEntries] = useState([])
  const [dashboardMetrics, setDashboardMetrics] = useState(null)

  // ── Fetch ledger entries (for statement view) ──
  const fetchLedger = () => {
    if (!profile?.id) return
    api.getWorkerLedgerEntries(profile.id)
      .then(res => {
        if (res?.success) setLedgerEntries(res.data || [])
      })
      .catch(() => {})
  }

  // ── Fetch dashboard metrics (for operational filters) ──
  const fetchDashboardMetrics = () => {
    if (!profile?.id) return
    api.getWorkerDashboardMetrics()
      .then(res => {
        if (res?.success) setDashboardMetrics(res.data)
      })
      .catch(() => {})
  }

  useEffect(() => {
    fetchLedger()
    fetchDashboardMetrics()
  }, [profile?.id])

  // ── Socket listeners for real‑time refresh ──
  useEffect(() => {
    const socket = getSocket()
    if (!socket) return

    const handleRefresh = () => {
      fetchLedger()
      fetchDashboardMetrics()
    }

    socket.on('payment.updated', handleRefresh)
    socket.on('booking.updated', handleRefresh)

    return () => {
      socket.off('payment.updated', handleRefresh)
      socket.off('booking.updated', handleRefresh)
    }
  }, [profile?.id])

  // ── Derive hero card data from METRICS ENGINE based on filter ──
  const dm = dashboardMetrics
  const heroEarnings = useMemo(() => {
    if (!dm) return { total_earnings: earnings?.total_earnings || 0, completed_jobs: earnings?.completed_jobs || 0 }

    switch (filter) {
      case 'today':
        return {
          total_earnings: dm.today?.earnings || 0,
          completed_jobs: dm.today?.completedJobs || 0,
        }
      case 'week':
        return {
          total_earnings: dm.weekly?.totalEarnings || 0,
          completed_jobs: dm.lifetime?.completedJobs || 0,
        }
      case 'month':
        return {
          total_earnings: dm.monthly?.totalEarnings || 0,
          completed_jobs: dm.lifetime?.completedJobs || 0,
        }
      case 'statement':
      case 'all':
      default:
        return {
          total_earnings: dm.lifetime?.totalEarnings || earnings?.total_earnings || 0,
          completed_jobs: dm.lifetime?.completedJobs || earnings?.completed_jobs || 0,
        }
    }
  }, [dm, filter, earnings])

  // ── Ledger‑based calculations (only for statement view) ──
  const showStatement = filter === 'statement'

  const filteredEntries = useMemo(() => {
    if (!showStatement) return []
    return ledgerEntries
  }, [ledgerEntries, showStatement])

  const invoiced = filteredEntries
    .filter(e => e.event_type === 'invoice_finalized')
    .reduce((sum, e) => sum + parseFloat(e.amount || 0), 0)
  const collected = filteredEntries
    .filter(e => e.event_type === 'payment_confirmed')
    .reduce((sum, e) => sum + parseFloat(e.amount || 0), 0)
  const commission = filteredEntries
    .filter(e => e.event_type === 'invoice_finalized')
    .reduce((sum, e) => sum + parseFloat(e.metadata?.commission_amount || 0), 0)
  const settled = filteredEntries
    .filter(e => e.event_type === 'settlement_recorded')
    .reduce((sum, e) => sum + parseFloat(e.amount || 0), 0)
  const netEarnings = collected - commission
  const outstandingDues = commission - settled

  // ── Operational KPI cards (metrics engine) ──
  const operationalKPIs = useMemo(() => {
    if (!dm) return []
    const data = filter === 'today' ? dm.today
      : filter === 'week' ? { earnings: dm.weekly?.totalEarnings, completedJobs: dm.lifetime?.completedJobs }
      : filter === 'month' ? { earnings: dm.monthly?.totalEarnings, completedJobs: dm.lifetime?.completedJobs }
      : { earnings: dm.lifetime?.totalEarnings, completedJobs: dm.lifetime?.completedJobs }

    return [
      { label: 'Earnings', value: `Rs ${(data?.earnings || 0).toLocaleString()}`, color: 'var(--accent-blue)' },
      { label: 'Jobs Done', value: data?.completedJobs || 0, color: 'var(--accent-green)' },
    ]
  }, [dm, filter])


      // Normalize filter boundaries (used by job history filtering)
  const now = new Date()
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const startOfWeek = new Date(now)
  startOfWeek.setDate(now.getDate() - now.getDay())
  startOfWeek.setHours(0, 0, 0, 0)
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)

  
  // ── Filter completed jobs based on selected period ──
  const completedJobs = (bookings || []).filter(b => b.status === 'completed')

  const filteredBookings = useMemo(() => {
    if (showStatement) return [] // statement uses ledger rows, not bookings
    if (filter === 'all') return completedJobs

    return completedJobs.filter(b => {
      // Use payment confirmation date if available, else job completion date
      const payment = paymentMap?.[b.id]
      const dateStr = payment?.paid_at || b.updated_at || b.created_at
      if (!dateStr) return false
      const date = new Date(dateStr)

      switch (filter) {
        case 'today': return date >= startOfToday
        case 'week':  return date >= startOfWeek
        case 'month': return date >= startOfMonth
        default:      return true
      }
    })
  }, [completedJobs, paymentMap, filter, showStatement, startOfToday, startOfWeek, startOfMonth])

  // ── Financial Overview (ledger‑derived, follows active filter) ──
  const financialOverviewEntries = useMemo(() => {
    if (showStatement) return ledgerEntries
    if (filter === 'all') return ledgerEntries
    return ledgerEntries.filter(entry => {
      const entryDate = new Date(entry.created_at)
      switch (filter) {
        case 'today': return entryDate >= startOfToday
        case 'week':  return entryDate >= startOfWeek
        case 'month': return entryDate >= startOfMonth
        default:      return true
      }
    })
  }, [ledgerEntries, filter, showStatement, startOfToday, startOfWeek, startOfMonth])

  const overviewInvoiced = financialOverviewEntries
    .filter(e => e.event_type === 'invoice_finalized')
    .reduce((sum, e) => sum + parseFloat(e.amount || 0), 0)
  const overviewCollected = financialOverviewEntries
    .filter(e => e.event_type === 'payment_confirmed')
    .reduce((sum, e) => sum + parseFloat(e.amount || 0), 0)
  const overviewCommission = financialOverviewEntries
    .filter(e => e.event_type === 'invoice_finalized')
    .reduce((sum, e) => sum + parseFloat(e.metadata?.commission_amount || 0), 0)
  const overviewSettled = financialOverviewEntries
    .filter(e => e.event_type === 'settlement_recorded')
    .reduce((sum, e) => sum + parseFloat(e.amount || 0), 0)
  const overviewNet = overviewCollected - overviewCommission
  const overviewDues = overviewCommission - overviewSettled

  if (loading) {
    return <div style={{ textAlign: 'center', padding: 40, color: 'var(--text-secondary)' }}>Loading...</div>
  }

  const grouped = groupBookingsByCompletedDate(filteredBookings)

  return (
    <div style={{ padding: '0 16px' }}>
      <ElementRenderer elementId="earningsHeading" overrideData={{}} />

      {/* Hero Card – metrics engine driven + ledger financial overview */}
      <ElementRenderer
        elementId="earningsHeroCard"
        overrideData={{
          earnings: heroEarnings,
          financialOverview: !showStatement && ledgerEntries.length > 0 ? {
            invoiced: overviewInvoiced,
            collected: overviewCollected,
            commission: overviewCommission,
            net: overviewNet,
            dues: overviewDues,
          } : null,
        }}
      />

      {/* ── Filter Buttons ── */}
      <div style={{ display: 'flex', gap: 6, marginBottom: 16, overflowX: 'auto' }}>
        {FILTERS.map(f => (
          <button key={f.key} onClick={() => setFilter(f.key)} style={{
            padding: '6px 14px', borderRadius: 20, border: '1px solid var(--border)',
            background: filter === f.key ? 'var(--accent-blue)' : 'transparent',
            color: filter === f.key ? '#fff' : 'var(--text-secondary)',
            fontSize: 12, fontWeight: 500, cursor: 'pointer', whiteSpace: 'nowrap',
          }}>{f.label}</button>
        ))}
      </div>


      {/* ── Statement View (ledger‑driven) ── */}
      {showStatement && ledgerEntries.length > 0 && (
        <>
          {/* Ledger Summary Cards */}
          <div style={{
            display: 'grid', gridTemplateColumns: '1fr 1fr',
            gap: 8, marginBottom: 16,
          }}>
            {[
              { label: 'Invoiced', value: `Rs ${invoiced.toLocaleString()}`, color: 'var(--accent-blue)' },
              { label: 'Collected', value: `Rs ${collected.toLocaleString()}`, color: 'var(--accent-green)' },
              { label: 'Commission', value: `Rs ${commission.toLocaleString()}`, color: 'var(--accent-orange)' },
              { label: 'Net Earnings', value: `Rs ${netEarnings.toLocaleString()}`, color: 'var(--text-primary)' },
            ].map(s => (
              <div key={s.label} style={{
                background: 'var(--bg-surface)', borderRadius: 8, padding: '10px 14px',
                border: '1px solid var(--border)', textAlign: 'center',
              }}>
                <div style={{ fontSize: 10, color: 'var(--text-secondary)', marginBottom: 2 }}>{s.label}</div>
                <div style={{ fontSize: 14, fontWeight: 700, color: s.color }}>{s.value}</div>
              </div>
            ))}
          </div>

          {/* Outstanding Dues */}
          <div style={{
            background: 'var(--bg-surface)', borderRadius: 8, padding: '10px 14px',
            border: '1px solid var(--border)', marginBottom: 16, display: 'flex',
            justifyContent: 'space-between', alignItems: 'center',
          }}>
            <div>
              <div style={{ fontSize: 10, color: 'var(--text-secondary)' }}>Outstanding Dues</div>
              <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
                Commission: Rs {commission.toLocaleString()} · Settled: Rs {settled.toLocaleString()}
              </div>
            </div>
            <div style={{ fontSize: 14, fontWeight: 700, color: outstandingDues > 0 ? 'var(--accent-red)' : 'var(--accent-green)' }}>
              Rs {outstandingDues.toLocaleString()}
            </div>
          </div>

          {/* Statement Rows */}
          <div style={{ marginBottom: 20 }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 10 }}>
              📋 Statement
            </div>
            {filteredEntries.map((entry, i) => (
              <div key={entry.id || i} style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                padding: '10px 0', borderBottom: '1px solid var(--border)', fontSize: 12,
              }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, color: 'var(--text-primary)', textTransform: 'capitalize' }}>
                    {entry.event_type?.replace(/_/g, ' ')}
                  </div>
                  <div style={{ fontSize: 10, color: 'var(--text-secondary)' }}>
                    {entry.created_at ? new Date(entry.created_at).toLocaleDateString() : ''}
                    {entry.metadata?.payment_method ? ` · via ${entry.metadata.payment_method}` : ''}
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontWeight: 700, color: entry.event_type === 'invoice_finalized' ? 'var(--accent-blue)' : entry.event_type === 'payment_confirmed' ? 'var(--accent-green)' : 'var(--text-secondary)' }}>
                    {entry.event_type === 'settlement_recorded' ? '-' : '+'} Rs {parseFloat(entry.amount || 0).toLocaleString()}
                  </div>
                  {entry.metadata?.commission_amount && (
                    <div style={{ fontSize: 10, color: 'var(--accent-orange)' }}>
                      Commission: Rs {parseFloat(entry.metadata.commission_amount).toLocaleString()}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* ── Legacy Job History (non‑statement filters) ── */}
      {!showStatement && (
        <>
          <ElementRenderer elementId="earningsHistoryHeading" overrideData={{}} />
          <ElementRenderer elementId="earningsJobItem" overrideData={{ bookings: grouped, paymentMap }} />
        </>
      )}

      {/* Empty state for statement when no ledger entries */}
      {showStatement && ledgerEntries.length === 0 && (
        <div style={{ textAlign: 'center', padding: 40, color: 'var(--text-secondary)', fontSize: 13 }}>
          No ledger entries yet. Complete and finalize jobs to see your financial statement.
        </div>
      )}
    </div>
  )
}