import React, { useState } from 'react';
import { GALLERY_IMAGES } from '../constants';
import { X, ChevronLeft, ChevronRight, ZoomIn } from 'lucide-react';

export const Gallery: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('Todas');
  const [lightboxImage, setLightboxImage] = useState<{ src: string, caption: string } | null>(null);

  const categories = ['Todas', ...Array.from(new Set(GALLERY_IMAGES.map(img => img.category)))];

  const filteredImages = selectedCategory === 'Todas'
    ? GALLERY_IMAGES
    : GALLERY_IMAGES.filter(img => img.category === selectedCategory);

  const openLightbox = (image: { src: string, caption: string }) => {
    setLightboxImage(image);
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    setLightboxImage(null);
    document.body.style.overflow = 'unset';
  };

  return (
    <div className="min-h-screen bg-stone-50">
      <div className="relative h-[300px] flex items-center justify-center overflow-hidden">
        <img src="/images/galeria_bg.jpg" className="absolute inset-0 w-full h-full object-cover object-top" alt="Galería" />
        <div className="absolute inset-0 bg-black/60"></div>
        <div className="relative z-10 text-white text-center px-4">
          <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4">Galería Fotográfica</h1>
          <p className="text-xl text-stone-200 font-light max-w-2xl mx-auto italic">
            Explore los rincones de La Casona, nuestras acogedoras estancias y la belleza natural que nos rodea en Tamajón.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Category Filters */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 ${selectedCategory === cat
                  ? 'bg-wood-600 text-white shadow-md'
                  : 'bg-white text-stone-600 hover:bg-stone-100 border border-stone-200'
                }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Image Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredImages.map((img, idx) => (
            <div
              key={idx}
              className="group relative cursor-pointer overflow-hidden rounded-lg shadow-sm bg-stone-900 aspect-[4/3]"
              onClick={() => openLightbox(img)}
            >
              <img
                src={img.src}
                alt={img.caption}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-90 group-hover:opacity-100"
              />
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                <ZoomIn className="text-white w-10 h-10 drop-shadow-lg" />
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
                <p className="text-white text-sm font-medium">{img.caption}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      {lightboxImage && (
        <div className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
          <button
            onClick={closeLightbox}
            className="absolute top-6 right-6 text-white/70 hover:text-white transition-colors"
          >
            <X size={32} />
          </button>

          <div className="max-w-5xl w-full flex flex-col items-center">
            <div className="relative w-auto max-h-[80vh] rounded-sm overflow-hidden shadow-2xl">
              <img
                src={lightboxImage.src}
                alt={lightboxImage.caption}
                className="max-h-[80vh] max-w-full object-contain"
              />
            </div>
            <p className="text-stone-300 mt-6 text-lg font-serif italic text-center">
              {lightboxImage.caption}
            </p>
          </div>

          {/* Close on background click */}
          <div className="absolute inset-0 -z-10" onClick={closeLightbox}></div>
        </div>
      )}
    </div>
  );
};