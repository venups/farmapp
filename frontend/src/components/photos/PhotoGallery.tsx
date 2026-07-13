import { useState } from 'react';
import { X, ChevronLeft, ChevronRight, Upload } from 'lucide-react';
import { Button } from '../common/Button';

interface Photo {
  url: string;
  caption?: string;
}

interface PhotoGalleryProps {
  tripId: string;
  photos: Photo[];
  onUpload: (file: File) => void;
  onDelete: (url: string) => void;
}

export function PhotoGallery({ photos, onUpload, onDelete }: PhotoGalleryProps) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onUpload(e.target.files[0]);
    }
  };

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 16 }}>
        <label style={{ border: '2px dashed var(--color-border)', borderRadius: 'var(--radius-lg)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 200, cursor: 'pointer', transition: 'border-color var(--transition-fast)' }}>
          <Upload size={32} style={{ color: 'var(--color-text-secondary)', marginBottom: 8 }} />
          <span style={{ fontSize: 13, color: 'var(--color-text-secondary)' }}>Upload Photo</span>
          <input type="file" accept="image/*" onChange={handleFileChange} style={{ display: 'none' }} />
        </label>
        {photos.map((photo, index) => (
          <div key={photo.url} style={{ position: 'relative', borderRadius: 'var(--radius-md)', overflow: 'hidden', aspectRatio: '1', cursor: 'pointer' }} onClick={() => setLightboxIndex(index)}>
            <img src={photo.url} alt={photo.caption || 'Photo'} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            <button
              onClick={(e) => { e.stopPropagation(); onDelete(photo.url); }}
              style={{ position: 'absolute', top: 8, right: 8, background: 'rgba(0,0,0,0.6)', border: 'none', borderRadius: '50%', width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'white' }}
            >
              <X size={14} />
            </button>
          </div>
        ))}
      </div>

      {lightboxIndex !== null && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 1000, backgroundColor: 'rgba(0,0,0,0.9)', display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={() => setLightboxIndex(null)}>
          <button onClick={() => setLightboxIndex(null)} style={{ position: 'absolute', top: 16, right: 16, background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}>
            <X size={28} />
          </button>
          {lightboxIndex > 0 && (
            <button onClick={(e) => { e.stopPropagation(); setLightboxIndex(lightboxIndex - 1); }} style={{ position: 'absolute', left: 16, background: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: '50%', width: 48, height: 48, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'white' }}>
              <ChevronLeft size={24} />
            </button>
          )}
          <img src={photos[lightboxIndex].url} alt={photos[lightboxIndex].caption || ''} style={{ maxWidth: '90vw', maxHeight: '90vh', objectFit: 'contain' }} onClick={(e) => e.stopPropagation()} />
          {lightboxIndex < photos.length - 1 && (
            <button onClick={(e) => { e.stopPropagation(); setLightboxIndex(lightboxIndex + 1); }} style={{ position: 'absolute', right: 16, background: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: '50%', width: 48, height: 48, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'white' }}>
              <ChevronRight size={24} />
            </button>
          )}
          {photos[lightboxIndex].caption && (
            <div style={{ position: 'absolute', bottom: 16, left: '50%', transform: 'translateX(-50%)', backgroundColor: 'rgba(0,0,0,0.6)', padding: '8px 16px', borderRadius: 'var(--radius-md)', color: 'white', fontSize: 14 }}>
              {photos[lightboxIndex].caption}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
