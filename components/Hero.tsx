import React from 'react';
import { PageState } from '../types';
import { ChevronDown, Image } from 'lucide-react';
import { HERO_IMAGE } from '../constants';

interface HeroProps {
  setPage: (page: PageState) => void;
}

export const Hero: React.FC<HeroProps> = ({ setPage }) => {
  return (
    <div className="relative h-screen w-full overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-10000 hover:scale-105"
        style={{
          backgroundImage: `url("${HERO_IMAGE}")`
        }}
      >
        <div className="absolute inset-0 bg-black/50"></div>
      </div>

      {/* Content */}
      <div className="relative h-full flex flex-col items-center justify-center text-center px-4">
        <span className="text-stone-200 text-lg md:text-xl tracking-[0.2em] mb-4 uppercase animate-fade-in-down">
          Tamajón • Guadalajara
        </span>
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif text-white mb-8 drop-shadow-lg animate-fade-in-up">
          La Casona de Tamaya
        </h1>
        <p className="max-w-2xl text-stone-100 text-lg md:text-xl mb-10 leading-relaxed font-light drop-shadow-md">
          Donde la arquitectura negra abraza la naturaleza. Un refugio de paz, gastronomía y descanso en la puerta de la sierra.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 animate-fade-in-up" style={{animationDelay: '0.3s'}}>
          <button 
            onClick={() => setPage(PageState.ROOMS)}
            className="px-8 py-3 bg-wood-600 text-white font-medium rounded-sm hover:bg-wood-400 transition shadow-lg hover:shadow-xl"
          >
            Ver Habitaciones
          </button>
          <button 
            onClick={() => setPage(PageState.ACTIVITIES)}
            className="px-8 py-3 bg-white/10 backdrop-blur-sm border border-white/30 text-white font-medium rounded-sm hover:bg-white/20 transition"
          >
            Descubrir el Entorno
          </button>
           <button 
            onClick={() => setPage(PageState.GALLERY)}
            className="px-8 py-3 bg-stone-900/50 backdrop-blur-sm text-white font-medium rounded-sm hover:bg-stone-900/70 transition flex items-center justify-center gap-2"
          >
            <Image size={20} /> Galería
          </button>
        </div>
      </div>

      <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 text-white/70 animate-bounce">
        <ChevronDown size={32} />
      </div>
    </div>
  );
};