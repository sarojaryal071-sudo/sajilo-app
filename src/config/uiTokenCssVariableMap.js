// sajilo-app/src/config/uiTokenCssVariableMap.js
// Maps UI Studio token paths to existing production CSS variable names.
// Used by applyUiTokens to inject published tokens globally.

const uiTokenCssVariableMap = {
  // ── Colors ──────────────────────────────────────────
  'colors.primary':            '--accent-blue',
  'colors.primaryLight':       '--accent-blue-light',
  'colors.surface':            '--bg-surface',
  'colors.surfaceElevated':    '--bg-surface2',
  'colors.surfaceGlass':       '--bg-surface2',          // no glass yet, reuse
  'colors.textPrimary':        '--text-primary',
  'colors.textSecondary':      '--text-secondary',
  'colors.border':             '--border',
  'colors.success':            '--accent-green',
  'colors.successLight':       '--accent-green-light',   // optional
  'colors.warning':            '--accent-orange',
  'colors.warningLight':       '--accent-orange-light',
  'colors.danger':             '--accent-red',
  'colors.dangerLight':        '--accent-red-light',
  'colors.secondary':          '--text-secondary',       // reuse
  'colors.shadow':             '--shadow-color',         // not defined, will be ignored
  'colors.background':         '--bg-primary',           // UI Studio "background" maps to page bg

  // ── Typography ─────────────────────────────────────
  'typography.fontFamily':     '--font-family',
  'typography.fontSizeXs':     '--font-caption',         // custom mapping
  'typography.fontSizeSm':     '--font-body-sm',
  'typography.fontSizeMd':     '--font-body',
  'typography.fontSizeLg':     '--font-heading',
  'typography.fontSizeXl':     '--font-title',
  'typography.fontWeightRegular':'--font-weight-regular',
  'typography.fontWeightMedium': '--font-weight-medium',
  'typography.fontWeightBold': '--font-weight-bold',
  'typography.lineHeight':     '--line-height',
  'typography.letterSpacing':  '--letter-spacing',

  // ── Radius ─────────────────────────────────────────
  'radius.card':               '--radius-md',
  'radius.button':             '--radius-sm',
  'radius.input':              '--radius-sm',
  'radius.modal':              '--radius-lg',
  'radius.chip':               '--radius-sm',            // chip radius not defined, reuse

  // ── Spacing ────────────────────────────────────────
  'spacing.xs':                '--spacing-xs',
  'spacing.sm':                '--spacing-sm',
  'spacing.md':                '--spacing-md',
  'spacing.lg':                '--spacing-lg',
  'spacing.xl':                '--spacing-xl',
  'spacing.sectionGap':        '--spacing-section',
  'spacing.cardPadding':       '--spacing-card',
  'spacing.screenPadding':     '--spacing-screen',
  'spacing.inputPadding':      '--spacing-input',
  'spacing.buttonPadding':     '--spacing-button',

  // ── Shadows ────────────────────────────────────────
  'shadows.soft':              '--shadow-soft',
  'shadows.medium':            '--shadow-medium',
  'shadows.heavy':             '--shadow-heavy',
  'shadows.card':              '--shadow-card',
  'shadows.modal':             '--shadow-modal',

  // ── Motion ─────────────────────────────────────────
  'motion.fast':               '--motion-fast',
  'motion.subtle':             '--motion-subtle',
  'motion.normal':             '--motion-normal',
  'motion.smooth':             '--motion-smooth',
  'motion.slow':               '--motion-slow',
  'motion.springIntensity':    '--motion-spring-intensity',
  'motion.hoverScale':         '--motion-hover-scale',
};

export default uiTokenCssVariableMap;