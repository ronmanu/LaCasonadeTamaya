import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { RoomList } from './components/RoomList';
import { Footer } from './components/Footer';
import { AIChat } from './components/AIChat';
import { BookingModal } from './components/BookingModal';
import { Gallery } from './components/Gallery';
import { StaffArea } from './components/StaffArea';
import { ROOMS, ENVIRONMENT_INFO, RESTAURANT_MENU, HOTEL_CONDITIONS, HOTEL_SERVICES, REVIEWS } from './constants';
import { PageState, Room } from './types';
import { Map, Mountain, Utensils, ArrowRight, Clock, Info, CheckCircle, Wifi, Ban, Car, AlertCircle, Star, Quote, Leaf, Camera, Loader2, Phone } from 'lucide-react';

/**
 * Main Application Component.
 * Handles the state of the current page and provides the layout for the entire site.
 */
function App() {
  const [currentPage, setCurrentPage] = useState<PageState>(PageState.HOME);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);

  // Form states
  const [contactForm, setContactForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [contactStatus, setContactStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');

  // Simple scroll-to-top on page change (simulating routing)
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentPage]);

  /**
   * Handles input changes for the contact form.
   */
  const handleContactChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setContactForm({ ...contactForm, [e.target.name]: e.target.value });
  };

  /**
   * Submits the contact form.
   * Note: Currently uses Netlify Forms logic. If deploying to Vercel/Others, 
   * replace with a backend API or service like Formspree.
   */
  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setContactStatus('submitting');

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
      console.error('Contact error:', error);
      setContactStatus('error');
    }
  };

  const handleLogout = () => {
    setCurrentPage(PageState.HOME);
  };

  /**
   * Renders the corresponding content based on the current page state.
   */
  const renderContent = () => {
    switch (currentPage) {
      case PageState.HOME:
        return <HomePage setCurrentPage={setCurrentPage} setSelectedRoom={setSelectedRoom} />;
      case PageState.ROOMS:
        return <RoomsPage setSelectedRoom={setSelectedRoom} />;
      case PageState.GALLERY:
        return <div className="pt-20"><Gallery /></div>;
      case PageState.ACTIVITIES:
        return <ActivitiesPage setCurrentPage={setCurrentPage} />;
      case PageState.RESTAURANT:
        return <RestaurantPage setCurrentPage={setCurrentPage} />;
      case PageState.CONTACT:
        return (
          <ContactPage
            contactForm={contactForm}
            contactStatus={contactStatus}
            handleContactChange={handleContactChange}
            handleContactSubmit={handleContactSubmit}
            setContactStatus={setContactStatus}
          />
        );
      case PageState.STAFF:
        return <StaffArea onLogout={handleLogout} />;
      default:
        return <HomePage setCurrentPage={setCurrentPage} setSelectedRoom={setSelectedRoom} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar setPage={setCurrentPage} currentPage={currentPage} />
      <main className="flex-grow">
        {renderContent()}
      </main>
      <Footer setPage={setCurrentPage} />
      <AIChat />
      {selectedRoom && (
        <BookingModal room={selectedRoom} onClose={() => setSelectedRoom(null)} />
      )}
    </div>
  );
}

// --- Page Components ---

