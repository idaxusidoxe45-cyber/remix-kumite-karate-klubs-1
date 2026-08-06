import React from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { GalleryItem } from '../types';

interface LightboxModalProps {
  item: GalleryItem | null;
  onClose: () => void;
  onNext: () => void;
  onPrev: () => void;
}

export default function LightboxModal({ item, onClose, onNext, onPrev }: LightboxModalProps) {
  if (!item) return null;
  const imgSrc = item.fullImage || item.image;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4">
      <button
        onClick={onClose}
        className="absolute top-6 right-6 text-white/80 hover:text-white p-2 rounded-full bg-black/50 transition-colors z-10"
      >
        <X className="w-8 h-8" />
      </button>

      <button
        onClick={onPrev}
        className="absolute left-4 top-1/2 -translate-y-1/2 text-white/80 hover:text-white p-3 rounded-full bg-black/50 transition-colors z-10"
      >
        <ChevronLeft className="w-8 h-8" />
      </button>

      <button
        onClick={onNext}
        className="absolute right-4 top-1/2 -translate-y-1/2 text-white/80 hover:text-white p-3 rounded-full bg-black/50 transition-colors z-10"
      >
        <ChevronRight className="w-8 h-8" />
      </button>

      <div className="max-w-4xl max-h-[85vh] flex flex-col items-center w-full">
        <img
          src={imgSrc}
          alt={item.title || 'Kumite Karate'}
          className="max-h-[80vh] max-w-full object-contain rounded-lg shadow-2xl border border-gray-800"
        />
        <p className="text-white font-['Oswald'] tracking-wider text-xl mt-4 text-center">
          {item.caption || item.title}
        </p>
      </div>
    </div>
  );
}
