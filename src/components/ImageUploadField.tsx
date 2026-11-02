import React, { useRef, useState } from 'react';

interface ImageUploadFieldProps {
  label: string;
  value: string;
  onChange: (url: string) => void;
  token: string;
}

const ImageUploadField: React.FC<ImageUploadFieldProps> = ({ label, value, onChange, token }) => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      setError('Please choose an image file.');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError('Image must be under 5MB.');
      return;
    }

    setError('');
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await fetch('/.netlify/functions/upload', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Upload failed.');
        return;
      }
      onChange(data.url);
    } catch {
      setError('Could not reach the server.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="admin-image-field">
      <label>{label}</label>
      <div className="admin-image-field-row">
        {value && (
          <div className="admin-image-preview">
            <img src={value} alt="" />
          </div>
        )}
        <div className="admin-image-field-controls">
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            style={{ display: 'none' }}
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleFile(file);
              e.target.value = '';
            }}
          />
          <button
            type="button"
            className="admin-btn-ghost"
            onClick={() => inputRef.current?.click()}
            disabled={uploading}
          >
            {uploading ? 'Uploading…' : value ? 'Replace image' : 'Upload image'}
          </button>
          <input
            type="text"
            placeholder="or paste an image URL"
            value={value}
            onChange={(e) => onChange(e.target.value)}
          />
        </div>
      </div>
      {error && <p className="admin-error">{error}</p>}
    </div>
  );
};

export default ImageUploadField;
