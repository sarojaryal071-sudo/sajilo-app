// sajilo-app/src/modules/settings/engine/FieldShell.jsx
export default function FieldShell({ focused, children }) {
      console.log('FieldShell focused=', focused);
  return (
    <div
      style={{
        position: 'relative',
        borderRadius: 10,
        transition: 'box-shadow 0.2s ease, transform 0.2s ease',
        boxShadow: focused
          ? '0 0 0 3px rgba(59,130,246,0.25), 0 2px 8px rgba(0,0,0,0.04)'
          : 'none',
        transform: focused ? 'translateY(-1px)' : 'none',
        zIndex: focused ? 2 : 0,
        padding: '2px 4px',       // give breathing room for the glow
        margin: '-2px -4px',       // keep layout alignment
      }}
    >
      {children}
    </div>
  );
}