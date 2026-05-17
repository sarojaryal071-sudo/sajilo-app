import uiTokenCssVariableMap from '../config/uiTokenCssVariableMap.js';
import { computeColor } from '../ui-studio/grading/ColorGradingEngine.js';

function flattenTokens(tokenTree) {
  const flat = {};
  if (!tokenTree || typeof tokenTree !== 'object') return flat;
  for (const [category, values] of Object.entries(tokenTree)) {
    if (!values || typeof values !== 'object') continue;
    for (const [key, value] of Object.entries(values)) {
      flat[`${category}.${key}`] = value;
    }
  }
  return flat;
}

export function applyUiTokens(tokenTree, grading = {}) {
  if (!tokenTree) return;
  const flat = flattenTokens(tokenTree);

  for (const [tokenPath, value] of Object.entries(flat)) {
    const cssVar = uiTokenCssVariableMap[tokenPath];
    if (!cssVar) continue;

    let finalValue = value;
    // If this is a color token and grading exists for it, compute the graded color
    if (tokenPath.startsWith('colors.')) {
      const colorKey = tokenPath.split('.')[1]; // e.g. 'primary'
      const colorGrading = grading[colorKey];
      if (colorGrading) {
        finalValue = computeColor(value, colorGrading);
      }
    }
    document.documentElement.style.setProperty(cssVar, finalValue);
  }
}