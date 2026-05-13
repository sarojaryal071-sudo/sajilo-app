import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useVerificationReview from '../../hooks/useVerificationReview.js';
import VerificationUploadOverlay from '../../components/verification/VerificationUploadOverlay.jsx';

const DOC_LABELS = {
  government_id_front: 'Government ID (Front)',
  government_id_back: 'Government ID (Back)',
  selfie_photo: 'Profile Photo / Selfie',
};

export default function WorkerVerificationReview() {
  const navigate = useNavigate();
  const { review, loading, documents, summary, rejectedDocuments } = useVerificationReview();
  const [showUpload, setShowUpload] = useState(false);

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', background: 'var(--bg-primary)' }}>
        <div style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>
          <div style={{ fontSize: 24 }}>Loading review status...</div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 500, margin: '0 auto', padding: '40px 24px', minHeight: '100vh', background: 'var(--bg-primary)' }}>
      
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: 24 }}>
        <div style={{ fontSize: 48, marginBottom: 12 }}>📋</div>
        <h2 style={{ fontSize: 22, fontWeight: 800, color: 'var(--text-primary)', marginBottom: 8 }}>
          Verification Review
        </h2>
        <p style={{ fontSize: 14, color: 'var(--text-secondary)' }}>
          {summary.rejected > 0 
            ? `${summary.rejected} document(s) need attention` 
            : 'All documents are under review'}
        </p>
      </div>

      {/* Progress Summary */}
      <div style={{
        display: 'flex', gap: 10, marginBottom: 24,
        background: 'var(--bg-surface)', borderRadius: 'var(--radius-md)',
        padding: 16, border: '1px solid var(--border)',
      }}>
        {[
          { label: 'Total', value: summary.total, color: 'var(--text-primary)' },
          { label: 'Approved', value: summary.approved, color: '#059669' },
          { label: 'Rejected', value: summary.rejected, color: '#DC2626' },
          { label: 'Pending', value: summary.pending, color: '#D97706' },
        ].map(s => (
          <div key={s.label} style={{ flex: 1, textAlign: 'center' }}>
            <div style={{ fontSize: 22, fontWeight: 800, color: s.color }}>{s.value}</div>
            <div style={{ fontSize: 10, color: 'var(--text-secondary)', marginTop: 2 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Documents List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 24 }}>
        {documents.map(doc => {
          const isRejected = doc.reviewStatus === 'rejected';
          const isApproved = doc.reviewStatus === 'approved';
          
          return (
            <div key={doc.id} style={{
              background: 'var(--bg-surface)',
              borderRadius: 'var(--radius-md)',
              border: `1px solid ${isRejected ? '#FECACA' : isApproved ? '#BBF7D0' : 'var(--border)'}`,
              padding: 16,
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 4 }}>
                    {DOC_LABELS[doc.document_type] || doc.document_type}
                  </div>
                  
                  {/* Status badge */}
                  <span style={{
                    display: 'inline-block', padding: '2px 10px', borderRadius: 12,
                    fontSize: 11, fontWeight: 600,
                    background: isApproved ? '#DCFCE7' : isRejected ? '#FEE2E2' : '#FEF3C7',
                    color: isApproved ? '#059669' : isRejected ? '#DC2626' : '#D97706',
                  }}>
                    {isApproved ? '✓ Approved' : isRejected ? '✗ Rejected' : '⏳ Pending'}
                  </span>

                  {/* Rejection reason */}
                  {isRejected && doc.rejectionReason && (
                    <div style={{
                      marginTop: 8, padding: '8px 12px',
                      background: '#FEF2F2', borderRadius: 'var(--radius-sm)',
                      border: '1px solid #FECACA',
                    }}>
                      <div style={{ fontSize: 11, fontWeight: 600, color: '#DC2626', marginBottom: 2 }}>
                        Issue: {doc.rejectionReason.replace(/_/g, ' ')}
                      </div>
                      {doc.rejectionText && (
                        <div style={{ fontSize: 12, color: '#991B1B' }}>{doc.rejectionText}</div>
                      )}
                    </div>
                  )}
                </div>

                {/* Document preview if available */}
                {doc.file_url && (
                  <img src={doc.file_url} alt="Document" style={{
                    width: 60, height: 60, borderRadius: 8, objectFit: 'cover',
                    marginLeft: 12, border: '1px solid var(--border)',
                  }} />
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Action buttons */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {rejectedDocuments.length > 0 && (
          <button
            onClick={() => setShowUpload(true)}
            style={{
              width: '100%', padding: 14, borderRadius: 'var(--radius-md)',
              border: 'none', background: 'var(--accent-blue)', color: '#fff',
              fontSize: 15, fontWeight: 700, cursor: 'pointer',
            }}
          >
            📄 Resubmit Rejected Documents
          </button>
        )}

        <button
          onClick={() => navigate('/worker/dashboard')}
          style={{
            width: '100%', padding: 12, borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border)', background: 'var(--bg-surface2)',
            color: 'var(--text-secondary)', fontSize: 14, fontWeight: 600, cursor: 'pointer',
          }}
        >
          ← Back to Dashboard
        </button>
      </div>

      {/* Upload overlay for resubmission */}
      {showUpload && (
        <VerificationUploadOverlay
          onClose={() => setShowUpload(false)}
          onSuccess={() => {
            setShowUpload(false);
            window.location.reload();
          }}
        />
      )}
    </div>
  );
}