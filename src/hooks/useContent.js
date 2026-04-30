import { useMemo } from 'react'
import contentRegistry from '../config/contentRegistry.js'

export function useContent(key, fallback = '') {
  const text = useMemo(() => {
    // Check admin override
    const overrides = localStorage.getItem('sajilo_content_overrides')
    if (overrides) {
      const parsed = JSON.parse(overrides)
      if (parsed[key]) return parsed[key]
    }

    // Check language
    const lang = localStorage.getItem('sajilo_lang') || 'en'

    // Get from registry
    const entry = contentRegistry[key]
    if (entry && entry[lang]) return entry[lang]
    if (entry && entry.en) return entry.en

    // Fallback
    return fallback || key
  }, [key, fallback])

  return text
}