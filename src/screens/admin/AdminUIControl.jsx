import { useState, useRef, useEffect } from 'react'
import uiRegistry from '../../config/ui/uiRegistry.js'
import { getControlConfig } from '../../config/studioControlRegistry.js'
import { sceneGraph, getElementById } from '../../config/sceneGraph.js'
import ScreenRenderer from '../../components/admin/ScreenRenderer.jsx';
import { getScreensForPanel } from '../../config/screenRegistry.js';



const FLAG_LABELS = {
  sosEmergency: 'SOS Emergency', proSubscription: 'Pro Subscription',
  googleLogin: 'Google Login', appleLogin: 'Apple Login',
  forgotPassword: 'Forgot Password', rememberMe: 'Remember Me',
  termsText: 'Terms & Privacy', socialDivider: 'Social Divider', loginLogo: 'Login Logo',
}

const STUDIO_CATEGORIES = [
  { key: 'appearance', label: 'Appearance', icon: '🎨' },
  { key: 'typography', label: 'Typography', icon: '🔤' },
  { key: 'motion', label: 'Motion', icon: '🎬' },
  { key: 'layout', label: 'Layout', icon: '📐' },
  { key: 'components', label: 'Components', icon: '🧩' },
  { key: 'publish', label: 'Publish', icon: '🚀' },
]

const PREVIEW_MODES = [
  { key: 'worker', label: 'Worker Panel', icon: '👷' },
  { key: 'client', label: 'Client Panel', icon: '👤' },
  { key: 'auth', label: 'Auth Screen', icon: '🔐' },
  { key: 'chat', label: 'Chat', icon: '💬' },
]

