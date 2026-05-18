// sajilo-app/src/modules/settings/engine/hooks/useRepeatableGroup.js
import { useCallback } from 'react';

export default function useRepeatableGroup(value, onChange, createDefault) {
  const addEntry = useCallback(() => {
    const newEntry = createDefault();
    if ((value || []).length === 0) {
      newEntry.isPrimary = true;
    }
    onChange([...(value || []), newEntry]);
  }, [value, onChange, createDefault]);

  const updateEntry = useCallback((index, patch) => {
    const updated = (value || []).map((entry, i) =>
      i === index ? { ...entry, ...patch } : entry
    );
    onChange(updated);
  }, [value, onChange]);

  const removeEntry = useCallback((index) => {
    const filtered = (value || []).filter((_, i) => i !== index);
    const wasPrimary = (value || [])[index]?.isPrimary;
    if (wasPrimary && filtered.length > 0) {
      filtered[0].isPrimary = true;
    }
    onChange(filtered);
  }, [value, onChange]);

  const setPrimary = useCallback((index) => {
    const updated = (value || []).map((entry, i) => ({
      ...entry,
      isPrimary: i === index,
    }));
    onChange(updated);
  }, [value, onChange]);

  return { addEntry, updateEntry, removeEntry, setPrimary };
}