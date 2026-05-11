// src/screens/admin/AdminProfessions.jsx
import { useState, useEffect, useCallback } from 'react';
import { api } from '../../services/api.js';

export default function AdminProfessions() {
  const [professions, setProfessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingProf, setEditingProf] = useState(null);
  const [expandedProf, setExpandedProf] = useState(null);
  const [services, setServices] = useState({});
  const [form, setForm] = useState({ slug: '', name: '', name_np: '', icon: '', sort_order: 0 });
  const [svcForm, setSvcForm] = useState({ label: '', label_np: '', base_price: '' });
  const [addingSvc, setAddingSvc] = useState(false);
  const [editingSvcId, setEditingSvcId] = useState(null);
  const [editSvcForm, setEditSvcForm] = useState({ label: '', label_np: '', base_price: '' });

  const loadProfessions = async () => {
    try {
      const res = await api.getAdminProfessions();
      setProfessions(res?.data || []);
    } catch (err) { console.error('Failed to load professions:', err); }
    setLoading(false);
  };

  const loadServices = async (profId) => {
    try {
      const res = await api.getProfessionServices(profId);
      setServices(prev => ({ ...prev, [profId]: res?.data || [] }));
    } catch (err) { console.error('Failed to load services:', err); }
  };

  useEffect(() => { loadProfessions(); }, []);

  const resetProfForm = () => setForm({ slug: '', name: '', name_np: '', icon: '', sort_order: 0 });
  const resetSvcForm = () => setSvcForm({ label: '', label_np: '', base_price: '' });
  const resetEditSvcForm = () => setEditSvcForm({ label: '', label_np: '', base_price: '' });

  // ── Profession handlers ──
  const handleSaveProf = async () => {
    if (!form.slug || !form.name) return alert('Slug and Name are required');
    try {
      if (editingProf) await api.updateAdminProfession(editingProf, form);
      else await api.createAdminProfession(form);
      resetProfForm(); setEditingProf(null); loadProfessions();
    } catch (err) { alert(err.message || 'Save failed'); }
  };

  const handleEditProf = (prof) => {
    setEditingProf(prof.id);
    setForm({ slug: prof.slug, name: prof.name, name_np: prof.name_np || '', icon: prof.icon || '', sort_order: prof.sort_order || 0 });
  };

  const handleDeactivateProf = async (id) => {
    if (!confirm('Deactivate this profession?')) return;
    try { await api.deleteAdminProfession(id); loadProfessions(); }
    catch (err) { alert(err.message || 'Failed to deactivate'); }
  };

  const toggleExpand = (profId) => {
    if (expandedProf === profId) { setExpandedProf(null); setAddingSvc(false); return; }
    setExpandedProf(profId);
    setAddingSvc(false);
    if (!services[profId]) loadServices(profId);
  };

  // ── Service handlers ──
  const handleSaveSvc = async () => {
    if (!svcForm.label) return alert('Service label is required');
    try {
      await api.createProfessionService({
        profession_id: expandedProf,
        label: svcForm.label,
        label_np: svcForm.label_np || null,
        sort_order: 0,
        base_price: svcForm.base_price ? parseFloat(svcForm.base_price) : null,
      });
      resetSvcForm(); setAddingSvc(false); loadServices(expandedProf);
    } catch (err) { alert(err.message || 'Failed to add service'); }
  };

  const handleUpdateSvc = async (svcId, data) => {
    try { await api.updateProfessionService(svcId, data); loadServices(expandedProf); }
    catch (err) { alert(err.message || 'Update failed'); }
  };

  const handleToggleActive = async (svcId, current) => {
    try {
      await api.updateProfessionService(svcId, { is_active: !current });
      loadServices(expandedProf);
    } catch (err) { alert(err.message || 'Toggle failed'); }
  };

  const handleDeleteSvc = async (svcId) => {
    if (!confirm('Permanently delete this service?')) return;
    try { await api.deleteProfessionService(svcId); loadServices(expandedProf); }
    catch (err) { alert(err.message || 'Delete failed'); }
  };

  if (loading) return <div style={{ padding: 24, color: 'var(--text-secondary)' }}>Loading…</div>;

  return (
    <div>
      {/* ── Profession Form ── */}
      <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', padding: 16, marginBottom: 20 }}>
        <h3 style={{ margin: '0 0 12px', color: 'var(--text-primary)', fontSize: 16 }}>
          {editingProf ? 'Edit Profession' : 'Add Profession'}
        </h3>
        <div style={{ display: 'grid', gap: 8, gridTemplateColumns: '1fr 1fr' }}>
          <input placeholder="Slug (e.g. plumber)" value={form.slug} onChange={e => setForm({...form, slug: e.target.value})} style={inputStyle} />
          <input placeholder="Name (English)" value={form.name} onChange={e => setForm({...form, name: e.target.value})} style={inputStyle} />
          <input placeholder="Name (Nepali)" value={form.name_np} onChange={e => setForm({...form, name_np: e.target.value})} style={inputStyle} />
          <input placeholder="Icon (emoji)" value={form.icon} onChange={e => setForm({...form, icon: e.target.value})} style={inputStyle} />
        </div>
        <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
          <button onClick={handleSaveProf} style={{ padding: '8px 20px', borderRadius: 8, border: 'none', background: 'var(--accent-blue)', color: '#fff', fontWeight: 600, cursor: 'pointer' }}>
            {editingProf ? 'Update' : 'Create'}
          </button>
          {editingProf && (
            <button onClick={() => { setEditingProf(null); resetProfForm(); }} style={{ padding: '8px 20px', borderRadius: 8, border: '1px solid var(--border)', background: 'transparent', color: 'var(--text-secondary)', fontWeight: 600, cursor: 'pointer' }}>
              Cancel
            </button>
          )}
        </div>
      </div>

      {/* ── Profession List ── */}
      <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', overflow: 'hidden' }}>
        {professions.length === 0 ? (
          <div style={{ padding: 24, textAlign: 'center', color: 'var(--text-secondary)' }}>No professions yet</div>
        ) : (
          professions.map((p, i) => {
            const isExpanded = expandedProf === p.id;
            const svcList = services[p.id] || [];
            return (
              <div key={p.id} style={{
                borderBottom: i === professions.length - 1 ? 'none' : '1px solid var(--border)',
                opacity: p.is_active ? 1 : 0.5,
              }}>
                <div onClick={() => toggleExpand(p.id)} style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '14px 16px', cursor: 'pointer',
                  background: isExpanded ? 'var(--accent-blue-light)' : 'transparent',
                }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 'var(--font-body-sm)', fontWeight: 600, color: 'var(--text-primary)' }}>
                      {p.icon && <span style={{ marginRight: 8 }}>{p.icon}</span>}
                      {p.name}
                      {!p.is_active && <span style={{ marginLeft: 8, fontSize: 10, color: 'var(--accent-red)' }}>(inactive)</span>}
                    </div>
                    <div style={{ fontSize: 'var(--font-caption)', color: 'var(--text-secondary)' }}>
                      slug: {p.slug} / sort: {p.sort_order}
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: 8, flexShrink: 0 }} onClick={e => e.stopPropagation()}>
                    <button onClick={() => handleEditProf(p)} style={actionBtn}>Edit</button>
                    <button onClick={() => handleDeactivateProf(p.id)} style={{...actionBtn, color: 'var(--accent-red)', borderColor: 'var(--accent-red)'}}>
                      Deactivate
                    </button>
                  </div>
                </div>

                {isExpanded && (
                  <div style={{ padding: '0 16px 12px' }}>
                    <div style={{ fontSize: 'var(--font-body-sm)', fontWeight: 600, marginBottom: 8, color: 'var(--text-primary)' }}>
                      Services
                    </div>
                    {svcList.length === 0 && !addingSvc ? (
                      <div style={{ fontSize: 'var(--font-caption)', color: 'var(--text-secondary)', marginBottom: 8 }}>
                        No services defined for this profession.
                      </div>
                    ) : (
                      svcList.map(svc => {
                        const isEditingThis = editingSvcId === svc.id;
                        return (
                          <div key={svc.id} style={{
                            display: 'flex', alignItems: 'center', gap: 8,
                            marginBottom: 6, padding: '4px 0',
                            borderBottom: '1px solid var(--border)',
                            flexWrap: 'wrap',
                          }}>
                            {isEditingThis ? (
                              <>
                                <input value={editSvcForm.label}
                                  onChange={e => setEditSvcForm(prev => ({ ...prev, label: e.target.value }))}
                                  placeholder="Service name" style={{ ...inputStyle, flex: 2, minWidth: 120 }} />
                                <input value={editSvcForm.label_np}
                                  onChange={e => setEditSvcForm(prev => ({ ...prev, label_np: e.target.value }))}
                                  placeholder="Nepali" style={{ ...inputStyle, flex: 1, minWidth: 100 }} />
                                <input type="number" value={editSvcForm.base_price}
                                  onChange={e => setEditSvcForm(prev => ({ ...prev, base_price: e.target.value }))}
                                  placeholder="Price" style={{ ...inputStyle, width: 80 }} />
                                <button onClick={async () => {
                                  await handleUpdateSvc(svc.id, {
                                    label: editSvcForm.label,
                                    label_np: editSvcForm.label_np,
                                    base_price: editSvcForm.base_price ? parseFloat(editSvcForm.base_price) : null,
                                  });
                                  setEditingSvcId(null); resetEditSvcForm();
                                }} style={{ ...actionBtn, background: 'var(--accent-blue)', color: '#fff', border: 'none' }}>Save</button>
                                <button onClick={() => { setEditingSvcId(null); resetEditSvcForm(); }} style={actionBtn}>Cancel</button>
                              </>
                            ) : (
                              <>
                                <div style={{ flex: 2, minWidth: 120 }}>
                                  <div style={{ fontSize: 'var(--font-body-sm)', fontWeight: 500, color: 'var(--text-primary)' }}>{svc.label}</div>
                                  {svc.label_np && <div style={{ fontSize: 10, color: 'var(--text-secondary)' }}>{svc.label_np}</div>}
                                </div>
                                <div style={{ flex: 1, minWidth: 80, fontSize: 'var(--font-caption)', color: 'var(--text-secondary)', textAlign: 'right' }}>
                                  {svc.base_price ? `Rs ${parseFloat(svc.base_price).toLocaleString()}` : '—'}
                                </div>
                                <span style={{ fontSize: 10, color: svc.is_active ? 'var(--accent-green)' : 'var(--accent-red)', fontWeight: 600, minWidth: 50, textAlign: 'center' }}>
                                  {svc.is_active ? 'Active' : 'Inactive'}
                                </span>
                                <button onClick={() => handleToggleActive(svc.id, svc.is_active)} style={{ ...actionBtn, fontSize: 10, padding: '2px 8px' }}>
                                  {svc.is_active ? 'Deactivate' : 'Activate'}
                                </button>
                                <button onClick={() => {
                                  setEditingSvcId(svc.id);
                                  setEditSvcForm({ label: svc.label, label_np: svc.label_np || '', base_price: svc.base_price || '' });
                                }} style={{ ...actionBtn, fontSize: 10, padding: '2px 8px' }}>✏️</button>
                                <button onClick={() => handleDeleteSvc(svc.id)} style={{ ...actionBtn, fontSize: 10, padding: '2px 8px', color: 'var(--accent-red)', borderColor: 'var(--accent-red)' }}>🗑️</button>
                              </>
                            )}
                          </div>
                        );
                      })
                    )}

                    {addingSvc ? (
                      <div style={{ display: 'flex', gap: 8, marginTop: 8, alignItems: 'center', flexWrap: 'wrap' }}>
                        <input placeholder="Service name (English)" value={svcForm.label}
                          onChange={e => setSvcForm({...svcForm, label: e.target.value})}
                          style={{ ...inputStyle, flex: 2, minWidth: 120 }} />
                        <input placeholder="Nepali (optional)" value={svcForm.label_np}
                          onChange={e => setSvcForm({...svcForm, label_np: e.target.value})}
                          style={{ ...inputStyle, flex: 1, minWidth: 100 }} />
                        <input placeholder="Price (Rs)" type="number" value={svcForm.base_price}
                          onChange={e => setSvcForm({...svcForm, base_price: e.target.value})}
                          style={{ ...inputStyle, width: 100, minWidth: 80 }} />
                        <button onClick={handleSaveSvc} style={{ ...actionBtn, background: 'var(--accent-blue)', color: '#fff', border: 'none', flexShrink: 0 }}>Save</button>
                        <button onClick={() => { setAddingSvc(false); resetSvcForm(); }} style={{ ...actionBtn, flexShrink: 0 }}>Cancel</button>
                      </div>
                    ) : (
                      <button onClick={() => setAddingSvc(true)} style={{
                        marginTop: 8, padding: '4px 12px', borderRadius: 4,
                        border: '1px dashed var(--border)', background: 'transparent',
                        color: 'var(--accent-blue)', fontSize: 11, fontWeight: 500, cursor: 'pointer'
                      }}>+ Add Service</button>
                    )}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

const inputStyle = {
  padding: '8px 10px',
  borderRadius: 'var(--radius-sm)',
  border: '1px solid var(--border)',
  background: 'var(--bg-surface2)',
  color: 'var(--text-primary)',
  fontSize: 13,
};

const actionBtn = {
  padding: '4px 12px',
  borderRadius: 4,
  border: '1px solid var(--border)',
  background: 'transparent',
  color: 'var(--text-primary)',
  fontSize: 11,
  fontWeight: 500,
  cursor: 'pointer',
};