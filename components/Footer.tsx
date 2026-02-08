import React from 'react';
import { MapPin, Phone, Mail, Instagram, Facebook } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-stone-900 text-stone-300 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
        <div>
          <h3 className="text-2xl font-serif text-white mb-6">La Casona de Tamaya</h3>
          <p className="mb-4 text-sm leading-relaxed">
            Un hotel rural con encanto en el corazón de la Arquitectura Negra. 
            El lugar perfecto para desconectar, disfrutar de la naturaleza y saborear la gastronomía local.
          </p>
          <div className="flex gap-4">
            <a href="#" className="hover:text-wood-400 transition"><Instagram size={20} /></a>
            <a href="#" className="hover:text-wood-400 transition"><Facebook size={20} /></a>
          </div>
        </div>

        <div>
          <h4 className="text-lg font-bold text-white mb-6 uppercase tracking-wider">Contacto</h4>
          <ul className="space-y-4">
            <li className="flex items-start gap-3">
              <MapPin className="text-wood-400 mt-1" size={18} />
              <span className="text-sm">C. Picota,<br/>19222 Tamajón, Guadalajara, España</span>
            </li>
            <li className="flex items-center gap-3">
              <Phone className="text-wood-400" size={18} />
              <a href="tel:+34681279508" className="text-sm hover:text-white transition">681 27 95 08</a>
            </li>
            <li className="flex items-center gap-3">
              <Mail className="text-wood-400" size={18} />
              <a href="mailto:info@casonatamaya.com" className="text-sm hover:text-white transition">info@casonatamaya.com</a>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="text-lg font-bold text-white mb-6 uppercase tracking-wider">Ubicación</h4>
          <div className="w-full h-40 bg-stone-800 rounded overflow-hidden relative group">
            {/* Pseudo-map placeholder */}
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3016.921389479344!2d-3.250556684589921!3d40.99916697930168!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xd44738555555555%3A0x5555555555555555!2sTamaj%C3%B3n%2C%20Guadalajara!5e0!3m2!1ses!2ses!4v1620000000000!5m2!1ses!2ses" 
              width="100%" 
              height="100%" 
              style={{border:0}} 
              loading="lazy"
              className="opacity-70 group-hover:opacity-100 transition-opacity"
            ></iframe>
          </div>
          <p className="text-xs mt-2 text-stone-500">A 1h 30min de Madrid</p>
        </div>
      </div>

      <div className="border-t border-stone-800 pt-8 text-center text-xs text-stone-600">
        <p>&copy; {new Date().getFullYear()} Hotel Rural La Casona de Tamaya. Todos los derechos reservados.</p>
      </div>
    </footer>
  );
};