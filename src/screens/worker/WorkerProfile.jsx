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
    </div>
  );
}