import useGovernance from '../hooks/useGovernance.js';

const severityStyles = {
  info: { background: '#dbeafe', color: '#1e40af', border: '#2563eb' },
  warning: { background: '#fef3c7', color: '#92400e', border: '#f59e0b' },
  critical: { background: '#fee2e2', color: '#991b1b', border: '#dc2626' },
};

export default function SystemNoticeBar() {
  const { governance } = useGovernance();
  const notice = governance?.communication;

  if (!notice?.globalNoticeEnabled || !notice?.globalNoticeText) return null;

  const styles = severityStyles[notice.globalNoticeSeverity] || severityStyles.info;

  return (
    <div style={{
      padding: '8px 16px',
      background: styles.background,
      color: styles.color,
      borderBottom: `2px solid ${styles.border}`,
      fontSize: 13,
      fontWeight: 500,
      textAlign: 'center',
    }}>
      {notice.globalNoticeText}
    </div>
  );
}