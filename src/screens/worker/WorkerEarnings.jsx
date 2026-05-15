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

    // Fetch ledger entries on mount and refresh on payment/booking updates
  const fetchLedger = () => {
    if (!profile?.id) return
    api.getWorkerLedgerEntries(profile.id)
      .then(res => {
        if (res?.success) setLedgerEntries(res.data || [])
      })
      .catch(() => {})
  }

  useEffect(() => {
    fetchLedger()
  }, [profile?.id])

  // Listen for socket events that affect earnings
  useEffect(() => {
    const socket = getSocket()
    if (!socket) return

    const handleRefresh = () => fetchLedger()

    socket.on('payment.updated', handleRefresh)
    socket.on('booking.updated', handleRefresh)

    return () => {
      socket.off('payment.updated', handleRefresh)
      socket.off('booking.updated', handleRefresh)
    }
  }, [profile?.id])

  // Normalize filter boundaries
  const now = new Date()
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const startOfWeek = new Date(now)
  startOfWeek.setDate(now.getDate() - now.getDay())
  startOfWeek.setHours(0, 0, 0, 0)
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)

  // Compute filtered ledger entries
  const filteredEntries = useMemo(() => {
    if (filter === 'statement') return ledgerEntries // show all for statement view
    return ledgerEntries.filter(entry => {
      const entryDate = new Date(entry.created_at)
      switch (filter) {
        case 'today': return entryDate >= startOfToday
        case 'week':  return entryDate >= startOfWeek
        case 'month': return entryDate >= startOfMonth
        default:      return true
      }
    })
  }, [ledgerEntries, filter])

  // Derive ALL financial metrics from filteredEntries
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

  // Show statement view when "Statement" filter is selected
  const showStatement = filter === 'statement'

  if (loading) {
    return <div style={{ textAlign: 'center', padding: 40, color: 'var(--text-secondary)' }}>Loading...</div>
  }

  const completedJobs = (bookings || []).filter(b => b.status === 'completed')
  const grouped = groupBookingsByCompletedDate(completedJobs)

  return (
    <div style={{ padding: '0 16px' }}>
      <ElementRenderer elementId="earningsHeading" overrideData={{}} />
      
      {/* Hero Card – dynamic from ledger */}
      <ElementRenderer elementId="earningsHeroCard" overrideData={{ earnings }} />

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

      {/* ── Statement View ── */}
      {showStatement && ledgerEntries.length > 0 && (
        <>
          {/* Summary Cards */}
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

      {/* ── Legacy Job History (shown for non-statement filters or empty ledger) ── */}
      {!showStatement && (
        <>
          <ElementRenderer elementId="earningsHistoryHeading" overrideData={{}} />
          <ElementRenderer elementId="earningsJobItem" overrideData={{ bookings: grouped, paymentMap }} />
        </>
      )}
      
      {/* Show empty state if statement selected but no ledger entries */}
      {showStatement && ledgerEntries.length === 0 && (
        <div style={{ textAlign: 'center', padding: 40, color: 'var(--text-secondary)', fontSize: 13 }}>
          No ledger entries yet. Complete and finalize jobs to see your financial statement.
        </div>
      )}
    </div>
  )
}