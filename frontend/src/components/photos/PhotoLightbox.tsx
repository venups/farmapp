import React, { useEffect } from 'react';
import { X, ArrowLeft, ArrowRight } from 'lucide-react';

interface PhotoItem {
  url: string;
  caption?: string;
}

interface PhotoLightboxProps {
  photos: PhotoItem[];
  currentIndex: number;
  isOpen: boolean;
  onClose: () => void;
  onNext: () => void;
  onPrev: () => void;
}

export default function PhotoLightbox({
  photos,
  currentIndex,
  isOpen,
  onClose,
  onNext,
  onPrev,
}: PhotoLightboxProps) {
  const [currentImage, setCurrentImage] = React.useState(photos[currentIndex]?.url || '');

  useEffect(() => {
    if (isOpen && photos.length > 0) {
      setCurrentImage(photos[currentIndex]?.url || '');
    }
  }, [isOpen, currentIndex, photos]);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') {
        onNext();
      } else if (e.key === 'ArrowLeft') {
        onPrev();
      } else if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onNext, onPrev, onClose]);

  if (!isOpen) return null;

  const currentPhoto = photos[currentIndex];

  return (
    <div className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-sm flex items-center justify-center p-4">
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-white hover:text-indigo-400 transition-colors z-50"
      >
        <X className="w-8 h-8" />
      </button>

      {/* Navigation Buttons */}
      {photos.length > 1 && (
        <>
          <button
            onClick={onPrev}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:text-indigo-400 transition-colors z-50 bg-black/30 hover:bg-black/50 rounded-full p-2"
          >
            <ArrowLeft className="w-8 h-8" />
          </button>
          <button
            onClick={onNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:text-indigo-400 transition-colors z-50 bg-black/30 hover:bg-black/50 rounded-full p-2"
          >
            <ArrowRight className="w-8 h-8" />
          </button>
        </>
      )}

      {/* Photo */}
      <div className="relative max-w-5xl max-h-[90vh]">
        {currentPhoto && (
          <div className="relative rounded-lg overflow-hidden shadow-2xl">
            <img
              src={currentPhoto.url}
              alt={currentPhoto.caption || 'Image'}
              className="max-w-full max-h-[80vh] object-contain bg-black"
            />
          </div>
        )}
      </div>

      {/* Caption */}
      {currentPhoto?.caption && (
        <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/90 to-transparent">
          <p className="text-white text-lg text-center">{currentPhoto.caption}</p>
        </div>
      )}

      {/* Image counter */}
      {photos.length > 1 && (
        <p className="absolute bottom-4 right-6 text-white/80 text-sm font-mono">
          {currentIndex + 1} / {photos.length}
        </p>
      )}

      {/* Click to close overlay */}
      <div
        className="absolute inset-0 -z-10 cursor-zoom-out"
        onClick={onClose}
      />
    </div>
  );
}
