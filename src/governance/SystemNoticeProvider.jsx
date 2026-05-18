import { createContext, useState, useCallback } from 'react';
import { MOCK_SYSTEM_NOTICES } from './governanceTypes.js';

export const SystemNoticeContextV2 = createContext(null);

const DISMISSED_STORAGE_KEY = 'sajilo_dismissed_system_notices';

function loadDismissedIds() {
  try {
    const raw = localStorage.getItem(DISMISSED_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

const defaultFallback = {
  notices: [],
  activeNotices: [],
  dismissNotice: () => {},
  refreshNotices: () => {},
};

export function SystemNoticeProviderV2({ children }) {
  const [notices, setNotices] = useState(MOCK_SYSTEM_NOTICES);
  const [dismissedIds, setDismissedIds] = useState(loadDismissedIds);

  const dismissNotice = useCallback((id) => {
    setDismissedIds(prev => {
      const next = [...prev, id];
      localStorage.setItem(DISMISSED_STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const refreshNotices = useCallback(() => {
    setNotices(MOCK_SYSTEM_NOTICES);
    setDismissedIds([]);
    localStorage.removeItem(DISMISSED_STORAGE_KEY);
  }, []);

  const activeNotices = notices.filter(
    n => n.enabled !== false && !dismissedIds.includes(n.id)
  );

  return (
    <SystemNoticeContextV2.Provider value={{ notices, activeNotices, dismissNotice, refreshNotices }}>
      {children}
    </SystemNoticeContextV2.Provider>
  );
}

export { defaultFallback };