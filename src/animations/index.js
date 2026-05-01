import { useSpring, animated } from '@react-spring/web'

// ──────────────────────────────────────────────
// All animations in one place — add new ones here
// ──────────────────────────────────────────────

/**
 * springCard — gentle scale bounce on mount
 * Usage: const { style } = useAnim('springCard', { from: 0.9, to: 1 })
 */
export const springCard = (config = {}) => {
  const [style, api] = useSpring(() => ({
    from: { scale: config.from ?? 0.95, opacity: 0 },
    to: { scale: config.to ?? 1, opacity: 1 },
    config: { tension: 250, friction: 20, ...config },
  }))
  return { style, api }
}

/**
 * fadeIn — simple opacity transition
 * Usage: const { style } = useAnim('fadeIn')
 */
export const fadeIn = (config = {}) => {
  const [style, api] = useSpring(() => ({
    from: { opacity: 0 },
    to: { opacity: 1 },
    config: { duration: config.duration ?? 400, ...config },
  }))
  return { style, api }
}

/**
 * bounce — playful scale bounce
 * Usage: const { style } = useAnim('bounce', { from: 0, to: 1 })
 */
export const bounce = (config = {}) => {
  const [style, api] = useSpring(() => ({
    from: { scale: config.from ?? 0 },
    to: async (next) => {
      await next({ scale: (config.to ?? 1) + 0.15 })
      await next({ scale: (config.to ?? 1) - 0.05 })
      await next({ scale: config.to ?? 1 })
    },
    config: { tension: 300, friction: 10, ...config },
  }))
  return { style, api }
}

/**
 * slideUp — slides up from below
 * Usage: const { style } = useAnim('slideUp')
 */
export const slideUp = (config = {}) => {
  const [style, api] = useSpring(() => ({
    from: { y: config.distance ?? 30, opacity: 0 },
    to: { y: 0, opacity: 1 },
    config: { tension: 200, friction: 22, ...config },
  }))
  return { style, api }
}

/**
 * pulse — continuous gentle pulse (for attention)
 * Usage: const { style } = useAnim('pulse')
 */
export const pulse = (config = {}) => {
  const [style, api] = useSpring(() => ({
    from: { scale: 1 },
    to: async (next) => {
      while (true) {
        await next({ scale: 1.03 })
        await next({ scale: 1 })
      }
    },
    config: { duration: config.duration ?? 800, ...config },
  }))
  return { style, api }
}

// ──────────────────────────────────────────────
// Registry — maps name strings to functions
// ──────────────────────────────────────────────
export const animationRegistry = {
  springCard,
  fadeIn,
  bounce,
  slideUp,
  pulse,
}

/**
 * useAnim — unified hook
 * @param {string} name — animation name (must exist in animationRegistry)
 * @param {object} config — optional override config
 * @returns {{ style, animated, api }}
 */
export function useAnim(name, config = {}) {
  const fn = animationRegistry[name] || animationRegistry.fadeIn
  const { style, api } = fn(config)
  return { style, animated, api }
}

// Re-export animated for convenience
export { animated }