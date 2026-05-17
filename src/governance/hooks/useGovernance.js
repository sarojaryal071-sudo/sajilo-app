import { useGovernanceContext } from '../GovernanceContext.jsx';

export default function useGovernance() {
  const { governance, loading, error } = useGovernanceContext();
  return { governance, loading, error };
}