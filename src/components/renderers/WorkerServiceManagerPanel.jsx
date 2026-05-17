import React from 'react';
import { api } from '../../services/api.js';
import { useContent } from '../../hooks/useContent.js';

export default function WorkerServiceManagerPanel({ overrideData, elementConfig }) {
  const professions = overrideData?.workerServices || [];
  const [activeProfId, setActiveProfId] = React.useState(null);
  const [showAddForm, setShowAddForm] = React.useState(false);
  const [newCustomLabel, setNewCustomLabel] = React.useState('');
  const [newCustomPrice, setNewCustomPrice] = React.useState('');
  const [newCustomNepali, setNewCustomNepali] = React.useState('');
  const [localServices, setLocalServices] = React.useState({});
  const [showChecklist, setShowChecklist] = React.useState(false);
  const [editingPriceId, setEditingPriceId] = React.useState(null);
  const [editPriceValue, setEditPriceValue] = React.useState('');
  const [editingSvcId, setEditingSvcId] = React.useState(null);
  const [editSvcLabel, setEditSvcLabel] = React.useState('');
  const [editSvcNepali, setEditSvcNepali] = React.useState('');
  const [checkedServices, setCheckedServices] = React.useState(new Set());
  const [jobSizeRanges, setJobSizeRanges] = React.useState({
    defaultRanges: { small_max_price: 1000, medium_max_price: 3000 },
    professionRanges: {},
  });
  const [rangesLoading, setRangesLoading] = React.useState(true);
  const [activeProfRange, setActiveProfRange] = React.useState({
    small: '',
    medium: '',
  });

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

  React.useEffect(() => {
    api.getJobSizeRanges?.()
      .then(res => {
        if (res?.success && res.data) {
          const data = res.data;
          setJobSizeRanges({
            defaultRanges: data.default_ranges || { small_max_price: 1000, medium_max_price: 3000 },
            professionRanges: data.profession_ranges || {},
          });
        }
      })
      .catch(() => {})
      .finally(() => setRangesLoading(false));
  }, []);

  React.useEffect(() => {
    if (!activeProfId) return;
    const profOverride = jobSizeRanges.professionRanges[activeProfId];
    const source = profOverride || jobSizeRanges.defaultRanges;
    setActiveProfRange({
      small: source.small_max_price?.toString() || '',
      medium: source.medium_max_price?.toString() || '',
    });
  }, [activeProfId, jobSizeRanges]);

  React.useEffect(() => {
    if (professions.length > 0 && !activeProfId) {
      setActiveProfId(professions[0].id);
      setLocalServices(prev => ({
        ...prev,
        [professions[0].id]: professions[0].services || [],
      }));
    }
  }, [professions]);

  const activeProf = professions.find(p => p.id === activeProfId);
  const allServices = (localServices[activeProfId] || activeProf?.services || [])
    .filter(s => s.worker_service_id || s.is_custom);

  const activatedIds = new Set(
    allServices.filter(s => s.worker_service_id).map(s => s.service_id)
  );
  const catalogueServices = (localServices[activeProfId] || activeProf?.services || [])
    .filter(s => !s.is_custom);

  const toggleService = async (wsId, isActive) => {
    try {
      await api.updateWorkerService(wsId, { is_active: isActive });
      setLocalServices(prev => {
        const updated = { ...prev };
        const list = updated[activeProfId] || [];
        updated[activeProfId] = list.map(s =>
          s.worker_service_id === wsId ? { ...s, is_active: isActive } : s
        );
        return updated;
      });
    } catch (err) { alert('Failed to update service: ' + err.message); }
  };

  const updatePrice = async (wsId, price) => {
    try {
      await api.updateWorkerService(wsId, { price });
      setLocalServices(prev => {
        const updated = { ...prev };
        const list = updated[activeProfId] || [];
        updated[activeProfId] = list.map(s =>
          s.worker_service_id === wsId ? { ...s, worker_price: price } : s
        );
        return updated;
      });
    } catch (err) { alert('Failed to update price: ' + err.message); }
  };

  const addCustomService = async () => {
    if (!newCustomLabel.trim()) return alert('Please enter a service name');
    const price = parseFloat(newCustomPrice) || 0;
    try {
      const res = await api.createWorkerCustomService({
        profession_id: activeProfId,
        custom_label: newCustomLabel,
        custom_label_np: newCustomNepali,
        price,
      });
      const created = res?.data;
      if (created) {
        setLocalServices(prev => {
          const updated = { ...prev };
          updated[activeProfId] = [
            ...(updated[activeProfId] || []),
            {
              service_id: null,
              label: created.custom_label,
              is_custom: true,
              worker_price: created.price,
              is_active: created.is_active,
              worker_service_id: created.id,
              base_price: null,
              custom_label_np: created.custom_label_np,
            },
          ];
          return updated;
        });
      }
      setNewCustomLabel('');
      setNewCustomPrice('');
      setNewCustomNepali('');
      setShowAddForm(false);
    } catch (err) { alert('Failed to add custom service: ' + err.message); }
  };

  const confirmChecklist = async () => {
    if (checkedServices.size === 0) return;
    const promises = Array.from(checkedServices)
      .filter(svcId => !activatedIds.has(svcId))
      .map(svcId => api.activateWorkerService(svcId, activeProfId));
    try {
      await Promise.all(promises);
      const res = await api.getMyServices();
      const freshProfs = res?.data?.professions || [];
      setLocalServices(prev => {
        const updated = { ...prev };
        freshProfs.forEach(p => {
          updated[p.id] = p.services || [];
        });
        return updated;
      });
    } catch (err) { alert('Some services could not be activated'); }
    setShowChecklist(false);
    setCheckedServices(new Set());
  };

  const toggleCheck = (svcId) => {
    setCheckedServices(prev => {
      const next = new Set(prev);
      if (next.has(svcId)) next.delete(svcId);
      else next.add(svcId);
      return next;
    });
  };

  return (
    <div style={{ padding: '0 16px' }}>
      {/* Profession pills */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 16, overflowX: 'auto', paddingBottom: 4 }}>
        {professions.map(prof => (
          <button key={prof.id} onClick={() => {
            setActiveProfId(prof.id);
            if (!localServices[prof.id]) {
              setLocalServices(prev => ({ ...prev, [prof.id]: prof.services || [] }));
            }
          }} style={{
            padding: '8px 16px', borderRadius: 20,
            border: '1px solid var(--border)',
            background: activeProfId === prof.id ? 'var(--accent-blue)' : 'transparent',
            color: activeProfId === prof.id ? '#fff' : 'var(--text-secondary)',
            fontSize: 'var(--font-body-sm)', fontWeight: 600,
            cursor: 'pointer', whiteSpace: 'nowrap', flexShrink: 0,
          }}>
            {prof.icon && <span style={{ marginRight: 4 }}>{prof.icon}</span>}
            {prof.name}
          </button>
        ))}
      </div>

      {/* Per‑Profession Job Size Ranges */}
      {activeProfId && (
        <div style={{
          background: 'var(--bg-surface)', border: '1px solid var(--border)',
          borderRadius: 'var(--radius-md)', padding: 12, marginBottom: 16,
        }}>
          <div style={{ fontSize: 'var(--font-body-sm)', fontWeight: 600, color: 'var(--text-primary)', marginBottom: 6 }}>
            Job Size Ranges – {activeProf?.name || 'Profession'}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
            <span style={{ fontSize: 'var(--font-body-sm)', color: 'var(--text-secondary)', whiteSpace: 'nowrap' }}>Small up to</span>
            <input type="number" value={activeProfRange.small} onChange={e => setActiveProfRange(prev => ({ ...prev, small: e.target.value }))} placeholder="1000" style={{ ...inputStyle, width: 80 }} />
            <span style={{ fontSize: 'var(--font-body-sm)', color: 'var(--text-secondary)', marginLeft: 8, whiteSpace: 'nowrap' }}>Medium up to</span>
            <input type="number" value={activeProfRange.medium} onChange={e => setActiveProfRange(prev => ({ ...prev, medium: e.target.value }))} placeholder="3000" style={{ ...inputStyle, width: 80 }} />
            <button onClick={async () => {
              const sm = parseFloat(activeProfRange.small);
              const mm = parseFloat(activeProfRange.medium);
              if (isNaN(sm) || isNaN(mm) || sm <= 0 || mm <= 0 || sm >= mm) {
                alert('Invalid ranges: small must be > 0, medium > 0, and small < medium');
                return;
              }
              try {
                await api.saveJobSizeRanges?.({
                  profession_id: activeProfId,
                  small_max_price: sm,
                  medium_max_price: mm,
                });
                setJobSizeRanges(prev => {
                  const updated = { ...prev };
                  if (activeProfId) {
                    updated.professionRanges = {
                      ...prev.professionRanges,
                      [activeProfId]: { small_max_price: sm, medium_max_price: mm },
                    };
                  }
                  return updated;
                });
                alert('Ranges saved');
              } catch (err) { alert(err.message || 'Failed to save ranges'); }
            }} style={{ ...actionBtn, background: 'var(--accent-blue)', color: '#fff', border: 'none', marginLeft: 8 }}>Save Ranges</button>
          </div>
          <div style={{ fontSize: 'var(--font-caption)', color: 'var(--text-secondary)', marginTop: 6 }}>Large jobs are above Rs {activeProfRange.medium || '—'}</div>
        </div>
      )}

      {/* Services list */}
      <div style={{ marginBottom: 16 }}>
        {allServices.length === 0 && !showAddForm ? (
          <div style={{ padding: 20, textAlign: 'center', color: 'var(--text-secondary)', fontSize: 'var(--font-body-sm)' }}>No services configured yet.</div>
        ) : (
          allServices.map((svc, idx) => (
            <div key={svc.worker_service_id || idx} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 0', borderBottom: '1px solid var(--border)', flexWrap: 'wrap' }}>
              {editingSvcId === svc.worker_service_id ? (
                <>
                  <input value={editSvcLabel} onChange={e => setEditSvcLabel(e.target.value)} placeholder="Service name" style={{ ...inputStyle, flex: 2, minWidth: 120 }} />
                  <input value={editSvcNepali} onChange={e => setEditSvcNepali(e.target.value)} placeholder="Nepali" style={{ ...inputStyle, flex: 1, minWidth: 100 }} />
                  <input type="number" value={editPriceValue} onChange={e => setEditPriceValue(e.target.value)} placeholder="Price" style={{ ...inputStyle, width: 80 }} />
                  <button onClick={async () => { const price = parseFloat(editPriceValue); if (!isNaN(price) && svc.worker_service_id) await updatePrice(svc.worker_service_id, price); setEditingSvcId(null); setEditSvcLabel(''); setEditSvcNepali(''); setEditPriceValue(''); }} style={{ ...actionBtn, background: 'var(--accent-blue)', color: '#fff', border: 'none' }}>Save</button>
                  <button onClick={() => { setEditingSvcId(null); setEditSvcLabel(''); setEditSvcNepali(''); setEditPriceValue(''); }} style={actionBtn}>Cancel</button>
                </>
              ) : (
                <>
                  <div style={{ flex: 2, minWidth: 120 }}>
                    <div style={{ fontSize: 'var(--font-body-sm)', fontWeight: 600, color: 'var(--text-primary)' }}>{svc.label}{svc.is_custom && <span style={{ marginLeft: 8, fontSize: 10, color: 'var(--accent-blue)', background: 'var(--accent-blue-light)', padding: '2px 6px', borderRadius: 8 }}>Custom</span>}</div>
                    {(svc.label_np || svc.custom_label_np) && <div style={{ fontSize: 10, color: 'var(--text-secondary)' }}>{svc.label_np || svc.custom_label_np}</div>}
                  </div>
                  <div style={{ flex: 1, minWidth: 80, textAlign: 'right', display: 'flex', alignItems: 'center', gap: 6, justifyContent: 'flex-end' }}>
                    {editingPriceId === svc.worker_service_id ? (
                      <>
                        <input type="number" value={editPriceValue} onChange={e => setEditPriceValue(e.target.value)} onKeyDown={e => { if (e.key === 'Enter') e.target.blur(); if (e.key === 'Escape') { setEditingPriceId(null); setEditPriceValue(''); } }} style={{ ...inputStyle, width: 80, textAlign: 'right' }} autoFocus />
                        <button onClick={async () => { const val = parseFloat(editPriceValue); if (!isNaN(val) && svc.worker_service_id) await updatePrice(svc.worker_service_id, val); setEditingPriceId(null); setEditPriceValue(''); }} style={{ ...actionBtn, background: 'var(--accent-blue)', color: '#fff', border: 'none', padding: '4px 8px' }}>Save</button>
                        <button onClick={() => { setEditingPriceId(null); setEditPriceValue(''); }} style={actionBtn}>Cancel</button>
                      </>
                    ) : (
                      <span onClick={() => { setEditingPriceId(svc.worker_service_id); setEditPriceValue(svc.worker_price || ''); }} style={{ cursor: 'pointer', fontSize: 'var(--font-body-sm)', color: svc.worker_price ? 'var(--text-primary)' : 'var(--text-secondary)', fontWeight: svc.worker_price ? 600 : 400 }}>{svc.worker_price ? `Rs ${parseFloat(svc.worker_price).toLocaleString()}` : 'Set price'}</span>
                    )}
                  </div>
                  <span style={{ fontSize: 10, color: svc.is_active ? 'var(--accent-green)' : 'var(--accent-red)', fontWeight: 600, minWidth: 50, textAlign: 'center' }}>{svc.is_active ? 'Active' : 'Inactive'}</span>
                  <button onClick={() => toggleService(svc.worker_service_id, !svc.is_active)} style={{ ...actionBtn, fontSize: 10, padding: '2px 8px' }}>{svc.is_active ? 'Deactivate' : 'Activate'}</button>
                  <button onClick={() => { setEditingSvcId(svc.worker_service_id); setEditSvcLabel(svc.label); setEditSvcNepali(svc.label_np || svc.custom_label_np || ''); setEditPriceValue(svc.worker_price || ''); }} style={{ ...actionBtn, fontSize: 10, padding: '2px 8px' }}>✏️</button>
                  <button onClick={async () => { if (!confirm('Remove this service?')) return; try { await api.deleteWorkerService(svc.worker_service_id); const res = await api.getMyServices(); const freshProfs = res?.data?.professions || []; setLocalServices(prev => { const updated = { ...prev }; freshProfs.forEach(p => { updated[p.id] = p.services || []; }); return updated; }); } catch (err) { alert('Failed to delete service'); } }} style={{ ...actionBtn, fontSize: 10, padding: '2px 8px', color: 'var(--accent-red)', borderColor: 'var(--accent-red)' }}>🗑️</button>
                </>
              )}
            </div>
          ))
        )}
      </div>

      {/* Add custom form */}
      {showAddForm && (
        <div style={{ display: 'flex', gap: 8, marginBottom: 12, flexWrap: 'wrap' }}>
          <input placeholder="Service name" value={newCustomLabel} onChange={e => setNewCustomLabel(e.target.value)} style={{ ...inputStyle, flex: 2 }} />
          <input placeholder="Nepali (optional)" value={newCustomNepali} onChange={e => setNewCustomNepali(e.target.value)} style={{ ...inputStyle, flex: 1 }} />
          <input type="number" placeholder="Price" value={newCustomPrice} onChange={e => setNewCustomPrice(e.target.value)} style={{ ...inputStyle, flex: 1 }} />
          <button onClick={addCustomService} style={{ ...actionBtn, background: 'var(--accent-blue)', color: '#fff', border: 'none' }}>Add</button>
          <button onClick={() => { setShowAddForm(false); setNewCustomLabel(''); setNewCustomPrice(''); }} style={actionBtn}>Cancel</button>
        </div>
      )}

      {/* Bottom buttons */}
      <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
        <button onClick={() => { setCheckedServices(new Set()); setShowChecklist(true); }} style={{ padding: '10px 20px', borderRadius: 'var(--radius-sm)', border: '1px dashed var(--border)', background: 'transparent', color: 'var(--accent-blue)', fontSize: 'var(--font-body-sm)', fontWeight: 600, cursor: 'pointer' }}>+ Add Service</button>
        <button onClick={async () => { const servicesToRemove = allServices.filter(s => s.worker_service_id); if (servicesToRemove.length === 0) return; if (!confirm(`Remove all ${servicesToRemove.length} services?`)) return; try { await Promise.all(servicesToRemove.map(s => api.deleteWorkerService(s.worker_service_id))); const res = await api.getMyServices(); const freshProfs = res?.data?.professions || []; setLocalServices(prev => { const updated = { ...prev }; freshProfs.forEach(p => { updated[p.id] = p.services || []; }); return updated; }); } catch (err) { alert('Failed to clear services'); } }} style={{ padding: '10px 20px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--accent-red)', background: 'transparent', color: 'var(--accent-red)', fontSize: 'var(--font-body-sm)', fontWeight: 600, cursor: 'pointer' }}>Clear All</button>
      </div>

      {/* Checklist overlay */}
      {showChecklist && (
        <>
          <div onClick={() => setShowChecklist(false)} style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.35)', zIndex: 9998 }} />
          <div style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '90%', maxWidth: 420, maxHeight: '80vh', overflowY: 'auto', background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: 24, zIndex: 9999, boxShadow: '0 12px 40px rgba(0,0,0,0.15)', WebkitOverflowScrolling: 'touch' }}>
            <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 16, textAlign: 'center' }}>Add Services from Catalogue</div>
            {catalogueServices.length === 0 ? (
              <div style={{ padding: 20, textAlign: 'center', color: 'var(--text-secondary)' }}>No predefined services available.</div>
            ) : (
              catalogueServices.map(svc => {
                const isAlreadyActive = activatedIds.has(svc.service_id);
                return (
                  <label key={svc.service_id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 0', borderBottom: '1px solid var(--border)', cursor: isAlreadyActive ? 'not-allowed' : 'pointer', fontSize: 'var(--font-body-sm)', opacity: isAlreadyActive ? 0.5 : 1 }}>
                    <input type="checkbox" checked={isAlreadyActive ? true : checkedServices.has(svc.service_id)} disabled={isAlreadyActive} onChange={() => { if (!isAlreadyActive) toggleCheck(svc.service_id); }} style={{ width: 18, height: 18, accentColor: 'var(--accent-blue)' }} />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{svc.label}{svc.label_np && <span style={{ marginLeft: 6, fontSize: 11, color: 'var(--text-secondary)' }}>({svc.label_np})</span>}</div>
                      {svc.base_price && <div style={{ fontSize: 'var(--font-caption)', color: 'var(--text-secondary)' }}>Suggested Rs {parseFloat(svc.base_price).toLocaleString()}</div>}
                    </div>
                    {isAlreadyActive && <span style={{ fontSize: 11, color: 'var(--accent-green)', fontWeight: 600 }}>Active</span>}
                  </label>
                );
              })
            )}
            <div style={{ marginTop: 16, fontSize: 'var(--font-body-sm)', color: 'var(--text-secondary)', padding: '8px 0', borderBottom: '1px solid var(--border)' }}>
              <span onClick={() => { setShowChecklist(false); setShowAddForm(true); }} style={{ cursor: 'pointer', color: 'var(--accent-blue)', fontWeight: 600 }}>+ Add manually</span>
            </div>
            <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
              <button onClick={() => { setShowChecklist(false); setCheckedServices(new Set()); }} style={{ flex: 1, padding: '10px 0', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)', background: 'transparent', color: 'var(--text-secondary)', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>Clear Selection</button>
              <button onClick={confirmChecklist} style={{ flex: 1, padding: '10px 0', borderRadius: 'var(--radius-sm)', border: 'none', background: 'var(--accent-green)', color: '#fff', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>Confirm Selection</button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}