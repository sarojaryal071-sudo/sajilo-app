export const defaultGovernanceConfig = {
  system: {
    maintenanceMode: false,
    safeMode: false,
    environment: 'production',
  },
  features: {
    bookingsEnabled: true,
    workerBookingsEnabled: true,
    financeEnabled: true,
    uiStudioEnabled: true,
    dynamicLayoutsEnabled: true,
  },
  communication: {
    globalNoticeEnabled: false,
    globalNoticeText: '',
    globalNoticeSeverity: 'info',
  },
  emergency: {
    disablePayments: false,
    disableNewBookings: false,
    disableWorkerActions: false,
  },
};