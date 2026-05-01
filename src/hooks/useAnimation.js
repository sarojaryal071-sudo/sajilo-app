import { useEffect, useState } from 'react'
import { useAnim, animated } from '../animations/index.js'

// ──────────────────────────────────────────────
// Fallback: used when backend is unreachable
// ──────────────────────────────────────────────
const FALLBACK_CONFIG = {
  LoginScreen: { card: 'springCard' },
  SignupScreen: { card: 'springCard' },
  WorkerPending: { card: 'fadeIn' },
}

// In-memory cache so we don't fetch every render
let cachedConfig = null

/**
 * useAnimation — fetches admin animation config and returns animation props
 * @param {string} screen — screen name (e.g. 'SignupScreen')
 * @param {string} component — component name (e.g. 'card', 'title', 'button')
 * @param {object} overrides — optional animation config overrides
 * @returns {{ style, animated, name }}
 */
export function useAnimation(screen, component, overrides = {}) {
  const [animName, setAnimName] = useState(() => {
    // Start with cached or fallback immediately (no flicker)
    if (cachedConfig?.[screen]?.[component]) {
      return cachedConfig[screen][component]
    }
    return FALLBACK_CONFIG[screen]?.[component] || 'fadeIn'
  })

  useEffect(() => {
    let cancelled = false

    async function fetchConfig() {
      try {
        const res = await fetch(`/api/animations?screen=${screen}`)
        if (!res.ok) throw new Error('Failed to fetch')
        const data = await res.json()
        if (!cancelled) {
          cachedConfig = { ...cachedConfig, [screen]: data.components || {} }
          const name = data.components?.[component] || FALLBACK_CONFIG[screen]?.[component] || 'fadeIn'
          setAnimName(name)
        }
      } catch {
        // Keep fallback — already set in useState initializer
        console.log(`🔍 useAnimation: using fallback for ${screen}/${component}`)
      }
    }

    fetchConfig()
    return () => { cancelled = true }
  }, [screen, component])

  const { style, api } = useAnim(animName, overrides)

  return { style, animated, api, name: animName }
}