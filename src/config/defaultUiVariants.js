// Fallback variant configuration – used when no published variants exist.
const defaultUiVariants = {
  button: {
    variant: 'filled',    // filled | outline | soft | glass
    radius: 'rounded',    // none | soft | rounded | pill
    size: 'md',           // sm | md | lg
  },
  card: {
    variant: 'elevated',  // flat | elevated | glass | soft
    hover: 'none',        // none | lift | glow | scale
    radius: 'rounded',
  },
  input: {
    variant: 'outline',   // outline | filled | soft
    radius: 'soft',
  },
  navigation: {
    variant: 'classic',   // classic | compact | floating
    position: 'top',      // top | bottom | side
  },
  header: {
    variant: 'default',   // default | compact | transparent
  },
  modal: {
    variant: 'default',   // default | glass | soft
    radius: 'modal',
  },
  badge: {
    variant: 'filled',    // filled | outline | soft
    radius: 'pill',
  },
};

export default defaultUiVariants;