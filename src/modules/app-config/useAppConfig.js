import { useContext } from 'react';
import { AppConfigContext } from './AppConfigContext';

export function useAppConfig() {
  return useContext(AppConfigContext);
}