export default function AdminUIControl() {
  const [activeCategory, setActiveCategory] = useState('appearance')
  const [activeScope, setActiveScope] = useState('global')
  const [previewMode, setPreviewMode] = useState('worker')
  const [activeScreen, setActiveScreen] = useState('dashboard')
  const [expandedSections, setExpandedSections] = useState({})
  const [viewport, setViewport] = useState({ zoom: 100, device: 'mobile', theme: 'light' })
  const [activeNode, setActiveNode] = useState(null)

  const handleNodeSelect = (nodeId) => {
    console.log('getElementById result:', el);
    if (!nodeId) { setActiveNode(null); console.log('cleared activeNode'); return; }
    const el = getElementById(nodeId);
    setActiveNode(el ? { id: nodeId, ...el } : null);
  };

  // Highlight selected element in preview
  useEffect(() => {
    const prev = document.querySelector('[data-selected="true"]');
    if (prev) { prev.style.outline = ''; prev.style.outlineOffset = ''; prev.dataset.selected = ''; }
    if (activeNode?.id) {
      const el = document.querySelector(`[data-node-id="${activeNode.id}"]`);
      if (el) { el.style.outline = '2px solid var(--accent-blue)'; el.style.outlineOffset = '2px'; el.dataset.selected = 'true'; }
      // Auto-scroll right panel to top to show inspector
      if (rightPanelRef.current) {
        rightPanelRef.current.scrollTop = 0;
      }
    }
  }, [activeNode]);
  const defaultTokens = {
    shadowBlur: 8,
    shadowOpacity: 12,
    spacing: { xs: 4, sm: 8, md: 16, lg: 24, xl: 32, sectionGap: 20, cardPadding: 16, screenPadding: 24 },
    radius: { soft: 6, rounded: 12, card: 12, button: 8, input: 8, modal: 14, chip: 20 },
    motion: { fast: 100, subtle: 150, normal: 200, smooth: 250, slow: 400, springIntensity: 250, hoverScale: 102, springForce: 40, damping: 60 },
    typography: { fontSizeXs: 10, fontSizeSm: 12, fontSizeMd: 14, fontSizeLg: 18, fontSizeXl: 22, fontWeightRegular: 400, fontWeightMedium: 500, fontWeightBold: 700, lineHeight: 150, letterSpacing: 0 },
    layout: { columns: 4, gutter: 16 },
    effects: { blur: 12, panelOpacity: 85 },
  };

  const [draftTokens, setDraftTokens] = useState(defaultTokens);
  const [configMessage, setConfigMessage] = useState(null)
  const previewRef = useRef(null)
  const rightPanelRef = useRef(null);

  const [flags, setFlags] = useState(() => {
    const saved = localStorage.getItem('sajilo_flags')
    const allFlags = saved ? JSON.parse(saved) : uiRegistry.features
    return {
      sosEmergency: allFlags.sosEmergency || { enabled: true },
      proSubscription: allFlags.proSubscription || { enabled: true },
      googleLogin: allFlags.googleLogin || { enabled: false },
      appleLogin: allFlags.appleLogin || { enabled: false },
      forgotPassword: allFlags.forgotPassword || { enabled: true },
      rememberMe: allFlags.rememberMe || { enabled: true },
      termsText: allFlags.termsText || { enabled: true },
      socialDivider: allFlags.socialDivider || { enabled: false },
      loginLogo: allFlags.loginLogo || { enabled: false },
    }
  })

  const [theme, setTheme] = useState(uiRegistry.theme)
  const [saved, setSaved] = useState(false)

  const [navItems, setNavItems] = useState(() => {
    const saved = localStorage.getItem('sajilo_nav_config')
    return saved ? JSON.parse(saved) : [
      { id: 'home', label: 'Home', enabled: true },
      { id: 'search', label: 'Search', enabled: true },
      { id: 'bookings', label: 'Bookings', enabled: true },
      { id: 'pro', label: 'Pro', enabled: true },
      { id: 'profile', label: 'Profile', enabled: true },
    ]
  })

  useEffect(() => {
    const el = previewRef.current
    if (!el) return
    const t = draftTokens
    if (t.spacing) for (const [k, v] of Object.entries(t.spacing)) el.style.setProperty(`--spacing-${k}`, v + 'px')
    if (t.radius) for (const [k, v] of Object.entries(t.radius)) el.style.setProperty(`--radius-${k}`, v + 'px')
    if (t.motion) for (const [k, v] of Object.entries(t.motion)) el.style.setProperty(`--motion-${k}`, typeof v === 'number' ? v + 'ms' : v)
    if (t.colors) for (const [k, v] of Object.entries(t.colors)) el.style.setProperty(`--color-${k}`, v)
    if (t.typography) for (const [k, v] of Object.entries(t.typography)) el.style.setProperty(`--font-${k}`, typeof v === 'number' ? v + (k.includes('Size') ? 'px' : '') : v)
    if (theme.primaryColor) el.style.setProperty('--color-primary', theme.primaryColor)
    if (theme.accentColor) el.style.setProperty('--color-accent', theme.accentColor)
  }, [draftTokens, theme])

  const toggleFlag = (key) => { setFlags(prev => { const u = { ...prev, [key]: { enabled: !prev[key].enabled } }; localStorage.setItem('sajilo_flags', JSON.stringify(u)); return u }) }
  const toggleNavItem = (id) => { setNavItems(prev => { const u = prev.map(n => n.id === id ? { ...n, enabled: !n.enabled } : n); localStorage.setItem('sajilo_nav_config', JSON.stringify(u)); return u }) }
  const handleSaveFlags = () => { localStorage.setItem('sajilo_flags', JSON.stringify(flags)); localStorage.setItem('sajilo_nav_config', JSON.stringify(navItems)); setSaved(true); setTimeout(() => setSaved(false), 2000) }
  const handleSaveDraft = async () => { try { const t = localStorage.getItem('sajilo_token'); const r = await fetch(`/api/ui-config/${activeScope}/draft`, { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${t}` }, body: JSON.stringify({ config: draftTokens }) }).then(r => r.json()); setConfigMessage(r.success ? { type: 'success', text: 'Draft saved' } : { type: 'error', text: r.message }) } catch { setConfigMessage({ type: 'error', text: 'Failed' }) } }
  const handlePublish = async () => {
  try {
    const t = localStorage.getItem('sajilo_token');
    // Step 1: Save draft first
    await fetch(`/api/ui-config/${activeScope}/draft`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${t}` },
      body: JSON.stringify({ config: draftTokens }),
    });
    // Step 2: Publish
    const r = await fetch(`/api/ui-config/${activeScope}/publish`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${t}` },
    }).then(r => r.json());
    setConfigMessage(r.success ? { type: 'success', text: 'Published!' } : { type: 'error', text: r.message });
  } catch { setConfigMessage({ type: 'error', text: 'Failed' }); }
};

  const setSpacing = (k, v) => setDraftTokens(prev => ({ ...prev, spacing: { ...prev.spacing, [k]: v } }))
  const setRadius = (k, v) => setDraftTokens(prev => ({ ...prev, radius: { ...prev.radius, [k]: v } }))
  const setMotion = (k, v) => setDraftTokens(prev => ({ ...prev, motion: { ...prev.motion, [k]: v } }))
  const setTypography = (k, v) => setDraftTokens(prev => ({ ...prev, typography: { ...prev.typography, [k]: v } }))
  const setLayout = (k, v) => setDraftTokens(prev => ({ ...prev, layout: { ...prev.layout, [k]: v } }))
  const setEffects = (k, v) => setDraftTokens(prev => ({ ...prev, effects: { ...prev.effects, [k]: v } }))
  const setColor = (k, v) => setDraftTokens(prev => ({ ...prev, colors: { ...prev.colors, [k]: v } }))

  const toolBtn = { padding: '4px 10px', borderRadius: 4, border: '1px solid var(--border)', background: 'transparent', color: 'var(--text-secondary)', fontSize: 11, cursor: 'pointer', fontWeight: 500, whiteSpace: 'nowrap' };

  return (
    <div style={{ 
      height: 'calc(100vh - 56px)', display: 'flex', overflow: 'hidden',
      background: '#f6f7fb',
      }}>
      
      {/* ── LEFT PANEL: Categories + Layers Tree ── */}
      <div style={{ 
        width: 220, flexShrink: 0, 
        background: '#ffffff',
        borderRight: '1px solid rgba(0,0,0,0.06)',
        boxShadow: '2px 0 12px rgba(0,0,0,0.04)',
        display: 'flex', flexDirection: 'column',
        zIndex: 10,
      }}>
        {/* Studio header */}
        <div style={{ padding: '14px 14px 10px', flexShrink: 0 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)' }}>UI Studio</div>
          <div style={{ fontSize: 9, color: 'var(--text-secondary)', marginTop: 1 }}>Design Layers</div>
        </div>

        {/* Category pills – compact */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, padding: '0 14px 10px', flexShrink: 0 }}>
          {STUDIO_CATEGORIES.map(cat => (
            <button key={cat.key} onClick={() => setActiveCategory(cat.key)} style={{
              padding: '4px 10px', borderRadius: 4, border: '1px solid var(--border)',
              background: activeCategory === cat.key ? 'var(--accent-blue)' : 'transparent',
              color: activeCategory === cat.key ? '#fff' : 'var(--text-secondary)',
              fontSize: 10, fontWeight: activeCategory === cat.key ? 600 : 400,
              cursor: 'pointer', whiteSpace: 'nowrap',
            }}>{cat.icon} {cat.label}</button>
          ))}
        </div>

        {/* Separator */}
        <div style={{ borderTop: '1px solid rgba(0,0,0,0.06)', margin: '0 14px', flexShrink: 0 }} />

        {/* Layers Tree */}
        <div style={{ flex: 1, overflowY: 'auto', overscrollBehavior: 'contain', padding: '8px 0' }}>
          <div style={{ padding: '6px 14px 4px', fontSize: 9, fontWeight: 700, color: 'rgba(0,0,0,0.4)', textTransform: 'uppercase', letterSpacing: '.5px' }}>
            Scene Layers
          </div>
          {Object.entries(sceneGraph)
            .filter(([key]) => key === previewMode)
            .map(([panelKey, panel]) => (
            <div key={panelKey}>
              <div style={{ padding: '6px 14px', fontSize: 10, fontWeight: 600, color: 'var(--text-primary)', background: 'var(--bg-surface2)', borderBottom: '1px solid rgba(0,0,0,0.04)' }}>
                {panel.label}
              </div>
              {Object.entries(panel.screens).map(([sectionKey, section]) => {
                const isExpanded = expandedSections[sectionKey] !== false;
                return (
                  <div key={sectionKey}>
                    <div
                      onClick={() => {
                        setExpandedSections(prev => ({ ...prev, [sectionKey]: !isExpanded }));
                        // Switch preview to this screen
                        const screens = getScreensForPanel(previewMode);
                        const match = screens.find(s => s.key === sectionKey);
                        if (match) setActiveScreen(match.key);
                      }}
                      style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '5px 14px 5px 20px', cursor: 'pointer', fontSize: 11, color: 'var(--text-secondary)', userSelect: 'none' }}
                    >
                      <span style={{ transform: isExpanded ? 'rotate(90deg)' : 'none', transition: 'transform .15s', fontSize: 8 }}>▶</span>
                      {section.label}
                    </div>
                    {isExpanded && section.elements.map(el => (
  <div
    key={el.id}
    onClick={() => {
      setActiveNode({
        id: el.id,
        label: el.label,
        type: el.type,
        tokens: el.tokens || ['spacing','radius','colors'],
      });
      handleNodeSelect(el.id);
    }}
    style={{
      padding: '4px 14px 4px 34px', cursor: 'pointer', fontSize: 10,
      color: activeNode?.id === el.id ? 'var(--accent-blue)' : 'var(--text-secondary)',
      background: activeNode?.id === el.id ? 'var(--accent-blue-light)' : 'transparent',
      borderLeft: activeNode?.id === el.id ? '2px solid var(--accent-blue)' : '2px solid transparent',
      fontWeight: activeNode?.id === el.id ? 600 : 400,
      whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
    }}
  >
    {el.label}
  </div>
))}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      <div style={{ 
        flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', 
        background: '#f3f5f9',
        }}>
        <div style={{ display: 'flex', gap: 2, padding: '8px 12px', background: 'var(--bg-surface)', borderBottom: '1px solid var(--border)', flexShrink: 0 }}>
          {PREVIEW_MODES.map(m => (
            <button key={m.key} onClick={() => { setPreviewMode(m.key); setActiveScreen(getScreensForPanel(m.key)[0]?.key || 'dashboard'); }} style={{
              padding: '6px 14px', borderRadius: 6, border: 'none', cursor: 'pointer',
              background: previewMode === m.key ? 'var(--accent-blue)' : 'transparent',
              color: previewMode === m.key ? '#fff' : 'var(--text-secondary)',
              fontSize: 12, fontWeight: previewMode === m.key ? 600 : 400,
            }}>{m.icon} {m.label}</button>
          ))}
        </div>
        <div style={{ display: 'flex', gap: 2, padding: '6px 12px', background: 'var(--bg-surface)', borderBottom: '1px solid var(--border)', flexShrink: 0, overflowX: 'auto' }}>
          {getScreensForPanel(previewMode).map(s => (
            <button key={s.key} onClick={() => setActiveScreen(s.key)} style={{
              padding: '4px 12px', borderRadius: 4, border: 'none', cursor: 'pointer',
              background: activeScreen === s.key ? 'var(--accent-blue)' : 'transparent',
              color: activeScreen === s.key ? '#fff' : 'var(--text-secondary)',
              fontSize: 11, fontWeight: activeScreen === s.key ? 600 : 400,
              whiteSpace: 'nowrap',
            }}>{s.icon} {s.label}</button>
          ))}
        </div>
        {/* Viewport Toolbar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '6px 12px', background: 'var(--bg-surface)', borderBottom: '1px solid var(--border)', flexShrink: 0, flexWrap: 'wrap' }}>
          {/* Zoom */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <button onClick={() => setViewport(v => ({ ...v, zoom: Math.max(50, v.zoom - 10) }))} style={toolBtn}>−</button>
            <span style={{ fontSize: 11, color: 'var(--text-secondary)', minWidth: 36, textAlign: 'center' }}>{viewport.zoom}%</span>
            <button onClick={() => setViewport(v => ({ ...v, zoom: Math.min(150, v.zoom + 10) }))} style={toolBtn}>+</button>
          </div>

          <div style={{ width: 1, height: 20, background: 'var(--border)' }} />

          {/* Device */}
          {['mobile', 'tablet', 'desktop'].map(d => (
            <button key={d} onClick={() => setViewport(v => ({ ...v, device: d }))} style={{
              ...toolBtn,
              background: viewport.device === d ? 'var(--accent-blue)' : 'transparent',
              color: viewport.device === d ? '#fff' : 'var(--text-secondary)',
            }}>{d === 'mobile' ? '📱' : d === 'tablet' ? '📋' : '🖥'} {d}</button>
          ))}

          <div style={{ width: 1, height: 20, background: 'var(--border)' }} />

          {/* Theme */}
          <button onClick={() => setViewport(v => ({ ...v, theme: v.theme === 'light' ? 'dark' : 'light' }))} style={{
            ...toolBtn,
            background: viewport.theme === 'dark' ? '#1a1d25' : 'var(--bg-surface2)',
            color: viewport.theme === 'dark' ? '#fff' : 'var(--text-secondary)',
          }}>{viewport.theme === 'light' ? '☀️ Light' : '🌙 Dark'}</button>
        </div>

                {/* Preview Area with zoom + device */}
        <div style={{ flex: 1, overflow: 'auto', background: 'var(--bg-surface2)', display: 'flex', justifyContent: 'center', alignItems: 'flex-start', padding: 20 }}>
          <div style={{
            width: viewport.device === 'mobile' ? 375 : viewport.device === 'tablet' ? 768 : '100%',
            maxWidth: '100%',
            zoom: viewport.zoom / 100,
            borderRadius: viewport.device === 'mobile' ? 24 : 8,
            overflow: 'hidden',
            boxShadow: '0 0 0 4px #e5e7eb, 0 0 0 6px #d1d5db, 0 20px 60px rgba(0,0,0,0.15)',
          }}>
            <div ref={previewRef} data-theme={viewport.theme} style={{
              width: '100%',
              height: viewport.device === 'mobile' ? 640 : viewport.device === 'tablet' ? 900 : '100%',
              maxHeight: viewport.device === 'desktop' ? 'none' : undefined,
              overflowY: 'auto',
              background: 'var(--bg-primary)',
            }}>
            <ScreenRenderer 
            panel={previewMode} 
            screenKey={activeScreen} 
            tokens={draftTokens} 
            theme={theme}
          />
            </div>
          </div>
        </div>
      </div>

      <div style={{ 
        width: 320, flexShrink: 0, 
        background: '#ffffff',
        borderLeft: '1px solid rgba(0,0,0,0.06)',
        boxShadow: '-2px 0 12px rgba(0,0,0,0.04)',
        display: 'flex', flexDirection: 'column', overflow: 'hidden',
        zIndex: 10,
      }}>
        <div style={{ padding: '16px 20px 12px', flexShrink: 0, borderBottom: '1px solid var(--border)' }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: 8 }}>Scope</div>
          <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
            {['global', 'worker', 'client', 'auth'].map(scope => (
              <button key={scope} onClick={() => setActiveScope(scope)} style={{
                padding: '4px 10px', borderRadius: 4, border: '1px solid var(--border)',
                background: activeScope === scope ? 'var(--accent-blue)' : 'transparent',
                color: activeScope === scope ? '#fff' : 'var(--text-secondary)',
                fontSize: 11, fontWeight: activeScope === scope ? 600 : 400, cursor: 'pointer',
              }}>{scope}</button>
            ))}
          </div>
        </div>
        <div ref={rightPanelRef} style={{ flex: 1, overflowY: 'auto', overscrollBehavior: 'contain', padding: 20 }}>

          {/* ── Selected Element Inspector ── */}
          {activeNode && (
            <div style={{ marginBottom: 20, padding: 14, background: 'var(--accent-blue-light)', borderRadius: 8, border: '1px solid var(--accent-blue)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                <div>
                  <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--accent-blue)' }}>🔍 {activeNode.label}</div>
                  <div style={{ fontSize: 10, color: 'var(--text-secondary)' }}>{activeNode.type} · {activeNode.id}</div>
                </div>
                <button onClick={() => setActiveNode(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 16, color: 'var(--text-secondary)' }}>✕</button>
              </div>
              <div style={{ fontSize: 10, color: 'var(--text-secondary)', marginBottom: 10 }}>
                Editable tokens: {(activeNode.tokens || []).join(', ')}
              </div>
              {activeNode.tokens?.includes('spacing') && (
                <>
                  <SectionTitle title="Spacing" />
                  <StudioControl label="Card Padding" controlKey="spacing.cardPadding" value={draftTokens.spacing?.cardPadding} onChange={v => setSpacing('cardPadding', v)} color="var(--accent-blue)" />
                </>
              )}
              {activeNode.tokens?.includes('radius') && (
                <>
                  <SectionTitle title="Radius" />
                  <StudioControl label="Card Radius" controlKey="radius.card" value={draftTokens.radius?.card} onChange={v => setRadius('card', v)} color="var(--accent-blue)" />
                </>
              )}
              {activeNode.tokens?.includes('colors') && (
                <>
                  <SectionTitle title="Colors" />
                  <ColorRow label="Surface" value={draftTokens.colors?.surface ?? '#ffffff'} onChange={v => setColor('surface', v)} />
                  <ColorRow label="Primary" value={theme.primaryColor} onChange={v => setTheme(prev => ({ ...prev, primaryColor: v }))} />
                </>
              )}
              {activeNode.tokens?.includes('typography') && (
                <>
                  <SectionTitle title="Typography" />
                  <StudioControl label="Font Size" controlKey="typography.fontSizeMd" value={draftTokens.typography?.fontSizeMd} onChange={v => setTypography('fontSizeMd', v)} color="var(--accent-blue)" />
                </>
              )}
            </div>
          )}

                    {activeCategory === 'appearance' && (
            <div>
              <SectionTitle title="Brand Colors" />
              <ColorModule label="Primary" color={theme.primaryColor} onChange={v => setTheme(prev => ({ ...prev, primaryColor: v }))} draftTokens={draftTokens} />
              <ColorModule label="Accent" color={theme.accentColor} onChange={v => setTheme(prev => ({ ...prev, accentColor: v }))} draftTokens={draftTokens} />

              <div style={{ marginTop: 16 }}>
                <SectionTitle title="Surfaces" />
                <ColorModule label="Background" color={draftTokens.colors?.background ?? '#f0f2f6'} onChange={v => setColor('background', v)} draftTokens={draftTokens} />
                <ColorModule label="Surface" color={draftTokens.colors?.surface ?? '#ffffff'} onChange={v => setColor('surface', v)} draftTokens={draftTokens} />
                <ColorModule label="Border" color={draftTokens.colors?.border ?? '#e5e7eb'} onChange={v => setColor('border', v)} draftTokens={draftTokens} />
              </div>

              <div style={{ marginTop: 16 }}>
                <SectionTitle title="Typography" />
                <ColorModule label="Text" color={draftTokens.colors?.textPrimary ?? '#1a1d23'} onChange={v => setColor('textPrimary', v)} draftTokens={draftTokens} />
                <ColorModule label="Text Secondary" color={draftTokens.colors?.textSecondary ?? '#6b7280'} onChange={v => setColor('textSecondary', v)} draftTokens={draftTokens} />
              </div>

              <div style={{ marginTop: 16 }}>
                <SectionTitle title="Feedback" />
                <ColorModule label="Success" color={draftTokens.colors?.success ?? '#2D9E6B'} onChange={v => setColor('success', v)} draftTokens={draftTokens} />
                <ColorModule label="Danger" color={draftTokens.colors?.danger ?? '#D92B2B'} onChange={v => setColor('danger', v)} draftTokens={draftTokens} />
                <ColorModule label="Warning" color={draftTokens.colors?.warning ?? '#E8720C'} onChange={v => setColor('warning', v)} draftTokens={draftTokens} />
              </div>
            </div>
          )}

          {activeCategory === 'typography' && (
            <div>
              <SectionTitle title="Font Family" />
              <select value={draftTokens.typography?.fontFamily ?? 'system-ui'} onChange={e => setTypography('fontFamily', e.target.value)} style={{ width: '100%', padding: '8px 10px', borderRadius: 6, border: '1px solid var(--border)', fontSize: 12, background: 'var(--bg-surface2)', color: 'var(--text-primary)', marginBottom: 16 }}>
                <option value="system-ui, -apple-system, sans-serif">System Default</option>
                <option value="Inter, system-ui, sans-serif">Inter</option>
                <option value="Georgia, serif">Georgia</option>
                <option value="monospace">Monospace</option>
              </select>

              <SectionTitle title="Font Sizes" />
              {[
                { key: 'fontSizeXs', label: 'Caption' },
                { key: 'fontSizeSm', label: 'Small' },
                { key: 'fontSizeMd', label: 'Body' },
                { key: 'fontSizeLg', label: 'Heading' },
                { key: 'fontSizeXl', label: 'Title' },
              ].map(f => (
                <StudioControl key={f.key} label={f.label} controlKey={`typography.${f.key}`} value={draftTokens.typography?.[f.key]} onChange={v => setTypography(f.key, v)} color="var(--accent-blue)" />
              ))}

              <div style={{ marginTop: 16 }}>
                <SectionTitle title="Weight" />
                {[
                  { key: 'fontWeightRegular', label: 'Regular' },
                  { key: 'fontWeightMedium', label: 'Medium' },
                  { key: 'fontWeightBold', label: 'Bold' },
                ].map(f => (
                  <StudioControl key={f.key} label={f.label} controlKey={`typography.${f.key}`} value={draftTokens.typography?.[f.key]} onChange={v => setTypography(f.key, v)} color="var(--accent-purple)" />
                ))}
              </div>

              <div style={{ marginTop: 16 }}>
                <SectionTitle title="Line Height" />
                <StudioControl label="Line H" controlKey="typography.lineHeight" value={draftTokens.typography?.lineHeight} onChange={v => setTypography('lineHeight', v)} color="var(--accent-cyan)" />
                <StudioControl label="Letter Spacing" controlKey="typography.letterSpacing" value={draftTokens.typography?.letterSpacing} onChange={v => setTypography('letterSpacing', v)} color="var(--accent-purple)" />
              </div>
            </div>
          )}

          {activeCategory === 'motion' && (
            <div>
              <SectionTitle title="Animation Speed" />
              {[
                { key: 'fast', label: 'Fast' },
                { key: 'subtle', label: 'Subtle' },
                { key: 'normal', label: 'Normal' },
                { key: 'smooth', label: 'Smooth' },
                { key: 'slow', label: 'Slow' },
              ].map(m => (
                <StudioControl key={m.key} label={m.label} controlKey={`motion.${m.key}`} value={draftTokens.motion?.[m.key]} onChange={v => setMotion(m.key, v)} color="var(--accent-blue)" />
              ))}

              <div style={{ marginTop: 16 }}>
                <SectionTitle title="Interaction" />
                <StudioControl label="Spring" controlKey="motion.spring" value={draftTokens.motion?.springIntensity} onChange={v => setMotion('springIntensity', v)} color="var(--accent-amber)" />
                <StudioControl label="Hover Scale" controlKey="motion.hoverScale" value={draftTokens.motion?.hoverScale} onChange={v => setMotion('hoverScale', v)} color="var(--accent-green)" />
                <StudioControl label="Spring Force" controlKey="motion.springForce" value={draftTokens.motion?.springForce} onChange={v => setMotion('springForce', v)} color="var(--accent-amber)" />
                <StudioControl label="Damping" controlKey="motion.damping" value={draftTokens.motion?.damping} onChange={v => setMotion('damping', v)} color="var(--accent-purple)" />
              </div>
            </div>
          )}

          {activeCategory === 'layout' && (
            <div>
              <SectionTitle title="Spacing Scale" />
              {['xs', 'sm', 'md', 'lg', 'xl'].map(k => (
                <StudioControl key={k} label={k.toUpperCase()} controlKey={`spacing.${k}`} value={draftTokens.spacing?.[k]} onChange={v => setSpacing(k, v)} color="var(--accent-blue)" />
              ))}

              <div style={{ marginTop: 16 }}>
                <SectionTitle title="Section Spacing" />
                <StudioControl label="Section" controlKey="spacing.sectionGap" value={draftTokens.spacing?.sectionGap} onChange={v => setSpacing('sectionGap', v)} color="var(--accent-cyan)" />
                <StudioControl label="Card" controlKey="spacing.cardPadding" value={draftTokens.spacing?.cardPadding} onChange={v => setSpacing('cardPadding', v)} color="var(--accent-cyan)" />
                <StudioControl label="Screen" controlKey="spacing.screenPadding" value={draftTokens.spacing?.screenPadding} onChange={v => setSpacing('screenPadding', v)} color="var(--accent-cyan)" />
              </div>

              <div style={{ marginTop: 16 }}>
                <SectionTitle title="Radius" />
                {['card', 'button', 'input', 'modal', 'chip'].map(k => (
                  <StudioControl key={k} label={k.charAt(0).toUpperCase()+k.slice(1)} controlKey={`radius.${k}`} value={draftTokens.radius?.[k]} onChange={v => setRadius(k, v)} color="var(--accent-blue)" />
                ))}
              </div>

              <div style={{ marginTop: 16 }}>
                <SectionTitle title="Grid" />
                <StudioControl label="Columns" controlKey="layout.columns" value={draftTokens.layout?.columns} onChange={v => setLayout('columns', v)} color="var(--accent-amber)" />
                <StudioControl label="Gutter" controlKey="layout.gutter" value={draftTokens.layout?.gutter} onChange={v => setLayout('gutter', v)} color="var(--accent-blue)" />
              </div>
            </div>
          )}

          {activeCategory === 'components' && (
            <div>
              <SectionTitle title="Feature Flags" />
              {Object.entries(flags).map(([key, value]) => <ToggleRow key={key} label={FLAG_LABELS[key] || key} enabled={value.enabled} onToggle={() => toggleFlag(key)} />)}
              <div style={{ marginTop: 16 }}><SectionTitle title="Navigation" />{navItems.map(item => <ToggleRow key={item.id} label={item.label} enabled={item.enabled} onToggle={() => toggleNavItem(item.id)} />)}</div>
              <button onClick={handleSaveFlags} style={{ width: '100%', marginTop: 12, padding: '8px 0', borderRadius: 6, border: 'none', background: saved ? '#059669' : 'var(--accent-blue)', color: '#fff', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>{saved ? '✓ Saved' : 'Save Flags & Nav'}</button>
            </div>
          )}

          {activeCategory === 'publish' && (
            <div>
              <SectionTitle title="Publish" />
              <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 12 }}>Publish draft tokens to make them live across all panels.</div>
              <button onClick={handleSaveDraft} style={{ width: '100%', padding: '10px 0', borderRadius: 6, border: 'none', background: 'var(--accent-blue)', color: '#fff', fontSize: 13, fontWeight: 600, cursor: 'pointer', marginBottom: 8 }}>Save Draft</button>
              <button onClick={handlePublish} style={{ width: '100%', padding: '10px 0', borderRadius: 6, border: '1px solid #059669', background: 'transparent', color: '#059669', fontSize: 13, fontWeight: 600, cursor: 'pointer', marginBottom: 8 }}>Publish</button>

              {/* Divider */}
              <div style={{ borderTop: '1px solid var(--border)', margin: '12px 0' }} />

              <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--accent-red)', marginBottom: 6 }}>
                ⚠️ Danger Zone
              </div>
              <button
                onClick={() => {
                  if (confirm('Restore all tokens to default values? This resets all your changes in the current draft. Published configs are not affected.')) {
                    setDraftTokens(JSON.parse(JSON.stringify(defaultTokens)));
                    setTheme(uiRegistry.theme);
                    setConfigMessage({ type: 'success', text: 'Restored to defaults' });
                  }
                }}
                style={{
                  width: '100%', padding: '10px 0', borderRadius: 6,
                  border: '1px solid var(--accent-red)', background: 'transparent',
                  color: 'var(--accent-red)', fontSize: 13, fontWeight: 600, cursor: 'pointer',
                }}
              >
                🔄 Restore Defaults
              </button>
              {configMessage && <div style={{ marginTop: 8, fontSize: 12, color: configMessage.type === 'success' ? '#059669' : '#DC2626', textAlign: 'center' }}>{configMessage.text}</div>}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// ── PREVIEW COMPONENTS ──
function WorkerPreview({ tokens, theme }) {
  return (
    <div style={{ maxWidth: 400, margin: '0 auto' }}>
      <div className="sajilo-card" data-node-id="workerStatsBar" style={{ marginBottom: 'var(--spacing-sm, 8px)' }}>
        <div className="sajilo-section-title" style={{ fontSize: 'var(--font-size-lg, 18px)' }}>📊 Your Performance</div>
        <div style={{ display: 'flex', gap: 'var(--spacing-sm, 8px)', marginBottom: 'var(--spacing-md, 16px)' }}>
          {['Jobs', 'Earnings', 'Rating'].map(l => (
            <div key={l} className="sajilo-surface" style={{ flex: 1, textAlign: 'center', padding: 'var(--spacing-sm, 8px)' }}>
              <div style={{ fontSize: 'var(--font-size-xl, 22px)', fontWeight: 'var(--font-weight-bold, 700)', color: 'var(--color-primary, #1A6FD4)' }}>24</div>
              <div className="sajilo-text-small">{l}</div>
            </div>
          ))}
        </div>
        <button className="sajilo-button sajilo-button-primary" style={{ width: '100%' }}>Sample Action</button>
      </div>
    </div>
  )
}

function ClientPreview({ tokens, theme }) {
  return (
    <div style={{ maxWidth: 400, margin: '0 auto' }}>
      <div className="sajilo-card sajilo-feed-item" data-node-id="bookingTrackCard">
        <div style={{ fontSize: 'var(--font-size-md, 14px)', fontWeight: 'var(--font-weight-bold, 700)', color: 'var(--color-text-primary, #1a1d23)', marginBottom: 4 }}>👷 Saroj Test</div>
        <div className="sajilo-text-small" style={{ marginBottom: 'var(--spacing-sm, 8px)' }}>⭐ 4.8 · Plumber · Kathmandu</div>
        <div style={{ display: 'flex', gap: 'var(--spacing-xs, 4px)' }}>
          <span className="sajilo-chip" style={{ background: 'var(--color-success-light, #ECFDF5)', color: 'var(--color-success, #059669)' }}>95% completion</span>
          <span className="sajilo-chip" style={{ background: 'var(--color-primary-light, #EFF6FF)', color: 'var(--color-primary, #2563EB)' }}>Verified</span>
        </div>
      </div>
    </div>
  )
}

function AuthPreview({ tokens, theme }) {
  return (
    <div style={{ maxWidth: 360, margin: '40px auto' }}>
      <div className="sajilo-overlay" data-node-id="authForm" style={{ textAlign: 'center' }}>
        <div style={{ fontSize: 'var(--font-size-xl, 22px)', fontWeight: 'var(--font-weight-bold, 700)', color: 'var(--color-primary, #1A6FD4)', marginBottom: 'var(--spacing-md, 16px)' }}>Sajilo</div>
        <input className="sajilo-input" placeholder="Email" style={{ marginBottom: 'var(--spacing-sm, 8px)' }} readOnly />
        <input className="sajilo-input" type="password" placeholder="Password" style={{ marginBottom: 'var(--spacing-md, 16px)' }} readOnly />
        <button className="sajilo-button sajilo-button-primary" style={{ width: '100%' }}>Login</button>
      </div>
    </div>
  )
}

function ChatPreview({ tokens, theme }) {
  return (
    <div style={{ maxWidth: 400, margin: '0 auto' }}>
      <div className="sajilo-card" data-node-id="chatContainer" style={{ height: 300, display: 'flex', flexDirection: 'column' }}>
        <div className="sajilo-section-title" style={{ marginBottom: 'var(--spacing-sm, 8px)' }}>💬 Chat</div>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'var(--spacing-sm, 8px)', overflow: 'hidden' }}>
          <div className="sajilo-chip" style={{ alignSelf: 'flex-start', background: 'var(--color-primary-light, #f0f2f6)', color: 'var(--color-text-primary, #1a1d23)', padding: '8px 14px', maxWidth: '70%' }}>Hello!</div>
          <div className="sajilo-chip" style={{ alignSelf: 'flex-end', background: 'var(--color-primary, #1A6FD4)', color: '#fff', padding: '8px 14px', maxWidth: '70%' }}>I need help.</div>
        </div>
        <input className="sajilo-input" placeholder="Type..." style={{ marginTop: 'var(--spacing-sm, 8px)' }} readOnly />
      </div>
    </div>
  )
}

function ColorModule({ label, color, onChange, draftTokens }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ marginBottom: 4, borderRadius: 6, overflow: 'hidden' }}>
      {/* Header */}
      <div onClick={() => setOpen(!open)} style={{
        display: 'flex', alignItems: 'center', gap: 10, padding: '8px 10px',
        cursor: 'pointer', background: open ? 'var(--bg-surface2)' : 'transparent',
        borderRadius: 6, transition: 'background .15s',
        border: open ? '1px solid var(--border)' : '1px solid transparent',
      }}>
        <span style={{ fontSize: 9, color: 'var(--text-secondary)', transform: open ? 'rotate(90deg)' : 'none', transition: 'transform .15s', display: 'inline-block' }}>▶</span>
        <div style={{
          width: 22, height: 22, borderRadius: 5, background: color,
          border: '1px solid var(--border)', boxShadow: `0 0 8px ${color}44`, flexShrink: 0,
        }} />
        <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-primary)', flex: 1 }}>{label}</span>
        <span style={{ fontSize: 9, color: 'var(--text-secondary)', fontVariantNumeric: 'tabular-nums' }}>{color}</span>
      </div>

      {/* Expanded grading controls */}
      {open && (
        <div style={{ padding: '8px 10px 12px 32px', background: 'var(--bg-surface2)', borderBottomLeftRadius: 6, borderBottomRightRadius: 6 }}>
          <StudioControl label="Saturation" controlKey="grading.saturation" value={0} onChange={() => {}} color={color} />
          <StudioControl label="Brightness" controlKey="grading.brightness" value={0} onChange={() => {}} color={color} />
          <StudioControl label="Warmth" controlKey="grading.warmth" value={0} onChange={() => {}} color={color} />
          <StudioControl label="Opacity" controlKey="grading.opacity" value={100} onChange={() => {}} color={color} />
        </div>
      )}
    </div>
  );
}

function SectionTitle({ title }) { return <div style={{ fontSize: 10, fontWeight: 700, color: 'rgba(0,0,0,0.45)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: 10, marginTop: 6, paddingBottom: 6, borderBottom: '1px solid rgba(0,0,0,0.06)' }}>{title}</div> }
function ColorRow({ label, value, onChange }) { return <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}><span style={{ fontSize: 12, color: 'var(--text-primary)', flex: 1 }}>{label}</span><input type="color" value={value} onChange={e => onChange(e.target.value)} style={{ width: 32, height: 28, border: 'none', cursor: 'pointer', borderRadius: 4 }} /><input value={value} onChange={e => onChange(e.target.value)} style={{ width: 80, padding: '4px 6px', borderRadius: 4, border: '1px solid var(--border)', fontSize: 11, background: 'var(--bg-surface2)', color: 'var(--text-primary)' }} /></div> }
function ToggleRow({ label, enabled, onToggle }) { return <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: '1px solid var(--border)' }}><span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{label}</span><button onClick={onToggle} style={{ width: 44, height: 24, borderRadius: 12, border: 'none', background: enabled ? '#059669' : '#cbd5e1', cursor: 'pointer', position: 'relative' }}><div style={{ width: 18, height: 18, borderRadius: '50%', background: '#fff', position: 'absolute', top: 3, left: enabled ? 23 : 3, transition: 'all 0.2s' }} /></button></div> }

function StudioControl({ label, controlKey, min, max, value, onChange, step, unit, color = 'var(--accent-blue)', isBipolar, precision = 0 }) {
  const config = controlKey ? getControlConfig(controlKey) : {};
  const _min = min ?? config.min ?? 0;
  const _max = max ?? config.max ?? 100;
  const _step = step ?? config.step ?? 1;
  const _unit = unit ?? config.unit ?? '';
  const _isBipolar = isBipolar ?? config.isBipolar ?? false;
  const _value = value ?? config.default ?? 0;

  const [isDragging, setIsDragging] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [inputText, setInputText] = useState('');
  const rulerRef = useRef(null);
  const dragRef = useRef({ startX: 0, startValue: 0 });

  const range = _max - _min;
  const pct = ((_value - _min) / range) * 100;
  const neutralPct = _isBipolar ? ((0 - _min) / range) * 100 : 0;
  const clamped = (v) => Math.max(_min, Math.min(_max, Math.round(v / _step) * _step));

  useEffect(() => {
    const el = rulerRef.current;
    if (!el) return;
    const onWheel = (e) => {
      e.preventDefault();
      let s = _step;
      if (e.shiftKey) s = _step * 0.1;
      if (e.altKey) s = _step * 10;
      onChange(clamped(_value + (e.deltaY < 0 ? s : -s)));
    };
    el.addEventListener('wheel', onWheel, { passive: false });
    return () => el.removeEventListener('wheel', onWheel);
  }, [_value, _step, onChange]);

  const handleDoubleClick = () => onChange(_isBipolar ? 0 : _min);

  const handleLabelDrag = (e) => {
    e.preventDefault();
    dragRef.current = { startX: e.clientX, startValue: _value, rectWidth: 280 };
    setIsDragging(true);
    const onMove = (ev) => {
      const dx = ev.clientX - dragRef.current.startX;
      const sensitivity = 3;
      const dv = (dx / sensitivity) * _step;
      onChange(clamped(dragRef.current.startValue + dv));
    };
    const onUp = () => {
      setIsDragging(false);
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
    };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
  };

  const handleRulerDown = (e) => {
    e.preventDefault();
    const rect = rulerRef.current.getBoundingClientRect();
    const ratio = (e.clientX - rect.left) / rect.width;
    const clickedVal = clamped(_min + ratio * range);
    onChange(clickedVal);
    dragRef.current = { startX: e.clientX, startValue: clickedVal, rectWidth: rect.width };
    setIsDragging(true);
    const onMove = (ev) => {
      const dx = ev.clientX - dragRef.current.startX;
      const dv = (dx / dragRef.current.rectWidth) * range;
      onChange(clamped(dragRef.current.startValue + dv));
    };
    const onUp = () => {
      setIsDragging(false);
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
    };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
  };

  const handleInputFocus = () => { setIsEditing(true); setInputText(String(_value)); };
  const handleInputChange = (e) => { setInputText(e.target.value); const p = parseFloat(e.target.value); if (!isNaN(p)) onChange(clamped(p)); };
  const handleInputBlur = () => { setIsEditing(false); const p = parseFloat(inputText); if (!isNaN(p)) onChange(clamped(p)); };
  const handleInputKey = (e) => {
    if (e.key === 'Enter') e.target.blur();
    if (e.key === 'Escape') { setInputText(String(_value)); setIsEditing(false); }
    if (e.key === 'ArrowUp') { e.preventDefault(); onChange(clamped(_value + _step)); }
    if (e.key === 'ArrowDown') { e.preventDefault(); onChange(clamped(_value - _step)); }
  };

  const displayVal = isEditing ? inputText : (precision > 0 ? _value.toFixed(precision) : Math.round(_value));

  return (
    <div style={{ marginBottom: 14 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
        <span onMouseDown={handleLabelDrag} onDoubleClick={handleDoubleClick}
          style={{ fontSize: 10, fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '.5px', cursor: 'ew-resize', userSelect: 'none', padding: '2px 4px', borderRadius: 3, background: isDragging ? `${color}11` : 'transparent', transition: 'background .15s' }}>{label}</span>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <div ref={rulerRef} onMouseDown={handleRulerDown} onDoubleClick={handleDoubleClick}
          style={{ flex: 1, position: 'relative', height: 26, cursor: isDragging ? 'grabbing' : 'ew-resize', userSelect: 'none', borderRadius: 4, background: isDragging ? `${color}06` : 'transparent', transition: 'background .2s' }}>
          {[0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100].map(i => {
            const isMajor = i % 25 === 0;
            const isCenter = i === 50 && _isBipolar;
            return <div key={i} style={{ position: 'absolute', left: `${i}%`, top: 8, width: isCenter ? 2 : isMajor ? 1.5 : 1, height: isCenter ? 16 : isMajor ? 10 : 5, background: isCenter ? color : 'var(--text-secondary)', opacity: isCenter ? 0.9 : isMajor ? 0.55 : 0.25, transform: 'translateX(-50%)', borderRadius: isCenter ? 1 : 0 }} />;
          })}
          <div style={{ position: 'absolute', left: 0, right: 0, top: 8, height: 1, background: 'var(--border)', borderRadius: 1, zIndex: 1 }} />
          {_isBipolar && <div style={{ position: 'absolute', top: 8, height: 1, left: `${Math.min(neutralPct, pct)}%`, width: `${Math.abs(pct - neutralPct)}%`, background: color, opacity: 0.7, borderRadius: 1, transition: isDragging ? 'none' : 'left .1s ease, width .1s ease', pointerEvents: 'none' }} />}
          {!_isBipolar && <div style={{ position: 'absolute', top: 8, height: 1, left: 0, width: `${pct}%`, background: `linear-gradient(90deg, ${color}44, ${color})`, borderRadius: 1, transition: isDragging ? 'none' : 'width .1s ease', pointerEvents: 'none' }} />}
          {_isBipolar && isDragging && <div style={{ position: 'absolute', top: 2, height: 14, left: `${Math.min(neutralPct, pct)}%`, width: `${Math.abs(pct - neutralPct)}%`, background: `${color}11`, borderRadius: 4, pointerEvents: 'none' }} />}
          <div style={{ position: 'absolute', left: `${pct}%`, top: 3, display: 'flex', alignItems: 'center', justifyContent: 'center', transform: 'translateX(-50%)', pointerEvents: 'none', zIndex: 3, transition: isDragging ? 'none' : 'left .1s ease' }}>
            <span style={{ fontSize: 12, fontWeight: 800, color: color, lineHeight: 1, background: 'var(--bg-surface)', padding: '0 2px', borderRadius: 2, textShadow: isDragging ? `0 0 10px ${color}` : `0 0 3px ${color}44`, transition: 'text-shadow .2s' }}>0</span>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 2, flexShrink: 0 }}>
          <input type="text" value={displayVal} onFocus={handleInputFocus} onChange={handleInputChange} onBlur={handleInputBlur} onKeyDown={handleInputKey}
            style={{ width: 50, padding: '3px 6px', borderRadius: 4, border: `1px solid ${isEditing ? color : 'var(--border)'}`, background: isEditing ? 'var(--bg-surface)' : 'var(--bg-surface2)', color: 'var(--text-primary)', fontSize: 11, textAlign: 'center', fontVariantNumeric: 'tabular-nums', outline: 'none', boxShadow: isEditing ? `0 0 0 2px ${color}22` : 'none', transition: 'all .15s' }} />
          {_unit && <span style={{ fontSize: 10, color: 'var(--text-secondary)', width: 20 }}>{_unit}</span>}
        </div>
      </div>
    </div>
  );
}