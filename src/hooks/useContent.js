import { useState, useEffect } from 'react'
import contentRegistry from '../config/contentRegistry.js'

// Single source of truth — same key for all panels
const STORAGE_KEY = 'sajilo_lang'

export function useContent(key, fallback = '') {
  const [lang, setLang] = useState(() => localStorage.getItem(STORAGE_KEY) || 'en')

  useEffect(() => {
    const handleChange = () => {
      setLang(localStorage.getItem(STORAGE_KEY) || 'en')
    }
    window.addEventListener('langChange', handleChange)
    return () => window.removeEventListener('langChange', handleChange)
  }, [])

  const entry = contentRegistry[key]
  if (entry && entry[lang]) return entry[lang]
  if (entry && entry.en) return entry.en
  return fallback || key
}