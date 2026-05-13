import { useState, useEffect } from 'react';
import { api } from '../../services/api.js';

const DOC_LABELS = {
  government_id_front: 'Government ID (Front)',
  government_id_back: 'Government ID (Back)',
  selfie_photo: 'Profile Photo / Selfie',
};

const REJECTION_REASONS = [
  { id: 'unclear_document', label: 'Document unclear' },
  { id: 'mismatch_identity', label: 'Identity mismatch' },
  { id: 'expired_document', label: 'Document expired' },
  { id: 'incomplete_submission', label: 'Incomplete submission' },
  { id: 'inappropriate_content', label: 'Inappropriate content' },
  { id: 'other', label: 'Other' },
];

export default function AdminVerificationDetail({ worker, onClose, onAction }) {
  const [documents, setDocuments] = useState([]);
  const [reviews, setReviews] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [rejectionNote, setRejectionNote] = useState('');

  useEffect(() => {
    loadDocuments();
  }, [worker.id]);

  const loadDocuments = async () => {
    try {
      // Get worker's verification status with documents
      const verifRes = await fetch(`http://localhost:5000/api/verification/check/${worker.id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('sajilo_token')}` }
      }).then(r => r.json());

      // Try to get reviews
      try {
        const reviewRes = await api.getWorkerReviews(worker.id);
        if (reviewRes?.success && reviewRes.data?.documents) {
          setDocuments(reviewRes.data.documents);
        }
      } catch {
        // Reviews may not exist yet — show empty state
        setDocuments([]);
      }
    } catch (err) {
      console.error('Failed to load documents', err);
    } finally {
      setLoading(false);
    }
  };

  const handleReview = async (documentId, status) => {
    if (status === 'rejected' && !rejectionReason) {
      alert('Please select a rejection reason');
      return;
    }

    setSubmitting(true);
    try {
      await api.createDocumentReview({
        workerId: worker.id,
        verificationId: documents[0]?.verification_id,
        documentId: status === 'full' ? null : documentId,
        documentType: status === 'full' ? null : documents.find(d => d.id === documentId)?.document_type,
        status: status === 'rejected' ? 'rejected' : 'approved',
        reasonCode: status === 'rejected' ? rejectionReason : null,
        reasonText: status === 'rejected' ? rejectionNote : null,
      });

      setSelectedDoc(null);
      setRejectionReason('');
      setRejectionNote('');
      await loadDocuments();
    } catch (err) {
      console.error('Review failed', err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleApproveAll = async () => {
    setSubmitting(true);
    try {
      await api.approveVerification(worker.id);
      if (onAction) onAction('approved', worker);
      onClose();
    } catch (err) {
      console.error('Approve all failed', err);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div style={overlayStyle}>
        <div style={cardStyle}>
          <div style={{ textAlign: 'center', padding: 40, color: 'var(--text-secondary)' }}>Loading documents...</div>
        </div>
      </div>
    );
  }

  return (
    <div style={overlayStyle} onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div style={cardStyle} onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          marginBottom: 20, paddingBottom: 16,
          borderBottom: '1px solid var(--border)',
        }}>
          <div>
            <h3 style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
              {worker.name || 'Worker'} — Verification Review
            </h3>
            <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 4 }}>
              {worker.client_id} · {worker.email}
            </div>
          </div>
          <button onClick={onClose} style={{
            background: 'none', border: 'none', fontSize: 24, cursor: 'pointer',
            color: 'var(--text-secondary)', padding: '4px 8px',
          }}>✕</button>
        </div>

        {/* Documents */}
        {documents.length === 0 ? (
          <div style={{
            textAlign: 'center', padding: 40, color: 'var(--text-secondary)',
            background: 'var(--bg-surface2)', borderRadius: 8,
          }}>
            <div style={{ fontSize: 36, marginBottom: 8 }}>📄</div>
            <p style={{ fontSize: 14 }}>No verification documents submitted yet.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 20 }}>
            {documents.map(doc => {
              const isApproved = doc.reviewStatus === 'approved';
              const isRejected = doc.reviewStatus === 'rejected';

              return (
                <div key={doc.id} style={{
                  display: 'flex', gap: 14, padding: 14,
                  background: isRejected ? '#FEF2F2' : isApproved ? '#F0FDF4' : 'var(--bg-surface2)',
                  borderRadius: 8, border: `1px solid ${isRejected ? '#FECACA' : isApproved ? '#BBF7D0' : 'var(--border)'}`,
                  alignItems: 'center',
                }}>
                  {/* Preview */}
                  {doc.file_url ? (
                    <img src={doc.file_url} alt="Document" style={{
                      width: 80, height: 80, borderRadius: 6, objectFit: 'cover',
                      border: '1px solid var(--border)', flexShrink: 0,
                    }} />
                  ) : (
                    <div style={{
                      width: 80, height: 80, borderRadius: 6,
                      background: 'var(--bg-surface)', border: '1px solid var(--border)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 24, flexShrink: 0,
                    }}>📄</div>
                  )}

                  {/* Info */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 2 }}>
                      {DOC_LABELS[doc.document_type] || doc.document_type}
                    </div>
                    {doc.original_filename && (
                      <div style={{ fontSize: 11, color: 'var(--text-secondary)', marginBottom: 4, wordBreak: 'break-all' }}>
                        {doc.original_filename}
                      </div>
                    )}
                    {isRejected && doc.rejectionReason && (
                      <div style={{ fontSize: 11, color: '#DC2626', marginTop: 4 }}>
                        Rejected: {doc.rejectionReason.replace(/_/g, ' ')}
                        {doc.rejectionText && ` — ${doc.rejectionText}`}
                      </div>
                    )}
                    {isApproved && (
                      <div style={{ fontSize: 11, color: '#059669', marginTop: 4 }}>✓ Approved</div>
                    )}
                  </div>

                  {/* Actions */}
                  <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
                    {!isApproved && (
                      <button
                        onClick={() => handleReview(doc.id, 'approved')}
                        disabled={submitting}
                        style={{
                          padding: '6px 14px', borderRadius: 6, border: 'none',
                          background: '#059669', color: '#fff', fontSize: 12,
                          fontWeight: 600, cursor: 'pointer',
                        }}
                      >Approve</button>
                    )}
                    {!isRejected && (
                      <button
                        onClick={() => { setSelectedDoc(doc.id); setRejectionReason(''); setRejectionNote(''); }}
                        style={{
                          padding: '6px 14px', borderRadius: 6,
                          border: '1px solid #DC2626', background: 'transparent',
                          color: '#DC2626', fontSize: 12, fontWeight: 600, cursor: 'pointer',
                        }}
                      >Reject</button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Rejection reason modal (inline) */}
        {selectedDoc && (
          <div style={{
            padding: 16, marginBottom: 20, background: '#FEF2F2',
            borderRadius: 8, border: '1px solid #FECACA',
          }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: '#DC2626', marginBottom: 10 }}>
              Rejection Reason
            </div>
            <select
              value={rejectionReason}
              onChange={e => setRejectionReason(e.target.value)}
              style={{
                width: '100%', padding: '8px 12px', borderRadius: 6,
                border: '1px solid var(--border)', fontSize: 13, marginBottom: 8,
                background: 'var(--bg-surface)', color: 'var(--text-primary)',
              }}
            >
              <option value="">Select reason...</option>
              {REJECTION_REASONS.map(r => (
                <option key={r.id} value={r.id}>{r.label}</option>
              ))}
            </select>
            <textarea
              value={rejectionNote}
              onChange={e => setRejectionNote(e.target.value)}
              placeholder="Additional notes (optional)"
              rows={2}
              style={{
                width: '100%', padding: '8px 12px', borderRadius: 6,
                border: '1px solid var(--border)', fontSize: 12, marginBottom: 8,
                background: 'var(--bg-surface)', color: 'var(--text-primary)',
                resize: 'vertical',
              }}
            />
            <div style={{ display: 'flex', gap: 8 }}>
              <button
                onClick={() => handleReview(selectedDoc, 'rejected')}
                disabled={submitting || !rejectionReason}
                style={{
                  padding: '8px 18px', borderRadius: 6, border: 'none',
                  background: rejectionReason ? '#DC2626' : '#FCA5A5',
                  color: '#fff', fontSize: 12, fontWeight: 600,
                  cursor: rejectionReason ? 'pointer' : 'not-allowed',
                }}
              >Confirm Rejection</button>
              <button
                onClick={() => setSelectedDoc(null)}
                style={{
                  padding: '8px 18px', borderRadius: 6,
                  border: '1px solid var(--border)', background: 'transparent',
                  color: 'var(--text-secondary)', fontSize: 12, fontWeight: 600, cursor: 'pointer',
                }}
              >Cancel</button>
            </div>
          </div>
        )}

        {/* Bottom actions */}
        <div style={{
          display: 'flex', gap: 10, paddingTop: 16,
          borderTop: '1px solid var(--border)',
        }}>
          <button onClick={handleApproveAll} disabled={submitting} style={{
            flex: 1, padding: 12, borderRadius: 8, border: 'none',
            background: '#059669', color: '#fff', fontSize: 14, fontWeight: 600, cursor: 'pointer',
          }}>
            ✅ Approve All & Verify Worker
          </button>
          <button onClick={onClose} style={{
            padding: '12px 20px', borderRadius: 8,
            border: '1px solid var(--border)', background: 'transparent',
            color: 'var(--text-secondary)', fontSize: 14, fontWeight: 600, cursor: 'pointer',
          }}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

const overlayStyle = {
  position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
  background: 'rgba(0,0,0,0.5)', zIndex: 10000,
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  padding: 20,
};

const cardStyle = {
  background: 'var(--bg-surface)',
  borderRadius: 12,
  padding: 24,
  width: '100%',
  maxWidth: 650,
  maxHeight: '85vh',
  overflowY: 'auto',
  boxShadow: '0 8px 40px rgba(0,0,0,0.15)',
};