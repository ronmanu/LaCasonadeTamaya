import React, { useState, useRef, useEffect } from 'react';
import { Send, User, Sparkles, Loader2, X } from 'lucide-react';
import { askHotelAI } from '../services/aiService';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
}

interface AIChatProps {
  onClose?: () => void;
}

const AIChat: React.FC<AIChatProps> = ({ onClose }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: '¡Hola! Soy el asistente de Ángel y Yoli. Conozco todos los secretos de Tamajón y la Sierra Norte. ¿En qué puedo ayudarte hoy?',
      sender: 'ai'
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: input,
      sender: 'user'
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    const aiResponse = await askHotelAI(input);
    
    const aiMessage: Message = {
      id: (Date.now() + 1).toString(),
      text: aiResponse,
      sender: 'ai'
    };

    setMessages(prev => [...prev, aiMessage]);
    setIsLoading(false);
  };

  return (
    <div className="flex flex-col h-[500px] bg-white rounded-2xl shadow-2xl border border-stone-100 overflow-hidden">
      <div className="bg-stone-900 text-white p-4 flex justify-between items-center">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest flex items-center gap-2">
            <Sparkles size={12} className="text-wood-400" /> Guía Local IA
          </p>
          <p className="text-[10px] text-stone-400 italic">Ángel y Yoli a tu servicio</p>
        </div>
        {onClose && (
          <button 
            onClick={onClose} 
            className="p-1 hover:bg-white/10 rounded-full transition-colors"
            title="Cerrar chat"
          >
            <X size={20} />
          </button>
        )}
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-4" id="chat-messages">
        {messages.map((m) => (
          <div key={m.id} className={`flex gap-3 ${m.sender === 'user' ? 'flex-row-reverse' : 'max-w-[90%]'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${m.sender === 'user' ? 'bg-wood-600' : 'bg-stone-200'} text-stone-900 shadow-sm`}>
              <User size={14} />
            </div>
            <div className={`p-3 rounded-2xl ${m.sender === 'user' ? 'bg-stone-900 text-white rounded-tr-none' : 'bg-stone-100 text-stone-800 rounded-tl-none border border-stone-200 shadow-sm'}`}>
              <p className="text-sm leading-relaxed whitespace-pre-wrap">{m.text}</p>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex gap-3 max-w-[90%] animate-pulse">
            <div className="w-8 h-8 rounded-full bg-stone-200 flex items-center justify-center flex-shrink-0 text-stone-900">
              <Sparkles size={14} className="animate-spin" />
            </div>
            <div className="bg-stone-100 p-3 rounded-2xl rounded-tl-none border border-stone-200 flex items-center gap-2">
              <Loader2 size={16} className="animate-spin text-stone-400" />
              <span className="text-xs text-stone-400 italic">Ángel está consultando sus notas...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 border-t border-stone-100 bg-stone-50">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="¿Qué ruta me recomienda Ángel?"
            className="flex-1 bg-white border border-stone-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-stone-900"
            disabled={isLoading}
          />
          <button 
            onClick={handleSend}
            disabled={isLoading || !input.trim()}
            className="bg-stone-900 text-white p-2 rounded-xl disabled:opacity-50 transition-all hover:bg-stone-800"
            title="Enviar"
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AIChat;