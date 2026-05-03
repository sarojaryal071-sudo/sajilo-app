// sajilo-app/src/config/ui/configResolver.js
// --------------------------------------------------------
// Combines theme.config.js + worker.config.js into one
// easy-to-use config object for ElementRenderer.
// --------------------------------------------------------

import theme from './theme.config.js';
import worker from './worker.config.js';

// Use light theme as default (dark mode will be wired later)
const currentTheme = theme.light;

const config = {
  // Base design tokens (colors, radius, spacing, fonts)
  colors: currentTheme,
  radius: theme.radius,
  spacing: theme.spacing,
  font: theme.font,

  // Worker-specific component styles
  worker,
};

export default config;
