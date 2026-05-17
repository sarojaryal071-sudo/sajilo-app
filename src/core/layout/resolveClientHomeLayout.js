import layoutBlockRegistry from '../../config/layoutBlockRegistry.js';

/**
 * Resolves whether to use the dynamic layout or the static fallback.
 * Also verifies that every enabled block has a registered component.
 */
export function resolveClientHomeLayout(publishedLayout, options = {}) {
  const { dynamicLayoutEnabled = true } = options;

  if (!dynamicLayoutEnabled) {
    return { useDynamic: false, blocks: null };
  }

  if (!Array.isArray(publishedLayout) || publishedLayout.length === 0) {
    return { useDynamic: false, blocks: null };
  }

  // At least one block enabled + all enabled blocks must have a known type
  let hasEnabled = false;
  for (const block of publishedLayout) {
    if (block.enabled !== false) {
      if (!layoutBlockRegistry[block.type]) {
        console.warn(`[HomeScreen] Unknown block type "${block.type}" – falling back to static layout`);
        return { useDynamic: false, blocks: null };
      }
      hasEnabled = true;
    }
  }

  if (!hasEnabled) {
    return { useDynamic: false, blocks: null };
  }

  return { useDynamic: true, blocks: publishedLayout };
}