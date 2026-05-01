import { useState } from 'react'
import { services, workers } from '../config/data.js'
import WorkerCard from './WorkerCard.jsx'
import { useIsMobile } from '../hooks/useIsMobile.js'
import { useContent } from '../hooks/useContent.js'
import { useStyle } from '../hooks/useStyle.js'

export default function HomeCategoryController({ categoryId, onClose }) {
  const [selectedWorker, setSelectedWorker] = useState(null)
  const isMobile = useIsMobile()

  const category = services.find(s => s.id === categoryId)
  const approvedWorkers = workers.filter(
    w => w.approved && w.status === 'active' && w.role?.toLowerCase() === category?.name?.toLowerCase()
  )

  const txt = {
    back: useContent('home.back'),
    noWorkers: useContent('home.noWorkers'),
    book: useContent('detail.book'),
    workersTitle: useContent('home.nearbyWorkers'),
    role: useContent('home.worker.role') || 'Role',
    location: useContent('home.worker.location') || 'Location',
    rating: useContent('home.worker.rating') || 'Rating',
    swipeClose: useContent('home.swipeClose'),
  }

  const titleStyle = useStyle('homeSectionTitle')

  // Worker Detail View
    if (selectedWorker) {
    return (
      <div style={{
        position: 'fixed', inset: 0, zIndex: 500,
        background: 'var(--bg-primary)', overflowY: 'auto',
        padding: 20,
        ...(isMobile ? {} : { left: '50%', maxWidth: 560, borderLeft: '1px solid var(--border)' }),
      }}>
        <button onClick={() => setSelectedWorker(null)} style={{
          background: 'var(--bg-surface2)', border: '1px solid var(--border)',
          borderRadius: 'var(--radius-sm)', cursor: 'pointer',
          fontSize: 'var(--font-body)', color: 'var(--text-secondary)',
          marginBottom: 16, fontWeight: 500, padding: '6px 14px',
        }}>← {txt.back}</button>

        {/* Compact detail card */}
        <div style={{
          background: 'var(--bg-surface)', borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--border)', padding: 20, maxWidth: 480, margin: '0 auto',
        }}>
          {/* Top: Avatar + Name + Rating */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 16 }}>
            <div style={{
              width: 64, height: 64, borderRadius: '50%',
              background: selectedWorker.bg || '#EBF3FF',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 28, fontWeight: 700, color: 'var(--text-primary)',
              flexShrink: 0,
            }}>
              {selectedWorker.name.split(' ').map(n => n[0]).join('')}
            </div>
            <div>
              <div style={{ fontSize: 'var(--font-body-lg)', fontWeight: 700, color: 'var(--text-primary)' }}>
                {selectedWorker.name}
              </div>
              <div style={{ fontSize: 'var(--font-body-sm)', color: 'var(--text-secondary)', marginTop: 2 }}>
                ⭐ {selectedWorker.rating} · {selectedWorker.role}
              </div>
              <div style={{ fontSize: 'var(--font-body-sm)', color: 'var(--accent-green)', fontWeight: 600, marginTop: 2 }}>
                ● Available
              </div>
            </div>
          </div>

          {/* Info grid */}
          <div style={{
            display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 16,
            fontSize: 'var(--font-body-sm)', color: 'var(--text-secondary)',
          }}>
            <div><strong style={{ color: 'var(--text-primary)' }}>📍</strong> {selectedWorker.location}</div>
            <div><strong style={{ color: 'var(--text-primary)' }}>📧</strong> {selectedWorker.email || '—'}</div>
            <div><strong style={{ color: 'var(--text-primary)' }}>📱</strong> {selectedWorker.phone || '—'}</div>
            <div><strong style={{ color: 'var(--text-primary)' }}>✅</strong> {selectedWorker.completed_jobs || 0} jobs done</div>
          </div>

          {/* Action buttons */}
          <div style={{ display: 'flex', gap: 10 }}>
            <button style={{
              flex: 1, padding: '10px 0', borderRadius: 'var(--radius-md)',
              border: '1px solid var(--accent-blue)', background: 'transparent',
              color: 'var(--accent-blue)', fontSize: 'var(--font-body-sm)', fontWeight: 600, cursor: 'pointer',
            }}>
              💬 Message
            </button>
            <button style={{
              flex: 1, padding: '10px 0', borderRadius: 'var(--radius-md)',
              border: 'none', background: 'var(--accent-orange)',
              color: '#fff', fontSize: 'var(--font-body-sm)', fontWeight: 600, cursor: 'pointer',
            }}>
              {txt.book}
            </button>
          </div>
        </div>
      </div>
    )
  }

  // Category Worker List
  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 500,
      background: 'var(--bg-primary)', overflowY: 'auto',
      padding: 20,
      ...(isMobile ? {} : { left: 'auto', right: 0, width: '50%', maxWidth: 600, borderLeft: '1px solid var(--border)', boxShadow: '-4px 0 24px rgba(0,0,0,0.08)' }),
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20, ...(isMobile ? { paddingTop: 10 } : {}) }}>
        <button onClick={onClose} style={{
          background: 'var(--bg-surface2)', border: '1px solid var(--border)',
          borderRadius: 'var(--radius-sm)', cursor: 'pointer',
          fontSize: 'var(--font-body)', color: 'var(--text-secondary)',
          fontWeight: 500, padding: '6px 14px',
        }}>← {txt.back}</button>
        <h3 style={{ ...titleStyle, margin: 0 }}>
          {category?.icon} {category?.name} — {txt.workersTitle}
        </h3>
      </div>

      {isMobile && (
        <div style={{ textAlign: 'center', marginBottom: 12 }}>
          <div style={{ width: 40, height: 4, borderRadius: 2, background: 'var(--border)', margin: '0 auto 8px' }} />
          <span style={{ fontSize: 10, color: 'var(--text-secondary)' }}>{txt.swipeClose || 'Swipe down to close'}</span>
        </div>
      )}

      {approvedWorkers.length === 0 ? (
        <div style={{ textAlign: 'center', padding: 60, color: 'var(--text-secondary)' }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>👷</div>
          <p>{txt.noWorkers}</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, 1fr)', gap: 12 }}>
          {approvedWorkers.map(worker => (
            <div key={worker.id} onClick={() => setSelectedWorker(worker)} style={{ cursor: 'pointer' }}>
              <WorkerCard worker={worker} />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}