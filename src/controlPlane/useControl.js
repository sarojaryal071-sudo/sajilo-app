import { useUIConfig } from '../contexts/UIConfigContext.jsx';
import { resolveControl } from './controlResolver';

export default function useControl(key) {
  const { uiConfig } = useUIConfig();
  return resolveControl(key, uiConfig);
}