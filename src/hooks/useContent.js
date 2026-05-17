import { useState, useEffect } from 'react'
import contentRegistry from '../config/contentRegistry.js'
import useContentConfig from './useContentConfig.js' // from Phase U7

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

  // 1. Try the published UI config content (nested dot‑notation)
  const uiContent = useContentConfig() // uses UIConfigContext
  if (uiContent && typeof uiContent === 'object') {
    const keys = key.split('.')
    let value = uiContent
    for (const k of keys) {
      if (value && typeof value === 'object') {
        value = value[k]
      } else {
        value = undefined
        break
      }
    }
    if (value && typeof value === 'string' && value.trim() !== '') return value
  }

  // 2. Fallback to the existing language‑aware contentRegistry
  const entry = contentRegistry[key]
  if (entry && entry[lang]) return entry[lang]
  if (entry && entry.en) return entry.en
  return fallback || key
}