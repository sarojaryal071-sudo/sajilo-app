export function buildUiConfig({ design = {}, branding = {}, features = {}, navigation = {}, content = {}, layouts = {}, variants = {}, assets = {}, presets = {}, colorsGrading = {} }) {
  return {
    design: design || {},
    branding: branding || {},
    features: features || {},
    navigation: navigation || {},
    content: content || {},
    layouts: layouts || {},
    variants: variants || {},
    assets: assets || {},
    presets: presets || {},
    colorsGrading: colorsGrading || {},
  };
}