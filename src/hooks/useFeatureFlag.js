import { useMemo } from 'react'

export function useFeatureFlag(key) {
  const enabled = useMemo(() => {
    try {
      const savedFlags = localStorage.getItem('sajilo_flags')
      if (!savedFlags) return true
      const flags = JSON.parse(savedFlags)
      return flags[key]?.enabled ?? true
    } catch {
      return true
    }
  }, [key])

  return enabled
}