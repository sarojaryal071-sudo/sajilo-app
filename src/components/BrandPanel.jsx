export default function BrandPanel() {
  return (
    <>
      {/* Desktop brand panel */}
      <div className="brand-panel" style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: '60px 48px',
        background: 'linear-gradient(135deg, #1A6FD4 0%, #2D1B69 100%)',
        color: '#fff',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Background shapes */}
        <div style={{
          position: 'absolute', top: -80, left: -80,
          width: 300, height: 300, borderRadius: '50%',
          background: 'rgba(255,255,255,0.04)',
        }} />
        <div style={{
          position: 'absolute', bottom: -60, right: -60,
          width: 250, height: 250, borderRadius: '50%',
          background: 'rgba(255,255,255,0.04)',
        }} />

        {/* Content */}
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{
            width: 48, height: 48, background: 'rgba(255,255,255,0.15)',
            borderRadius: 12, display: 'flex', alignItems: 'center',
            justifyContent: 'center', fontSize: 24, fontWeight: 800,
            marginBottom: 32,
          }}>
            S
          </div>

          <h1 style={{
            fontSize: '28px', fontWeight: 800, marginBottom: 12,
            lineHeight: 1.2,
          }}>
            Trusted home services<br />at your doorstep
          </h1>

          <p style={{
            fontSize: '15px', opacity: 0.7, marginBottom: 40,
            lineHeight: 1.6,
          }}>
            Book electricians, plumbers, cleaners in minutes.
            Verified workers. Fast service. Fair pricing.
          </p>

          {/* Trust badges */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {[
              { icon: '✓', text: 'Verified Workers' },
              { icon: '⚡', text: 'Fast Booking' },
              { icon: '⭐', text: 'Rated Service' },
            ].map((badge) => (
              <div key={badge.text} style={{
                display: 'flex', alignItems: 'center', gap: 12,
              }}>
                <div style={{
                  width: 32, height: 32, borderRadius: 8,
                  background: 'rgba(255,255,255,0.12)',
                  display: 'flex', alignItems: 'center',
                  justifyContent: 'center', fontSize: 16,
                }}>
                  {badge.icon}
                </div>
                <span style={{ fontSize: '14px', fontWeight: 500 }}>
                  {badge.text}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .brand-panel {
            position: fixed !important;
            inset: 0 !important;
            z-index: 0 !important;
            opacity: 0.15 !important;
            padding: 0 !important;
          }
          .brand-panel > div:last-child {
            display: none !important;
          }
        }
      `}</style>
    </>
  )
}