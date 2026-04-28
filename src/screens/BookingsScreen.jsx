import { useState } from 'react'
import { workers } from '../config/data.js'

export default function BookingsScreen({ navigate, t }) {
  const [stars, setStars] = useState(0)
  const [rated, setRated] = useState(false)
  const [showForm, setShowForm] = useState(false)

  return (
    <div>
      <h2 style={{ fontSize: 'var(--font-heading)', fontWeight: 700, color: 'var(--text-primary)', marginBottom: 20 }}>
        {t.myBookings}
      </h2>

      {/* Active */}
      <div style={{
        background: 'var(--bg-surface)', border: '1px solid var(--border)',
        borderRadius: 'var(--radius-lg)', padding: 16, marginBottom: 12,
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
          <span style={{ fontSize: 'var(--font-body-lg)', fontWeight: 600, color: 'var(--text-primary)' }}>
            ⚡ Electrician - Medium Job
          </span>
          <span style={{
            fontSize: 'var(--font-caption)', fontWeight: 700, padding: '3px 9px', borderRadius: 20,
            background: 'var(--accent-blue-light)', color: 'var(--accent-blue)',
          }}>{t.active}</span>
        </div>
        <div style={{ display: 'flex', gap: 16, fontSize: 'var(--font-body-sm)', color: 'var(--text-secondary)', marginBottom: 12 }}>
          <span>👷 {workers[0]?.name || 'Worker'}</span>
          <span>📍 {workers[0]?.location || 'Nepal'}</span>
          <span>⏱ 12 min ETA</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 10, borderTop: '1px solid var(--border)' }}>
          <span style={{ fontSize: 'var(--font-title)', fontWeight: 700, color: 'var(--text-primary)' }}>Rs 1500-4000</span>
          <button onClick={() => navigate(`/tracking/${workers[0]?.id}`)} style={{
            fontSize: 'var(--font-body-sm)', fontWeight: 600, color: 'var(--accent-blue)',
            background: 'none', border: 'none', cursor: 'pointer',
          }}>{t.track}</button>
        </div>
      </div>

      {/* Scheduled */}
      <div style={{
        background: 'var(--bg-surface)', border: '1px solid var(--border)',
        borderRadius: 'var(--radius-lg)', padding: 16, marginBottom: 12,
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
          <span style={{ fontSize: 'var(--font-body-lg)', fontWeight: 600, color: 'var(--text-primary)' }}>
            🧹 Home Cleaning - 3h
          </span>
          <span style={{
            fontSize: 'var(--font-caption)', fontWeight: 700, padding: '3px 9px', borderRadius: 20,
            background: 'var(--accent-orange-light)', color: 'var(--accent-orange)',
          }}>{t.scheduled}</span>
        </div>
        <div style={{ display: 'flex', gap: 16, fontSize: 'var(--font-body-sm)', color: 'var(--text-secondary)', marginBottom: 12 }}>
          <span>👩 {workers[2]?.name || 'Worker'}</span>
          <span>📅 Tomorrow 10:00 AM</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 10, borderTop: '1px solid var(--border)' }}>
          <span style={{ fontSize: 'var(--font-title)', fontWeight: 700, color: 'var(--text-primary)' }}>Rs 2500</span>
          <button onClick={() => navigate(`/detail/${workers[2]?.id}`)} style={{
            fontSize: 'var(--font-body-sm)', fontWeight: 600, color: 'var(--accent-blue)',
            background: 'none', border: 'none', cursor: 'pointer',
          }}>{t.manage}</button>
        </div>
      </div>

      {/* Completed */}
      <div style={{
        background: 'var(--bg-surface)', border: '1px solid var(--border)',
        borderRadius: 'var(--radius-lg)', padding: 16, marginBottom: 12,
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
          <span style={{ fontSize: 'var(--font-body-lg)', fontWeight: 600, color: 'var(--text-primary)' }}>
            🔧 Plumber - Leak Fix
          </span>
          <span style={{
            fontSize: 'var(--font-caption)', fontWeight: 700, padding: '3px 9px', borderRadius: 20,
            background: 'var(--accent-green-light)', color: 'var(--accent-green)',
          }}>{t.completed}</span>
        </div>
        <div style={{ display: 'flex', gap: 16, fontSize: 'var(--font-body-sm)', color: 'var(--text-secondary)', marginBottom: 12 }}>
          <span>👨 {workers[1]?.name || 'Worker'}</span>
          <span>📅 Yesterday</span>
        </div>

        {!showForm && !rated && (
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 10, borderTop: '1px solid var(--border)' }}>
            <span style={{ fontSize: 'var(--font-title)', fontWeight: 700, color: 'var(--text-primary)' }}>Rs 1800</span>
            <button onClick={() => setShowForm(true)} style={{
              fontSize: 'var(--font-body-sm)', fontWeight: 600, color: 'var(--accent-blue)',
              background: 'none', border: 'none', cursor: 'pointer',
            }}>{t.rateWorker}</button>
          </div>
        )}

        {showForm && !rated && (
          <div style={{ marginTop: 12, borderTop: '1px solid var(--border)', paddingTop: 12 }}>
            <div style={{ fontSize: 'var(--font-body-sm)', fontWeight: 600, color: 'var(--text-primary)', marginBottom: 8 }}>
              {t.howWas} {workers[1]?.name || 'the worker'}?
            </div>
            <div style={{ display: 'flex', gap: 6, marginBottom: 12 }}>
              {[1, 2, 3, 4, 5].map(n => (
                <span key={n} onClick={() => setStars(n)} style={{
                  fontSize: 26, cursor: 'pointer', opacity: stars >= n ? 1 : 0.22,
                }}>★</span>
              ))}
            </div>
            <button onClick={() => stars && setRated(true)} style={{
              padding: '9px 16px', background: 'var(--accent-blue)', color: '#fff',
              border: 'none', borderRadius: 'var(--radius-sm)', fontSize: 'var(--font-body)',
              fontWeight: 600, cursor: 'pointer',
            }}>{t.submitRating}</button>
          </div>
        )}

        {rated && (
          <div style={{ marginTop: 10, fontSize: 'var(--font-body)', color: 'var(--accent-green)', fontWeight: 600, padding: '8px 0' }}>
            ✓ {t.thanksRating} {stars} {t.stars}
          </div>
        )}
      </div>
    </div>
  )
}