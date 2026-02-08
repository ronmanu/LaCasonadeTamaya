import React from 'react';
import { ROOMS, BOOKING_URL } from '../constants';
import { Room } from '../types';
import { Wifi, Check, ExternalLink } from 'lucide-react';

interface RoomListProps {
  onSelectRoom: (room: Room) => void;
}

export const RoomList: React.FC<RoomListProps> = ({ onSelectRoom }) => {
  return (
    <div className="py-20 px-4 max-w-7xl mx-auto">
      <div className="text-center mb-16">
        <h2 className="text-3xl md:text-4xl font-serif font-bold text-stone-800 mb-4">Nuestras Habitaciones</h2>
        <div className="w-24 h-1 bg-wood-600 mx-auto rounded-full"></div>
        <p className="mt-4 text-stone-600 max-w-2xl mx-auto">
          Diseñadas para el descanso absoluto, combinando el encanto rústico de la piedra y madera con las comodidades modernas.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {ROOMS.map((room) => (
          <div key={room.id} className="group bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 border border-stone-100 flex flex-col">
            <div className="relative h-64 overflow-hidden">
              <img 
                src={room.image} 
                alt={room.name} 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute bottom-0 right-0 bg-stone-900 text-white px-4 py-2 text-lg font-serif">
                {room.price}€ <span className="text-xs font-sans text-stone-300">/ noche</span>
              </div>
            </div>
            
            <div className="p-6 flex-1 flex flex-col">
              <h3 className="text-xl font-serif font-bold text-stone-800 mb-2">{room.name}</h3>
              <p className="text-stone-600 text-sm mb-4 line-clamp-3">{room.description}</p>
              
              <div className="mt-auto">
                <ul className="grid grid-cols-2 gap-y-2 gap-x-1 mb-6">
                  {room.features.slice(0, 4).map((feature, idx) => (
                    <li key={idx} className="flex items-center text-xs text-stone-500">
                      <Check size={12} className="text-wood-600 mr-1.5" />
                      {feature}
                    </li>
                  ))}
                </ul>
                
                <div className="flex flex-col gap-3">
                    <button 
                      onClick={() => onSelectRoom(room)}
                      className="w-full py-3 border-2 border-stone-800 bg-stone-800 text-white font-medium text-sm tracking-wide uppercase hover:bg-stone-900 transition-colors"
                    >
                      Solicitar Reserva Directa
                    </button>
                    <a 
                      href={BOOKING_URL} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="w-full py-2 text-center text-xs text-stone-500 hover:text-wood-600 flex items-center justify-center gap-1 transition-colors"
                    >
                      <span>Ver disponibilidad en Booking.com</span>
                      <ExternalLink size={12} />
                    </a>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};