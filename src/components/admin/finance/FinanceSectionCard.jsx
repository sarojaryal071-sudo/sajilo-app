import useUiVariant from '../../../hooks/useUiVariant.js';
import { buildVariantClassName } from '../../../utils/buildVariantClassName.js';

export default function FinanceSectionCard({
  title,
  subtitle,
  children,
  loading = false,
  empty = false,
  emptyMessage = 'No data available',
  actions,
}) {
  const { getVariant } = useUiVariant();
  const cardVariant = getVariant('card');
  const variantClass = buildVariantClassName('card', cardVariant);

  return (
    <div className={variantClass} style={{
      background: 'var(--bg-surface)',
      border: '1px solid var(--border)',
      borderRadius: 'var(--radius-md)',
      padding: 20,
      marginBottom: 16,
    }}>
      {(title || actions) && (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <div>
            {title && <h3 style={{ fontSize: 'var(--font-body)', fontWeight: 600, color: 'var(--text-primary)', margin: 0 }}>{title}</h3>}
            {subtitle && <p style={{ fontSize: 12, color: 'var(--text-secondary)', margin: '2px 0 0' }}>{subtitle}</p>}
          </div>
          {actions && <div>{actions}</div>}
        </div>
      )}

      {loading ? (
        <div style={{ textAlign: 'center', padding: 24, color: 'var(--text-secondary)', fontSize: 13 }}>
          Loading...
        </div>
      ) : empty ? (
        <div style={{ textAlign: 'center', padding: 24, color: 'var(--text-secondary)', fontSize: 13 }}>
          {emptyMessage}
        </div>
      ) : (
        children
      )}
    </div>
  );
}