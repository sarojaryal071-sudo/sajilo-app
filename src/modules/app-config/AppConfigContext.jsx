import { createContext, useState, useEffect, useMemo } from 'react';
import { fetchAppConfig } from './appConfig.service';

export const AppConfigContext = createContext(null);

export function AppConfigProvider({ children }) {
  const [appConfig, setAppConfig] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAppConfig()
      .then(data => setAppConfig(data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const value = useMemo(() => ({ appConfig, loading }), [appConfig, loading]);

  return (
    <AppConfigContext.Provider value={value}>
      {children}
    </AppConfigContext.Provider>
  );
}