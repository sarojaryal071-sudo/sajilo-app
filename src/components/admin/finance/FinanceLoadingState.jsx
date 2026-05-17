export default function FinanceLoadingState({ text = 'Loading...' }) {
  return (
    <div style={{ textAlign: 'center', padding: 40, color: 'var(--text-secondary)', fontSize: 13 }}>
      {text}
    </div>
  );
}