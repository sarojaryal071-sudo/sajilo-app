import { useState, useEffect, useCallback } from 'react';
import { api } from '../services/api.js';

/**
 * useVerificationStatus
 * Phase 17 — Worker Verification System
 * 
 * Single hook for all verification-related state and actions.
 * 
 * @returns {{ verification, loading, error, submitDocuments, refresh }}
 */
export default function useVerificationStatus() {
  const [verification, setVerification] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const refresh = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.getMyVerification();
      if (res?.success) {
        setVerification(res.data);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  /**
   * Submit verification documents
   * @param {Array} documents - [{ document_type, file_url, ... }]
   */
  const submitDocuments = async (documents) => {
    setSubmitting(true);
    setError(null);
    try {
      const res = await api.submitVerification(documents);
      if (res?.success) {
        setVerification(res.data);
        return { success: true };
      }
      throw new Error(res?.message || 'Submission failed');
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setSubmitting(false);
    }
  };

  return {
    verification,
    loading,
    error,
    submitting,
    submitDocuments,
    refresh,
    // Derived states
    status: verification?.status || 'pending',
    isPending: verification?.status === 'pending',
    isSubmitted: verification?.status === 'submitted',
    isApproved: verification?.status === 'approved',
    isRejected: verification?.status === 'rejected',
    canSubmit: verification?.statusConfig?.allowsResubmit !== false,
    documents: verification?.documents || [],
    statusLabel: verification?.statusConfig?.label || 'Pending',
    statusColor: verification?.statusConfig?.color || '#6B7280',
  };
}