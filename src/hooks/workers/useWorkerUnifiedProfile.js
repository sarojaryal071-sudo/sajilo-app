import { useState, useEffect } from 'react';
import { api, API_URL } from '../../services/api.js';

/**
 * useWorkerUnifiedProfile
 * Phase 15E — Unified Frontend Migration
 * 
 * Single hook for all worker data. Calls /api/workers/view/me or /api/workers/view/:id.
 * Returns the full standardized worker contract with safe defaults.
 * 
 * @param {string} [workerId] — If provided, fetches that worker's public profile.
 *                              If omitted, fetches current user's own profile.
 * @returns {{ worker: Object, loading: boolean, error: string|null }}
 */
export default function useWorkerUnifiedProfile(workerId) {
  const [worker, setWorker] = useState(getDefaultWorker());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function fetchWorker() {
      setLoading(true);
      setError(null);

      try {
        const endpoint = workerId
          ? `/workers/view/${workerId}`
          : '/workers/view/me';

        // Use the underlying request directly since api object may not have this method yet
        const token = localStorage.getItem('sajilo_token');
        const headers = {
          'Content-Type': 'application/json',
          ...(token && { Authorization: `Bearer ${token}` }),
        };

        const response = await fetch(`${API_URL}${endpoint}`, { headers });
        const data = await response.json();

        if (!cancelled) {
          if (data.success && data.data) {
            setWorker(data.data);
          } else {
            setError(data.message || 'Failed to load worker profile');
          }
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.message || 'Network error');
          // Keep default worker shape — no crash
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    fetchWorker();

    return () => {
      cancelled = true;
    };
  }, [workerId]);

  return { worker, loading, error };
}

/**
 * Safe default worker shape matching the unified contract.
 * Prevents undefined errors when API is loading or fails.
 */
function getDefaultWorker() {
  return {
    identity: {
      id: null,
      clientId: null,
      name: 'Loading...',
      email: null,
      phone: null,
      avatar: null,
      role: 'worker',
      bio: null,
      primarySkill: null,
      secondaryRoles: [],
      serviceArea: null,
    },
    onboarding: {
      status: 'pending',
      isOnline: false,
      applicationStatus: 'pending',
      welcomed: false,
      createdAt: null,
    },
    professions: [],
    services: [],
    pricing: {
      mode: 'default',
      hourlyRate: 0,
      currency: 'NPR',
      smallMaxPrice: 1000,
      mediumMaxPrice: 3000,
    },
    stats: {
      completedJobs: 0,
      totalEarnings: 0,
      averageRating: '0.0',
      reviewCount: 0,
      cancellationRate: 0,
      completionRate: 0,
      isOnline: false,
    },
    verification: {
      isVerified: false,
      level: 'none',
      status: 'pending',
      documentSubmitted: false,
    },
    performance: {
      trustScore: 0,
      reliabilityLabel: null,
      badges: [],
    },
  };
}