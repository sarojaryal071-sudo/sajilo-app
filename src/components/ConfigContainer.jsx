import React from "react";

/**
 * ConfigContainer
 * ----------------
 * Structural wrapper component — Phase 2 only.
 * Does NOT modify UI, styling, or behavior.
 * Marks sections with data-config-id for future admin control.
 *
 * Future phases will add: show/hide, reorder, admin-driven config.
 */

const ConfigContainer = ({ id, children }) => {
  console.log(`[ConfigContainer] rendering section: ${id}`);

  return (
    <div data-config-id={id} className="config-container">
      {children}
    </div>
  );
};

export default ConfigContainer;