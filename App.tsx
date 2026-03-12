import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { RoomList } from './components/RoomList';
import { Footer } from './components/Footer';
import AIChat from './components/AIChat';
import { BookingModal } from './components/BookingModal';
import { Gallery } from './components/Gallery';
import { StaffArea } from './components/StaffArea';
import { ROOMS, ENVIRONMENT_INFO, RESTAURANT_MENU, HOTEL_CONDITIONS, HOTEL_SERVICES, REVIEWS } from './constants';
import { PageState, Room } from './types';
import { Map, Mountain, Utensils, ArrowRight, Clock, Info, CheckCircle, Wifi, Ban, Car, AlertCircle, Star, Quote, Leaf, Camera, Loader2, Phone, MessageSquare, Send, Sparkles, User, X } from 'lucide-react';

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
  const [isChatOpen, setIsChatOpen] = useState(false);

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
      case PageState.GUEST_PORTAL:
        return <GuestPortalPage setCurrentPage={setCurrentPage} />;
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
      
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-4">
        {isChatOpen && (
          <div className="w-[90vw] md:w-96 shadow-2xl animate-in slide-in-from-bottom-6 duration-300">
            <AIChat onClose={() => setIsChatOpen(false)} />
          </div>
        )}
        <button
          onClick={() => setIsChatOpen(!isChatOpen)}
          className={`${isChatOpen ? 'bg-stone-100 text-stone-900 rotate-90' : 'bg-stone-900 text-white animate-bounce'} w-14 h-14 rounded-full shadow-2xl flex items-center justify-center border border-white/20 active:scale-95 transition-all duration-300`}
          title="Guía del Huésped"
        >
          {isChatOpen ? <X size={24} /> : <MessageSquare size={24} />}
        </button>
      </div>
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
        <h2 className="text-3xl font-serif text-stone-800 mb-6 font-bold">Bienvenido a tu casa en la montaña</h2>
        <div className="inline-block bg-stone-900 text-white px-6 py-2 rounded-full text-xs font-bold mb-8 tracking-[0.2em] uppercase">
          La Casona de Tamaya
        </div>
        <p className="text-stone-600 leading-relaxed text-lg mb-10 max-w-2xl mx-auto italic">
          "Un refugio de piedra y madera donde el tiempo se detiene y la naturaleza de los Pueblos Negros te da la bienvenida."
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-lg mx-auto">
          <button
            onClick={() => setCurrentPage(PageState.ACTIVITIES)}
            className="group bg-white border border-stone-200 px-6 py-4 rounded-2xl flex items-center justify-between hover:border-stone-900 transition-all font-bold text-stone-800"
          >
            <span>Explorar el Entorno</span>
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </button>
          <button
            onClick={() => setCurrentPage(PageState.GUEST_PORTAL)}
            className="group bg-stone-900 text-white px-6 py-4 rounded-2xl flex items-center justify-between hover:bg-stone-800 transition-all font-bold"
          >
            <span>Guía del Huésped</span>
            <span className="bg-white/20 px-2 py-0.5 rounded text-[10px]">INFO</span>
          </button>
        </div>
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
    <div className="relative h-[50vh] flex items-center justify-center overflow-hidden">
      <img src="/images/pueblos_negros.webp" className="absolute inset-0 w-full h-full object-cover object-top" alt="Entorno" />
      <div className="absolute inset-0 bg-gradient-to-t from-stone-50 via-stone-50/20 to-transparent"></div>
      <div className="relative z-10 text-center px-4">
        <h1 className="text-4xl md:text-6xl font-serif font-bold text-stone-900 mb-4 tracking-tight">Vivir la Sierra</h1>
        <p className="text-stone-700 text-lg md:text-xl font-light uppercase tracking-[0.3em]">Tamajón & Pueblos Negros</p>
      </div>
    </div>
    <div className="max-w-7xl mx-auto px-4 py-24 space-y-32">
      {ENVIRONMENT_INFO.map((section, index) => (
        <div key={section.id} className={`flex flex-col lg:flex-row gap-16 items-center ${index % 2 === 1 ? 'lg:flex-row-reverse' : ''}`}>
          <div className="flex-1 w-full relative group">
            <div className="absolute -inset-4 bg-stone-200 rounded-3xl transform rotate-1 transition-transform group-hover:rotate-0"></div>
            <img
              src={section.image}
              alt={section.title}
              className="relative rounded-2xl shadow-2xl w-full h-[500px] object-cover object-center z-10 border border-white/50"
            />
            <div className="absolute -bottom-6 -right-6 lg:-right-10 bg-white p-6 rounded-2xl shadow-xl z-20 border border-stone-100 hidden sm:block min-w-[180px]">
              {section.isRecommended && (
                <div className="flex items-center gap-2 mb-4 bg-wood-600/10 text-wood-600 px-3 py-1 rounded-full w-fit">
                  <Star size={10} fill="currentColor" />
                  <span className="text-[10px] font-bold uppercase tracking-wider">Favorito del Hotel</span>
                </div>
              )}
              {section.duration && (
                <div className="mb-4">
                  <p className="text-[10px] uppercase font-bold text-stone-400 tracking-wider">Duración</p>
                  <p className="text-sm font-serif font-bold text-stone-800">{section.duration}</p>
                </div>
              )}
              {section.details?.map((detail, idx) => (
                <div key={idx} className="mb-2 last:mb-0">
                  <p className="text-[10px] uppercase font-bold text-stone-400 tracking-wider">{detail.label}</p>
                  <p className="text-sm font-serif font-bold text-stone-800">{detail.value}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="flex-1 space-y-8 lg:px-6">
            <div className="flex items-center gap-4">
              <span className="text-6xl font-serif font-black text-stone-100">0{index + 1}</span>
              <div>
                <div className="flex items-center gap-3">
                  <h2 className="text-4xl font-serif font-bold text-stone-900">{section.title}</h2>
                  {section.category && (
                    <span className="bg-stone-100 text-stone-500 px-2 py-0.5 rounded text-[8px] uppercase font-bold tracking-widest border border-stone-200">
                      {section.category === 'nature' && 'Naturaleza'}
                      {section.category === 'culture' && 'Cultura'}
                      {section.category === 'adventure' && 'Aventura'}
                      {section.category === 'gastronomy' && 'Gastronomía'}
                    </span>
                  )}
                </div>
                <p className="text-wood-600 font-bold tracking-widest uppercase text-xs mt-1">{section.subtitle}</p>
              </div>
            </div>
            <div className="space-y-6">
              {section.content.map((p, i) => <p key={i} className="text-stone-600 leading-relaxed text-lg text-justify">{p}</p>)}
            </div>
          </div>
        </div>
      ))}
    </div>

    <section className="bg-stone-900 py-32 mt-20">
      <div className="max-w-4xl mx-auto px-4 text-center text-white">
        <h2 className="text-4xl font-serif mb-8">¿Listo para la aventura?</h2>
        <p className="text-stone-400 text-xl mb-12 font-light leading-relaxed font-serif italic">
          "Hay lugares que no se visitan, se sienten. Tamajón es la puerta, La Casona es tu refugio."
        </p>
        <button
          onClick={() => setCurrentPage(PageState.ROOMS)}
          className="bg-white text-stone-900 px-12 py-5 rounded-full font-bold hover:bg-stone-200 transition-all text-sm uppercase tracking-widest"
        >
          Reservar Estancia
        </button>
      </div>
    </section>
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

// --- Portal del Huésped (Guía Digital) ---

const GuestPortalPage: React.FC<{ setCurrentPage: (p: PageState) => void }> = ({ setCurrentPage }) => {
  const [activeTab, setActiveTab] = useState<'info' | 'menu' | 'routes' | 'chat'>('info');

  const tabs = [
    { id: 'info', label: 'Bienvenida', icon: Info },
    { id: 'chat', label: 'Guía IA', icon: MessageSquare },
    { id: 'menu', label: 'Bar & Cena', icon: Utensils },
    { id: 'routes', label: 'Rutas', icon: Map },
  ];

  return (
    <div className="pt-20 bg-stone-50 min-h-screen pb-20">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header de la Guía */}
        <div className="bg-stone-900 text-white rounded-3xl p-8 mb-6 shadow-2xl relative overflow-hidden">
          <div className="relative z-10">
            <h1 className="text-3xl font-serif font-bold mb-2 tracking-tight">Guía del Huésped</h1>
            <p className="text-stone-400 font-light flex items-center gap-2">
              <Star size={14} className="text-wood-600" />
              La Casona de Tamaya
            </p>
          </div>
          <div className="absolute top-0 right-0 w-32 h-32 bg-wood-600/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
        </div>

        {/* Navegación por Pestañas */}
        <div className="flex bg-white p-1.5 rounded-2xl shadow-sm border border-stone-200 mb-8 sticky top-24 z-20">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex-1 flex flex-col items-center gap-1.5 py-3 rounded-xl transition-all ${activeTab === tab.id
                ? 'bg-stone-900 text-white shadow-lg'
                : 'text-stone-400 hover:text-stone-600 hover:bg-stone-50'
                }`}
            >
              <tab.icon size={18} />
              <span className="text-[10px] font-bold uppercase tracking-widest">{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Contenido Dinámico */}
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          {activeTab === 'chat' && <AIChat />}
          
          {activeTab === 'info' && (
            <div className="space-y-6">
              <section className="bg-white p-6 rounded-2xl shadow-sm border border-stone-100">
                <h2 className="text-xl font-serif font-bold text-stone-800 mb-4 flex items-center gap-2">
                  <Wifi className="text-wood-600" /> WiFi del Hotel
                </h2>
                <div className="bg-stone-50 p-4 rounded-xl border border-stone-200 text-center select-all">
                  <p className="text-xs text-stone-400 uppercase font-bold mb-1">Contraseña</p>
                  <p className="text-2xl font-serif font-bold text-stone-800">CASONA_2026</p>
                </div>
              </section>

              <section className="bg-white p-6 rounded-2xl shadow-sm border border-stone-100">
                <h2 className="text-xl font-serif font-bold text-stone-800 mb-4 flex items-center gap-2">
                  <Clock className="text-wood-600" /> Información Práctica
                </h2>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-stone-50 rounded-xl">
                    <p className="text-[8px] uppercase font-bold text-stone-400">Desayuno</p>
                    <p className="text-sm font-bold text-stone-800">09:00 - 10:30</p>
                  </div>
                  <div className="p-4 bg-stone-50 rounded-xl">
                    <p className="text-[8px] uppercase font-bold text-stone-400">Check-out</p>
                    <p className="text-sm font-bold text-stone-800">Hasta las 12:00</p>
                  </div>
                  <div className="p-4 bg-stone-50 rounded-xl">
                    <p className="text-[8px] uppercase font-bold text-stone-400">Calefacción</p>
                    <p className="text-sm font-bold text-stone-800">Automática</p>
                  </div>
                  <div className="p-4 bg-stone-50 rounded-xl">
                    <p className="text-[8px] uppercase font-bold text-stone-400">Atención</p>
                    <p className="text-sm font-bold text-stone-800">Ángel & Yoli</p>
                  </div>
                </div>
              </section>

              <button
                onClick={() => window.location.href = "tel:+34681279508"}
                className="w-full bg-wood-600 text-white p-4 rounded-2xl font-bold flex items-center justify-center gap-3 shadow-lg hover:bg-wood-700 transition-all"
              >
                <Phone size={20} /> Llamar a Recepción
              </button>
            </div>
          )}

          {activeTab === 'menu' && (
            <div className="space-y-6">
              {RESTAURANT_MENU.map((cat, idx) => (
                <div key={idx} className="bg-white p-6 rounded-2xl shadow-sm border border-stone-100">
                  <h3 className="text-lg font-serif font-bold text-stone-800 mb-6 border-b border-stone-50 pb-3">{cat.title}</h3>
                  <div className="space-y-4">
                    {cat.items.slice(0, 10).map((item, i) => (
                      <div key={i} className="flex justify-between items-baseline gap-4">
                        <div className="flex-1">
                          <p className="font-bold text-stone-800 text-sm">{item.name}</p>
                          {item.desc && <p className="text-[10px] text-stone-400 mt-0.5">{item.desc}</p>}
                        </div>
                        <span className="font-bold text-wood-600 text-sm">{item.price}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
              <p className="text-center text-stone-400 text-[10px] italic">Carta reducida. Consulta especialidades del día en el bar.</p>
            </div>
          )}

          {activeTab === 'routes' && (
            <div className="space-y-4">
              <div className="bg-wood-600/5 p-4 rounded-2xl border border-wood-600/10 mb-6">
                <p className="text-xs text-wood-600 font-bold flex items-center gap-2 mb-1">
                  <Star size={12} fill="currentColor" /> Nuestra Selección
                </p>
                <p className="text-stone-500 text-[10px] leading-relaxed italic">
                  "Hemos seleccionado estos rincones porque son los que nosotros mismos disfrutamos. Confía en nuestro criterio y déjate sorprender."
                </p>
              </div>
              {ENVIRONMENT_INFO.map(section => (
                <div key={section.id} className="relative h-48 rounded-2xl overflow-hidden group shadow-lg">
                  <img src={section.image} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt={section.title} />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent p-6 flex flex-col justify-end">
                    <div className="flex justify-between items-start mb-1">
                      <div>
                        <h3 className="text-white font-serif font-bold text-xl">{section.title}</h3>
                        <p className="text-stone-300 text-xs font-light">{section.subtitle}</p>
                      </div>
                      {section.isRecommended && (
                        <span className="bg-wood-600 text-white p-1.5 rounded-full">
                          <Star size={12} fill="currentColor" />
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-3 mt-4">
                      {section.duration && (
                        <span className="text-white/70 text-[10px] flex items-center gap-1">
                          <Clock size={10} /> {section.duration}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default App;

