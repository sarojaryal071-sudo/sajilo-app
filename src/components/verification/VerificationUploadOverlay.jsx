import { useState } from 'react';
import useVerificationStatus from '../../hooks/useVerificationStatus.js';

/**
 * VerificationUploadOverlay
 * Phase 17 — Document upload component for worker verification.
 * 
 * Handles: file selection, preview, validation, and submission.
 * Mobile-first design, minimal fields.
 */

const DOC_TYPES = [
  { id: 'government_id_front', label: 'Government ID (Front)', icon: '🪪' },
  { id: 'government_id_back', label: 'Government ID (Back)', icon: '🪪' },
  { id: 'selfie_photo', label: 'Your Photo / Selfie', icon: '📸' },
];

export default function VerificationUploadOverlay({ onClose, onSuccess }) {
  const { submitDocuments, submitting, error } = useVerificationStatus();
  const [files, setFiles] = useState({});
  const [previews, setPreviews] = useState({});
  const [validationError, setValidationError] = useState(null);
  const [submitted, setSubmitted] = useState(false);

  const handleFileSelect = (docType, e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate type
    if (!file.type.startsWith('image/')) {
      setValidationError('Please upload image files only (JPEG, PNG, WebP)');
      return;
    }

    // Validate size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setValidationError('File size must be under 5MB');
      return;
    }

    setValidationError(null);
    setFiles(prev => ({ ...prev, [docType]: file }));

    // Generate preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreviews(prev => ({ ...prev, [docType]: e.target.result }));
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async () => {
    // Check all required docs uploaded
    const missing = DOC_TYPES.filter(d => !files[d.id]);
    if (missing.length > 0) {
      setValidationError(`Please upload all required documents (${missing.length} missing)`);
      return;
    }

    setValidationError(null);

    // In production, upload files to server first, then submit URLs
    // For now, we'll use the preview URLs as temporary references
    const documents = DOC_TYPES.map(doc => ({
      document_type: doc.id,
      file_url: previews[doc.id] || '',
      original_filename: files[doc.id]?.name || '',
      file_size_bytes: files[doc.id]?.size || 0,
      mime_type: files[doc.id]?.type || 'image/jpeg',
    }));

    const result = await submitDocuments(documents);
    if (result.success) {
      setSubmitted(true);
      if (onSuccess) setTimeout(onSuccess, 1500);
    }
  };

  if (submitted) {
    return (
      <div style={overlayStyle}>
        <div style={cardStyle}>
          <div style={{ textAlign: 'center', padding: 20 }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>✅</div>
            <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 8 }}>
              Verification Submitted!
            </div>
            <div style={{ fontSize: 14, color: 'var(--text-secondary)' }}>
              Your documents are under review. We'll notify you once verified.
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={overlayStyle}>
      <div style={cardStyle}>
        {/* Header */}
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          marginBottom: 16, paddingBottom: 12,
          borderBottom: '1px solid var(--border)',
        }}>
          <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-primary)' }}>
            Verify Your Identity
          </div>
          <button onClick={onClose} style={{
            background: 'none', border: 'none', fontSize: 20, cursor: 'pointer',
            color: 'var(--text-secondary)', padding: '4px 8px',
          }}>
            ✕
          </button>
        </div>

        <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 16 }}>
          Upload clear photos of your documents to get verified. This helps build trust with clients.
        </div>

        {/* Error */}
        {(validationError || error) && (
          <div style={{
            background: '#FEF2F2', color: '#DC2626', padding: '10px 14px',
            borderRadius: 'var(--radius-sm)', fontSize: 13, marginBottom: 12,
            border: '1px solid #FECACA',
          }}>
            {validationError || error}
          </div>
        )}

        {/* Document uploads */}
        {DOC_TYPES.map(doc => (
          <div key={doc.id} style={{
            marginBottom: 12, padding: 12,
            border: '1px solid var(--border)', borderRadius: 'var(--radius-md)',
            background: files[doc.id] ? '#F0FDF4' : 'var(--bg-surface)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ fontSize: 24 }}>{doc.icon}</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)' }}>
                  {doc.label}
                </div>
                {files[doc.id] ? (
                  <div style={{ fontSize: 11, color: '#059669', marginTop: 2 }}>
                    ✓ {files[doc.id].name}
                  </div>
                ) : (
                  <div style={{ fontSize: 11, color: 'var(--text-secondary)', marginTop: 2 }}>
                    Tap to upload
                  </div>
                )}
              </div>
              {previews[doc.id] && (
                <img src={previews[doc.id]} alt="Preview" style={{
                  width: 48, height: 48, borderRadius: 6, objectFit: 'cover',
                }} />
              )}
            </div>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleFileSelect(doc.id, e)}
              style={{ display: 'none' }}
              id={`file-${doc.id}`}
            />
            <label
              htmlFor={`file-${doc.id}`}
              style={{
                display: 'block', marginTop: 8, padding: '8px 0',
                textAlign: 'center', borderRadius: 'var(--radius-sm)',
                background: files[doc.id] ? '#DCFCE7' : 'var(--bg-surface2)',
                color: files[doc.id] ? '#059669' : 'var(--accent-blue)',
                fontSize: 12, fontWeight: 600, cursor: 'pointer',
              }}
            >
              {files[doc.id] ? 'Change Photo' : 'Upload Photo'}
            </label>
          </div>
        ))}

        {/* Submit button */}
        <button
          onClick={handleSubmit}
          disabled={submitting}
          style={{
            width: '100%', padding: 14, marginTop: 8,
            borderRadius: 'var(--radius-md)', border: 'none',
            background: submitting ? '#9CA3AF' : 'var(--accent-blue)',
            color: '#fff', fontSize: 16, fontWeight: 700,
            cursor: submitting ? 'not-allowed' : 'pointer',
          }}
        >
          {submitting ? 'Submitting...' : 'Submit for Verification'}
        </button>
      </div>
    </div>
  );
}

const overlayStyle = {
  position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
  background: 'rgba(0,0,0,0.5)', zIndex: 9998,
  display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
};

const cardStyle = {
  background: 'var(--bg-surface)',
  borderRadius: 'var(--radius-lg) var(--radius-lg) 0 0',
  padding: 20,
  width: '100%', maxWidth: 500, maxHeight: '90vh',
  overflowY: 'auto',
};