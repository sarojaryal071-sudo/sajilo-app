/**
 * Interaction Registry
 * Phase 18 — Config-Driven Interaction System
 * 
 * Centralized motion rules for every UI category.
 * Components read from here — no hardcoded animations.
 */

export const interactionRegistry = {
  // ─── CATEGORIES ───────────────────────────────────────────────
  categories: {
    auth: {
      animation: 'springCard',
      bounce: false,
      duration: 300,
      description: 'Login, Signup, Welcome screens',
    },
    feed: {
      animation: 'fadeIn',
      bounce: false,
      duration: 200,
      smoothScroll: true,
      description: 'Worker dashboard, client home, search results',
    },
    chat: {
      animation: 'none',
      bounce: false,
      containerFixed: true,
      innerScrollOnly: true,
      description: 'Chat/inbox screens — no page bounce',
    },
    admin: {
      animation: 'fadeIn',
      bounce: false,
      duration: 0,
      description: 'Admin panel — instant, no animation by default',
    },
    modal: {
      animation: 'fadeIn',
      bounce: false,
      duration: 150,
      description: 'Overlays, modals, popups',
    },
    pending: {
      animation: 'fadeIn',
      bounce: false,
      duration: 250,
      description: 'Worker pending/verification/review screens',
    },
    default: {
      animation: 'fadeIn',
      bounce: false,
      duration: 200,
      description: 'Fallback for unmatched routes',
    },
  },

  // ─── ROUTE-TO-CATEGORY MAPPING ────────────────────────────────
  routeMapping: {
    '/login': 'auth',
    '/signup': 'auth',
    '/welcome': 'auth',
    '/worker/apply': 'auth',
    '/worker/dashboard': 'feed',
    '/worker/jobs': 'feed',
    '/worker/earnings': 'feed',
    '/worker/schedule': 'feed',
    '/worker/profile': 'feed',
    '/worker/pending': 'pending',
    '/worker/review': 'pending',
    '/admin': 'admin',
    '/search': 'feed',
    '/detail': 'feed',
    '/bookings': 'feed',
    '/inbox': 'chat',
    '/chat': 'chat',
  },

  // ─── COMPONENT OVERRIDES (per-component within a category) ────
  components: {
    card: { animation: 'springCard', duration: 350 },
    title: { animation: 'fadeIn', duration: 300 },
    button: { animation: 'fadeIn', duration: 200 },
    modal: { animation: 'fadeIn', duration: 150 },
    list: { animation: 'fadeIn', duration: 250 },
  },
};

/**
 * Get category config for a given route path.
 * @param {string} pathname
 * @returns {Object} category config
 */
export function getCategoryForRoute(pathname) {
  for (const [route, category] of Object.entries(interactionRegistry.routeMapping)) {
    if (pathname.startsWith(route) && route !== '/') return category;
  }
  // Check exact matches for short paths
  if (interactionRegistry.routeMapping[pathname]) {
    return interactionRegistry.routeMapping[pathname];
  }
  return 'default';
}

/**
 * Get animation config for a category + component.
 * @param {string} category
 * @param {string} component
 * @returns {{ animation: string, bounce: boolean, duration: number }}
 */
export function getAnimationConfig(category, component = 'card') {
  const cat = interactionRegistry.categories[category] || interactionRegistry.categories.default;
  const comp = interactionRegistry.components[component] || {};
  return {
    animation: comp.animation || cat.animation || 'fadeIn',
    bounce: comp.bounce ?? cat.bounce ?? false,
    duration: comp.duration ?? cat.duration ?? 200,
  };
}