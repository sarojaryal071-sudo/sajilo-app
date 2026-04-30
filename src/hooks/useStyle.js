import { useMemo } from 'react'
import styleRegistry from '../config/styleRegistry.js'

export function useStyle(key, fallback = {}) {
  const style = useMemo(() => {
    // Default from registry
    if (styleRegistry[key]) {
      return { ...styleRegistry[key] }
    }

    // Fallback
    return fallback
  }, [key])

  return style
}