import React from 'react'
import { useContent } from '../../hooks/useContent.js'
import { formatDateSeparator } from '../../utils/dateGrouping.js'
import { getPaymentStatusConfig, getPaymentMethodLabel } from '../../config/paymentRegistry.js'
import { api } from '../../services/api.js'
import WorkerInvoiceOverlay from '../reviews/WorkerInvoiceOverlay.jsx'
import config from '../../config/ui/configResolver.js'

export default function JobHistoryItem({ elementConfig, overrideData }) {
  const items = overrideData?.bookings || []
  const we = (config.worker).earnings || {}
  const showReward = elementConfig.content?.showRewardPoints === true
  const rewardRate = elementConfig.content?.rewardPointsRate || 0.1
  const emptyMsg = useContent('worker.noCompletedJobs', 'No completed jobs yet.')
  const [workerInvoiceBooking, setWorkerInvoiceBooking] = React.useState(null)

  if (items.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: we.empty?.padding || '40px', color: 'var(--text-secondary)' }}>
        {emptyMsg}
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      {items.map((item, idx) => {
        if (item.type === 'dateSeparator') {
          return (
            <div key={`sep-${idx}`} style={{ padding: '12px 16px 4px 16px', fontSize: 'var(--font-caption)', fontWeight: 600, color: 'var(--text-secondary)', borderBottom: '1px solid var(--border)' }}>
              {formatDateSeparator(item.date)}
            </div>
          )
        }
        const job = item
        const completedDate = job.updated_at ? new Date(job.updated_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : ''
        return (
          <div key={job.id} style={{ display: 'flex', flexDirection: 'column', padding: '10px 16px', borderBottom: '1px solid var(--border)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, flex: 1, minWidth: 0 }}>
                <span style={{ fontSize: 'var(--font-body-sm)', fontWeight: 600, color: 'var(--text-primary)' }}>#{job.id}</span>
                <span style={{ fontSize: 'var(--font-body)', fontWeight: 500, color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{job.service_name}</span>
              </div>
              <span style={{ fontSize: 'var(--font-body)', fontWeight: 700, color: 'var(--accent-green)', whiteSpace: 'nowrap', marginLeft: 8 }}>
                Rs {overrideData.paymentMap?.[job.id]?.final_total || job.price || 0}
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 4, fontSize: 'var(--font-body-sm)', color: 'var(--text-secondary)' }}>
              <span>{job.customer_client_id || '—'}</span>
              <span>{completedDate}</span>
              <span>{job.review_rating != null ? '★' + job.review_rating : ''}</span>
              {overrideData.paymentMap?.[job.id]?.status === 'paid' && (
                <span style={{ marginLeft: 'auto', fontSize: 'var(--font-caption)', fontWeight: 600, padding: '2px 8px', borderRadius: 'var(--radius-sm)', whiteSpace: 'nowrap', background: getPaymentStatusConfig('paid').badgeColor, color: getPaymentStatusConfig('paid').textColor }}>
                  Paid by {getPaymentMethodLabel(overrideData.paymentMap[job.id].method)}
                </span>
              )}
            </div>
            {overrideData.paymentMap?.[job.id]?.status !== 'paid' && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 8, flexWrap: 'wrap' }}>
                <span style={{ fontSize: 'var(--font-caption)', color: 'var(--accent-blue)', background: 'var(--accent-blue-light)', padding: '2px 8px', borderRadius: 'var(--radius-sm)', fontWeight: 500, whiteSpace: 'nowrap' }}>Completed</span>
                {overrideData.paymentMap?.[job.id] && (
                  <span style={{ fontSize: 'var(--font-caption)', fontWeight: 600, padding: '2px 8px', borderRadius: 'var(--radius-sm)', whiteSpace: 'nowrap', background: getPaymentStatusConfig(overrideData.paymentMap[job.id].status).badgeColor, color: getPaymentStatusConfig(overrideData.paymentMap[job.id].status).textColor }}>
                    {((status) => { const method = getPaymentMethodLabel(overrideData.paymentMap[job.id].method); if (status === 'pending_cash' || status === 'awaiting_cash_confirmation') return `Pay by ${method}`; return `${getPaymentStatusConfig(status).label} · ${method}`; })(overrideData.paymentMap[job.id].status)}
                  </span>
                )}
                {overrideData.paymentMap?.[job.id]?.status === 'unpaid' && (
                  <button onClick={() => setWorkerInvoiceBooking(job)} style={{ padding: '2px 10px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--accent-blue)', background: 'transparent', color: 'var(--accent-blue)', fontSize: 'var(--font-caption)', fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap' }}>View Invoice</button>
                )}
                {(overrideData.paymentMap?.[job.id]?.status === 'pending_cash' || overrideData.paymentMap?.[job.id]?.status === 'awaiting_cash_confirmation') && overrideData.paymentMap?.[job.id]?.method === 'cash' && (
                  <button onClick={() => api.markCashPaid(job.id).catch(err => alert(err.message))} style={{ padding: '2px 10px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--accent-green)', background: 'transparent', color: 'var(--accent-green)', fontSize: 'var(--font-caption)', fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap' }}>Confirm Cash Received</button>
                )}
              </div>
            )}
            {showReward && (
              <div style={{ marginTop: 4, fontSize: 'var(--font-caption)', color: 'var(--text-secondary)' }}>Reward Points: {Math.round((job.price || 0) * rewardRate)} pts</div>
            )}
          </div>
        )
      })}
      {workerInvoiceBooking && (
        <WorkerInvoiceOverlay payment={overrideData.paymentMap?.[workerInvoiceBooking.id]} booking={workerInvoiceBooking} onClose={() => setWorkerInvoiceBooking(null)} onConfirmed={() => setWorkerInvoiceBooking(null)} />
      )}
    </div>
  )
}