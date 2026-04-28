import { useState } from 'react'
import { workers } from '../config/data.js'

const steps = [
  { key: 'accepted', label: 'Accepted' },
  { key: 'onway', label: 'On the way' },
  { key: 'working', label: 'Working' },
  { key: 'done', label: 'Done' },
]

export default function TrackingScreen({ navigate, workerId, previousTab }) {
  const [currentStep, setCurrentStep] = useState(1)
  const worker = workers.find(w => w.id === workerId)

  if (!worker) {
    return (
      <div style={{ textAlign: 'center', padding: 40 }}>
        <p style={{ color: 'var(--text-secondary)' }}>No active tracking found.</p>
        <button onClick={() => navigate('home')} style={{
          marginTop: 16,
          padding: '8px 16px',
          borderRadius: 'var(--radius-sm)',
          border: '1px solid var(--border)',
          background: 'var(--bg-surface2)',
          color: 'var(--accent-blue)',
          cursor: 'pointer',
        }}>
          ← Back to Home
        </button>
      </div>
    )
  }

  return (
    <div style={{ maxWidth: 720, margin: '0 auto' }}>
      {/* Title */}
      <h2 style={{
        fontSize: 'var(--font-heading)',
        fontWeight: 700,
        color: 'var(--text-primary)',
        marginBottom: 20,
      }}>
        Live Tracking
      </h2>

      {/* Map Placeholder */}
      <div style={{
        height: 190,
        background: 'linear-gradient(180deg, #D8E9F7, #C5DCF0)',
        borderRadius: 'var(--radius-lg)',
        marginBottom: 20,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div style={{
          width: 44,
          height: 44,
          background: 'var(--accent-blue)',
          borderRadius: '50%',
          border: '3px solid #fff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 20,
          zIndex: 2,
          animation: 'pulse 2s ease-in-out infinite',
        }}>
          {worker.name.split(' ').map(n => n[0]).join('')}
        </div>
        <span style={{ position: 'absolute', bottom: 28, right: 80, fontSize: 24 }}>📍</span>
        <style>{`@keyframes pulse{0%,100%{box-shadow:0 0 0 0 rgba(26,111,212,.3)}50%{box-shadow:0 0 0 16px rgba(26,111,212,0)}}`}</style>
      </div>

      {/* ETA */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 16,
        marginBottom: 20,
      }}>
        <div>
          <div style={{
            fontSize: 'var(--font-xl)',
            fontWeight: 800,
            color: 'var(--text-primary)',
          }}>
            {worker.eta}
          </div>
          <div style={{
            fontSize: 'var(--font-body)',
            color: 'var(--text-secondary)',
          }}>
            {worker.name} is on the way
          </div>
        </div>
        <div style={{
          background: 'var(--accent-blue-light)',
          color: 'var(--accent-blue)',
          fontSize: 'var(--font-body-sm)',
          fontWeight: 700,
          padding: '5px 12px',
          borderRadius: 20,
        }}>
          On the way
        </div>
      </div>

      {/* Progress Steps */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 20,
        position: 'relative',
      }}>
        <div style={{
          position: 'absolute',
          top: 14,
          left: '5%',
          right: '5%',
          height: 2,
          background: 'var(--border)',
          zIndex: 0,
        }} />
        <div style={{
          position: 'absolute',
          top: 14,
          left: '5%',
          width: `${(currentStep / (steps.length - 1)) * 90}%`,
          height: 2,
          background: 'var(--accent-blue)',
          zIndex: 1,
        }} />

        {steps.map((step, i) => (
          <div key={step.key} style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 6,
            position: 'relative',
            zIndex: 2,
          }}>
            <div style={{
              width: 28,
              height: 28,
              borderRadius: '50%',
              background: i < currentStep ? 'var(--accent-blue)' : i === currentStep ? '#fff' : 'var(--bg-surface2)',
              border: `2px solid ${i <= currentStep ? 'var(--accent-blue)' : 'var(--border)'}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 11,
              fontWeight: 600,
              color: i < currentStep ? '#fff' : i === currentStep ? 'var(--accent-blue)' : 'var(--text-secondary)',
              boxShadow: i === currentStep ? '0 0 0 5px var(--accent-blue-light)' : 'none',
            }}>
              {i < currentStep ? '✓' : i === currentStep ? '▶' : i + 1}
            </div>
            <div style={{
              fontSize: 'var(--font-caption)',
              color: 'var(--text-secondary)',
              textAlign: 'center',
              maxWidth: 60,
            }}>
              {step.label}
            </div>
          </div>
        ))}
      </div>

      {/* Worker Info */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        background: 'var(--bg-surface2)',
        borderRadius: 'var(--radius-md)',
        padding: 14,
        marginBottom: 14,
      }}>
        <div style={{
          width: 42,
          height: 42,
          borderRadius: '50%',
          background: 'var(--accent-blue-light)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 20,
          flexShrink: 0,
          fontWeight: 700,
          color: 'var(--text-primary)',
        }}>
          {worker.name.split(' ').map(n => n[0]).join('')}
        </div>
        <div style={{ flex: 1 }}>
          <div style={{
            fontSize: 'var(--font-body)',
            fontWeight: 600,
            color: 'var(--text-primary)',
          }}>
            {worker.name}
          </div>
          <div style={{
            fontSize: 'var(--font-body-sm)',
            color: 'var(--text-secondary)',
          }}>
            ⭐ {worker.rating} · {worker.role}
          </div>
        </div>
        <span style={{ fontSize: 22, cursor: 'pointer' }}>📞</span>
      </div>

      {/* Action Buttons */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr 1fr',
        gap: 8,
        marginBottom: 16,
      }}>
        {[
          { label: 'Chat', icon: '💬' },
          { label: 'Job Details', icon: '📋' },
          { label: 'Cancel', icon: '✕', danger: true },
        ].map((action) => (
          <button key={action.label} style={{
            padding: 10,
            borderRadius: 'var(--radius-sm)',
            border: `1px solid ${action.danger ? 'var(--accent-red)' : 'var(--border)'}`,
            background: 'transparent',
            cursor: 'pointer',
            fontSize: 'var(--font-body-sm)',
            fontWeight: 500,
            color: action.danger ? 'var(--accent-red)' : 'var(--text-primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 5,
          }}>
            {action.icon} {action.label}
          </button>
        ))}
      </div>

      {/* Estimated Cost */}
      <div style={{
        background: 'var(--bg-surface2)',
        borderRadius: 'var(--radius-md)',
        padding: 14,
      }}>
        <div style={{
          fontSize: 'var(--font-body-sm)',
          fontWeight: 600,
          color: 'var(--text-secondary)',
          marginBottom: 4,
        }}>
          Estimated cost
        </div>
        <div style={{
          fontSize: 'var(--font-large)',
          fontWeight: 800,
          color: 'var(--text-primary)',
        }}>
          Rs 1500-4000
        </div>
        <div style={{
          fontSize: 'var(--font-body-sm)',
          color: 'var(--text-secondary)',
          marginTop: 4,
        }}>
          Worker may adjust on-site · You approve first
        </div>
      </div>
    </div>
  )
}