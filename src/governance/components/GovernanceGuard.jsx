import useGovernance from '../hooks/useGovernance.js';

export default function GovernanceGuard({ feature, children }) {
  const { governance } = useGovernance();
  const features = governance?.features || {};

  if (features[feature] === false) {
    return (
      <div style={{
        textAlign: 'center',
        padding: 40,
        color: 'var(--text-secondary)',
        fontSize: 14,
      }}>
        This feature is temporarily unavailable.
      </div>
    );
  }

  return children;
}