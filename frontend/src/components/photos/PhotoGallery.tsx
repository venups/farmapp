import React from 'react';
import { Upload, Trash2 } from 'lucide-react';

interface PhotoItem {
  url: string;
  caption?: string;
}

interface PhotoGalleryProps {
  photos: PhotoItem[];
  onUpload: (file: File) => void;
  onDelete?: (url: string) => void;
}

export default function PhotoGallery({ photos, onUpload, onDelete }: PhotoGalleryProps) {
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      if (file.type.startsWith('image/')) {
        onUpload(file);
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      if (file.type.startsWith('image/')) {
        onUpload(file);
      }
    }
  };

  const handleDelete = (url: string) => {
    if (onDelete) {
      onDelete(url);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="space-y-6">
      {/* Upload Area */}
      <div
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        className="border-2 border-dashed border-slate-700 rounded-xl p-8 hover:border-indigo-500 transition-colors cursor-pointer bg-slate-800/30"
        onClick={() => fileInputRef.current?.click()}
      >
        <div className="flex flex-col items-center justify-center text-slate-400">
          <Upload className="w-12 h-12 mb-3" />
          <p className="text-lg font-medium text-slate-300">Click or drag photos to upload</p>
          <p className="text-sm text-slate-500 mt-2">
            Supported formats: JPG, PNG, GIF
          </p>
        </div>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/*"
          className="hidden"
        />
      </div>

      {/* Photo Grid */}
      {photos.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {photos.map((photo, index) => (
            <div
              key={`${photo.url}-${index}`}
              className="group relative aspect-square rounded-xl overflow-hidden bg-slate-800 border border-slate-700"
            >
              <img
                src={photo.url}
                alt={photo.caption || 'Photo'}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                loading="lazy"
              />
              
              {/* Overlay on hover */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col justify-end p-3">
                {photo.caption && (
                  <p className="text-white text-sm truncate mb-1">{photo.caption}</p>
                )}
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-300">{formatDate(photo.url)}</span>
                  {onDelete && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(photo.url);
                      }}
                      className="p-1.5 bg-red-600 rounded-full text-white hover:bg-red-700 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {photos.length === 0 && (
        <div className="text-center py-16 bg-slate-800/30 rounded-xl border border-dashed border-slate-700">
          <p className="text-slate-500">No photos yet</p>
        </div>
      )}
    </div>
  );
}
