import React, { useState } from 'react';
import { X, CheckCircle, Calendar, Users, CreditCard, ExternalLink, Loader2 } from 'lucide-react';
import { Room } from '../types';
import { BOOKING_URL } from '../constants';

interface BookingModalProps {
  room: Room | null;
  onClose: () => void;
}

// Helper para codificar datos para Netlify
const encode = (data: any) => {
  return Object.keys(data)
    .map((key) => encodeURIComponent(key) + "=" + encodeURIComponent(data[key]))
    .join("&");
};

export const BookingModal: React.FC<BookingModalProps> = ({ room, onClose }) => {
  const [step, setStep] = useState(1); // 1: Details, 2: Payment/Confirm
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    name: '', email: '', phone: '', checkIn: '', checkOut: '', guests: 2, comments: ''
  });

  if (!room) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (step === 1) {
      setStep(2);
    } else {
      // Envío real a Netlify
      setIsSubmitting(true);
      
      try {
        await fetch("/", {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: encode({
            "form-name": "reserva-habitacion",
            "roomName": room.name, // Añadimos el nombre de la habitación
            ...formData
          }),
        });
        setStep(3); // Éxito
      } catch (err) {
        console.error(err);
        setError("Hubo un error al enviar la solicitud. Por favor, inténtalo de nuevo o llámanos.");
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm">
      <div className="bg-white rounded-lg shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-4 border-b border-stone-100 flex justify-between items-center sticky top-0 bg-white z-10">
          <h2 className="text-xl font-serif font-bold text-stone-800">Reserva: {room.name}</h2>
          <button onClick={onClose} className="text-stone-400 hover:text-stone-800">
            <X size={24} />
          </button>
        </div>

        <div className="p-6">
            {step === 3 ? (
                <div className="text-center py-12 animate-fade-in">
                    <div className="flex justify-center mb-4">
                        <CheckCircle size={64} className="text-green-600" />
                    </div>
                    <h3 className="text-2xl font-serif font-bold mb-2">¡Solicitud Recibida!</h3>
                    <p className="text-stone-600 mb-6 max-w-md mx-auto">
                        Hemos recibido tu petición para la <strong>{room.name}</strong>. 
                        Te hemos enviado un correo de confirmación y nos pondremos en contacto contigo en breve.
                    </p>
                    
                    <div className="bg-stone-50 p-4 rounded-lg mb-6 border border-stone-200">
                        <p className="text-sm text-stone-500 mb-2">¿Necesitas confirmación inmediata?</p>
                        <a href={BOOKING_URL} target="_blank" rel="noopener noreferrer" className="text-wood-600 font-medium hover:underline inline-flex items-center gap-1">
                            Reservar en Booking.com <ExternalLink size={14} />
                        </a>
                    </div>

                    <button onClick={onClose} className="bg-stone-800 text-white px-6 py-2 rounded hover:bg-stone-700">
                        Volver a la web
                    </button>
                </div>
            ) : (
                <form onSubmit={handleSubmit} className="space-y-6" name="reserva-habitacion" data-netlify="true">
                    {/* Campos ocultos necesarios para que React funcione con Netlify Forms */}
                    <input type="hidden" name="form-name" value="reserva-habitacion" />
                    <input type="hidden" name="roomName" value={room.name} />

                    {step === 1 && (
                        <>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-stone-700 mb-1">Fecha Entrada</label>
                                    <div className="relative">
                                        <Calendar className="absolute left-3 top-2.5 text-stone-400" size={18} />
                                        <input required type="date" name="checkIn" value={formData.checkIn} onChange={handleChange} className="w-full pl-10 pr-3 py-2 border border-stone-300 rounded focus:ring-1 focus:ring-wood-600 outline-none" />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-stone-700 mb-1">Fecha Salida</label>
                                    <div className="relative">
                                        <Calendar className="absolute left-3 top-2.5 text-stone-400" size={18} />
                                        <input required type="date" name="checkOut" value={formData.checkOut} onChange={handleChange} className="w-full pl-10 pr-3 py-2 border border-stone-300 rounded focus:ring-1 focus:ring-wood-600 outline-none" />
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-stone-700 mb-1">Huéspedes</label>
                                <div className="relative">
                                    <Users className="absolute left-3 top-2.5 text-stone-400" size={18} />
                                    <select name="guests" value={formData.guests} onChange={handleChange} className="w-full pl-10 pr-3 py-2 border border-stone-300 rounded focus:ring-1 focus:ring-wood-600 outline-none">
                                        {[...Array(room.capacity)].map((_, i) => (
                                            <option key={i} value={i + 1}>{i + 1} Persona{i > 0 ? 's' : ''}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <h3 className="font-serif font-bold text-lg pt-2 border-t border-stone-100">Datos Personales</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <input required placeholder="Nombre Completo" name="name" value={formData.name} onChange={handleChange} className="w-full px-3 py-2 border border-stone-300 rounded outline-none focus:border-wood-600" />
                                    <input required placeholder="Teléfono" name="phone" value={formData.phone} onChange={handleChange} className="w-full px-3 py-2 border border-stone-300 rounded outline-none focus:border-wood-600" />
                                </div>
                                <input required type="email" placeholder="Email" name="email" value={formData.email} onChange={handleChange} className="w-full px-3 py-2 border border-stone-300 rounded outline-none focus:border-wood-600" />
                                <textarea placeholder="Comentarios o peticiones especiales (cuna, dieta, etc...)" name="comments" value={formData.comments} onChange={handleChange} rows={3} className="w-full px-3 py-2 border border-stone-300 rounded outline-none focus:border-wood-600" />
                            </div>

                            <div className="flex justify-end pt-4">
                                <button type="submit" className="bg-wood-600 text-white px-8 py-3 rounded hover:bg-wood-700 transition font-medium">
                                    Continuar al Pago
                                </button>
                            </div>
                        </>
                    )}

                    {step === 2 && (
                        <div className="space-y-6 animate-fade-in">
                            <div className="bg-stone-50 p-4 rounded border border-stone-200">
                                <h3 className="font-bold text-stone-800 mb-2">Resumen</h3>
                                <p className="text-sm"><strong>Habitación:</strong> {room.name}</p>
                                <p className="text-sm"><strong>Fechas:</strong> {formData.checkIn} al {formData.checkOut}</p>
                                <p className="text-sm"><strong>Precio base:</strong> {room.price}€ / noche</p>
                                <p className="text-xs text-stone-500 mt-2">* El precio final se confirmará vía email.</p>
                            </div>

                            <div className="opacity-50 pointer-events-none grayscale select-none relative">
                                <div className="absolute inset-0 flex items-center justify-center z-10">
                                    <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded text-xs font-bold border border-yellow-300">MODO SOLICITUD - PAGO EN HOTEL</span>
                                </div>
                                <h3 className="font-serif font-bold text-lg flex items-center gap-2">
                                    <CreditCard size={20} /> Datos de Tarjeta (Garantía)
                                </h3>
                                <input placeholder="Número de tarjeta" className="w-full mt-2 px-3 py-2 border border-stone-300 rounded" />
                                <div className="grid grid-cols-2 gap-4 mt-2">
                                    <input placeholder="MM/YY" className="w-full px-3 py-2 border border-stone-300 rounded" />
                                    <input placeholder="CVC" className="w-full px-3 py-2 border border-stone-300 rounded" />
                                </div>
                            </div>
                            
                            {error && (
                              <p className="text-red-600 text-sm font-medium bg-red-50 p-3 rounded">{error}</p>
                            )}

                             <div className="flex gap-4 pt-4">
                                <button type="button" onClick={() => setStep(1)} disabled={isSubmitting} className="px-6 py-3 border border-stone-300 rounded hover:bg-stone-50 text-stone-600 font-medium">
                                    Atrás
                                </button>
                                <button type="submit" disabled={isSubmitting} className="flex-1 bg-stone-800 text-white px-8 py-3 rounded hover:bg-stone-900 transition font-medium flex justify-center items-center gap-2">
                                    {isSubmitting ? (
                                      <>
                                        <Loader2 size={18} className="animate-spin" /> Enviando...
                                      </>
                                    ) : 'Confirmar Solicitud'}
                                </button>
                            </div>
                        </div>
                    )}
                </form>
            )}
        </div>
      </div>
    </div>
  );
};