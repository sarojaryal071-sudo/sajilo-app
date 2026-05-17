// Pure functions for color grading. All return a hex color string.

function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
}

function rgbToHex(r, g, b) {
  const clamp = (x) => Math.max(0, Math.min(255, x));
  return '#' + [r, g, b].map(x => clamp(Math.round(x)).toString(16).padStart(2, '0')).join('');
}

function rgbToHsl(r, g, b) {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h, s, l = (max + min) / 2;
  if (max === min) { h = s = 0; }
  else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
      case g: h = ((b - r) / d + 2) / 6; break;
      case b: h = ((r - g) / d + 4) / 6; break;
    }
  }
  return { h: h * 360, s: s * 100, l: l * 100 };
}

function hslToRgb(h, s, l) {
  h /= 360; s /= 100; l /= 100;
  let r, g, b;
  if (s === 0) { r = g = b = l; }
  else {
    const hue2rgb = (p, q, t) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1/6) return p + (q - p) * 6 * t;
      if (t < 1/2) return q;
      if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
      return p;
    };
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, h + 1/3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1/3);
  }
  return { r: r * 255, g: g * 255, b: b * 255 };
}

export function hexToHSL(hex) {
  const rgb = hexToRgb(hex);
  if (!rgb) return { h: 0, s: 0, l: 0 };
  return rgbToHsl(rgb.r, rgb.g, rgb.b);
}

export function hslToHex(h, s, l) {
  const rgb = hslToRgb(h, s, l);
  return rgbToHex(rgb.r, rgb.g, rgb.b);
}

function applySaturation(hsl, value) {
  // value between -100 and 100
  hsl.s = Math.max(0, Math.min(100, hsl.s + value));
  return hsl;
}

function applyBrightness(hsl, value) {
  // value between -100 and 100
  hsl.l = Math.max(0, Math.min(100, hsl.l + value));
  return hsl;
}

function applyWarmth(hsl, value) {
  // shift hue towards orange/blue
  // positive = warmer (towards orange), negative = cooler (towards blue)
  hsl.h = (hsl.h + value * 0.5 + 360) % 360;
  return hsl;
}

function applyOpacity(hex, value) {
  // value between 0 and 100
  const rgb = hexToRgb(hex);
  if (!rgb) return hex;
  const alpha = Math.max(0, Math.min(100, value)) / 100;
  return `rgba(${rgb.r},${rgb.g},${rgb.b},${alpha})`;
}

/**
 * Main function: compute a new color from a base color and grading values.
 * @param {string} baseColor - hex color (e.g. '#1A6FD4')
 * @param {object} grading - { saturation, brightness, warmth, opacity }
 * @returns {string} computed hex or rgba color
 */
export function computeColor(baseColor, grading = {}) {
  if (!baseColor) return baseColor;
  try {
    let hsl = hexToHSL(baseColor);
    if (grading.saturation !== undefined) hsl = applySaturation(hsl, grading.saturation);
    if (grading.brightness !== undefined) hsl = applyBrightness(hsl, grading.brightness);
    if (grading.warmth !== undefined) hsl = applyWarmth(hsl, grading.warmth);
    let result = hslToHex(hsl.h, hsl.s, hsl.l);
    if (grading.opacity !== undefined && grading.opacity !== 100) {
      result = applyOpacity(result, grading.opacity);
    }
    return result;
  } catch (e) {
    return baseColor; // fallback
  }
}