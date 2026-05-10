// src/config/paymentRegistry.js
// Phase 8 — Payment & Billing Foundation
// Config‑ready mappings for payment statuses, methods, badge styles, invoice labels.
// All visual values can be edited here or later via an admin panel.

export const PAYMENT_STATUS_CONFIG = {
  unpaid: {
    label: 'Unpaid',
    badgeColor: '#F59E0B',   // amber
    textColor: '#FFFFFF',
  },
  pending_cash: {
    label: 'Cash Pending',
    badgeColor: '#3B82F6',   // blue
    textColor: '#FFFFFF',
  },
  paid: {
    label: 'Paid',
    badgeColor: '#10B981',   // green
    textColor: '#FFFFFF',
  },
  // Future‑ready statuses
  gateway_pending: {
    label: 'Processing',
    badgeColor: '#8B5CF6',   // purple
    textColor: '#FFFFFF',
  },
  failed: {
    label: 'Failed',
    badgeColor: '#EF4444',   // red
    textColor: '#FFFFFF',
  },
  refunded: {
    label: 'Refunded',
    badgeColor: '#6B7280',   // gray
    textColor: '#FFFFFF',
  },
};

export const PAYMENT_METHOD_LABELS = {
  cash: 'Cash',
  esewa: 'eSewa',
  khalti: 'Khalti',
  stripe: 'Stripe',
  wallet: 'Wallet',
};

export const INVOICE_LABELS = {
  title: 'Payment Receipt',
  bookingId: 'Booking ID',
  worker: 'Service Provider',
  serviceName: 'Service',
  date: 'Date',
  method: 'Payment Method',
  status: 'Status',
  subtotal: 'Subtotal',
  platformFee: 'Platform Fee',
  workerAmount: 'Worker Earnings',
  total: 'Total Paid',
  invoiceNumber: 'Invoice #',
  paidAt: 'Paid On',
  closeButton: 'Close',
};

export const PAYMENT_DEFAULT_VALUES = {
  defaultMethod: 'cash',
  defaultCurrency: 'NPR',
  defaultStatus: 'unpaid',
};

// Helper to get status config safely
export function getPaymentStatusConfig(status) {
  return PAYMENT_STATUS_CONFIG[status] || {
    label: status || 'Unknown',
    badgeColor: '#6B7280',
    textColor: '#FFFFFF',
  };
}

// Helper to get method label safely
export function getPaymentMethodLabel(method) {
  return PAYMENT_METHOD_LABELS[method] || method || 'Unknown';
}