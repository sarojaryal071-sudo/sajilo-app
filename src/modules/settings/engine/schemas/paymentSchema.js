// sajilo-app/src/modules/settings/engine/schemas/paymentSchema.js
export const paymentTypes = ['bank', 'wallet', 'cash'];

let nextId = 1;

export function createDefaultPayment() {
  return {
    id: `pm_${Date.now()}_${nextId++}`,   // unique stable key
    type: 'bank',
    place: '',
    accountName: '',
    accountNumber: '',
    isPrimary: false,
  };
}

export function validatePayment(payment) {
  const errors = {};
  if (!payment.place.trim()) errors.place = 'Required';
  if (!payment.accountName.trim()) errors.accountName = 'Required';
  if (!payment.accountNumber.trim()) errors.accountNumber = 'Required';
  return errors;
}