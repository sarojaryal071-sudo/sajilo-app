// Governance API layer – currently returns mock data;
// ready to be replaced with real backend calls later.
import { MOCK_SYSTEM_NOTICES } from '../governance/governanceTypes.js';

export async function fetchSystemNotices() {
  // TODO: replace with real API call when available
  return MOCK_SYSTEM_NOTICES;
}

export async function dismissSystemNotice(id) {
  // TODO: replace with real API call when available
  console.log('[G2] dismissNotice called for', id);
  return true;
}

export async function fetchGovernanceFlags() {
  // TODO: replace with real API call when available
  return {};
}