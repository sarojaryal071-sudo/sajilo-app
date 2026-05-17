import { createContext, useContext, useState, useEffect } from 'react';
import { defaultGovernanceConfig } from './config/defaultGovernanceConfig.js';

const GovernanceContext = createContext();

export function GovernanceProvider({ children }) {
  const [governance, setGovernance] = useState(defaultGovernanceConfig);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // For now, load from local defaults.
    // Future: fetch from UIConfig backend under 'governance' key.
    try {
      setGovernance(defaultGovernanceConfig);
      setError(null);
    } catch (err) {
      console.warn('[Governance] Failed to load config:', err.message);
      setError(err.message);
      setGovernance(defaultGovernanceConfig);
    } finally {
      setLoading(false);
    }
  }, []);

  const updateGovernance = (newConfig) => {
    setGovernance(prev => ({ ...prev, ...newConfig }));
  };

  const refreshGovernance = () => {
    setGovernance(defaultGovernanceConfig);
  };

  const value = { governance, loading, error, updateGovernance, refreshGovernance };

  return (
    <GovernanceContext.Provider value={value}>
      {children}
    </GovernanceContext.Provider>
  );
}

export function useGovernanceContext() {
  return useContext(GovernanceContext);
}