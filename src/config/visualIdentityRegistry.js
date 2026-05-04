// src/config/visualIdentityRegistry.js

/**
 * VISUAL IDENTITY REGISTRY
 * -------------------------
 * Defines "WHAT EACH UI ELEMENT IS" — not how it renders.
 * Pure configuration only. No React, no JSX.
 *
 * Phase 3 purpose:
 * - Blueprint of all Worker Panel UI components
 * - Prepare for future ElementRenderer engine
 * - Keep UI modular and admin-configurable
 *
 * Each element has:
 *   type       → Maps to component type (from componentDictionary or custom)
 *   screen     → Which screen it belongs to
 *   layout     → Width, position, grid placement
 *   style      → Style variant (references worker.config.js tokens)
 *   content    → Data source (context field or contentRegistry key)
 *   behavior   → Click action, interactivity
 *   responsive → Mobile vs desktop layout rules
 *   visible    → Default visibility (overridden by feature flags in uiRegistry.js)
 */

const visualIdentityRegistry = {

  // ============================================================
  // WORKER DASHBOARD ELEMENTS
  // ============================================================

  workerStatusBanner: {
    type: "statusBanner",
    screen: "WorkerDashboard",
    layout: {
      width: "full",
      position: 1,
    },
    style: {
      variant: "onlineOffline",
      styleRef: "statusBanner",
    },
    content: {
      onlineTitleKey: "worker.online",
      offlineTitleKey: "worker.offline",
      onlineSubtitleKey: "worker.receiving",
      offlineSubtitleKey: "worker.goOnline",
      dataSource: "WorkerContext.profile.is_online",
    },
    behavior: {
      clickable: false,
    },
    responsive: {
      mobile: "full",
      desktop: "full",
    },
    visible: true,
  },

    // ── DASHBOARD: Map Preview Card (Phase 15) ──────────
  dashboardMapCard: {
    type: "mapPlaceholder",
    screen: "WorkerDashboard",
    layout: { width: "full", position: 1.5 },
    style: { variant: "mapCard", styleRef: "dashboard.mapCard" },
    content: {
      titleKey: "worker.mapPreview",
      emptyKey: "worker.mapEmpty",
      dataSource: "BookingContext.activeBooking",
      // Updates when worker accepts a job — shows location preview
    },
    behavior: { clickable: false },
    responsive: { mobile: "full", desktop: "full" },
    visible: true,
  },

  // ── DASHBOARD: Online Toggle Card (Phase 15) ──────────
  dashboardOnlineToggle: {
    type: "onlineToggleCard",
    screen: "WorkerDashboard",
    layout: { width: "full", position: 1.7 },
    style: { variant: "centered", styleRef: "dashboard.toggleCard" },
    content: {
      onlineLabelKey: "worker.online",
      offlineLabelKey: "worker.offline",
      tapToOfflineKey: "worker.tapToGoOffline",
      tapToOnlineKey: "worker.tapToGoOnline",
      dataSource: "WorkerContext.profile.is_online",
    },
    behavior: { clickable: true, action: "toggleOnline" },
    responsive: { mobile: "full", desktop: "full" },
    visible: true,
  },

  // ── DASHBOARD: Analytics Section (Phase 15) ───────────
  dashboardAnalytics: {
    type: "analyticsChart",
    screen: "WorkerDashboard",
    layout: { width: "full", position: 1.9 },
    style: { variant: "chartSection", styleRef: "dashboard.analytics" },
    content: {
      titleKey: "worker.analytics",
      chartTypes: ["bar", "line", "pie"],
      defaultChart: "bar",
      periods: ["weekly", "monthly"],
      defaultPeriod: "weekly",
      dataSource: "WorkerContext.earnings",
      groupByProfession: true,
      // Colors pulled from theme.config.js chart palette
    },
    behavior: { clickable: true, action: "switchChart" },
    responsive: { mobile: "full", desktop: "full" },
    visible: true,
  },
  
  workerStatsBar: {
    type: "statsCardGroup",
    screen: "WorkerDashboard",
    layout: {
      width: "full",
      position: 2,
    },
    style: {
      variant: "statCards",
      styleRef: "statsBar",
    },
    content: {
      stats: [
        { labelKey: "worker.jobsToday", dataSource: "WorkerContext.profile.completed_jobs" },
        { labelKey: "worker.todayEarnings", dataSource: "WorkerContext.earnings.total_earnings" },
        { labelKey: "worker.rating", dataSource: "WorkerContext.profile.rating" },
      ],
    },
    behavior: {
      clickable: false,
    },
    responsive: {
      mobile: "3-column-compact",
      desktop: "3-column",
    },
    visible: true,
  },

  workerActiveTaskCard: {
    type: "activeTaskCard",
    screen: "WorkerDashboard",
    layout: {
      width: "full",
      position: 3,
    },
    style: {
      variant: "highlight",
      styleRef: "activeTaskCard",
    },
    content: {
      activeTitleKey: "worker.activeJobInProgress",
      noJobTitleKey: "worker.noJob",
      waitingSubtitleKey: "worker.waiting",
      goOnlineSubtitleKey: "worker.goOnline",
      buttonKey: "worker.viewTasks",
      dataSource: "BookingContext.activeBooking",
    },
    behavior: {
      clickable: true,
      action: "navigate:/worker/jobs",
    },
    responsive: {
      mobile: "full",
      desktop: "full",
    },
    visible: true,
  },

  workerQuickActions: {
    type: "navActionGrid",
    screen: "WorkerDashboard",
    layout: {
      width: "full",
      position: 4,
      grid: "2x2",
    },
    style: {
      variant: "cardGrid",
      styleRef: "quickActionsGrid",
    },
    content: {
      items: [
        { labelKey: "worker.viewTasks", icon: "🔧", route: "/worker/jobs" },
        { labelKey: "worker.viewSchedule", icon: "📅", route: "/worker/schedule" },
        { labelKey: "worker.earnings", icon: "💰", route: "/worker/earnings" },
        { labelKey: "worker.profile", icon: "👤", route: "/worker/profile" },
      ],
    },
    behavior: {
      clickable: true,
      action: "navigate",
    },
    responsive: {
      mobile: "2x2-grid",
      desktop: "2x2-grid",
    },
    visible: true,
  },

  workerNotificationsCard: {
    type: "notificationCard",
    screen: "WorkerDashboard",
    layout: {
      width: "full",
      position: 5,
    },
    style: {
      variant: "default",
      styleRef: "notificationsCard",
    },
    content: {
      titleKey: "worker.notifications",
      emptyKey: "worker.noNotifications",
      dataSource: "WorkerContext.notifications",
    },
    behavior: {
      clickable: false,
    },
    responsive: {
      mobile: "full",
      desktop: "full",
    },
    visible: true,
  },

  // ============================================================
  // WORKER JOBS SCREEN ELEMENTS
  // ============================================================

  jobsHeading: {
    type: "screenHeading",
    screen: "WorkerJobs",
    layout: {
      width: "full",
      position: 1,
    },
    style: {
      variant: "heading",
      styleRef: "jobs.heading",
    },
    content: {
      titleKey: "worker.myJobs",
    },
    behavior: {
      clickable: false,
    },
    responsive: {
      mobile: "full",
      desktop: "full",
    },
    visible: true,
  },

    jobsFilterTabs: {
    type: "filterTabs",
    screen: "WorkerJobs",
    layout: { width: "full", position: 1.5 },
    style: { variant: "filterTabs", styleRef: "jobs.filters" },
    content: {
      tabs: [
        { id: "all", labelKey: "worker.jobs.all", default: true },
        { id: "pending", labelKey: "booking.status.pending" },
        { id: "accepted", labelKey: "booking.status.accepted" },
        { id: "active", labelKey: "worker.jobs.active" },
        { id: "completed", labelKey: "booking.status.completed" },
      ],
    },
    behavior: { clickable: true, action: "filterJobs" },
    responsive: { mobile: "scrollable", desktop: "horizontal" },
    visible: true,
  },

  jobCard: {
    type: "jobCard",
    screen: "WorkerJobs",
    layout: {
      width: "full",
      position: 2,
    },
    style: {
      variant: "statusBased",
      styleRef: "jobs.card",
    },
    content: {
      dataSource: "WorkerContext.bookings",
      statusBadgeKeys: {
        pending: "booking.status.pending",
        accepted: "booking.status.accepted",
        onway: "booking.status.onway",
        working: "booking.status.working",
        completed: "booking.status.completed",
        cancelled: "booking.status.cancelled",
      },
      actionButtons: {
        pending: [
          { labelKey: "worker.accept", action: "accept", styleRef: "btnAccept" },
          { labelKey: "worker.reject", action: "reject", styleRef: "btnReject" },
        ],
        accepted: [
          { labelKey: "worker.startTravel", action: "onway", styleRef: "btnAction" },
        ],
        onway: [
          { labelKey: "worker.startWork", action: "working", styleRef: "btnAction" },
        ],
        working: [
          { labelKey: "worker.completeJob", action: "completed", styleRef: "btnComplete" },
        ],
      },
    },
    behavior: {
      clickable: true,
      actions: ["accept", "reject", "onway", "working", "completed"],
    },
    responsive: {
      mobile: "full",
      desktop: "full",
    },
    visible: true,
  },

  jobsEmptyState: {
    type: "emptyState",
    screen: "WorkerJobs",
    layout: {
      width: "full",
      position: 3,
    },
    style: {
      variant: "centered",
      styleRef: "jobs.empty",
    },
    content: {
      messageKey: "empty.noBookings",
    },
    behavior: {
      clickable: false,
    },
    responsive: {
      mobile: "full",
      desktop: "full",
    },
    visible: true,
  },

  // ============================================================
  // WORKER EARNINGS SCREEN ELEMENTS
  // ============================================================

  earningsHeading: {
    type: "screenHeading",
    screen: "WorkerEarnings",
    layout: {
      width: "full",
      position: 1,
    },
    style: {
      variant: "heading",
      styleRef: "earnings.heading",
    },
    content: {
      titleKey: "worker.earnings",
    },
    behavior: {
      clickable: false,
    },
    responsive: {
      mobile: "full",
      desktop: "full",
    },
    visible: true,
  },

  earningsHeroCard: {
    type: "earningsHero",
    screen: "WorkerEarnings",
    layout: {
      width: "full",
      position: 2,
    },
    style: {
      variant: "gradientHero",
      styleRef: "earnings.hero",
    },
    content: {
      labelKey: "worker.totalEarnings",
      dataSource: "WorkerContext.earnings",
      amountField: "total_earnings",
      subField: "completed_jobs",
      subLabelKey: "worker.completedJobs",
    },
    behavior: {
      clickable: false,
    },
    responsive: {
      mobile: "full",
      desktop: "full",
    },
    visible: true,
  },

  earningsHistoryHeading: {
    type: "sectionHeading",
    screen: "WorkerEarnings",
    layout: {
      width: "full",
      position: 3,
    },
    style: {
      variant: "subheading",
      styleRef: "earnings.subheading",
    },
    content: {
      titleKey: "worker.jobHistory",
    },
    behavior: {
      clickable: false,
    },
    responsive: {
      mobile: "full",
      desktop: "full",
    },
    visible: true,
  },

  earningsJobItem: {
    type: "jobHistoryItem",
    screen: "WorkerEarnings",
    layout: {
      width: "full",
      position: 4,
    },
    style: {
      variant: "listRow",
      styleRef: "earnings.jobItem",
    },
    content: {
      dataSource: "WorkerContext.bookings",
      filter: { status: "completed" },
      fields: ["service_name", "customer_name", "job_size", "price"],
    },
    behavior: {
      clickable: false,
    },
    responsive: {
      mobile: "full",
      desktop: "full",
    },
    visible: true,
  },

  earningsEmptyState: {
    type: "emptyState",
    screen: "WorkerEarnings",
    layout: {
      width: "full",
      position: 5,
    },
    style: {
      variant: "centered",
      styleRef: "earnings.empty",
    },
    content: {
      messageKey: "worker.noCompletedJobs",
    },
    behavior: {
      clickable: false,
    },
    responsive: {
      mobile: "full",
      desktop: "full",
    },
    visible: true,
  },

  // ============================================================
  // WORKER SCHEDULE SCREEN ELEMENTS
  // ============================================================

  scheduleHeading: {
    type: "screenHeading",
    screen: "WorkerSchedule",
    layout: {
      width: "full",
      position: 1,
    },
    style: {
      variant: "heading",
      styleRef: "schedule.heading",
    },
    content: {
      titleKey: "worker.availabilitySchedule",
    },
    behavior: {
      clickable: false,
    },
    responsive: {
      mobile: "full",
      desktop: "full",
    },
    visible: true,
  },

  scheduleDayCard: {
    type: "dayScheduleCard",
    screen: "WorkerSchedule",
    layout: {
      width: "full",
      position: 2,
    },
    style: {
      variant: "dayToggleCard",
      styleRef: "schedule.dayCard",
    },
    content: {
      dataSource: "WorkerContext.schedule",
      days: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
      slots: ["morning", "afternoon", "evening"],
      slotLabelKeys: {
        morning: "worker.morning",
        afternoon: "worker.afternoon",
        evening: "worker.evening",
      },
    },
    behavior: {
      clickable: true,
      action: "toggleSlot",
    },
    responsive: {
      mobile: "vertical-list",
      desktop: "vertical-list",
    },
    visible: true,
  },

  scheduleSavingIndicator: {
    type: "statusText",
    screen: "WorkerSchedule",
    layout: {
      width: "full",
      position: 3,
    },
    style: {
      variant: "centered",
      styleRef: "schedule.saving",
    },
    content: {
      savingKey: "worker.saving",
    },
    behavior: {
      clickable: false,
    },
    responsive: {
      mobile: "full",
      desktop: "full",
    },
    visible: true,
  },

    // ── SUBTAB CONTAINER (Phase 12) ────────────────────────
  scheduleSubtabs: {
    type: "subtabContainer",
    screen: "WorkerSchedule",
    layout: { width: "full", position: 1 },
    style: { variant: "subtabBar", styleRef: "schedule.subtabs" },
    content: {
      defaultSubtabs: [
        { id: "timeSlots", labelKey: "worker.schedule.timeSlots", elementId: "scheduleDayCard" },
        { id: "services", labelKey: "worker.schedule.services", elementId: "serviceTable" },
      ],
      // Admin can add more subtabs from admin panel
      adminAddable: true,
      maxEmptyContainers: 1, // Only one empty container allowed at a time
    },
    behavior: { clickable: true, action: "switchSubtab" },
    responsive: { mobile: "scrollable", desktop: "horizontal" },
    visible: true,
  },

  // ── SERVICE TABLE (Phase 12) ───────────────────────────
  serviceTable: {
    type: "serviceTable",
    screen: "WorkerSchedule",
    layout: { width: "full", position: 2 },
    style: { variant: "table", styleRef: "schedule.services" },
    content: {
      columns: [
        { id: "name", labelKey: "worker.services.name", type: "text", required: true },
        { id: "category", labelKey: "worker.services.category", type: "select", options: [
          { value: "small", labelKey: "worker.services.smallJob" },
          { value: "medium", labelKey: "worker.services.mediumJob" },
          { value: "large", labelKey: "worker.services.largeJob" },
        ]},
        { id: "price", labelKey: "worker.services.price", type: "number", required: true },
        { id: "active", labelKey: "worker.services.active", type: "toggle" },
      ],
      dataSource: "WorkerContext.services",
      addLabelKey: "worker.services.add",
      removeLabelKey: "worker.schedule.remove",
      // Admin can configure which columns appear and their order
      adminConfigurable: ["columns", "categories"],
    },
    behavior: { clickable: true, action: "editService" },
    responsive: { mobile: "stacked", desktop: "table" },
    visible: true,
  },


  // ============================================================
  // WORKER PROFILE SCREEN ELEMENTS
  // ============================================================

  profileHeader: {
    type: "screenHeaderWithAction",
    screen: "WorkerProfile",
    layout: {
      width: "full",
      position: 1,
    },
    style: {
      variant: "headerWithButton",
      styleRef: "profile.header",
    },
    content: {
      titleKey: "worker.profile",
      editButtonKey: "worker.edit",
      saveButtonKey: "worker.save",
      savingButtonKey: "worker.saving",
    },
    behavior: {
      clickable: true,
      action: "toggleEdit",
    },
    responsive: {
      mobile: "full",
      desktop: "full",
    },
    visible: true,
  },

  profileAvatar: {
    type: "avatar",
    screen: "WorkerProfile",
    layout: {
      width: "auto",
      position: 2,
    },
    style: {
      variant: "initials",
      styleRef: "profile.avatar",
    },
    content: {
      dataSource: "WorkerContext.profile",
      nameField: "name",
      emailField: "email",
    },
    behavior: {
      clickable: false,
    },
    responsive: {
      mobile: "left-aligned",
      desktop: "left-aligned",
    },
    visible: true,
  },

  profileFieldGroup: {
    type: "editableFieldGroup",
    screen: "WorkerProfile",
    layout: {
      width: "full",
      position: 3,
    },
    style: {
      variant: "formFields",
      styleRef: "profile.fieldGroup",
    },
    content: {
      fields: [
        { name: "phone", labelKey: "field.phone", type: "text" },
        { name: "bio", labelKey: "field.bio", type: "textarea" },
        { name: "skills", labelKey: "field.skills", type: "tagInput" },
        { name: "hourly_rate", labelKey: "worker.hourlyRate", type: "number" },
      ],
      dataSource: "WorkerContext.profile",
    },
    behavior: {
      clickable: true,
      action: "editField",
    },
    responsive: {
      mobile: "full",
      desktop: "full",
    },
    visible: true,
  },

  profileStatsRow: {
    type: "statsRow",
    screen: "WorkerProfile",
    layout: {
      width: "full",
      position: 4,
      grid: "3-column",
    },
    style: {
      variant: "statCards",
      styleRef: "profile.statsRow",
    },
    content: {
      stats: [
        { labelKey: "worker.jobsDone", valueField: "completed_jobs", color: "accentBlue" },
        { labelKey: "worker.earnings", valueField: "total_earnings", color: "accentGreen", format: "currency" },
        { labelKey: "worker.status", valueField: "is_online", color: "statusBased", format: "onlineStatus" },
      ],
      dataSource: "WorkerContext.profile",
    },
    behavior: {
      clickable: false,
    },
    responsive: {
      mobile: "3-column-compact",
      desktop: "3-column",
    },
    visible: true,
  },
};

export default visualIdentityRegistry;