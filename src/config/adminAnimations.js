export const adminAnimationConfig = {
  signupCard: {
    type: 'springCard', // key from animations directory
    initial: { scale: 1 },
    trigger: { scale: 1.05 },
  },
  loginCard: {
    type: 'fadeIn',
    initial: { opacity: 0 },
    trigger: { opacity: 1 },
  },

    // Shake + highlight error effect — reusable anywhere
  shakeError: {
    animation: 'shake 0.4s ease',
    background: '#fee2e2',
    color: '#DC2626',
    borderColor: 'var(--accent-red)',
    padding: '10px 14px',
    borderRadius: 'var(--radius-md)',
    fontSize: '13px',
    fontWeight: 500,
  },
  
}