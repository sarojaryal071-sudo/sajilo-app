import useBranding from '../../hooks/useBranding.js';

export default function BrandLogo({ dark = false, size = 32 }) {
  const branding = useBranding();
  const logoSrc = dark ? branding.logos.dark : branding.logos.light;

  if (!logoSrc) {
    return <span style={{ fontWeight: 700, fontSize: size * 0.5 }}>{branding.shortName}</span>;
  }

  return (
    <img
      src={logoSrc}
      alt={branding.shortName}
      style={{ height: size, width: 'auto' }}
      onError={(e) => { e.target.style.display = 'none'; e.target.parentNode.textContent = branding.shortName; }}
    />
  );
}