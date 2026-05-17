import React from 'react'
import config from '../../config/ui/configResolver.js'
import { useStyle } from '../../hooks/useStyle.js'

export default function AvatarRenderer({ elementConfig, overrideData }) {
  const c = config.colors; const w = config.worker; const wp = w.profile || {}
  const overrideStyles = useStyle(elementConfig.style?.styleRef, {})
  const profile = overrideData?.profile || {}
  const name = profile.name || 'W'; const email = profile.email || ''; const photoUrl = profile.photo_url || null

  return (
    <div style={{ display: wp.avatarRow?.display || 'flex', alignItems: wp.avatarRow?.alignItems || 'center', gap: wp.avatarRow?.gap || '16px', marginBottom: wp.avatarRow?.marginBottom || '16px', ...overrideStyles }}>
      <div style={{ width: wp.avatar?.width || '64px', height: wp.avatar?.height || '64px', borderRadius: wp.avatar?.borderRadius || '50%', background: photoUrl ? 'transparent' : (wp.avatar?.background || c.accentBlueLight), display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: wp.avatar?.fontSize || '28px', fontWeight: wp.avatar?.fontWeight || 700, color: wp.avatar?.color || c.accentBlue, overflow: 'hidden' }}>
        {photoUrl ? <img src={photoUrl} alt={name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : name.charAt(0).toUpperCase()}
      </div>
      <div>
        <div style={{ fontSize: wp.name?.fontSize || '18px', fontWeight: wp.name?.fontWeight || 700, color: wp.name?.color || c.textPrimary }}>{name}</div>
        <div style={{ fontSize: wp.email?.fontSize || '14px', color: wp.email?.color || c.textSecondary }}>{email}</div>
      </div>
    </div>
  )
}