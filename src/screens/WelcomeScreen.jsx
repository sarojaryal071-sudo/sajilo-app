// WelcomeScreen — development disclaimer shown before login
import { useNavigate } from 'react-router-dom'

export default function WelcomeScreen() {
  const navigate = useNavigate()

  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      minHeight: '100vh', background: '#f0f2f6', fontFamily: 'system-ui, sans-serif',
    }}>
      <div style={{
        width: '100%', maxWidth: 420, background: '#fff',
        borderRadius: 16, padding: 32, boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
        textAlign: 'center',
      }}>
        <div style={{ fontSize: 22, fontWeight: 800, color: '#1A6FD4', marginBottom: 16 }}>Sajilo</div>
        <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>Welcome to Sajilo</h2>
        
        <div style={{
          background: '#fef3c7', border: '1px solid #D97706',
          borderRadius: 10, padding: 16, marginBottom: 24,
          fontSize: 13, color: '#92400e', lineHeight: 1.6,
        }}>
          ⚠️ This project is under active development.<br/>
          Please do <strong>not</strong> use real credentials.<br/>
          Real names are appreciated for testing.<br/>
          Use a simple password — forgot password is not yet available.
        </div>

        <button onClick={() => navigate('/login')} style={{
          width: '100%', padding: 14, borderRadius: 8,
          border: 'none', background: '#1A6FD4', color: '#fff',
          fontSize: 15, fontWeight: 600, cursor: 'pointer',
        }}>
          Continue to Login →
        </button>
      </div>
    </div>
  )
}