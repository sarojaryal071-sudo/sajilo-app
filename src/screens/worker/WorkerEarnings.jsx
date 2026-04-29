import { useState, useEffect } from 'react'
import { api } from '../../services/api.js'

export default function WorkerEarnings() {
  const [earnings, setEarnings] = useState(null)
  const [bookings, setBookings] = useState([])

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      const [earnRes, bookRes] = await Promise.all([
        api.getWorkerEarnings(),
        api.getWorkerBookings(),
      ])
      setEarnings(earnRes.data)
      setBookings(bookRes.data || [])
    } catch (err) {
      console.error('Failed to load earnings:', err)
    }
  }

  if (!earnings) {
    return <div style={{ textAlign: 'center', padding: 40, color: 'var(--text-secondary)' }}>Loading...</div>
  }

  const completedJobs = bookings.filter(b => b.status === 'completed')

  return (
    <div>
      <h2 style={{ fontSize: 'var(--font-heading)', fontWeight: 700, color: 'var(--text-primary)', marginBottom: 20 }}>
        Earnings
      </h2>

      <div style={{
        background: 'linear-gradient(135deg, var(--accent-blue), #1A56DB)',
        borderRadius: 'var(--radius-lg)', padding: 24, marginBottom: 20,
        color: '#fff',
      }}>
        <div style={{ fontSize: 'var(--font-body-sm)', opacity: 0.8, marginBottom: 4 }}>Total Earnings</div>
        <div style={{ fontSize: 'var(--font-xxl)', fontWeight: 800 }}>
          Rs {earnings.total_earnings?.toLocaleString() || 0}
        </div>
        <div style={{ fontSize: 'var(--font-body-sm)', opacity: 0.8, marginTop: 8 }}>
          {earnings.completed_jobs || 0} completed jobs
        </div>
      </div>

      <h3 style={{ fontSize: 'var(--font-title)', fontWeight: 700, color: 'var(--text-primary)', marginBottom: 12 }}>
        Job History
      </h3>

      {completedJobs.length === 0 ? (
        <div style={{ textAlign: 'center', padding: 40, color: 'var(--text-secondary)' }}>
          No completed jobs yet.
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {completedJobs.map((job) => (
            <div key={job.id} style={{
              background: 'var(--bg-surface)', border: '1px solid var(--border)',
              borderRadius: 'var(--radius-md)', padding: 12,
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            }}>
              <div>
                <div style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: 'var(--font-body)' }}>
                  {job.service_name}
                </div>
                <div style={{ fontSize: 'var(--font-body-sm)', color: 'var(--text-secondary)' }}>
                  {job.customer_name} · {job.job_size}
                </div>
              </div>
              <div style={{
                fontSize: 'var(--font-body)', fontWeight: 700,
                color: 'var(--accent-green)',
              }}>
                Rs {job.price || 0}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}