import { useState, useCallback } from 'react';

function flattenTokens(tokenTree) {
  const flat = {};
  if (!tokenTree) return flat;
  for (const [category, values] of Object.entries(tokenTree)) {
    if (values && typeof values === 'object') {
      for (const [key, value] of Object.entries(values)) {
        flat[`${category}.${key}`] = value;
      }
    }
  }
  return flat;
}

function computeChangedTokens(currentTokens, publishedTokens) {
  const currentFlat = flattenTokens(currentTokens);
  const publishedFlat = flattenTokens(publishedTokens);
  const changed = [];
  for (const [path, val] of Object.entries(currentFlat)) {
    if (publishedFlat[path] !== val) {
      changed.push(path);
    }
  }
  return changed;
}

export function usePreviewTokens(initialTokens, publishedTokens) {
  const [history, setHistory] = useState([initialTokens]);
  const [index, setIndex] = useState(0);

  const tokens = history[index];
  const canUndo = index > 0;
  const canRedo = index < history.length - 1;

  // Support both direct values and updater functions
  const setTokens = useCallback((valueOrFn) => {
    setHistory(prevHistory => {
      const current = prevHistory[index];
      const nextTokens = typeof valueOrFn === 'function' ? valueOrFn(current) : valueOrFn;
      return [...prevHistory.slice(0, index + 1), nextTokens];
    });
    setIndex(prev => prev + 1);
  }, [index]);

  const undo = useCallback(() => { if (canUndo) setIndex(prev => prev - 1); }, [canUndo]);
  const redo = useCallback(() => { if (canRedo) setIndex(prev => prev + 1); }, [canRedo]);

  const changedTokens = computeChangedTokens(tokens, publishedTokens);

  return { tokens, setTokens, undo, redo, canUndo, canRedo, changedTokens };
}