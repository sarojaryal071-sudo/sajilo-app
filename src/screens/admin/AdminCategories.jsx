import { useState } from 'react'
import { services } from '../../config/data.js'

const ICONS = ['⚡', '🔧', '🧹', '🪚', '🚚', '📚', '🔩', '🎨', '💻', '🚗', '🏥', '🍳']

export default function AdminCategories() {
  const [categories, setCategories] = useState(services)
  const [showModal, setShowModal] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState({ name: '', icon: '⚡', smallPrice: '500', mediumPrice: '1500', largePrice: '4000', active: true })

  const openAdd = () => {
    setEditing(null)
    setForm({ name: '', icon: '⚡', smallPrice: '500', mediumPrice: '1500', largePrice: '4000', active: true })
    setShowModal(true)
  }

  const openEdit = (cat) => {
    setEditing(cat.id)
    setForm({ name: cat.name, icon: cat.icon, smallPrice: '500', mediumPrice: '1500', largePrice: '4000', active: true })
    setShowModal(true)
  }

  const handleSave = () => {
    if (editing) {
      setCategories(prev => prev.map(c => c.id === editing ? { ...c, name: form.name, icon: form.icon } : c))
    } else {
      setCategories(prev => [...prev, { id: Date.now().toString(), name: form.name, icon: form.icon, bg: '#EBF3FF' }])
    }
    setShowModal(false)
  }

  const toggleActive = (id) => {
    setCategories(prev => prev.map(c => c.id === id ? { ...c, active: !c.active } : c))
  }

  const deleteCategory = (id) => {
    setCategories(prev => prev.filter(c => c.id !== id))
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <h2 style={{ fontSize: 20, fontWeight: 700, color: '#1e293b', margin: 0 }}>Service Categories</h2>
        <button onClick={openAdd} style={{
          padding: '10px 20px', borderRadius: 8, border: 'none',
          background: '#1A56DB', color: '#fff', fontSize: 13, fontWeight: 600, cursor: 'pointer',
        }}>+ Add Category</button>
      </div>

      {/* Category Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14 }}>
        {categories.map((cat) => (
          <div key={cat.id} style={{
            background: '#fff', borderRadius: 10, border: '1px solid #e2e8f0', padding: 18,
            opacity: cat.active === false ? 0.5 : 1,
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
              <div style={{
                width: 44, height: 44, borderRadius: 10, background: cat.bg || '#f1f5f9',
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22,
              }}>{cat.icon}</div>
              <div style={{ display: 'flex', gap: 6 }}>
                <button onClick={() => toggleActive(cat.id)} style={{
                  width: 32, height: 32, borderRadius: 6, border: '1px solid #e2e8f0',
                  background: cat.active !== false ? '#dcfce7' : '#fee2e2',
                  fontSize: 14, cursor: 'pointer',
                }}>{cat.active !== false ? '✓' : '✕'}</button>
              </div>
            </div>
            <div style={{ fontSize: 14, fontWeight: 600, color: '#1e293b', marginBottom: 4 }}>{cat.name}</div>
            <div style={{ fontSize: 12, color: '#94a3b8', marginBottom: 8 }}>
              Rs 500 – 4000
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button onClick={() => openEdit(cat)} style={{
                flex: 1, padding: '6px 0', borderRadius: 6, border: '1px solid #e2e8f0',
                background: '#fff', color: '#1A56DB', fontSize: 12, fontWeight: 500, cursor: 'pointer',
              }}>Edit</button>
              <button onClick={() => deleteCategory(cat.id)} style={{
                flex: 1, padding: '6px 0', borderRadius: 6, border: '1px solid #fee2e2',
                background: '#fff', color: '#DC2626', fontSize: 12, fontWeight: 500, cursor: 'pointer',
              }}>Delete</button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {showModal && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000,
        }} onClick={() => setShowModal(false)}>
          <div style={{
            background: '#fff', borderRadius: 14, padding: 28, width: 420,
            boxShadow: '0 20px 60px rgba(0,0,0,0.2)',
          }} onClick={e => e.stopPropagation()}>
            <h3 style={{ fontSize: 18, fontWeight: 700, color: '#1e293b', marginBottom: 20 }}>
              {editing ? 'Edit Category' : 'Add Category'}
            </h3>

            {/* Icon picker */}
            <label style={{ fontSize: 12, fontWeight: 600, color: '#64748b', display: 'block', marginBottom: 6 }}>Icon</label>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 16 }}>
              {ICONS.map((icon) => (
                <button key={icon} onClick={() => setForm(prev => ({ ...prev, icon }))} style={{
                  width: 36, height: 36, borderRadius: 8, border: form.icon === icon ? '2px solid #1A56DB' : '1px solid #e2e8f0',
                  background: form.icon === icon ? '#eff6ff' : '#fff', fontSize: 18, cursor: 'pointer',
                }}>{icon}</button>
              ))}
            </div>

            <label style={{ fontSize: 12, fontWeight: 600, color: '#64748b', display: 'block', marginBottom: 6 }}>Category Name</label>
            <input value={form.name} onChange={(e) => setForm(prev => ({ ...prev, name: e.target.value }))} placeholder="e.g. Freelance Drivers" style={{
              width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid #e2e8f0', fontSize: 14, marginBottom: 16, outline: 'none',
            }} />

            <div style={{ display: 'flex', gap: 10, marginBottom: 20 }}>
              {['small', 'medium', 'large'].map((size) => (
                <div key={size} style={{ flex: 1 }}>
                  <label style={{ fontSize: 11, fontWeight: 600, color: '#64748b', display: 'block', marginBottom: 4, textTransform: 'capitalize' }}>{size} (Rs)</label>
                  <input value={form[`${size}Price`]} onChange={(e) => setForm(prev => ({ ...prev, [`${size}Price`]: e.target.value }))} style={{
                    width: '100%', padding: '8px', borderRadius: 6, border: '1px solid #e2e8f0', fontSize: 13, outline: 'none',
                  }} />
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', gap: 10 }}>
              <button onClick={() => setShowModal(false)} style={{
                flex: 1, padding: '10px 0', borderRadius: 8, border: '1px solid #e2e8f0',
                background: '#fff', color: '#64748b', fontSize: 13, fontWeight: 600, cursor: 'pointer',
              }}>Cancel</button>
              <button onClick={handleSave} style={{
                flex: 1, padding: '10px 0', borderRadius: 8, border: 'none',
                background: '#1A56DB', color: '#fff', fontSize: 13, fontWeight: 600, cursor: 'pointer',
              }}>{editing ? 'Update' : 'Add Category'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}