const HomePage: React.FC<{ setCurrentPage: (p: PageState) => void, setSelectedRoom: (r: Room) => void }> = ({ setCurrentPage, setSelectedRoom }) => (
  <>
    <Hero setPage={setCurrentPage} />
    <section className="py-24 px-4 bg-stone-50">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-3xl font-serif text-stone-800 mb-6">Bienvenido a tu casa en la montaña</h2>
        <div className="inline-block bg-wood-600/10 text-wood-600 px-4 py-1 rounded-full text-sm font-bold mb-6 border border-wood-600/20">
          ⭐ 8,1 Ubicación (Parejas)
        </div>
        <p className="text-stone-600 leading-relaxed text-lg mb-8">
          La Casona de Tamaya no es solo un hotel, es el punto de partida para descubrir la magia de la Sierra Norte de Guadalajara.
          Destacamos por nuestro <strong>Personal (8,3)</strong> y nuestra <strong>Limpieza (8,3)</strong>.
        </p>
        <button onClick={() => setCurrentPage(PageState.ACTIVITIES)} className="text-wood-600 font-medium hover:text-wood-800 flex items-center justify-center gap-2 mx-auto transition-transform hover:translate-x-1">
          Descubre qué hacer en Tamajón <ArrowRight size={18} />
        </button>
      </div>
    </section>

    <section className="py-16 bg-white border-y border-stone-100">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-12">
        <div className="bg-stone-50 p-8 rounded-lg shadow-sm border border-stone-200">
          <h3 className="text-2xl font-serif text-stone-800 mb-6 flex items-center gap-2">
            <Clock className="text-wood-600" /> Horarios y Normas
          </h3>
          <ul className="space-y-4 text-stone-700">
            <li className="flex justify-between border-b border-stone-200 pb-2 font-medium">
              <span>Entrada (Check-in)</span>
              <span>{HOTEL_CONDITIONS.checkIn}</span>
            </li>
            <li className="flex justify-between border-b border-stone-200 pb-2 font-medium">
              <span>Salida (Check-out)</span>
              <span>{HOTEL_CONDITIONS.checkOut}</span>
            </li>
            <li className="flex items-start gap-3 pt-2 text-stone-500 text-sm">
              <AlertCircle size={16} className="text-amber-600 flex-shrink-0" />
              <span>{HOTEL_CONDITIONS.accessibility} (No hay ascensor)</span>
            </li>
          </ul>
        </div>
        <div>
          <h3 className="text-2xl font-serif text-stone-800 mb-6 flex items-center gap-2">
            <CheckCircle className="text-wood-600" /> Servicios Incluidos
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-3">
            {HOTEL_SERVICES.slice(0, 8).map((service, idx) => (
              <div key={idx} className="flex items-center gap-3 text-stone-700 text-sm">
                <CheckCircle size={14} className="text-stone-300" />
                {service}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>

    <section className="bg-stone-50 py-10">
      <RoomList onSelectRoom={setSelectedRoom} />
    </section>

    <ReviewsSection />

    <section className="py-20 bg-stone-900 text-stone-200 relative overflow-hidden">
      <div className="absolute inset-0 opacity-20 bg-[url('/images/salon_principal.webp')] bg-cover bg-center"></div>
      <div className="max-w-7xl mx-auto px-4 relative z-10 flex flex-col md:flex-row items-center gap-12">
        <div className="flex-1">
          <h2 className="text-4xl font-serif text-white mb-6">Sabores de la Tierra</h2>
          <p className="text-stone-400 mb-8 italic">Cocina tradicional elaborada con productos locales de la Sierra.</p>
          <button onClick={() => setCurrentPage(PageState.RESTAURANT)} className="border border-white/40 text-white px-8 py-3 hover:bg-white hover:text-stone-900 transition-all">
            Ver nuestra Carta
          </button>
        </div>
        <div className="flex-1 grid grid-cols-2 gap-4">
          <img src="/images/salon_principal_2.webp" className="rounded shadow-2xl translate-y-4 hover:translate-y-0 transition-transform duration-500" alt="Restaurante" />
          <img src="/images/barra_bar.webp" className="rounded shadow-2xl -translate-y-4 hover:translate-y-0 transition-transform duration-500" alt="Bar" />
        </div>
      </div>
    </section>
  </>
);

const RoomsPage: React.FC<{ setSelectedRoom: (r: Room) => void }> = ({ setSelectedRoom }) => (
  <div className="pt-20">
    <div className="relative h-[300px] flex items-center justify-center overflow-hidden">
      <img src="/images/habitaciones_bg.webp" className="absolute inset-0 w-full h-full object-cover" alt="Habitaciones" />
      <div className="absolute inset-0 bg-black/60 shadow-inner"></div>
      <h1 className="relative z-10 text-4xl md:text-5xl font-serif font-bold text-white tracking-wide">Nuestras Estancias</h1>
    </div>
    <RoomList onSelectRoom={setSelectedRoom} />
  </div>
);

const ActivitiesPage: React.FC<{ setCurrentPage: (p: PageState) => void }> = ({ setCurrentPage }) => (
  <div className="pt-20 bg-stone-50 min-h-screen">
    <div className="relative h-[300px] flex items-center justify-center overflow-hidden">
      <img src="/images/pueblos_negros.webp" className="absolute inset-0 w-full h-full object-cover object-top" alt="Entorno" />
      <div className="absolute inset-0 bg-black/50"></div>
      <h1 className="relative z-10 text-4xl md:text-5xl font-serif font-bold text-white">El Entorno</h1>
    </div>
    <div className="max-w-6xl mx-auto px-4 py-24 space-y-32">
      {ENVIRONMENT_INFO.map((section, index) => (
        <div key={section.id} className={`flex flex-col lg:flex-row gap-16 items-center ${index % 2 === 1 ? 'lg:flex-row-reverse' : ''}`}>
          <div className="flex-1 w-full relative group">
            <div className="absolute inset-0 bg-wood-600 rounded-sm transform translate-x-4 translate-y-4 transition-transform group-hover:translate-x-2 group-hover:translate-y-2"></div>
            <img src={section.image} alt={section.title} className="relative rounded shadow-2xl w-full h-[450px] object-cover object-top z-10 border border-white/10" />
          </div>
          <div className="flex-1 space-y-6">
            <h2 className="text-4xl font-serif font-bold text-stone-800">{section.title}</h2>
            <div className="w-16 h-1 bg-wood-600"></div>
            {section.content.map((p, i) => <p key={i} className="text-stone-600 leading-relaxed text-lg">{p}</p>)}
          </div>
        </div>
      ))}
    </div>
  </div>
);

const RestaurantPage: React.FC<{ setCurrentPage: (p: PageState) => void }> = ({ setCurrentPage }) => (
  <div className="pt-20 bg-stone-50 min-h-screen">
    <div className="relative h-[400px]">
      <img src="/images/restaurant_bar.webp" className="w-full h-full object-cover" alt="Restaurante" />
      <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center text-white p-4">
        <h1 className="text-5xl font-serif mb-2 text-center">Restaurante La Casona</h1>
        <p className="text-xl font-light tracking-widest uppercase text-stone-200">Tamajón</p>
      </div>
    </div>
    <div className="max-w-4xl mx-auto px-4 py-20 space-y-16">
      {RESTAURANT_MENU.map((cat, idx) => (
        <div key={idx} className="bg-white p-8 md:p-12 shadow-sm border border-stone-100 rounded-sm">
          <h2 className="text-center text-2xl font-serif font-bold text-stone-800 mb-12 uppercase tracking-[0.2em] border-b border-stone-50 pb-6">{cat.title}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
            {cat.items.map((item, i) => (
              <div key={i} className="flex justify-between items-baseline border-b border-stone-50 pb-2 group">
                <div className="pr-4">
                  <h3 className="font-bold text-stone-800 text-sm group-hover:text-wood-600 transition-colors">{item.name}</h3>
                  {item.desc && <p className="text-[11px] text-stone-400 mt-0.5">{item.desc}</p>}
                </div>
                <span className="font-bold text-wood-600">{item.price}</span>
              </div>
            ))}
          </div>
        </div>
      ))}
      <div className="bg-stone-800 text-white p-12 text-center rounded shadow-xl">
        <Phone className="mx-auto mb-4 text-wood-400" />
        <h3 className="text-2xl font-serif mb-4">¿Mesa para hoy?</h3>
        <p className="text-stone-400 mb-8">Recomendamos reservar con antelación, especialmente los fines de semana.</p>
        <button onClick={() => window.location.href = "tel:+34681279508"} className="bg-wood-600 text-white px-8 py-3 font-bold hover:bg-wood-700 transition-colors">
          Llamar al Restaurante
        </button>
      </div>
    </div>
  </div>
);

const ContactPage: React.FC<{ contactForm: any, contactStatus: string, handleContactChange: (e: any) => void, handleContactSubmit: (e: any) => void, setContactStatus: (s: any) => void }> = ({ contactForm, contactStatus, handleContactChange, handleContactSubmit, setContactStatus }) => (
  <div className="pt-20 bg-stone-50 min-h-screen">
    <div className="relative h-[300px] flex items-center justify-center overflow-hidden">
      <img src="/images/paisaje_nevado.webp" className="absolute inset-0 w-full h-full object-cover" alt="Contacto" />
      <div className="absolute inset-0 bg-black/40"></div>
      <h1 className="relative z-10 text-4xl md:text-5xl font-serif font-bold text-white tracking-wide">Contacto</h1>
    </div>
    <div className="max-w-6xl mx-auto px-4 py-20 grid md:grid-cols-2 gap-16">
      <div className="bg-white p-8 md:p-10 rounded shadow-md">
        <h2 className="text-2xl font-serif font-bold mb-8">Escríbenos</h2>
        {contactStatus === 'success' ? (
          <div className="text-center py-10">
            <CheckCircle size={48} className="text-green-600 mx-auto mb-4" />
            <h3 className="font-bold text-xl uppercase tracking-wider mb-2">¡Gracias!</h3>
            <p className="text-stone-500">Hemos recibido tu mensaje correctamente.</p>
            <button onClick={() => setContactStatus('idle')} className="mt-8 text-wood-600 font-bold underline text-sm">Enviar otro mensaje</button>
          </div>
        ) : (
          <form onSubmit={handleContactSubmit} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input required placeholder="Nombre" name="name" value={contactForm.name} onChange={handleContactChange} className="w-full px-4 py-3 bg-stone-50 border border-stone-200 outline-none focus:border-wood-600" />
              <input required type="email" placeholder="Email" name="email" value={contactForm.email} onChange={handleContactChange} className="w-full px-4 py-3 bg-stone-50 border border-stone-200 outline-none focus:border-wood-600" />
            </div>
            <textarea required placeholder="Tu mensaje..." name="message" value={contactForm.message} onChange={handleContactChange} rows={5} className="w-full px-4 py-3 bg-stone-50 border border-stone-200 outline-none focus:border-wood-600" />

            {contactStatus === 'error' && <p className="text-red-600 text-xs">Error al enviar. Inténtalo por teléfono.</p>}

            <button type="submit" disabled={contactStatus === 'submitting'} className="bg-wood-600 text-white w-full py-4 rounded font-bold hover:bg-wood-700 tracking-widest uppercase text-sm shadow-lg">
              {contactStatus === 'submitting' ? <Loader2 className="animate-spin mx-auto" /> : 'Enviar Mensaje'}
            </button>
          </form>
        )}
      </div>
      <div className="space-y-8">
        <div>
          <h2 className="text-2xl font-serif font-bold mb-4 text-stone-800 italic">Nuestra Ubicación</h2>
          <p className="text-stone-500 text-sm leading-relaxed mb-6">Estamos en el corazón de Tamajón, la puerta de entrada a los Pueblos Negros de Guadalajara.</p>
          <div className="h-[350px] rounded overflow-hidden shadow-2xl border border-stone-200 grayscale-[0.2] hover:grayscale-0 transition-all duration-700">
            <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3016.921389479344!2d-3.250556684589921!3d40.99916697930168!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xd44738555555555%3A0x5555555555555555!2sTamaj%C3%B3n%2C%20Guadalajara!5e0!3m2!1ses!2ses!4v1620000000000!5m2!1ses!2ses" width="100%" height="100%" style={{ border: 0 }} loading="lazy"></iframe>
          </div>
        </div>
      </div>
    </div>
  </div>
);

const ReviewsSection: React.FC = () => (
  <section className="py-24 bg-stone-100">
    <div className="max-w-7xl mx-auto px-4 text-center">
      <h2 className="text-3xl font-serif font-bold text-stone-800 mb-12">Experiencias de nuestros clientes</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 text-left">
        {REVIEWS.map((r, i) => (
          <div key={i} className="bg-white p-6 rounded shadow-sm border border-stone-200">
            <div className="flex justify-between mb-4">
              <div className="flex gap-0.5">{[...Array(5)].map((_, starI) => <Star key={starI} size={14} className={`${starI < Math.round(r.score / 2) ? 'text-yellow-400 fill-current' : 'text-stone-200'}`} />)}</div>
              <span className="text-xs font-bold text-wood-600">{r.score}</span>
            </div>
            <p className="text-stone-600 text-sm italic mb-6 leading-relaxed">"{r.text}"</p>
            <div className="border-t border-stone-50 pt-4">
              <p className="font-bold text-stone-800 text-sm">{r.author}</p>
              <p className="text-[10px] text-stone-400 uppercase tracking-tighter">{r.date}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default App;

