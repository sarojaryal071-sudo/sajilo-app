// sajilo-app/src/modules/media-ui/ProfileImageUploader.jsx
import { useRef, useState } from 'react';
import { useMediaUpload } from './useMediaUpload';
import { getMediaUrl } from './mediaUrl';

export default function ProfileImageUploader({ currentImageUrl, onImageChange }) {
  const fileInputRef = useRef(null);
  const [preview, setPreview] = useState(currentImageUrl);
  const [hover, setHover] = useState(false);
  const { uploading, error, replaceProfileImage, deleteProfileImage } = useMediaUpload();

  const handleFileSelect = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (ev) => setPreview(ev.target.result);
    reader.readAsDataURL(file);

    try {
      const url = await replaceProfileImage(file);
      if (url) {
        setPreview(getMediaUrl(url));
        onImageChange?.(url);
      }
    } catch {}
  };

  const handleDelete = async () => {
    await deleteProfileImage();
    setPreview(null);
    onImageChange?.(null);
  };

  const avatarSize = 76; // match the old static circle

  return (
    <div
      style={{ position: 'relative', display: 'inline-block', flexShrink: 0, lineHeight: 0 }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      {/* Avatar circle */}
      <div
        onClick={() => fileInputRef.current?.click()}
        style={{
          width: avatarSize,
          height: avatarSize,
          borderRadius: '50%',
          background: preview ? 'transparent' : 'rgba(255,255,255,0.2)',
          border: '3px solid rgba(255,255,255,0.5)',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
          position: 'relative',
        }}
      >
        {preview ? (
          <img src={preview} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        ) : (
          <span style={{ fontSize: 36, color: '#fff' }}>👤</span>
        )}
        {uploading && (
          <div style={{
            position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.4)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 20,
          }}>
            ⏳
          </div>
        )}
      </div>

      {/* Buttons – appear below the circle on hover, absolutely positioned so they don't affect parent alignment */}
      {hover && (
        <div style={{
          position: 'absolute',
          top: avatarSize + 4,
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          gap: 6,
          zIndex: 5,
          whiteSpace: 'nowrap',
        }}>
          <button
            onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click(); }}
            disabled={uploading}
            style={{
              padding: '4px 10px', borderRadius: 6, border: '1px solid #fff',
              background: 'rgba(0,0,0,0.4)', color: '#fff', fontSize: 11, fontWeight: 600, cursor: 'pointer',
            }}
          >
            {uploading ? '…' : 'Upload'}
          </button>
          {preview && (
            <button
              onClick={(e) => { e.stopPropagation(); handleDelete(); }}
              style={{
                padding: '4px 10px', borderRadius: 6, border: '1px solid rgba(255,255,255,0.5)',
                background: 'rgba(0,0,0,0.4)', color: '#fff', fontSize: 11, cursor: 'pointer',
              }}
            >
              Remove
            </button>
          )}
        </div>
      )}
      <input ref={fileInputRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleFileSelect} />
      {error && <div style={{ fontSize: 12, color: 'var(--accent-red)', marginTop: 4 }}>{error}</div>}
    </div>
  );
}