export const workerSections = {
  account: {
    label: 'Account',
    fields: [
      { key: 'fullName', type: 'text', label: 'Full Name' },
      { key: 'email', type: 'email', label: 'Email' },
      { key: 'phone', type: 'tel', label: 'Phone' },
      { key: 'bio', type: 'text', label: 'Bio' },
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