import { getScreenComponent } from '../../config/screenRegistry.js';
import { WorkerProvider } from '../../contexts/WorkerContext.jsx';
import { BookingProvider } from '../../contexts/BookingContext.jsx';
import { NotificationProvider } from '../../contexts/NotificationContext.jsx';
import { ToastProvider } from '../../contexts/ToastContext.jsx';
import { PreviewProvider } from '../../contexts/PreviewSandboxContext.jsx';
import React, { Suspense, useEffect, useRef } from 'react';
import visualIdentityRegistry from '../../config/visualIdentityRegistry.js';

export default function ScreenRenderer({ panel, screenKey, tokens, theme, onNodeClick, previewMode = false }) {
  const containerRef = useRef(null);
  const Component = getScreenComponent(panel, screenKey);

  // Post-render: inject data-node-id attributes based on the registry
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const applyNodeIds = () => {
      // Walk all elements inside the sandbox
      const allElements = el.querySelectorAll('*');
      const registryEntries = Object.entries(visualIdentityRegistry);

      allElements.forEach((child) => {
        if (child.hasAttribute('data-node-id')) return; // already has one
        // Check if any registry key matches the element's class or structure
        for (const [key, config] of registryEntries) {
          // For simplicity, check if the element contains a known class or style pattern
          // Many ElementRenderer elements have a specific structure we can match
          if (
            child.className && typeof child.className === 'string' &&
            child.className.includes(key)
          ) {
            child.setAttribute('data-node-id', key);
            break;
          }
          // Also check for inline style patterns that match known elements
          if (child.getAttribute('style') && child.getAttribute('style').includes(key)) {
            child.setAttribute('data-node-id', key);
            break;
          }
        }
      });
    };

    // Run once after mount, and whenever children change
    applyNodeIds();
    const observer = new MutationObserver(applyNodeIds);
    observer.observe(el, { childList: true, subtree: true });
    return () => observer.disconnect();
  }, [Component, panel, screenKey]);

  if (!Component) {
    return (
      <div style={{ padding: 40, textAlign: 'center', color: 'var(--text-secondary)' }}>
        <div style={{ fontSize: 36, marginBottom: 8 }}>📱</div>
        <p>Select a screen to preview</p>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
            onClick={(e) => {
        const node = e.target.closest('[data-node-id]');
        if (node && onNodeClick) {
          onNodeClick(node.dataset.nodeId);
        } else if (onNodeClick) {
          onNodeClick(null);
        }
      }}
      style={{ width: '100%', height: '100%', overflow: 'hidden', pointerEvents: 'auto' }}
    >
                  <ScreenSandbox>
        <Suspense fallback={<div style={{ padding: 40, textAlign: 'center', color: 'var(--text-secondary)' }}>Loading screen...</div>}>
          {previewMode ? (
            <PreviewProvider>
              <Component navigate={() => {}} t={(key) => key} title={screenKey} />
            </PreviewProvider>
          ) : (
            <NotificationProvider>
              <ToastProvider>
                <BookingProvider>
                  <WorkerProvider>
                    <Component navigate={() => {}} t={(key) => key} title={screenKey} />
                  </WorkerProvider>
                </BookingProvider>
              </ToastProvider>
            </NotificationProvider>
          )}
        </Suspense>
      </ScreenSandbox>
    </div>
  );
}

function ScreenSandbox({ children }) {
  return (
    <div style={{
      width: '100%', height: '100%', overflow: 'hidden',
      background: 'var(--bg-primary)', color: 'var(--text-primary)',
      fontFamily: 'var(--font-family)', contain: 'layout style',
    }}>
      {children}
    </div>
  );
}