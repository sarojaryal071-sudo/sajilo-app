import { createContext, useState, useCallback } from 'react';
import { MOCK_SYSTEM_NOTICES } from './governanceTypes.js';

export const SystemNoticeContextV2 = createContext(null);

const defaultFallback = {
  notices: [],
  activeNotices: [],
  dismissNotice: () => {},
  refreshNotices: () => {},
};

export function SystemNoticeProviderV2({ children }) {
  const [notices, setNotices] = useState(MOCK_SYSTEM_NOTICES);
  const [dismissedIds, setDismissedIds] = useState([]);

  const dismissNotice = useCallback((id) => {
    setDismissedIds(prev => [...prev, id]);
  }, []);

  const refreshNotices = useCallback(() => {
    setNotices(MOCK_SYSTEM_NOTICES);
    setDismissedIds([]);
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