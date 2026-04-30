const styleRegistry = {
  // Login
  loginLogo: {
    fontSize: '32px',
    fontWeight: 800,
    textAlign: 'center',
    marginBottom: '8px',
  },
  loginCard: {
    padding: 'clamp(28px, 5vw, 44px)',
    maxWidth: '430px',
    borderRadius: 'var(--radius-lg)',
  },
  loginButton: {
    backgroundColor: 'var(--accent-blue)',
    color: '#fff',
    borderRadius: 'var(--radius-md)',
    padding: '14px',
    fontSize: 'var(--font-body)',
    fontWeight: 600,
  },
  formGap: '16px',

  // Home — Services
  homeServiceCard: {
    background: 'var(--bg-surface)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius-md)',
    padding: '14px 8px 12px',
    gap: '8px',
  },
  homeServiceIcon: {
    width: '44px',
    height: '44px',
    borderRadius: '12px',
    fontSize: '22px',
  },
  homeServiceLabel: {
    fontSize: 'var(--font-body-sm)',
    fontWeight: 500,
    color: 'var(--text-primary)',
  },

  // Home — Workers
  homeWorkerCard: {
    background: 'var(--bg-surface)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius-lg)',
    overflow: 'hidden',
  },
  homeWorkerIconArea: {
    height: '80px',
    fontSize: '32px',
  },
  homeWorkerPhoto: {
    width: '56px',
    height: '56px',
    borderRadius: '50%',
    objectFit: 'cover',
    border: '2px solid #fff',
  },
  homeWorkerInfo: {
    padding: '12px',
  },
  homeWorkerName: {
    fontSize: 'var(--font-body)',
    fontWeight: 600,
    color: 'var(--text-primary)',
  },
  homeWorkerRole: {
    fontSize: 'var(--font-body-sm)',
    color: 'var(--text-secondary)',
  },
  homeWorkerRating: {
    fontSize: 'var(--font-body-sm)',
    fontWeight: 600,
    color: 'var(--text-primary)',
  },
  homeWorkerEta: {
    fontSize: 'var(--font-caption)',
    fontWeight: 700,
    padding: '2px 8px',
    borderRadius: '20px',
  },

  // Home — Promos
  homePromoCard: {
    borderRadius: '14px',
    padding: '22px',
    minHeight: '110px',
    color: '#fff',
  },

  // Home — Sections
  homeSectionTitle: {
    fontSize: 'var(--font-title)',
    fontWeight: 700,
    color: 'var(--text-primary)',
    marginBottom: '14px',
  },
  homeWelcomeTitle: {
    fontSize: 'var(--font-heading)',
    fontWeight: 700,
    color: 'var(--text-primary)',
    marginBottom: '6px',
  },
  homeWelcomeSub: {
    fontSize: 'var(--font-body)',
    color: 'var(--text-secondary)',
    marginBottom: '24px',
  },
}

export default styleRegistry