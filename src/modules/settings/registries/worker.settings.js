// Worker‑only settings sections
export const workerSections = {
  account: {
    label: 'Account',
    fields: [
      { key: 'fullName', type: 'text', label: 'Full Name' },
      { key: 'email', type: 'email', label: 'Email' },
      { key: 'phone', type: 'tel', label: 'Phone' },
    ],
  },
    payment: {
    label: 'Banking & Payments',
    fields: [
      {
        key: 'methods',
        type: 'repeatable_group',
        label: 'Payment Methods',
        value: [],
      },
    ],
  },
};