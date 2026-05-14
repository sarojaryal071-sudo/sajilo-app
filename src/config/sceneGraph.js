/**
 * Scene Graph
 * Phase 3 — Live Scene Introspection System
 * 
 * Builds a hierarchical component tree from visualIdentityRegistry.
 * Auto-discovers all panels, screens, and elements.
 * New registry entries appear here automatically — zero maintenance.
 */

import visualIdentityRegistry from './visualIdentityRegistry.js';

/**
 * Build a scene graph from the visual identity registry.
 * Scans every registered element and organizes by screen.
 */
function buildSceneGraph() {
  const panels = {};

  for (const [elementId, config] of Object.entries(visualIdentityRegistry)) {
    if (!config || config.visible === false) continue;

    // Determine panel from screen name
    const screen = config.screen || 'Unknown';
    const panel = getPanelFromScreen(screen);
    const section = getSectionFromScreen(screen);

    if (!panels[panel]) {
      panels[panel] = { label: getPanelLabel(panel), screens: {} };
    }
    if (!panels[panel].screens[section]) {
      panels[panel].screens[section] = { label: getSectionLabel(screen), screen, elements: [] };
    }

    panels[panel].screens[section].elements.push({
      id: elementId,
      type: config.type || 'unknown',
      label: getElementLabel(elementId, config),
      description: config.content?.dataSource || '',
      tokens: getTokensForType(config.type),
    });
  }

  return panels;
}

function getPanelFromScreen(screen) {
  if (screen.startsWith('Worker')) return 'worker';
  if (screen.startsWith('Admin')) return 'admin';
  if (screen.startsWith('Login') || screen.startsWith('Signup')) return 'auth';
  return 'client';
}

function getPanelLabel(panel) {
  return { worker: 'Worker Panel', client: 'Client Panel', admin: 'Admin Panel', auth: 'Auth Screens' }[panel] || panel;
}

function getSectionFromScreen(screen) {
  const map = {
    'WorkerDashboard': 'Dashboard',
    'WorkerJobs': 'Jobs',
    'WorkerEarnings': 'Earnings',
    'WorkerSchedule': 'Schedule',
    'WorkerProfile': 'Profile',
    'BookingsScreen': 'Bookings',
    'HomeScreen': 'Feed',
    'SearchScreen': 'Search',
    'LoginScreen': 'Login',
    'SignupScreen': 'Signup',
  };
  return map[screen] || screen;
}

function getSectionLabel(screen) {
  const map = {
    'WorkerDashboard': '📊 Dashboard',
    'WorkerJobs': '📋 Jobs',
    'WorkerEarnings': '💰 Earnings',
    'WorkerSchedule': '📅 Schedule',
    'WorkerProfile': '👤 Profile',
    'BookingsScreen': '📋 Bookings',
    'HomeScreen': '🏠 Feed',
    'SearchScreen': '🔍 Search',
    'LoginScreen': '🔐 Login',
    'SignupScreen': '📝 Signup',
  };
  return map[screen] || screen;
}

function getElementLabel(id, config) {
  // Use content key as label if available
  if (config.content?.titleKey) return id;
  // Convert camelCase to Title Case
  return id.replace(/([A-Z])/g, ' $1').replace(/^./, s => s.toUpperCase()).trim();
}

function getTokensForType(type) {
  const tokenMap = {
    statsCardGroup: ['spacing', 'radius', 'colors'],
    statusBanner: ['spacing', 'colors'],
    mapPlaceholder: ['radius', 'colors'],
    analyticsChart: ['spacing', 'radius', 'colors'],
    jobCard: ['spacing', 'radius', 'colors', 'shadows'],
    onlineToggleCard: ['spacing', 'colors'],
    screenHeading: ['typography', 'colors'],
    earningsHero: ['spacing', 'radius', 'colors'],
    jobHistoryItem: ['spacing', 'typography', 'colors'],
    bookingTrackCard: ['spacing', 'radius', 'colors'],
    dataTable: ['spacing', 'typography', 'colors'],
    filterTabs: ['spacing', 'colors'],
    profileFieldGroup: ['spacing', 'typography'],
    serviceTable: ['spacing', 'radius', 'typography'],
  };
  return tokenMap[type] || ['spacing', 'radius', 'colors'];
}

export const sceneGraph = buildSceneGraph();

/**
 * Get all elements for a specific panel and screen.
 */
export function getElements(panel, screen) {
  return sceneGraph[panel]?.screens?.[screen]?.elements || [];
}

/**
 * Get an element by its ID.
 */
export function getElementById(id) {
  for (const panel of Object.values(sceneGraph)) {
    for (const section of Object.values(panel.screens)) {
      const el = section.elements.find(e => e.id === id);
      if (el) return el;
    }
  }
  return null;
}