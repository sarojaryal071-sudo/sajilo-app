import { useContext } from 'react';
import { SystemNoticeContextV2 } from './SystemNoticeProvider.jsx';

const defaultFallback = {
  notices: [],
  activeNotices: [],
  dismissNotice: () => {},
  refreshNotices: () => {},
};

export function useSystemNoticesSafe() {
  const ctx = useContext(SystemNoticeContextV2);
  if (ctx === undefined || ctx === null) {
    console.warn('[G2] SystemNoticeProviderV2 missing – using fallback');
    return defaultFallback;
  }
  return ctx;
}