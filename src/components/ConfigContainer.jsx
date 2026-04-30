import { useFeatureFlag } from '../hooks/useFeatureFlag.js'

export default function ConfigContainer({ id, children, style = {} }) {
  const visible = useFeatureFlag(id)

  if (!visible) return null

  return (
    <div style={{ marginBottom: 28, ...style }}>
      {children}
    </div>
  )
}