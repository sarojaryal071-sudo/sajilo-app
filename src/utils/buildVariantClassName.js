/**
 * Build a predictable BEM‑like class name from a component type and variant props.
 * e.g. buildVariantClassName('button', { variant: 'filled', radius: 'xl' })
 * returns 'ui-button ui-button-filled ui-radius-xl'
 */
export function buildVariantClassName(componentType, props = {}) {
  const classes = [`ui-${componentType}`];
  for (const [key, value] of Object.entries(props)) {
    if (value && value !== 'default') {
      classes.push(`ui-${componentType}-${key}-${value}`);
    }
  }
  return classes.join(' ');
}