export default function AuthSection({ visible = true, children, style = {} }) {
  if (!visible) return null

  return (
    <div style={{
      width: '100%',
      marginBottom: 0,
      ...style,
    }}>
      {children}
    </div>
  )
}