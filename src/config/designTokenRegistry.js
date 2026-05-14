/**
 * Design Token Registry
 * Phase 21 — Global Component Tokenization Engine
 * 
 * THE SINGLE SOURCE OF TRUTH for all design tokens.
 * Maps admin-configurable tokens to CSS variables with fallbacks.
 * 
 * Categories: spacing, radius, colors, typography, shadows, motion
 */

export const designTokenRegistry = {
  // ─── SPACING ──────────────────────────────────────────────────
  spacing: {
    xs:  { cssVar: '--spacing-xs',  fallback: '4px' },
    sm:  { cssVar: '--spacing-sm',  fallback: '8px' },
    md:  { cssVar: '--spacing-md',  fallback: '16px' },
    lg:  { cssVar: '--spacing-lg',  fallback: '24px' },
    xl:  { cssVar: '--spacing-xl',  fallback: '32px' },
    sectionGap:    { cssVar: '--spacing-section',  fallback: '20px' },
    cardPadding:   { cssVar: '--spacing-card',     fallback: '16px' },
    screenPadding: { cssVar: '--spacing-screen',   fallback: '24px' },
    inputPadding:  { cssVar: '--spacing-input',    fallback: '12px' },
    buttonPadding: { cssVar: '--spacing-button',   fallback: '10px 20px' },
  },

  // ─── RADIUS ───────────────────────────────────────────────────
  radius: {
    none:    { cssVar: '--radius-none',    fallback: '0px' },
    soft:    { cssVar: '--radius-soft',    fallback: '6px' },
    rounded: { cssVar: '--radius-rounded', fallback: '12px' },
    pill:    { cssVar: '--radius-pill',    fallback: '999px' },
    card:    { cssVar: '--radius-card',    fallback: '12px' },
    button:  { cssVar: '--radius-button',  fallback: '8px' },
    input:   { cssVar: '--radius-input',   fallback: '8px' },
    modal:   { cssVar: '--radius-modal',   fallback: '14px' },
    chip:    { cssVar: '--radius-chip',    fallback: '20px' },
  },

  // ─── COLORS ───────────────────────────────────────────────────
  colors: {
    surface:         { cssVar: '--color-surface',          fallback: '#ffffff' },
    surfaceElevated: { cssVar: '--color-surface-elevated', fallback: '#ffffff' },
    surfaceGlass:    { cssVar: '--color-surface-glass',    fallback: 'rgba(255,255,255,0.8)' },
    primary:         { cssVar: '--color-primary',          fallback: '#1A6FD4' },
    primaryLight:    { cssVar: '--color-primary-light',    fallback: '#EBF3FF' },
    secondary:       { cssVar: '--color-secondary',        fallback: '#6b7280' },
    success:         { cssVar: '--color-success',          fallback: '#2D9E6B' },
    successLight:    { cssVar: '--color-success-light',    fallback: '#ECFDF5' },
    warning:         { cssVar: '--color-warning',          fallback: '#E8720C' },
    warningLight:    { cssVar: '--color-warning-light',    fallback: '#FFFBEB' },
    danger:          { cssVar: '--color-danger',           fallback: '#D92B2B' },
    dangerLight:     { cssVar: '--color-danger-light',     fallback: '#FEE2E2' },
    textPrimary:     { cssVar: '--color-text-primary',     fallback: '#1a1d23' },
    textSecondary:   { cssVar: '--color-text-secondary',   fallback: '#6b7280' },
    border:          { cssVar: '--color-border',           fallback: '#e5e7eb' },
    shadow:          { cssVar: '--color-shadow',           fallback: 'rgba(0,0,0,0.08)' },
  },

  // ─── TYPOGRAPHY ───────────────────────────────────────────────
  typography: {
    fontFamily:       { cssVar: '--font-family',           fallback: 'system-ui, -apple-system, sans-serif' },
    fontSizeXs:       { cssVar: '--font-size-xs',          fallback: '10px' },
    fontSizeSm:       { cssVar: '--font-size-sm',          fallback: '12px' },
    fontSizeMd:       { cssVar: '--font-size-md',          fallback: '14px' },
    fontSizeLg:       { cssVar: '--font-size-lg',          fallback: '18px' },
    fontSizeXl:       { cssVar: '--font-size-xl',          fallback: '22px' },
    fontWeightRegular:{ cssVar: '--font-weight-regular',   fallback: '400' },
    fontWeightMedium: { cssVar: '--font-weight-medium',    fallback: '500' },
    fontWeightBold:   { cssVar: '--font-weight-bold',      fallback: '700' },
    lineHeight:       { cssVar: '--line-height',           fallback: '1.5' },
  },

  // ─── SHADOWS ──────────────────────────────────────────────────
  shadows: {
    soft:   { cssVar: '--shadow-soft',   fallback: '0 1px 3px rgba(0,0,0,0.08)' },
    medium: { cssVar: '--shadow-medium', fallback: '0 2px 8px rgba(0,0,0,0.10)' },
    heavy:  { cssVar: '--shadow-heavy',  fallback: '0 4px 16px rgba(0,0,0,0.12)' },
    card:   { cssVar: '--shadow-card',   fallback: '0 2px 12px rgba(0,0,0,0.08)' },
    modal:  { cssVar: '--shadow-modal',  fallback: '0 8px 40px rgba(0,0,0,0.15)' },
  },

  // ─── MOTION ───────────────────────────────────────────────────
  motion: {
    none:            { cssVar: '--motion-none',            fallback: '0ms' },
    fast:            { cssVar: '--motion-fast',            fallback: '100ms' },
    subtle:          { cssVar: '--motion-subtle',          fallback: '150ms' },
    normal:          { cssVar: '--motion-normal',          fallback: '200ms' },
    smooth:          { cssVar: '--motion-smooth',          fallback: '250ms' },
    slow:            { cssVar: '--motion-slow',            fallback: '400ms' },
    springIntensity: { cssVar: '--motion-spring-intensity', fallback: '250' },
    hoverScale:      { cssVar: '--motion-hover-scale',     fallback: '1.02' },
  },

  // ─── CATEGORY LABELS (for admin studio) ──────────────────────
  categories: {
    spacing:    { label: 'Spacing',    icon: '↔️' },
    radius:     { label: 'Radius',     icon: '⭕' },
    colors:     { label: 'Colors',     icon: '🎨' },
    typography: { label: 'Typography', icon: '🔤' },
    shadows:    { label: 'Shadows',    icon: '🕶️' },
    motion:     { label: 'Motion',     icon: '🎬' },
  },
};

/**
 * Get fallback value for a token.
 */
export function getFallback(category, tokenKey) {
  return designTokenRegistry.mappings?.[category]?.[tokenKey]?.fallback || '';
}

/**
 * Get CSS variable name for a token.
 */
export function getCSSVar(category, tokenKey) {
  return designTokenRegistry.mappings?.[category]?.[tokenKey]?.cssVar || '';
}

/**
 * Get all tokens for a category as CSS variable declarations.
 * Returns object like { '--spacing-md': '16px', ... }
 */
export function getTokenValues(category) {
  const tokens = {};
  const cat = designTokenRegistry.mappings?.[category];
  if (!cat) return tokens;
  for (const [key, token] of Object.entries(cat)) {
    tokens[token.cssVar] = token.fallback;
  }
  return tokens;
}