import React, { useState } from 'react';
import { Menu, X, Phone, Calendar } from 'lucide-react';
import { PageState } from '../types';

interface NavbarProps {
  setPage: (page: PageState) => void;
  currentPage: PageState;
}

export const Navbar: React.FC<NavbarProps> = ({ setPage, currentPage }) => {
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { label: 'Inicio', value: PageState.HOME },
    { label: 'Habitaciones', value: PageState.ROOMS },
    { label: 'Restaurante', value: PageState.RESTAURANT },
    { label: 'Galería', value: PageState.GALLERY },
    { label: 'Entorno', value: PageState.ACTIVITIES },
    { label: 'Contacto', value: PageState.CONTACT },
  ];

  const handleNav = (value: PageState) => {
    setPage(value);
    setIsOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <nav className="fixed w-full z-50 bg-white/90 backdrop-blur-md shadow-sm transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <div
            className="flex-shrink-0 cursor-pointer flex items-center gap-2"
            onClick={() => handleNav(PageState.HOME)}
          >
            <img src="/images/logo.png" alt="Logo" className="h-12 w-auto object-contain" />
            <span className="font-serif text-2xl font-bold text-stone-800 tracking-tight">La Casona de Tamaya</span>
          </div>

          <div className="hidden md:flex items-center space-x-6 lg:space-x-8">
            {navItems.map((item) => (
              <button
                key={item.label}
                onClick={() => handleNav(item.value)}
                className={`text-sm font-medium transition-colors duration-200 ${currentPage === item.value ? 'text-wood-600 border-b-2 border-wood-600' : 'text-stone-600 hover:text-wood-600'
                  }`}
              >
                {item.label}
              </button>
            ))}
            <button
              onClick={() => handleNav(PageState.ROOMS)}
              className="bg-stone-800 text-white px-5 py-2.5 rounded-sm hover:bg-stone-700 transition flex items-center gap-2 text-sm uppercase tracking-wider"
            >
              <Calendar size={16} /> Reservar
            </button>
          </div>

          <div className="md:hidden flex items-center">
            <button onClick={() => setIsOpen(!isOpen)} className="text-stone-800">
              {isOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white border-t border-stone-100 absolute w-full h-screen">
          <div className="px-4 pt-8 pb-3 space-y-6 flex flex-col items-center">
            {navItems.map((item) => (
              <button
                key={item.label}
                onClick={() => handleNav(item.value)}
                className={`block px-3 py-2 text-xl font-serif ${currentPage === item.value ? 'text-wood-600' : 'text-stone-800'
                  }`}
              >
                {item.label}
              </button>
            ))}
            <button
              onClick={() => handleNav(PageState.ROOMS)}
              className="mt-8 bg-wood-600 text-white px-8 py-3 rounded-sm hover:bg-wood-700 transition w-full max-w-xs flex justify-center items-center gap-2"
            >
              <Calendar size={18} /> Reservar Ahora
            </button>
            <a href="tel:+34681279508" className="flex items-center gap-2 text-stone-500 mt-4">
              <Phone size={18} /> 681 27 95 08
            </a>
          </div>
        </div>
      )}
    </nav>
  );
};