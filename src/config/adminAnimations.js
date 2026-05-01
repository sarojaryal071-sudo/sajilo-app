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
}