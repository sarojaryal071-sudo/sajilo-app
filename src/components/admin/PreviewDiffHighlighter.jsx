import { useEffect } from 'react';
import { getElementById } from '../../config/sceneGraph.js';

export default function PreviewDiffHighlighter({ enabled, changedTokens, containerRef }) {
  useEffect(() => {
    const el = containerRef?.current;
    if (!el) return;

    // Remove previous highlights
    el.querySelectorAll('[data-diff-highlight]').forEach(e => {
      e.style.outline = '';
      e.style.outlineOffset = '';
      e.removeAttribute('data-diff-highlight');
    });

    if (!enabled || !changedTokens || changedTokens.length === 0) return;

    // Determine which categories have changes
    const changedCategories = new Set(changedTokens.map(p => p.split('.')[0]));

    // Highlight elements whose categories intersect with changed tokens
    const nodes = el.querySelectorAll('[data-node-id]');
    nodes.forEach(node => {
      const nodeId = node.getAttribute('data-node-id');
      const element = getElementById(nodeId);
      if (element && element.tokens) {
        if (element.tokens.some(cat => changedCategories.has(cat))) {
          node.style.outline = '2px dashed var(--accent-orange)';
          node.style.outlineOffset = '2px';
          node.setAttribute('data-diff-highlight', 'true');
        }
      }
    });
  }, [enabled, changedTokens, containerRef]);

  return null;
}