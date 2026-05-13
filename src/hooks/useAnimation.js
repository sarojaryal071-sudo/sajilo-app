import { useEffect, useState } from 'react'
import { useAnim, animated } from '../animations/index.js'
import { getCategoryForRoute, getAnimationConfig } from '../config/interactionRegistry.js'

/**
 * useAnimation — reads from interactionRegistry for motion rules.
 * Falls back gracefully if backend is unreachable.
 * 
 * @param {string} screen — screen name (e.g. 'LoginScreen')
 * @param {string} component — component name (e.g. 'card', 'title')
 * @param {object} overrides — optional animation config overrides
 * @returns {{ style, animated, name }}
 */
export function useAnimation(screen, component = 'card', overrides = {}) {
  const [animName, setAnimName] = useState(() => {
    // Determine category from current route
    const pathname = window.location.pathname || '/'
    const category = getCategoryForRoute(pathname)
    const config = getAnimationConfig(category, component)
    return config.animation
  })

  useEffect(() => {
    let cancelled = false

    async function fetchConfig() {
      try {
        const res = await fetch(`/api/animations?screen=${screen}`)
        if (!res.ok) throw new Error('Failed to fetch')
        const data = await res.json()
        if (!cancelled) {
          const name = data.components?.[component] || animName
          setAnimName(name)
        }
      } catch {
        // Keep registry-based fallback — already set
        console.log(`🔍 useAnimation: using registry fallback for ${screen}/${component}`)
      }
    }

    fetchConfig()
    return () => { cancelled = true }
  }, [screen, component])

  const { style, api } = useAnim(animName, overrides)

  return { style, animated, api, name: animName }
}