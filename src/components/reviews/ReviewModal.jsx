import { useState } from 'react'
import { api } from '../../services/api.js'

const MAX_RATING = 5

export default function ReviewModal({ bookingId, workerName, onClose, onSubmitted }) {
  const [rating, setRating] = useState(0)
  const [hovered, setHovered] = useState(0)
  const [reviewText, setReviewText] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async () => {
    if (rating === 0) {
      setError('Please select a star rating')
      return
    }
    setSubmitting(true)
    setError('')
    try {
      await api.createReview(bookingId, rating, reviewText || null)
      onSubmitted()
      onClose()
    } catch (err) {
      setError(err.message || 'Failed to submit review')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <>
      {/* backdrop */}
      <div
        onClick={onClose}
        style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.35)', zIndex: 9998,
        }}
      />

      {/* modal card */}
      <div style={{
        position: 'fixed', top: '50%', left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '90%', maxWidth: 400,
        background: 'var(--bg-surface)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius-lg)',
        padding: 24,
        zIndex: 9999,
        boxShadow: '0 12px 40px rgba(0,0,0,0.15)',
      }}>
        <div style={{
          fontSize: 16, fontWeight: 700,
          color: 'var(--text-primary)', marginBottom: 8,
        }}>
          Rate {workerName || 'Worker'}
        </div>

        {/* stars */}
        <div style={{ display: 'flex', gap: 6, marginBottom: 16 }}>
          {Array.from({ length: MAX_RATING }, (_, i) => i + 1).map(star => (
            <span
              key={star}
              onClick={() => setRating(star)}
              onMouseEnter={() => setHovered(star)}
              onMouseLeave={() => setHovered(0)}
              style={{
                fontSize: 32,
                cursor: 'pointer',
                color: star <= (hovered || rating) ? 'var(--accent-orange)' : 'var(--border)',
                transition: 'color 0.15s',
              }}
            >
              ★
            </span>
          ))}
        </div>

        {/* textarea */}
        <textarea
          value={reviewText}
          onChange={e => setReviewText(e.target.value)}
          placeholder="Share your experience (optional)"
          rows={3}
          style={{
            width: '100%', padding: '10px 12px',
            borderRadius: 'var(--radius-sm)',
            border: '1px solid var(--border)',
            background: 'var(--bg-surface2)',
            color: 'var(--text-primary)',
            fontSize: 13,
            resize: 'vertical',
            outline: 'none',
          }}
        />

        {error && (
          <div style={{ color: 'var(--accent-red)', fontSize: 12, marginTop: 8 }}>
            {error}
          </div>
        )}

        <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
          <button
            onClick={handleSubmit}
            disabled={submitting}
            style={{
              flex: 1, padding: '10px 12px',
              borderRadius: 'var(--radius-sm)',
              border: 'none', background: 'var(--accent-blue)',
              color: '#fff', fontWeight: 600,
              fontSize: 14, cursor: 'pointer',
              opacity: submitting ? 0.6 : 1,
            }}
          >
            {submitting ? 'Submitting…' : 'Submit Review'}
          </button>
          <button
            onClick={onClose}
            style={{
              flex: 1, padding: '10px 12px',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--border)',
              background: 'transparent',
              color: 'var(--text-secondary)',
              fontWeight: 600, fontSize: 14,
              cursor: 'pointer',
            }}
          >
            Cancel
          </button>
        </div>
      </div>
    </>
  )
}