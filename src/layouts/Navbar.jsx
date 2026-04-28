export default function Navbar({ dark, setDark, lang, setLang, activeTab, setActiveTab, t }) {
  const tabs = [
    { key: 'home', label: t.navHome },
    { key: 'search', label: t.navSearch },
    { key: 'bookings', label: t.navBookings },
    { key: 'pro', label: t.navPro },
    { key: 'profile', label: t.navProfile },
  ]

  return (
    <nav style={{
      height: 56,
      background: 'var(--bg-nav)',
      borderBottom: '1px solid var(--border)',
      display: 'flex',
      alignItems: 'center',
      padding: '0 24px',
      gap: 8,
      position: 'sticky',
      top: 0,
      zIndex: 100,
      flexShrink: 0,
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        marginRight: 24,
        flexShrink: 0,
      }}>
        <div style={{
          width: 30, height: 30, background: 'var(--accent-blue)',
          borderRadius: 8, display: 'flex', alignItems: 'center',
          justifyContent: 'center', color: '#fff', fontWeight: 800, fontSize: 14,
        }}>S</div>
        <span style={{ fontSize: 17, fontWeight: 800, color: 'var(--text-primary)' }}>
          {t.appName}
        </span>
      </div>

      <div className="navbar-tabs" style={{ display: 'flex', gap: 2, flex: 1 }}>
        {tabs.map((tab) => (
          <button key={tab.key} onClick={() => setActiveTab(tab.key)} style={{
            padding: '6px 14px', borderRadius: 6, border: 'none', cursor: 'pointer',
            fontSize: 13, fontWeight: 500, whiteSpace: 'nowrap',
            background: activeTab === tab.key ? 'var(--accent-blue-light)' : 'transparent',
            color: activeTab === tab.key ? 'var(--accent-blue)' : 'var(--text-secondary)',
          }}>
            {tab.label}
          </button>
        ))}
      </div>

      <select value={lang} onChange={(e) => setLang(e.target.value)} style={{
        padding: '5px 8px', borderRadius: 6, border: '1px solid var(--border)',
        background: 'var(--bg-surface2)', color: 'var(--text-primary)',
        fontSize: 12, fontWeight: 600, cursor: 'pointer', outline: 'none', flexShrink: 0,
      }}>
        <option value="en">EN</option>
        <option value="ne">ने</option>
      </select>

      <button onClick={() => setDark(d => !d)} style={{
        width: 34, height: 34, borderRadius: 7, display: 'flex',
        alignItems: 'center', justifyContent: 'center',
        background: 'var(--bg-surface2)', border: '1px solid var(--border)',
        cursor: 'pointer', fontSize: 16, flexShrink: 0,
      }}>
        {dark ? '☀️' : '🌙'}
      </button>

      <style>{`
        @media (max-width: 768px) {
          .navbar-tabs { display: none !important; }
        }
      `}</style>
    </nav>
  )
}