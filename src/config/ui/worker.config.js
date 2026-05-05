// src/config/ui/worker.config.js
// ============================================================
// Worker Panel Visual Configuration
// All Worker Dashboard/Jobs/Earnings/Schedule/Profile styles
// References design tokens from theme.config.js
// ============================================================

const worker = {

  // ── DASHBOARD: Status Banner ──────────────────────────
  statusBanner: {
    padding: '14px 18px',
    marginBottom: '20px',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    borderLeft: '4px solid',
  },
  statusBannerOnline: {
    background: '#D1FAE5',
    borderLeftColor: '#10B981',
  },
  statusBannerOffline: {
    background: '#FEE2E2',
    borderLeftColor: '#EF4444',
  },
  statusDot: {
    fontSize: '24px',
  },
  statusTitle: {
    fontSize: '14px',
    fontWeight: 600,
  },
  statusSubtitle: {
    fontSize: '12px',
    color: 'var(--text-secondary)',
  },

    // Calendar / Datepicker styles
  calendar: {
    input: {
      width: '100%',
      padding: '12px',
      borderRadius: 'var(--radius-md)',
      border: '1px solid var(--border)',
      background: 'var(--bg-surface2)',
      fontSize: 'var(--font-body)',
      cursor: 'pointer',
      outline: 'none',
    },
    label: {
      fontSize: '12px',
      fontWeight: 600,
      display: 'block',
      marginBottom: '4px',
    },
    note: {
      fontSize: '11px',
      color: 'var(--text-secondary)',
      marginTop: '4px',
    },
  },

  
  // ── DASHBOARD: Map Card (Phase 15) ──────────────────
  dashboard: {
     mapCard: {
  width: '90%',
  maxWidth: '350px',
  height: '350px',
      background: 'var(--bg-surface2)',
      border: '2px dashed var(--border)',
      borderRadius: 'var(--radius-lg)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: '16px',
      marginLeft: 'auto',
      marginRight: 'auto',
      icon: { fontSize: '40px', opacity: 0.3 },
      title: { fontSize: 'var(--font-body-sm)', color: 'var(--text-secondary)', marginTop: '8px' },
      active: { border: '2px solid var(--accent-blue)', background: 'var(--accent-blue-light)' },
    },

    // ── DASHBOARD: Online Toggle Card (Phase 15) ──────
    toggleCard: {
      background: 'var(--bg-surface)',
      borderRadius: 'var(--radius-lg)',
      padding: '20px',
      textAlign: 'center',
      marginBottom: '16px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
      toggleArea: {
        display: 'flex',
        justifyContent: 'center',
        marginBottom: '8px',
      },
      label: {
        fontSize: 'var(--font-body-sm)',
        color: 'var(--text-secondary)',
      },
    },

    // ── DASHBOARD: Analytics Section (Phase 15) ───────
    analytics: {
      background: 'var(--bg-surface)',
      borderRadius: 'var(--radius-lg)',
      padding: '20px',
      marginBottom: '16px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
      header: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '16px',
      },
      title: {
        fontSize: 'var(--font-title)',
        fontWeight: 700,
        color: 'var(--text-primary)',
      },
      // Tab buttons for chart type + period
      tabs: {
        display: 'flex',
        gap: '6px',
        marginBottom: '12px',
      },
      tab: {
        padding: '6px 12px',
        borderRadius: 'var(--radius-sm)',
        border: '1px solid var(--border)',
        background: 'transparent',
        fontSize: 'var(--font-caption)',
        fontWeight: 500,
        color: 'var(--text-secondary)',
        cursor: 'pointer',
      },
      tabActive: {
        background: 'var(--accent-blue)',
        color: '#fff',
        borderColor: 'var(--accent-blue)',
      },
      chartArea: {
        height: '180px',
        display: 'flex',
        alignItems: 'flex-end',
        gap: '4px',
        padding: '8px 0',
      },
      // Bar chart colors (from theme palette)
      chartColors: ['var(--accent-blue)', 'var(--accent-green)', 'var(--accent-orange)', '#8B5CF6', '#EC4899'],
    },
  },
  // ── DASHBOARD: Stats Bar ──────────────────────────────
    statsBar: {
    display: 'flex',
    gap: '8px',
    marginBottom: '14px',
    padding: '0 4px',
    width: '90%',
    maxWidth: '350px',
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  statCard: {
    flex: 1,
    background: 'var(--bg-surface)',
    padding: '10px 6px',
    textAlign: 'center',
    borderRadius: 'var(--radius-md)',
    boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
  },
  statValue: {
    fontSize: '18px',
    fontWeight: 800,
    color: 'var(--accent-blue)',
  },
  statLabel: {
    fontSize: '9px',
    color: 'var(--text-secondary)',
    marginTop: '2px',
  },

  // ── DASHBOARD: Active Task Card ───────────────────────
  activeTaskCard: {
    background: 'var(--bg-surface)',
    border: '2px solid var(--accent-orange)',
    padding: '18px',
    marginBottom: '16px',
    borderRadius: 'var(--radius-md)',
  },
  activeTaskTitle: {
    fontSize: '14px',
    fontWeight: 600,
    color: 'var(--text-primary)',
    marginBottom: '4px',
  },
  activeTaskSubtitle: {
    fontSize: '12px',
    color: 'var(--text-secondary)',
    marginBottom: '12px',
  },
  activeTaskButton: {
    padding: '10px 20px',
    borderRadius: 'var(--radius-sm)',
    border: 'none',
    background: 'var(--accent-blue)',
    color: '#fff',
    fontSize: '12px',
    fontWeight: 600,
    cursor: 'pointer',
  },

  // ── DASHBOARD: Quick Actions Grid ─────────────────────
  quickActionsGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '10px',
    marginBottom: '16px',
  },
  actionCard: {
    background: 'var(--bg-surface)',
    padding: '16px',
    textAlign: 'center',
    cursor: 'pointer',
    borderRadius: 'var(--radius-md)',
  },
  actionIcon: {
    fontSize: '28px',
    marginBottom: '8px',
  },
  actionLabel: {
    fontSize: '12px',
    fontWeight: 500,
    color: 'var(--text-primary)',
  },

  // ── DASHBOARD: Notifications Card ─────────────────────
  notificationsCard: {
    background: 'var(--bg-surface)',
    border: '1px solid var(--border)',
    padding: '16px',
    borderRadius: 'var(--radius-md)',
  },
  notificationsTitle: {
    fontSize: '14px',
    fontWeight: 600,
    color: 'var(--text-primary)',
    marginBottom: '8px',
  },
  notificationsEmpty: {
    textAlign: 'center',
    padding: '16px',
    color: 'var(--text-secondary)',
    fontSize: '12px',
  },

  // ── DASHBOARD: Loading Skeleton ───────────────────────
  skeleton: {
    borderRadius: '12px',
    background: 'var(--bg-surface)',
    boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
  },

  // ── JOBS ──────────────────────────────────────────────
  jobs: {
    heading: {
      fontSize: 'var(--font-heading)',
      fontWeight: 700,
      color: 'var(--text-primary)',
      marginBottom: '20px',
    },
    list: {
      display: 'flex',
      flexDirection: 'column',
      gap: '12px',
    },
    card: {
      background: 'var(--bg-surface)',
      border: '1px solid var(--border)',
      borderRadius: 'var(--radius-md)',
      padding: '16px',
    },
    header: {
      display: 'flex',
      justifyContent: 'space-between',
      marginBottom: '8px',
    },
    serviceName: {
      fontWeight: 600,
      color: 'var(--text-primary)',
    },
    info: {
      fontSize: 'var(--font-body-sm)',
      color: 'var(--text-secondary)',
      marginBottom: '12px',
    },
    actions: {
      display: 'flex',
      gap: '8px',
    },
    empty: {
      textAlign: 'center',
      padding: '40px',
      color: 'var(--text-secondary)',
    },
        filters: {
      display: 'flex',
      gap: '6px',
      marginBottom: '16px',
      overflowX: 'auto',
      padding: '4px 0',
    },
    filterTab: {
      padding: '8px 16px',
      borderRadius: '20px',
      border: '1px solid var(--border)',
      background: 'transparent',
      fontSize: 'var(--font-body-sm)',
      fontWeight: 500,
      color: 'var(--text-secondary)',
      cursor: 'pointer',
      whiteSpace: 'nowrap',
    },
    filterTabActive: {
      background: 'var(--accent-blue)',
      color: '#fff',
      borderColor: 'var(--accent-blue)',
    },
  },

  // ── JOBS: Status Badges ───────────────────────────────
  statusBadge: {
    fontSize: 'var(--font-caption)',
    fontWeight: 700,
    padding: '2px 10px',
    borderRadius: '12px',
  },
  statusPending: {
    background: 'var(--accent-orange-light, #FED7AA)',
    color: 'var(--accent-orange)',
  },
  statusOther: {
    background: 'var(--accent-blue-light)',
    color: 'var(--accent-blue)',
  },

  // ── JOBS: Action Buttons ──────────────────────────────
  btnAccept: {
    padding: '8px 16px',
    borderRadius: 'var(--radius-sm)',
    border: 'none',
    background: 'var(--accent-green)',
    color: '#fff',
    cursor: 'pointer',
    fontSize: 'var(--font-body-sm)',
    fontWeight: 600,
  },
  btnReject: {
    padding: '8px 16px',
    borderRadius: 'var(--radius-sm)',
    border: '1px solid var(--border)',
    background: 'transparent',
    color: 'var(--text-secondary)',
    cursor: 'pointer',
    fontSize: 'var(--font-body-sm)',
    fontWeight: 600,
  },
  btnAction: {
    padding: '8px 16px',
    borderRadius: 'var(--radius-sm)',
    border: 'none',
    background: 'var(--accent-blue)',
    color: '#fff',
    cursor: 'pointer',
    fontSize: 'var(--font-body-sm)',
    fontWeight: 600,
  },
  btnComplete: {
    padding: '8px 16px',
    borderRadius: 'var(--radius-sm)',
    border: 'none',
    background: 'var(--accent-green)',
    color: '#fff',
    cursor: 'pointer',
    fontSize: 'var(--font-body-sm)',
    fontWeight: 600,
  },

  // ── EARNINGS ──────────────────────────────────────────
  earnings: {
    heading: {
      fontSize: 'var(--font-heading)',
      fontWeight: 700,
      color: 'var(--text-primary)',
      marginBottom: '20px',
    },
    hero: {
      background: 'linear-gradient(135deg, var(--accent-blue), #1A56DB)',
      borderRadius: 'var(--radius-lg)',
      padding: '24px',
      marginBottom: '20px',
      color: '#fff',
    },
    heroLabel: {
      fontSize: 'var(--font-body-sm)',
      opacity: 0.8,
      marginBottom: '4px',
    },
    heroAmount: {
      fontSize: 'var(--font-xxl)',
      fontWeight: 800,
    },
    heroSub: {
      fontSize: 'var(--font-body-sm)',
      opacity: 0.8,
      marginTop: '8px',
    },
    subheading: {
      fontSize: 'var(--font-title)',
      fontWeight: 700,
      color: 'var(--text-primary)',
      marginBottom: '12px',
    },
    list: {
      display: 'flex',
      flexDirection: 'column',
      gap: '8px',
    },
    jobItem: {
      background: 'var(--bg-surface)',
      border: '1px solid var(--border)',
      borderRadius: 'var(--radius-md)',
      padding: '12px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    jobName: {
      fontWeight: 600,
      color: 'var(--text-primary)',
      fontSize: 'var(--font-body)',
    },
    jobMeta: {
      fontSize: 'var(--font-body-sm)',
      color: 'var(--text-secondary)',
    },
    jobPrice: {
      fontSize: 'var(--font-body)',
      fontWeight: 700,
      color: 'var(--accent-green)',
    },
    empty: {
      textAlign: 'center',
      padding: '40px',
      color: 'var(--text-secondary)',
    },
  },

    // ── SCHEDULE ──────────────────────────────────────────
  schedule: {
    heading: {
      fontSize: 'var(--font-heading)',
      fontWeight: 700,
      color: 'var(--text-primary)',
      marginBottom: '20px',
    },
    list: {
      display: 'flex',
      flexDirection: 'column',
      gap: '10px',
    },
    dayCard: {
      background: 'var(--bg-surface)',
      border: '1px solid var(--border)',
      borderRadius: 'var(--radius-md)',
      padding: '12px',
    },
    dayName: {
      fontSize: 'var(--font-body)',
      fontWeight: 600,
      color: 'var(--text-primary)',
      marginBottom: '8px',
    },
    slots: {
      display: 'flex',
      gap: '8px',
    },
    slot: {
      flex: 1,
      padding: '8px 0',
      borderRadius: 'var(--radius-sm)',
      border: '1px solid var(--border)',
      cursor: 'pointer',
      fontSize: 'var(--font-body-sm)',
      fontWeight: 500,
      textAlign: 'center',
    },
    slotActive: {
      background: 'var(--accent-green-light)',
      color: 'var(--accent-green)',
    },
    slotInactive: {
      background: 'var(--bg-surface2)',
      color: 'var(--text-secondary)',
    },
    saving: {
      textAlign: 'center',
      marginTop: '12px',
      color: 'var(--text-secondary)',
      fontSize: 'var(--font-body-sm)',
    },

    // ── Subtabs Bar (Phase 12) ─────────────────────────
    subtabs: {
      // The tab bar container
      bar: {
        display: 'flex',
        gap: '4px',
        marginBottom: '20px',
        borderBottom: '2px solid var(--border)',
        paddingBottom: '0',
        overflowX: 'auto',
        flexWrap: 'nowrap',
      },
      // Individual tab button (inactive)
      tab: {
        padding: '10px 18px',
        fontSize: 'var(--font-body-sm)',
        fontWeight: 500,
        color: 'var(--text-secondary)',
        background: 'transparent',
        border: 'none',
        borderBottom: '2px solid transparent',
        cursor: 'pointer',
        whiteSpace: 'nowrap',
        transition: 'all 0.2s',
        marginBottom: '-2px',
      },
      // Active tab
      tabActive: {
        color: 'var(--accent-blue)',
        borderBottomColor: 'var(--accent-blue)',
        fontWeight: 600,
      },
      // Add tab button (+)
      addButton: {
        padding: '10px 14px',
        fontSize: '18px',
        fontWeight: 600,
        color: 'var(--text-secondary)',
        background: 'transparent',
        border: 'none',
        cursor: 'pointer',
        opacity: 0.6,
        transition: 'opacity 0.2s',
      },
      // Add button disabled (until current empty tab is filled)
      addButtonDisabled: {
        opacity: 0.3,
        cursor: 'not-allowed',
      },
    },

    // ── Time Slots (Phase 12) ───────────────────────────
    timeSlots: {
      // Container for all day cards
      container: {
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
      },
      // Single time range row
      slotRow: {
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        padding: '6px 0',
      },
      // Time input field
      timeInput: {
        padding: '6px 10px',
        borderRadius: 'var(--radius-sm)',
        border: '1px solid var(--border)',
        fontSize: 'var(--font-body-sm)',
        background: 'var(--bg-surface)',
        color: 'var(--text-primary)',
        width: '100px',
      },
      // Label between time inputs
      timeLabel: {
        fontSize: 'var(--font-body-sm)',
        color: 'var(--text-secondary)',
        margin: '0 4px',
      },
      // Remove slot button
      removeBtn: {
        padding: '4px 8px',
        borderRadius: 'var(--radius-sm)',
        border: '1px solid var(--accent-red)',
        background: 'transparent',
        color: 'var(--accent-red)',
        fontSize: 'var(--font-caption)',
        cursor: 'pointer',
        fontWeight: 500,
      },
      // Add slot button
      addSlotBtn: {
        padding: '6px 12px',
        borderRadius: 'var(--radius-sm)',
        border: '1px dashed var(--border)',
        background: 'transparent',
        color: 'var(--accent-blue)',
        fontSize: 'var(--font-body-sm)',
        cursor: 'pointer',
        fontWeight: 500,
        width: '100%',
        marginTop: '4px',
      },
      // Max slots reached message
      maxReached: {
        fontSize: 'var(--font-caption)',
        color: 'var(--text-secondary)',
        textAlign: 'center',
        padding: '4px',
      },
    },

    // ── Services Table (Phase 12) ───────────────────────
    services: {
      // Table container
      table: {
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
      },
      // Header row
      header: {
        display: 'flex',
        gap: '8px',
        padding: '8px 12px',
        background: 'var(--bg-surface2)',
        borderRadius: 'var(--radius-sm)',
        fontWeight: 600,
        fontSize: 'var(--font-body-sm)',
        color: 'var(--text-secondary)',
      },
      // Data row
      row: {
        display: 'flex',
        gap: '8px',
        padding: '10px 12px',
        background: 'var(--bg-surface)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius-md)',
        alignItems: 'center',
      },
      // Input inside row
      input: {
        padding: '6px 8px',
        borderRadius: 'var(--radius-sm)',
        border: '1px solid var(--border)',
        fontSize: 'var(--font-body-sm)',
        background: 'var(--bg-surface)',
        color: 'var(--text-primary)',
        flex: 1,
        minWidth: 0,
      },
      // Select dropdown inside row
      select: {
        padding: '6px 8px',
        borderRadius: 'var(--radius-sm)',
        border: '1px solid var(--border)',
        fontSize: 'var(--font-body-sm)',
        background: 'var(--bg-surface)',
        color: 'var(--text-primary)',
        flex: 1,
        minWidth: 0,
      },
      // Active toggle
      toggle: {
        width: '40px',
        height: '22px',
        borderRadius: '11px',
        border: 'none',
        cursor: 'pointer',
        position: 'relative',
        transition: 'background 0.2s',
      },
      toggleActive: {
        background: 'var(--accent-green)',
      },
      toggleInactive: {
        background: 'var(--border)',
      },
      toggleDot: {
        width: '18px',
        height: '18px',
        borderRadius: '50%',
        background: '#fff',
        position: 'absolute',
        top: '2px',
        transition: 'left 0.2s',
      },
      // Add row button
      addBtn: {
        padding: '6px 12px',
        borderRadius: 'var(--radius-sm)',
        border: '1px dashed var(--border)',
        background: 'transparent',
        color: 'var(--accent-blue)',
        fontSize: 'var(--font-body-sm)',
        cursor: 'pointer',
        fontWeight: 500,
        width: '100%',
      },
      // Remove row button
      removeBtn: {
        padding: '4px 8px',
        borderRadius: 'var(--radius-sm)',
        border: '1px solid var(--accent-red)',
        background: 'transparent',
        color: 'var(--accent-red)',
        fontSize: 'var(--font-caption)',
        cursor: 'pointer',
        fontWeight: 500,
        flexShrink: 0,
      },
    },

    // ── Empty / New Subtab (admin-added blank) ──────────
    emptySubtab: {
      textAlign: 'center',
      padding: '40px',
      color: 'var(--text-secondary)',
      fontSize: 'var(--font-body)',
      border: '2px dashed var(--border)',
      borderRadius: 'var(--radius-md)',
      background: 'var(--bg-surface)',
    },
  },

  // ── PROFILE ───────────────────────────────────────────
  profile: {
    header: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '20px',
    },
    heading: {
      fontSize: 'var(--font-heading)',
      fontWeight: 700,
      color: 'var(--text-primary)',
    },
    editBtn: {
      padding: '8px 16px',
      borderRadius: 'var(--radius-sm)',
      border: 'none',
      color: '#fff',
      fontSize: 'var(--font-body-sm)',
      fontWeight: 600,
      cursor: 'pointer',
    },
    editBtnEdit: {
      background: 'var(--accent-blue)',
    },
    editBtnSave: {
      background: 'var(--accent-green)',
    },
    card: {
      background: 'var(--bg-surface)',
      border: '1px solid var(--border)',
      borderRadius: 'var(--radius-lg)',
      padding: '20px',
      marginBottom: '16px',
    },
    avatarRow: {
      display: 'flex',
      alignItems: 'center',
      gap: '16px',
      marginBottom: '16px',
    },
    avatar: {
      width: '64px',
      height: '64px',
      borderRadius: '50%',
      background: 'var(--accent-blue-light)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '28px',
      fontWeight: 700,
      color: 'var(--accent-blue)',
    },
    name: {
      fontSize: 'var(--font-large)',
      fontWeight: 700,
      color: 'var(--text-primary)',
    },
    email: {
      fontSize: 'var(--font-body-sm)',
      color: 'var(--text-secondary)',
    },
    fieldGroup: {
      display: 'flex',
      flexDirection: 'column',
      gap: '12px',
    },
    fieldLabel: {
      fontSize: 'var(--font-body-sm)',
      fontWeight: 600,
      color: 'var(--text-secondary)',
      marginBottom: '4px',
    },
    fieldValue: {
      color: 'var(--text-primary)',
      fontSize: 'var(--font-body)',
    },
    fieldInput: {
      padding: '8px 10px',
      borderRadius: 'var(--radius-sm)',
      border: '1px solid var(--border)',
      width: '100%',
      fontSize: 'var(--font-body)',
    },
    fieldTextarea: {
      padding: '8px 10px',
      borderRadius: 'var(--radius-sm)',
      border: '1px solid var(--border)',
      width: '100%',
      fontSize: 'var(--font-body)',
      resize: 'vertical',
      minHeight: '60px',
    },
    skills: {
      display: 'flex',
      gap: '6px',
      flexWrap: 'wrap',
    },
    skillTag: {
      padding: '4px 10px',
      borderRadius: '12px',
      background: 'var(--accent-blue-light)',
      color: 'var(--accent-blue)',
      fontSize: 'var(--font-body-sm)',
      fontWeight: 500,
    },
    statsRow: {
      display: 'flex',
      gap: '10px',
    },
    statCard: {
      flex: 1,
      background: 'var(--bg-surface)',
      border: '1px solid var(--border)',
      borderRadius: 'var(--radius-md)',
      padding: '14px',
      textAlign: 'center',
    },
    statValue: {
      fontSize: 'var(--font-large)',
      fontWeight: 800,
    },
    statLabel: {
      fontSize: 'var(--font-caption)',
      color: 'var(--text-secondary)',
    },
  },

  // ── SHARED: Loading & Empty ───────────────────────────
  loading: {
    textAlign: 'center',
    padding: '40px',
    color: 'var(--text-secondary)',
  },

  
  // ── DESKTOP LAYOUT (Phase 13) ──────────────────────────
  desktop: {
    // Sidebar (left navigation)
    sidebar: {
      width: '240px',
      background: 'var(--bg-surface)',
      borderRight: '1px solid var(--border)',
      padding: '20px 0',
      // Logo / brand area at top
      brand: {
        fontSize: '20px',
        fontWeight: 800,
        color: 'var(--accent-blue)',
        padding: '0 20px 20px',
        marginBottom: '20px',
        borderBottom: '1px solid var(--border)',
      },
      // Navigation link
      link: {
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        padding: '12px 20px',
        fontSize: 'var(--font-body)',
        fontWeight: 500,
        color: 'var(--text-secondary)',
        cursor: 'pointer',
        transition: 'all 0.15s',
        borderLeft: '3px solid transparent',
        textDecoration: 'none',
      },
      // Active link
      linkActive: {
        background: 'var(--accent-blue-light)',
        color: 'var(--accent-blue)',
        fontWeight: 600,
        borderLeftColor: 'var(--accent-blue)',
      },
      // Link hover
      linkHover: {
        background: 'var(--bg-surface2)',
      },
      // Icon inside link
      icon: {
        fontSize: '18px',
        width: '24px',
        textAlign: 'center',
      },
    },

    // Top navbar
    navbar: {
      height: '56px',
      background: 'var(--bg-surface)',
      borderBottom: '1px solid var(--border)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'flex-end',
      padding: '0 24px',
      gap: '12px',
      // Control buttons (theme, lang, notifications, logout)
      control: {
        width: '36px',
        height: '36px',
        borderRadius: '8px',
        border: '1px solid var(--border)',
        background: 'var(--bg-surface2)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        fontSize: '16px',
        color: 'var(--text-secondary)',
      },
      // Notification badge
      badge: {
        background: 'var(--accent-red)',
        color: '#fff',
        fontSize: '10px',
        fontWeight: 700,
        width: '18px',
        height: '18px',
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'absolute',
        top: '-4px',
        right: '-4px',
      },
    },

    // Content area (right side)
    content: {
      flex: 1,
      padding: '24px',
      overflowY: 'auto',
      background: 'var(--bg-primary)',
    },

    // Breakpoint
    breakpoint: '768px',
  },

    // Client Bookings Tracking
  bookings: {
    trackCard: {
      background: 'var(--bg-surface)',
      border: '1px solid var(--border)',
      borderRadius: 'var(--radius-lg)',
      padding: '16px',
      marginBottom: '12px',
    },
    trackHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      marginBottom: '12px',
    },
    trackTitle: {
      fontSize: 'var(--font-body)',
      fontWeight: 600,
      color: 'var(--text-primary)',
    },
    trackStages: {
      display: 'flex',
      justifyContent: 'space-between',
      marginBottom: '14px',
      position: 'relative',
    },
    trackLine: {
      position: 'absolute',
      top: '12px',
      left: '12px',
      right: '12px',
      height: '2px',
      background: 'var(--border)',
      zIndex: 0,
    },
    trackLineDone: {
      background: 'var(--accent-blue)',
    },
    trackDot: {
      width: '24px',
      height: '24px',
      borderRadius: '50%',
      background: 'var(--bg-surface2)',
      border: '2px solid var(--border)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '10px',
      zIndex: 1,
      flexShrink: 0,
    },
    trackDotDone: {
      background: 'var(--accent-blue)',
      borderColor: 'var(--accent-blue)',
      color: '#fff',
    },
    trackDotCurrent: {
      background: '#fff',
      borderColor: 'var(--accent-blue)',
      borderWidth: '3px',
    },
    trackLabel: {
      fontSize: '8px',
      color: 'var(--text-secondary)',
      textAlign: 'center',
      marginTop: '4px',
      maxWidth: '40px',
    },
    trackLabelActive: {
      color: 'var(--accent-blue)',
      fontWeight: 600,
    },
    trackChat: {
      borderTop: '1px solid var(--border)',
      paddingTop: '10px',
      marginTop: '10px',
      display: 'flex',
      gap: '8px',
    },
    trackChatInput: {
      flex: 1,
      padding: '10px 14px',
      borderRadius: '20px',
      border: '1px solid var(--border)',
      background: 'var(--bg-surface2)',
      fontSize: 'var(--font-body-sm)',
      outline: 'none',
    },
    trackChatSend: {
      padding: '10px 16px',
      borderRadius: '20px',
      border: 'none',
      background: 'var(--accent-blue)',
      color: '#fff',
      fontSize: 'var(--font-body-sm)',
      fontWeight: 600,
      cursor: 'pointer',
    },
    trackEmpty: {
      textAlign: 'center',
      padding: '60px',
      color: 'var(--text-secondary)',
      background: 'var(--bg-surface)',
      borderRadius: 'var(--radius-lg)',
      border: '1px solid var(--border)',
    },
  },
}

export default worker