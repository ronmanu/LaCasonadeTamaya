import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Loader2, MapPin } from 'lucide-react';
import { askConcierge } from '../services/geminiService';

export const AIChat: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{role: 'user' | 'bot', text: string}[]>([
    { role: 'bot', text: '¡Hola! Soy el asistente virtual de La Casona. Pregúntame sobre rutas, el tiempo, setas o nuestro menú.' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isOpen]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;
    
    const userMsg = input;
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setInput('');
    setLoading(true);

    const answer = await askConcierge(userMsg);
    
    setMessages(prev => [...prev, { role: 'bot', text: answer }]);
    setLoading(false);
  };

  return (
    <>
      {!isOpen && (
        <button 
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 bg-wood-600 text-white p-4 rounded-full shadow-xl hover:bg-wood-700 transition-transform hover:scale-105 z-40 flex items-center gap-2 group"
        >
          <MessageCircle size={24} />
          <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-500 ease-in-out whitespace-nowrap">
            Preguntar al Guía
          </span>
        </button>
      )}

      {isOpen && (
        <div className="fixed bottom-6 right-6 w-full max-w-sm bg-white rounded-lg shadow-2xl z-50 flex flex-col overflow-hidden border border-stone-200 animate-fade-in-up" style={{height: '500px', maxHeight: '80vh'}}>
          {/* Header */}
          <div className="bg-stone-800 text-white p-4 flex justify-between items-center">
            <div className="flex items-center gap-2">
                <MapPin size={18} className="text-wood-400" />
                <h3 className="font-medium">Guía Local IA</h3>
            </div>
            <button onClick={() => setIsOpen(false)} className="hover:text-stone-300">
              <X size={20} />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 bg-stone-50 space-y-4" ref={scrollRef}>
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] p-3 rounded-lg text-sm leading-relaxed ${
                  msg.role === 'user' 
                    ? 'bg-wood-600 text-white rounded-br-none' 
                    : 'bg-white border border-stone-200 text-stone-800 rounded-bl-none shadow-sm'
                }`}>
                  {msg.text}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-white border border-stone-200 p-3 rounded-lg rounded-bl-none shadow-sm">
                  <Loader2 size={16} className="animate-spin text-wood-600" />
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <div className="p-3 bg-white border-t border-stone-200 flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="¿Qué ruta me recomiendas?"
              className="flex-1 border border-stone-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-wood-600"
            />
            <button 
              onClick={handleSend}
              disabled={loading}
              className="bg-stone-800 text-white p-2 rounded-md hover:bg-stone-700 disabled:opacity-50"
            >
              <Send size={18} />
            </button>
          </div>
        </div>
      )}
    </>
  );
};