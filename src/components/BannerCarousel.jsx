import { useState, useEffect } from 'react'
import { useContent } from '../hooks/useContent.js'

const banners = [
  {
    id: 1,
    bg: 'linear-gradient(135deg, #1A6FD4, #378ADD)',
    tagKey: 'promo.tag1',
    titleKey: 'promo.title1',
    subKey: 'promo.sub1',
    badge: 'NEW20',
  },
  {
    id: 2,
    bg: 'linear-gradient(135deg, #1D9E75, #2D9E6B)',
    tagKey: 'promo.tag2',
    titleKey: 'promo.title2',
    subKey: 'promo.sub2',
    badge: 'PRO',
  },
]

export default function BannerCarousel() {
  const [current, setCurrent] = useState(0)

  const tag = useContent(banners[current].tagKey)
  const title = useContent(banners[current].titleKey)
  const sub = useContent(banners[current].subKey)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent(prev => (prev + 1) % banners.length)
    }, 4000)
    return () => clearInterval(timer)
  }, [])

  return (
    <div style={{
      display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14,
    }}>
      {banners.map((b, i) => (
        <div key={b.id} onClick={() => setCurrent(i)} style={{
          background: b.bg,
          borderRadius: 14,
          padding: 22,
          position: 'relative',
          overflow: 'hidden',
          cursor: 'pointer',
          minHeight: 110,
          opacity: i === current ? 1 : 0.7,
          transition: 'opacity 0.3s',
          border: i === current ? '2px solid rgba(255,255,255,0.3)' : '2px solid transparent',
        }}>
          <div style={{ position: 'absolute', right: -20, top: -20, width: 90, height: 90, borderRadius: '50%', background: 'rgba(255,255,255,0.1)' }} />
          <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.7)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.08em', marginBottom: 4 }}>
            {i === current ? (useContent(b.tagKey)) : ''}
          </div>
          <div style={{ fontSize: 16, fontWeight: 800, color: '#fff', marginBottom: 3 }}>
            {i === current ? title : useContent(b.titleKey)}
          </div>
          <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.75)' }}>
            {i === current ? sub : useContent(b.subKey)}
          </div>
          <div style={{ position: 'absolute', top: 14, right: 14, background: 'rgba(255,255,255,0.22)', color: '#fff', fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 20 }}>
            {b.badge}
          </div>
        </div>
      ))}
    </div>
  )
}