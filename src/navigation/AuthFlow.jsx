import { Routes, Route, useNavigate } from 'react-router-dom'
import LoginScreen from '../screens/LoginScreen.jsx'
import SignupScreen from '../screens/SignupScreen.jsx'
import WorkerApply from '../screens/worker/WorkerApply.jsx'
import WelcomeScreen from '../screens/WelcomeScreen.jsx'

export default function AuthFlow({ onLogin }) {
  const navigate = useNavigate()

  const handleLogin = (user) => {
    if (onLogin) onLogin(user)

    if (user.role === 'worker') {
      if (user.status === 'pending') {
        if (user.application_submitted) {
          navigate('/worker/pending')
        } else {
          navigate('/worker/apply')
        }
      } else if (user.status === 'rejected') {
        navigate('/worker/pending')
      } else if (user.status === 'active') {
        const welcomed = localStorage.getItem('sajilo_worker_welcomed') === 'true'
        navigate(welcomed ? '/worker/dashboard' : '/worker/pending')
      } else {
        navigate('/worker/dashboard')
      }
    } else {
      navigate('/home')
    }
  }

  return (
    <Routes>
      <Route path="/welcome" element={<WelcomeScreen />} />
      <Route path="/login" element={<LoginScreen navigate={navigate} onLogin={handleLogin} />} />
      <Route path="/signup" element={<SignupScreen navigate={navigate} onLogin={handleLogin} />} />
      <Route path="/worker/apply" element={<WorkerApply onUserRefresh={onLogin} />} />
    </Routes>
  )
}