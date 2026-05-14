/**
 * StudioControl Registry
 * Phase 2 — Universal Control System Standardization
 * 
 * Single source of truth for every control's range, step, defaults, and bipolar mode.
 * StudioControl reads from here — no inline min/max in JSX.
 */

export const controlRegistry = {
  // ─── SPACING ──────────────────────────────────────────────────
  'spacing.xs':    { min: 0, max: 16,  step: 1, default: 4,   unit: 'px', isBipolar: false },
  'spacing.sm':    { min: 0, max: 24,  step: 1, default: 8,   unit: 'px', isBipolar: false },
  'spacing.md':    { min: 0, max: 40,  step: 1, default: 16,  unit: 'px', isBipolar: false },
  'spacing.lg':    { min: 0, max: 56,  step: 1, default: 24,  unit: 'px', isBipolar: false },
  'spacing.xl':    { min: 0, max: 80,  step: 1, default: 32,  unit: 'px', isBipolar: false },
  'spacing.sectionGap':   { min: 0, max: 64, step: 1, default: 20, unit: 'px', isBipolar: false },
  'spacing.cardPadding':  { min: 0, max: 48, step: 1, default: 16, unit: 'px', isBipolar: false },
  'spacing.screenPadding':{ min: 0, max: 64, step: 1, default: 24, unit: 'px', isBipolar: false },

  // ─── RADIUS ───────────────────────────────────────────────────
  'radius.card':    { min: 0, max: 48, step: 1, default: 12, unit: 'px', isBipolar: false },
  'radius.button':  { min: 0, max: 32, step: 1, default: 8,  unit: 'px', isBipolar: false },
  'radius.input':   { min: 0, max: 24, step: 1, default: 8,  unit: 'px', isBipolar: false },
  'radius.modal':   { min: 0, max: 32, step: 1, default: 14, unit: 'px', isBipolar: false },
  'radius.chip':    { min: 0, max: 40, step: 1, default: 20, unit: 'px', isBipolar: false },

  // ─── MOTION ───────────────────────────────────────────────────
  'motion.fast':    { min: 0, max: 300,  step: 10, default: 100, unit: 'ms', isBipolar: false },
  'motion.subtle':  { min: 0, max: 400,  step: 10, default: 150, unit: 'ms', isBipolar: false },
  'motion.normal':  { min: 0, max: 500,  step: 10, default: 200, unit: 'ms', isBipolar: false },
  'motion.smooth':  { min: 0, max: 600,  step: 10, default: 250, unit: 'ms', isBipolar: false },
  'motion.slow':    { min: 0, max: 1200, step: 10, default: 400, unit: 'ms', isBipolar: false },
  'motion.spring':  { min: 0, max: 500,  step: 5,  default: 250, unit: '',   isBipolar: false },
  'motion.hoverScale':   { min: 100, max: 120, step: 1, default: 102, unit: '%', isBipolar: false },
  'motion.springForce':  { min: 0, max: 100, step: 1, default: 40,  unit: '', isBipolar: false },
  'motion.damping':      { min: 0, max: 100, step: 1, default: 60,  unit: '', isBipolar: false },

  // ─── TYPOGRAPHY ───────────────────────────────────────────────
  'typography.fontSizeXs': { min: 8, max: 16, step: 1, default: 10, unit: 'px', isBipolar: false },
  'typography.fontSizeSm': { min: 10, max: 18, step: 1, default: 12, unit: 'px', isBipolar: false },
  'typography.fontSizeMd': { min: 12, max: 22, step: 1, default: 14, unit: 'px', isBipolar: false },
  'typography.fontSizeLg': { min: 14, max: 28, step: 1, default: 18, unit: 'px', isBipolar: false },
  'typography.fontSizeXl': { min: 18, max: 36, step: 1, default: 22, unit: 'px', isBipolar: false },
  'typography.fontWeightRegular': { min: 100, max: 500, step: 100, default: 400, unit: '', isBipolar: false },
  'typography.fontWeightMedium':  { min: 300, max: 600, step: 100, default: 500, unit: '', isBipolar: false },
  'typography.fontWeightBold':    { min: 500, max: 900, step: 100, default: 700, unit: '', isBipolar: false },
  'typography.lineHeight':   { min: 100, max: 200, step: 5, default: 150, unit: '%', isBipolar: false },
  'typography.letterSpacing':{ min: -50, max: 100, step: 1, default: 0, unit: '%', isBipolar: true },

  // ─── LAYOUT ───────────────────────────────────────────────────
  'layout.columns': { min: 1, max: 12, step: 1, default: 4, unit: '', isBipolar: false },
  'layout.gutter':  { min: 4, max: 32, step: 1, default: 16, unit: 'px', isBipolar: false },

  // ─── EFFECTS ──────────────────────────────────────────────────
  'effects.shadowBlur':    { min: 0, max: 60, step: 1, default: 8,  unit: 'px', isBipolar: false },
  'effects.shadowOpacity': { min: 0, max: 100, step: 1, default: 12, unit: '%', isBipolar: false },

  // ─── GRADING (future) ─────────────────────────────────────────
  'grading.saturation': { min: -100, max: 100, step: 1, default: 0, unit: '%', isBipolar: true },
  'grading.brightness': { min: -100, max: 100, step: 1, default: 0, unit: '%', isBipolar: true },
  'grading.warmth':     { min: -100, max: 100, step: 1, default: 0, unit: '°', isBipolar: true },
  'grading.contrast':   { min: -100, max: 100, step: 1, default: 0, unit: '%', isBipolar: true },
  'grading.opacity':    { min: 0, max: 100, step: 1, default: 100, unit: '%', isBipolar: false },
};

/**
 * Get control config by key. Returns defaults if key not found.
 */
export function getControlConfig(key) {
  return controlRegistry[key] || { min: 0, max: 100, step: 1, default: 0, unit: '', isBipolar: false };
}