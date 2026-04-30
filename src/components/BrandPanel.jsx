export default function BrandPanel() {
  return (
    <>
      <div className="brand-panel" style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: 'clamp(24px, 5vw, 60px) clamp(20px, 4vw, 48px)',
        background: 'linear-gradient(135deg, #1A6FD4 0%, #2D1B69 100%)',
        color: '#fff',
        position: 'relative',
        overflow: 'hidden',
        minHeight: '100%',
        width: '100%',
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
        <div className="brand-content" style={{ position: 'relative', zIndex: 1 }}>
          <div style={{
            width: 'clamp(36px, 5vw, 48px)', height: 'clamp(36px, 5vw, 48px)',
            background: 'rgba(255,255,255,0.15)',
            borderRadius: 12, display: 'flex', alignItems: 'center',
            justifyContent: 'center', fontSize: 'clamp(18px, 3vw, 24px)',
            fontWeight: 800, marginBottom: 'clamp(16px, 3vw, 32px)',
          }}>
            S
          </div>

          <h1 style={{
            fontSize: 'clamp(20px, 3.5vw, 28px)', fontWeight: 800,
            marginBottom: 12, lineHeight: 1.2,
          }}>
            Trusted home services<br />at your doorstep
          </h1>

          <p style={{
            fontSize: 'clamp(12px, 1.5vw, 15px)', opacity: 0.7,
            marginBottom: 'clamp(20px, 3vw, 40px)', lineHeight: 1.6,
          }}>
            Book electricians, plumbers, cleaners in minutes.
            Verified workers. Fast service. Fair pricing.
          </p>

          {/* Trust badges */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(8px, 1.5vw, 14px)' }}>
            {[
              { icon: '✓', text: 'Verified Workers' },
              { icon: '⚡', text: 'Fast Booking' },
              { icon: '⭐', text: 'Rated Service' },
            ].map((badge) => (
              <div key={badge.text} style={{
                display: 'flex', alignItems: 'center', gap: 12,
              }}>
                <div style={{
                  width: 'clamp(24px, 3vw, 32px)', height: 'clamp(24px, 3vw, 32px)',
                  borderRadius: 8, background: 'rgba(255,255,255,0.12)',
                  display: 'flex', alignItems: 'center',
                  justifyContent: 'center', fontSize: 'clamp(12px, 1.5vw, 16px)',
                }}>
                  {badge.icon}
                </div>
                <span style={{
                  fontSize: 'clamp(11px, 1.5vw, 14px)', fontWeight: 500,
                }}>
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
            position: absolute !important;
            inset: 0 !important;
            z-index: 0 !important;
            padding: 40px 24px !important;
            text-align: center;
          }
          .brand-content {
            display: flex !important;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            min-height: 100%;
          }
          .brand-content h1 br {
            display: none;
          }
        }
      `}</style>
    </>
  )
}