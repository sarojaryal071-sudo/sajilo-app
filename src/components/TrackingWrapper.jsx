import { useParams, useNavigate } from 'react-router-dom'
import TrackingScreen from '../screens/TrackingScreen.jsx'

export default function TrackingWrapper({ t }) {
  const { workerId } = useParams()
  const navigate = useNavigate()
  return <TrackingScreen navigate={navigate} workerId={parseInt(workerId)} previousTab="home" t={t} />
}