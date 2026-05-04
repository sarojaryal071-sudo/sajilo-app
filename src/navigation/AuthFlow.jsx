// sajilo-app/src/navigation/AuthFlow.jsx
// Central auth navigation — Login, Signup, WorkerApply
// All visual components unchanged, just wired together here

import { Routes, Route, useNavigate } from 'react-router-dom'
import LoginScreen from '../screens/LoginScreen.jsx'
import SignupScreen from '../screens/SignupScreen.jsx'
import WorkerApply from '../screens/worker/WorkerApply.jsx'

export default function AuthFlow({ onLogin }) {
  const navigate = useNavigate()

  const handleLogin = (user) => {
    if (onLogin) onLogin(user)
    // Route based on role
    if (user.role === 'worker') {
      if (user.status === 'pending' && !user.application_submitted) {
        navigate('/worker/apply')
      } else if (user.status === 'pending') {
        navigate('/worker/pending')
      } else {
        navigate('/worker')
      }
    } else {
      navigate('/home')
    }
  }

  return (
    <Routes>
      <Route path="/login" element={<LoginScreen navigate={navigate} onLogin={handleLogin} />} />
      <Route path="/signup" element={<SignupScreen navigate={navigate} onLogin={handleLogin} />} />
      <Route path="/worker/apply" element={<WorkerApply navigate={navigate} />} />
    </Routes>
  )
}
