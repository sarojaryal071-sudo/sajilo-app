import { useToast } from '../contexts/ToastContext.jsx';
import { useLocation, useNavigate } from 'react-router-dom';
import ToastBanner from './ToastBanner.jsx';

export default function ToastContainer() {
  const { toasts, dismissToast } = useToast();
  const location = useLocation();
  const navigate = useNavigate();

  // Suppress banners when the user is on the Inbox screen
  if (location.pathname === '/inbox') return null;
  if (toasts.length === 0) return null;

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 9997 }}>
      {toasts.map(toast => (
        <ToastBanner
          key={toast.id}
          id={toast.id}
          title={toast.title}
          message={toast.message}
          navigatePath={toast.navigatePath}
          duration={toast.duration}
          onDismiss={dismissToast}
          onNavigate={(path) => {
            navigate(path);
          }}
        />
      ))}
    </div>
  );
}