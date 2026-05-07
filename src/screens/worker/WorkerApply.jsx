import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import fieldRegistry from '../../config/fieldRegistry.js'
import contentRegistry from '../../config/contentRegistry.js'
import { allRequiredFilled } from '../../utils/validateFields.js'
import { adminAnimationConfig } from '../../config/adminAnimations.js'
import { API_URL } from '../../services/api.js'

function getContent(key, fallback = '') {
  const lang = localStorage.getItem('sajilo_lang') || 'en'
  const entry = contentRegistry[key]
  if (entry && entry[lang]) return entry[lang]
  if (entry && entry.en) return entry.en
  return fallback || key
}

export default function WorkerApply({ onUserRefresh }) {
  const navigate = useNavigate()
  const CARDS = Array.isArray(fieldRegistry.workerApplyCards) ? fieldRegistry.workerApplyCards : []
  const [currentCardIndex, setCurrentCardIndex] = useState(0)
  const [formData, setFormData] = useState({})
  const [showErrors, setShowErrors] = useState(false)
  const [photoGender, setPhotoGender] = useState('male')
  const [secondaryRoles, setSecondaryRoles] = useState([])
  const [notifyLater, setNotifyLater] = useState(false)
  const [showPasswords, setShowPasswords] = useState({})
  const [showConfirm, setShowConfirm] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [serviceAreaOptions, setServiceAreaOptions] = useState([])
  const shake = adminAnimationConfig?.shakeError || {}
  const errBorder = (val) => showErrors && !val ? `1px solid ${shake.borderColor || 'var(--accent-red)'}` : '1px solid var(--border)'

  // Fetch available service areas from backend
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`${API_URL}/locations?status=available`)
        const json = await res.json()
        if (json.success) {
          setServiceAreaOptions(json.data || [])
        }
      } catch (err) {
        console.error('Failed to load locations', err)
      }
    })()
  }, [])

  const currentCard = CARDS[currentCardIndex] || { titleKey: '', fields: [] }
  const cardTitle = getContent(currentCard.titleKey, 'Worker Application')
  const nextLabel = getContent('worker.apply.next', 'Next')
  const prevLabel = getContent('worker.apply.previous', 'Previous')
  const missingFieldsMsg = getContent('worker.apply.missingFields', 'Please fill all required fields.')
  const notifLabel = getContent('worker.apply.notificationLabel', 'How would you like to receive notifications?')

  // ... (the rest of the file is exactly the same as your local version)
  // I won't repeat the entire long file here; you already have the correct local version.
  // Just ensure the import at the top includes API_URL, and the fetch uses ${API_URL}/locations?status=available
  // as shown above in the useEffect.