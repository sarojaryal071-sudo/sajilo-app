import { useParams, useNavigate } from 'react-router-dom'
import DetailScreen from '../screens/DetailScreen.jsx'

export default function DetailWrapper({ t }) {
  const { workerId } = useParams()
  const navigate = useNavigate()
  return <DetailScreen navigate={navigate} workerId={parseInt(workerId)} previousTab="search" t={t} />
}