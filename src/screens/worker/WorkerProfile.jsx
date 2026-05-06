// sajilo-app/src/screens/worker/WorkerProfile.jsx

import { useState } from 'react';
import { useWorker } from '../../contexts/WorkerContext.jsx';
import ElementRenderer from '../../components/ElementRenderer.jsx';

export default function WorkerProfile() {
  const { profile, updateProfile } = useWorker();
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [bio, setBio] = useState('');
  const [skills, setSkills] = useState('');
  const [hourlyRate, setHourlyRate] = useState('');

  if (!profile) {
    return (
      <div style={{ textAlign: 'center', padding: 40, color: 'var(--text-secondary)' }}>
        Loading...
      </div>
    );
  }

  const startEdit = () => {
    setName(profile?.name || '');
    setPhone(profile?.phone || '');
    setBio(profile?.bio || '');
    setSkills((profile?.skills || []).join(', '));
    setHourlyRate(profile?.hourly_rate || '');
    setEditing(true);
  };

  const handleSave = async () => {
    setSaving(true);
    await updateProfile({
      name,
      phone,
      bio,
      skills: skills.split(',').map(s => s.trim()).filter(Boolean),
      hourly_rate: parseInt(hourlyRate) || 500,
    });
    setSaving(false);
    setEditing(false);
  };

  const displayProfile = editing
    ? { ...profile, name, phone, bio, skills: skills.split(',').map(s => s.trim()).filter(Boolean), hourly_rate: parseInt(hourlyRate) || 500 }
    : profile;

  return (
    <div>
      <ElementRenderer
        elementId="profileHeader"
        overrideData={{
          isEditing: editing,
          isSaving: saving,
          onEdit: startEdit,
          onSave: handleSave,
        }}
      />

      <div style={{
        background: 'var(--bg-surface)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius-lg)',
        padding: 20,
        marginBottom: 16,
      }}>
        <ElementRenderer
          elementId="profileAvatar"
          overrideData={{ profile: displayProfile }}
        />
        <ElementRenderer
          elementId="profileFieldGroup"
          overrideData={{
            profile: displayProfile,
            isEditing: editing,
          }}
        />
      </div>

      <ElementRenderer
        elementId="profileStatsRow"
        overrideData={{ profile }}
      />
            {/* Worker identity card – name, profession, worker ID, photo */}
      <div style={{
        background: 'var(--bg-surface)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius-lg)',
        padding: 20,
        marginBottom: 16,
        display: 'flex',
        alignItems: 'center',
        gap: 16,
      }}>
        <div style={{
          width: 64, height: 64, borderRadius: '50%',
          background: profile.photo_url ? 'transparent' : 'var(--accent-blue-light)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 28, fontWeight: 700, color: 'var(--accent-blue)',
          overflow: 'hidden', flexShrink: 0,
        }}>
          {profile.photo_url ? (
            <img src={profile.photo_url} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          ) : (
            profile.name?.charAt(0)?.toUpperCase() || 'W'
          )}
        </div>
        <div>
          <div style={{ fontSize: 'var(--font-body-lg)', fontWeight: 700, color: 'var(--text-primary)' }}>
            {profile.name || 'Worker'}
          </div>
          <div style={{ fontSize: 'var(--font-body-sm)', color: 'var(--text-secondary)', marginTop: 4 }}>
            {profile.primary_skill || 'General Service'}
            {profile.secondary_roles?.length > 0 && ` + ${profile.secondary_roles.join(', ')}`}
          </div>
          <div style={{ fontSize: 12, color: 'var(--accent-blue)', fontWeight: 600, marginTop: 4 }}>
            {profile.client_id || ''}
          </div>
        </div>
      </div>
    </div>
  );
}