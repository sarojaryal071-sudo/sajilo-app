import { useNavigate } from 'react-router-dom';
import { getRouteForAction } from './SettingsNavigator';

export default function SettingsActionItem({ label, icon, action, description, danger }) {
  const navigate = useNavigate();

  const handleClick = () => {
    const route = getRouteForAction(action);
    if (route) {
      navigate(route);
    }
  };

  return (
    <div
      onClick={handleClick}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        padding: '14px 16px',
        borderBottom: '1px solid var(--border)',
        cursor: 'pointer',
        background: danger ? '#fee2e2' : 'transparent',
        color: danger ? 'var(--accent-red)' : 'var(--text-primary)',
      }}
    >
      {icon && <span style={{ fontSize: 18, flexShrink: 0 }}>{icon}</span>}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 14, fontWeight: 500 }}>{label}</div>
        {description && (
          <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 2 }}>
            {description}
          </div>
        )}
      </div>
      <span style={{ color: 'var(--text-secondary)', fontSize: 14 }}>›</span>
    </div>
  );
}