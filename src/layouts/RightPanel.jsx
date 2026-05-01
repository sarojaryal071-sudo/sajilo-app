import { workers } from '../config/data.js'
import { useContent } from '../hooks/useContent.js'

export default function RightPanel() {
  const onlineCount = workers.filter(w => w.approved).length

  const txt = {
    stats: useContent('right.stats'),
    activity: useContent('right.activity'),
    trust: useContent('right.trust'),
    workersOnline: useContent('right.workersOnline'),
    satisfaction: useContent('right.satisfaction'),
    avgResponse: useContent('right.avgResponse'),
    avgCost: useContent('right.avgCost'),
  }

  const activities = [
    { icon: '⚡', text: 'Sagar Kandel accepted a job', time: '2 min ago' },
    { icon: '✅', text: 'Bimal Sapkota completed cleaning', time: '1 hour ago' },
    { icon: '📅', text: 'Ankit Kharel scheduled for tomorrow', time: '3 hours ago' },
  ]

  const trustItems = [
    { icon: '🔒', title: useContent('right.verifiedWorkers'), desc: useContent('right.verifiedDesc') },
    { icon: '💳', title: useContent('right.securePayments'), desc: useContent('right.secureDesc') },
    { icon: '⭐', title: useContent('right.ratingSystem'), desc: useContent('right.ratingDesc') },
  ]

  return (
    <aside style={{
      width: 280, flexShrink: 0, background: 'var(--bg-surface)',
      borderLeft: '1px solid var(--border)', padding: '20px 16px',
      display: 'flex', flexDirection: 'column', gap: 20,
      overflowY: 'auto', height: '100%',
    }}>
      <div>
        <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 12 }}>{txt.stats}</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
          {[
            { value: onlineCount, label: txt.workersOnline },
            { value: '98%', label: txt.satisfaction },
            { value: '~12m', label: txt.avgResponse },
            { value: 'Rs 1500', label: txt.avgCost },
          ].map((stat, i) => (
            <div key={i} style={{ background: 'var(--bg-surface2)', borderRadius: 8, padding: 12, textAlign: 'center' }}>
              <div style={{ fontSize: 20, fontWeight: 800, color: 'var(--text-primary)' }}>{stat.value}</div>
              <div style={{ fontSize: 10, color: 'var(--text-secondary)', marginTop: 2 }}>{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      <hr style={{ border: 'none', borderTop: '1px solid var(--border)', margin: 0 }} />

      <div>
        <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 12 }}>{txt.activity}</div>
        {activities.map((a, i) => (
          <div key={i} style={{ display: 'flex', gap: 10, marginBottom: 12 }}>
            <span style={{ fontSize: 18 }}>{a.icon}</span>
            <div>
              <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-primary)' }}>{a.text}</div>
              <div style={{ fontSize: 11, color: 'var(--text-secondary)' }}>{a.time}</div>
            </div>
          </div>
        ))}
      </div>

      <hr style={{ border: 'none', borderTop: '1px solid var(--border)', margin: 0 }} />

      <div>
        <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 12 }}>{txt.trust}</div>
        {trustItems.map((item, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, background: 'var(--bg-surface2)', borderRadius: 8, padding: 10, marginBottom: 8 }}>
            <span style={{ fontSize: 18 }}>{item.icon}</span>
            <div>
              <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-primary)' }}>{item.title}</div>
              <div style={{ fontSize: 11, color: 'var(--text-secondary)' }}>{item.desc}</div>
            </div>
          </div>
        ))}
      </div>
    </aside>
  )
}