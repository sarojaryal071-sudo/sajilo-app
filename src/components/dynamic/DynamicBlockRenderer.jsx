import { Suspense } from 'react';
import layoutBlockRegistry from '../../config/layoutBlockRegistry.js';

export default function DynamicBlockRenderer({ blocks = [] }) {
  if (!blocks || blocks.length === 0) return null;

  const sorted = [...blocks]
    .filter(block => block.enabled !== false)
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

  return (
    <>
      {sorted.map(block => {
        const Component = layoutBlockRegistry[block.type];
        if (!Component) {
          console.warn(`[DynamicBlockRenderer] Unknown block type: ${block.type}`);
          return null;
        }
        return (
          <div key={block.id} data-block-id={block.id} style={{ marginBottom: 16 }}>
            <Suspense fallback={<div style={{ padding: 24, textAlign: 'center' }}>Loading...</div>}>
              <Component {...(block.props || {})} />
            </Suspense>
          </div>
        );
      })}
    </>
  );
}