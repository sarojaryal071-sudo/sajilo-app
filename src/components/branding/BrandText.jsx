import useBranding from '../../hooks/useBranding.js';

export default function BrandText({ short = false }) {
  const branding = useBranding();
  return <span>{short ? branding.shortName : branding.appName}</span>;
}