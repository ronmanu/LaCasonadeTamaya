import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { RoomList } from './components/RoomList';
import { Footer } from './components/Footer';
import { AIChat } from './components/AIChat';
import { BookingModal } from './components/BookingModal';
import { Gallery } from './components/Gallery';
import { ROOMS, ENVIRONMENT_INFO, RESTAURANT_MENU, HOTEL_CONDITIONS, HOTEL_SERVICES, REVIEWS } from './constants';
import { PageState, Room } from './types';
import { Map, Mountain, Utensils, ArrowRight, Clock, Info, CheckCircle, Wifi, Ban, Car, AlertCircle, Star, Quote, Leaf, Camera, Loader2, Phone } from 'lucide-react';

function App() {
  const [currentPage, setCurrentPage] = useState<PageState>(PageState.HOME);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);

  // Estados para el formulario de contacto
  const [contactForm, setContactForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [contactStatus, setContactStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');

  // Simple scroll-to-top on page change (simulating routing)
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentPage]);

  const handleContactChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setContactForm({ ...contactForm, [e.target.name]: e.target.value });
  };

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setContactStatus('submitting');

    // Helper para codificar datos
    const encode = (data: any) => {
      return Object.keys(data)
        .map((key) => encodeURIComponent(key) + "=" + encodeURIComponent(data[key]))
        .join("&");
    };

    try {
      await fetch("/", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: encode({ "form-name": "contacto-general", ...contactForm }),
      });
      setContactStatus('success');
      setContactForm({ name: '', email: '', subject: '', message: '' });
    } catch (error) {
      console.error(error);
      setContactStatus('error');
    }
  };

  const renderContent = () => {
    switch (currentPage) {
      case PageState.HOME:
        return (
          <>
            <Hero setPage={setCurrentPage} />

            {/* Intro Section */}
            <section className="py-24 px-4 bg-stone-50">
              <div className="max-w-4xl mx-auto text-center">
                <h2 className="text-3xl font-serif text-stone-800 mb-6">Bienvenido a tu casa en la montaña</h2>
                <div className="inline-block bg-wood-600/10 text-wood-600 px-4 py-1 rounded-full text-sm font-bold mb-6 border border-wood-600/20">
                  ⭐ 8,1 Ubicación (Parejas)
                </div>
                <p className="text-stone-600 leading-relaxed text-lg mb-8">
                  La Casona de Tamaya no es solo un hotel, es el punto de partida para descubrir la magia de la Sierra Norte de Guadalajara.
                  Destacamos por nuestro <strong>Personal (8,3)</strong> y nuestra <strong>Limpieza (8,3)</strong>.
                  Situado a 45km del Parque Natural Hayedo de Tejera Negra.
                </p>
                <button onClick={() => setCurrentPage(PageState.ACTIVITIES)} className="text-wood-600 font-medium hover:text-wood-800 flex items-center justify-center gap-2 mx-auto">
                  Descubre qué hacer en Tamajón <ArrowRight size={18} />
                </button>
              </div>
            </section>

            {/* Servicios y Condiciones (New Section) */}
            <section className="py-16 bg-white border-y border-stone-100">
              <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-12">
                {/* Condiciones */}
                <div className="bg-stone-50 p-8 rounded-lg shadow-sm border border-stone-200">
                  <h3 className="text-2xl font-serif text-stone-800 mb-6 flex items-center gap-2">
                    <Clock className="text-wood-600" /> Horarios y Normas
                  </h3>
                  <ul className="space-y-4 text-stone-700">
                    <li className="flex justify-between border-b border-stone-200 pb-2">
                      <span className="font-medium">Check-in (Entrada)</span>
                      <span>{HOTEL_CONDITIONS.checkIn}</span>
                    </li>
                    <li className="flex justify-between border-b border-stone-200 pb-2">
                      <span className="font-medium">Check-out (Salida)</span>
                      <span>{HOTEL_CONDITIONS.checkOut}</span>
                    </li>
                    <li className="flex items-start gap-3 pt-2 text-stone-600 text-sm italic border-b border-stone-200 pb-2">
                      <AlertCircle size={16} className="mt-1 flex-shrink-0" />
                      <span>Importante: {HOTEL_CONDITIONS.accessibility} (No hay ascensor)</span>
                    </li>
                    <li className="flex items-start gap-3 pt-2">
                      <Ban className="text-red-400 mt-1 flex-shrink-0" size={18} />
                      <span className="text-sm">{HOTEL_CONDITIONS.smoking}</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <Info className="text-stone-400 mt-1 flex-shrink-0" size={18} />
                      <span className="text-sm">Mascotas: {HOTEL_CONDITIONS.pets}</span>
                    </li>
                  </ul>
                </div>

                {/* Servicios */}
                <div>
                  <h3 className="text-2xl font-serif text-stone-800 mb-6 flex items-center gap-2">
                    <CheckCircle className="text-wood-600" /> Servicios Destacados
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {HOTEL_SERVICES.map((service, idx) => (
                      <div key={idx} className="flex items-center gap-3 text-stone-700">
                        <div className="w-2 h-2 bg-wood-600 rounded-full"></div>
                        <span>{service}</span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-8 p-4 bg-wood-600/5 rounded-lg border border-wood-600/20 flex items-start gap-3">
                    <Car className="text-wood-600 mt-1" />
                    <div>
                      <p className="font-bold text-stone-800">Parking Gratuito</p>
                      <p className="text-sm text-stone-600">Disponemos de parking privado gratis en el establecimiento. No es necesario reservar.</p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Preview Rooms */}
            <section className="bg-stone-50 pt-10">
              <RoomList onSelectRoom={setSelectedRoom} />
            </section>

            {/* Reviews Section */}
            <section className="py-20 bg-stone-100">
              <div className="max-w-7xl mx-auto px-4">
                <div className="text-center mb-12">
                  <h2 className="text-3xl font-serif font-bold text-stone-800 mb-4">Lo que dicen nuestros huéspedes</h2>
                  <div className="flex justify-center items-center gap-2 text-yellow-600 text-xl font-bold">
                    <span className="bg-yellow-500 text-white px-2 py-1 rounded">7,7</span>
                    <span>Bien</span>
                    <span className="text-stone-400 font-normal text-sm ml-2">(336 comentarios)</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {REVIEWS.map((review, idx) => (
                    <div key={idx} className="bg-white p-6 rounded-lg shadow-sm border border-stone-200 flex flex-col transition-all duration-300 hover:shadow-md hover:-translate-y-1">
                      <div className="flex justify-between items-center mb-3">
                        <div className="flex gap-0.5">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              size={16}
                              className={`${i < Math.round(review.score / 2) ? 'text-yellow-400 fill-current' : 'text-stone-200 fill-stone-100'}`}
                            />
                          ))}
                        </div>
                        <span className="bg-stone-50 text-stone-700 text-xs font-bold px-2 py-1 rounded border border-stone-100">
                          {review.score}
                        </span>
                      </div>

                      <div className="flex-grow mb-4 relative">
                        <Quote className="text-wood-100 mb-2 absolute -top-1 -left-1 opacity-50" size={24} />
                        <p className="text-stone-600 text-sm italic leading-relaxed pt-6 relative z-10">
                          "{review.text}"
                        </p>
                      </div>

                      <div className="border-t border-stone-100 pt-4 mt-auto">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-wood-50 border border-wood-100 flex items-center justify-center text-wood-700 font-bold text-xs uppercase">
                            {review.author.charAt(0)}
                          </div>
                          <div>
                            <p className="font-bold text-stone-800 text-sm leading-tight">{review.author}</p>
                            <p className="text-xs text-stone-400">{review.date}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Restaurant Preview */}
            <section className="py-20 bg-stone-900 text-stone-200 relative overflow-hidden">
              <div className="absolute inset-0 opacity-20 bg-[url('https://images.unsplash.com/photo-1514362545857-3bc16549766b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80')] bg-cover bg-center"></div>
              <div className="max-w-7xl mx-auto px-4 relative z-10 flex flex-col md:flex-row items-center gap-12">
                <div className="flex-1">
                  <h2 className="text-4xl font-serif text-white mb-6">Sabores de la Tierra</h2>
                  <p className="mb-8 text-stone-300">
                    Nuestro restaurante ofrece menús especiales y opciones dietéticas bajo petición. Disfrute de su comida en nuestra terraza al aire libre.
                  </p>
                  <button onClick={() => setCurrentPage(PageState.RESTAURANT)} className="border border-white/40 text-white px-6 py-3 hover:bg-white hover:text-stone-900 transition">
                    Ver Carta y Menús
                  </button>
                </div>
                <div className="flex-1 grid grid-cols-2 gap-4">
                  <img src="https://images.unsplash.com/photo-1600891964092-4316c288032e?w=500&auto=format&fit=crop&q=60" className="rounded-lg shadow-lg translate-y-4" alt="Carne" />
                  <img src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=500&auto=format&fit=crop&q=60" className="rounded-lg shadow-lg -translate-y-4" alt="Plato" />
                </div>
              </div>
            </section>
          </>
        );

      case PageState.ROOMS:
        return (
          <div className="pt-20">
            <div className="bg-stone-800 text-white py-12 px-4 text-center">
              <h1 className="text-4xl font-serif">Nuestras Estancias</h1>
              <p className="mt-2 text-stone-400">Habitaciones climatizadas con baño privado y artículos de aseo gratis</p>
            </div>
            <RoomList onSelectRoom={setSelectedRoom} />
          </div>
        );

      case PageState.GALLERY:
        return (
          <div className="pt-20">
            <Gallery />
          </div>
        );

      case PageState.ACTIVITIES:
        return (
          <div className="pt-20 bg-stone-50 min-h-screen">
            <div className="bg-stone-800 text-white py-16 px-4 text-center">
              <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4">El Entorno</h1>
              <div className="w-24 h-1 bg-wood-600 mx-auto rounded-full mb-6"></div>
              <p className="mt-2 text-stone-400 text-lg max-w-2xl mx-auto">
                Tamajón: Puerta de la Arquitectura Negra. Descubre un paisaje donde la historia y la naturaleza se funden.
              </p>
            </div>

            <div className="max-w-7xl mx-auto px-4 pb-24">
              <div className="space-y-24">
                {ENVIRONMENT_INFO.map((section, index) => (
                  <div key={section.id} className={`flex flex-col lg:flex-row gap-12 items-center ${index % 2 === 1 ? 'lg:flex-row-reverse' : ''}`}>
                    {/* Image Side */}
                    <div className="flex-1 w-full relative group">
                      <div className="absolute inset-0 bg-wood-600 rounded-lg transform translate-x-3 translate-y-3 transition-transform group-hover:translate-x-4 group-hover:translate-y-4"></div>
                      <img
                        src={section.image}
                        alt={section.title}
                        className="relative rounded-lg shadow-xl w-full h-[400px] object-cover border border-stone-200 z-10"
                      />
                    </div>

                    {/* Text Side */}
                    <div className="flex-1 space-y-6">
                      <div>
                        <span className="text-wood-600 font-bold uppercase tracking-widest text-sm mb-2 block">{section.subtitle}</span>
                        <h2 className="text-3xl md:text-4xl font-serif font-bold text-stone-800">{section.title}</h2>
                      </div>

                      {section.content.map((paragraph, i) => (
                        <p key={i} className="text-stone-600 leading-relaxed text-lg">
                          {paragraph}
                        </p>
                      ))}

                      {section.details && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
                          {section.details.map((detail, i) => (
                            <div key={i} className="bg-white p-4 rounded border-l-4 border-wood-600 shadow-sm">
                              <p className="text-xs text-stone-400 uppercase font-bold">{detail.label}</p>
                              <p className="text-stone-800 font-medium">{detail.value}</p>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-24 bg-stone-800 text-stone-300 p-8 md:p-12 rounded-lg shadow-xl text-center relative overflow-hidden">
                <div className="relative z-10">
                  <Camera className="mx-auto text-wood-400 mb-4" size={48} />
                  <h3 className="text-2xl font-serif font-bold text-white mb-4">¿Preparando tu cámara?</h3>
                  <p className="text-stone-300 mb-8 max-w-2xl mx-auto text-lg">
                    Cada estación ofrece un espectáculo diferente. Nuestro equipo estará encantado de indicarte los mejores puntos fotográficos del día según la luz y el clima.
                  </p>
                  <button onClick={() => setCurrentPage(PageState.CONTACT)} className="bg-white text-stone-900 px-8 py-3 rounded hover:bg-wood-50 transition font-bold">
                    Contactar con Recepción
                  </button>
                </div>
              </div>
            </div>
          </div>
        );

      case PageState.RESTAURANT:
        return (
          <div className="pt-20 bg-stone-50 min-h-screen">
            <div className="relative h-[400px]">
              <img src="/images/restaurant_bar.jpg" className="w-full h-full object-cover" alt="Restaurante" />
              <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center text-white">
                <h1 className="text-5xl font-serif mb-2">Restaurante La Casona</h1>
                <p className="text-xl font-light">Cocina tradicional con un toque de autor</p>
              </div>
            </div>

            <div className="max-w-6xl mx-auto px-4 py-16">
              <div className="space-y-16">
                {RESTAURANT_MENU.map((category, idx) => (
                  <div key={idx} className="bg-white p-8 md:p-12 shadow-lg rounded-sm border border-stone-100">
                    <h2 className="text-center text-3xl font-serif font-bold text-stone-800 mb-12 uppercase tracking-widest border-b pb-4">
                      {category.title}
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
                      {category.items.map((item, itemIdx) => (
                        <div key={itemIdx} className="flex justify-between items-baseline border-b border-stone-100 pb-4">
                          <div className="pr-4">
                            <h3 className="text-xl font-bold text-stone-800">{item.name}</h3>
                            {item.desc && <p className="text-stone-500 italic mt-1 text-sm">{item.desc}</p>}
                          </div>
                          <span className="text-wood-600 font-bold text-lg whitespace-nowrap">{item.price}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}

                <div className="mt-12 text-center bg-stone-800 text-white p-12 rounded-sm shadow-xl">
                  <Utensils className="mx-auto text-wood-400 mb-6" size={48} />
                  <h2 className="text-3xl font-serif mb-6">¿Vienes a vernos?</h2>
                  <p className="text-stone-300 mb-8 max-w-2xl mx-auto text-lg">
                    Disponemos de menú del día y menús especiales para grupos. Se recomienda reserva previa para asegurar su mesa.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <button onClick={() => window.location.href = "tel:+34681279508"} className="bg-wood-600 text-white px-8 py-3 rounded-sm hover:bg-wood-700 transition font-bold flex items-center justify-center gap-2">
                      <Phone size={18} /> Llamar para reservar
                    </button>
                    <button onClick={() => setCurrentPage(PageState.CONTACT)} className="border border-white/40 text-white px-8 py-3 rounded-sm hover:bg-white hover:text-stone-900 transition">
                      Dónde estamos
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case PageState.CONTACT:
        return (
          <div className="pt-20 bg-stone-100 min-h-screen">
            <div className="bg-stone-800 text-white py-12 px-4 text-center">
              <h1 className="text-4xl font-serif">Contacta con nosotros</h1>
            </div>
            <div className="max-w-6xl mx-auto px-4 py-16 grid md:grid-cols-2 gap-12">
              <div className="bg-white p-8 rounded shadow-sm">
                <h2 className="text-2xl font-serif font-bold mb-6">Envíanos un mensaje</h2>

                {contactStatus === 'success' ? (
                  <div className="text-center py-12 animate-fade-in">
                    <CheckCircle size={48} className="text-green-600 mx-auto mb-4" />
                    <h3 className="text-xl font-bold mb-2">¡Mensaje Enviado!</h3>
                    <p className="text-stone-600 mb-6">Gracias por contactarnos. Te responderemos lo antes posible.</p>
                    <button onClick={() => setContactStatus('idle')} className="text-wood-600 hover:underline">Enviar otro mensaje</button>
                  </div>
                ) : (
                  <form onSubmit={handleContactSubmit} className="space-y-4" name="contacto-general" data-netlify="true">
                    <input type="hidden" name="form-name" value="contacto-general" />

                    <div className="grid grid-cols-2 gap-4">
                      <input required placeholder="Nombre" name="name" value={contactForm.name} onChange={handleContactChange} className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded focus:border-wood-600 outline-none" />
                      <input required type="email" placeholder="Email" name="email" value={contactForm.email} onChange={handleContactChange} className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded focus:border-wood-600 outline-none" />
                    </div>
                    <input required placeholder="Asunto" name="subject" value={contactForm.subject} onChange={handleContactChange} className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded focus:border-wood-600 outline-none" />
                    <textarea required placeholder="Mensaje" name="message" value={contactForm.message} onChange={handleContactChange} rows={5} className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded focus:border-wood-600 outline-none" />

                    {contactStatus === 'error' && (
                      <p className="text-red-500 text-sm">Hubo un error al enviar el mensaje.</p>
                    )}

                    <button type="submit" disabled={contactStatus === 'submitting'} className="bg-wood-600 text-white px-8 py-3 rounded hover:bg-wood-700 w-full font-bold flex justify-center items-center gap-2">
                      {contactStatus === 'submitting' ? <Loader2 className="animate-spin" /> : 'Enviar'}
                    </button>
                  </form>
                )}
              </div>
              <div>
                <h2 className="text-2xl font-serif font-bold mb-6">Dónde estamos</h2>
                <div className="h-[400px] bg-stone-200 rounded overflow-hidden shadow-inner">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3016.921389479344!2d-3.250556684589921!3d40.99916697930168!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xd44738555555555%3A0x5555555555555555!2sTamaj%C3%B3n%2C%20Guadalajara!5e0!3m2!1ses!2ses!4v1620000000000!5m2!1ses!2ses"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    loading="lazy"
                  ></iframe>
                </div>
                <div className="mt-4 text-stone-600 text-sm">
                  <p>Distancias:</p>
                  <ul className="list-disc ml-4">
                    <li>97 km del Aeropuerto Adolfo Suárez Madrid-Barajas</li>
                    <li>45 km del Hayedo de Tejera Negra</li>
                    <li>300 m del centro de Tamajón</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar setPage={setCurrentPage} currentPage={currentPage} />
      <main className="flex-grow">
        {renderContent()}
      </main>
      <Footer />
      <AIChat />
      {selectedRoom && (
        <BookingModal room={selectedRoom} onClose={() => setSelectedRoom(null)} />
      )}
    </div>
  );
}

export default App;