import { useState, useEffect, useCallback } from 'react';
import { api } from '../services/api.js';

export default function useVerificationReview() {
  const [review, setReview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchReview = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.getMyReviewStatus();
      if (res?.success) setReview(res.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchReview(); }, [fetchReview]);

  return {
    review,
    loading,
    error,
    refresh: fetchReview,
    status: review?.status || 'pending',
    canResubmit: review?.canResubmit || false,
    rejectedDocuments: review?.rejectedDocuments || [],
    documents: review?.documents || [],
    summary: review?.summary || { total: 0, approved: 0, rejected: 0, pending: 0 },
  };
}