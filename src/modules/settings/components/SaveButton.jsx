export default function SaveButton({ onClick, loading, disabled }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      style={{
        padding: '10px 24px',
        borderRadius: 8,
        border: 'none',
        background: disabled || loading ? '#cbd5e1' : 'var(--accent-blue)',
        color: '#fff',
        fontSize: 14,
        fontWeight: 600,
        cursor: disabled || loading ? 'not-allowed' : 'pointer',
        display: 'flex',
        alignItems: 'center',
        gap: 8,
      }}
    >
      {loading && <span className="spinner" style={{ width: 16, height: 16, border: '2px solid #fff', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.6s linear infinite' }} />}
      {loading ? 'Saving…' : 'Save Changes'}
    </button>
  );
}