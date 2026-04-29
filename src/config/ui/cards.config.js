const cards = {
  workerCard: {
    borderRadius: 'var(--radius-lg)',
    iconArea: {
      height: '80px',
      fontSize: '32px',
      photoSize: '56px',
    },
    info: {
      padding: '12px',
      nameSize: 'var(--font-body)',
      nameWeight: 600,
      roleSize: 'var(--font-body-sm)',
      ratingSize: 'var(--font-body-sm)',
      etaBadge: {
        fontSize: 'var(--font-caption)',
        fontWeight: 700,
        padding: '2px 8px',
        borderRadius: '20px',
      },
    },
  },
  serviceCard: {
    borderRadius: 'var(--radius-md)',
    padding: '14px 8px 12px',
    iconContainer: {
      width: '44px',
      height: '44px',
      borderRadius: '12px',
      fontSize: '22px',
    },
    label: {
      fontSize: 'var(--font-body-sm)',
      fontWeight: 500,
    },
  },
  planCard: {
    borderRadius: 'var(--radius-lg)',
    padding: '20px',
    popularBorder: '2px solid var(--accent-blue)',
    normalBorder: '1px solid var(--border)',
    popularBadge: {
      fontSize: 'var(--font-caption)',
      fontWeight: 700,
      padding: '3px 12px',
      borderRadius: '20px',
    },
    price: {
      fontSize: 'var(--font-large)',
      fontWeight: 800,
    },
    feature: {
      fontSize: 'var(--font-body-sm)',
    },
  },
}

export default cards