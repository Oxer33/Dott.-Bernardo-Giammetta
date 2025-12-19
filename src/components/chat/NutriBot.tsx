// =============================================================================
// NUTRIBOT CHAT WIDGET - DOTT. BERNARDO GIAMMETTA
// Widget chatbot flottante per assistenza utenti
// =============================================================================

'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MessageCircle, 
  X, 
  Send, 
  Bot,
  User,
  Loader2,
  Minimize2,
  Sparkles
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { WELCOME_MESSAGE, OFFLINE_MESSAGE } from '@/lib/nutribot';

// =============================================================================
// TIPI
// =============================================================================

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

// =============================================================================
// COMPONENTE PRINCIPALE
// =============================================================================

export function NutriBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Scroll automatico ai nuovi messaggi
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  // Focus sull'input quando si apre la chat
  useEffect(() => {
    if (isOpen && !isMinimized) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [isOpen, isMinimized]);

  // Messaggio di benvenuto all'apertura
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([
        {
          id: 'welcome',
          role: 'assistant',
          content: WELCOME_MESSAGE,
          timestamp: new Date(),
        },
      ]);
    }
  }, [isOpen, messages.length]);

  // Invia messaggio
  const sendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: inputValue.trim(),
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);
    setHasError(false);

    try {
      // Prepara i messaggi per l'API (escludi welcome message)
      const apiMessages = [...messages, userMessage]
        .filter(m => m.id !== 'welcome')
        .map(m => ({
          role: m.role,
          content: m.content,
        }));

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: apiMessages }),
      });

      const data = await response.json();

      if (data.success && data.message) {
        const assistantMessage: Message = {
          id: `assistant-${Date.now()}`,
          role: 'assistant',
          content: data.message,
          timestamp: new Date(),
        };
        setMessages(prev => [...prev, assistantMessage]);
      } else {
        throw new Error(data.error || 'Errore sconosciuto');
      }
    } catch (error) {
      console.error('Chat error:', error);
      setHasError(true);
      const errorMessage: Message = {
        id: `error-${Date.now()}`,
        role: 'assistant',
        content: OFFLINE_MESSAGE,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  // Gestisci invio con Enter
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <>
      {/* Pulsante flottante */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsOpen(true)}
            className="fixed bottom-6 right-6 z-50 w-16 h-16 rounded-full 
                       bg-gradient-to-br from-lavender-300 to-lavender-500
                       text-white shadow-lg hover:shadow-xl
                       flex items-center justify-center
                       transition-shadow duration-300"
            aria-label="Apri chat con NutriBot"
          >
            <MessageCircle className="w-7 h-7" />
            {/* Indicatore pulsante */}
            <span className="absolute top-0 right-0 w-4 h-4 bg-orange-400 rounded-full 
                           animate-pulse border-2 border-white" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Finestra chat */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ 
              opacity: 1, 
              y: 0, 
              scale: 1,
              height: isMinimized ? 'auto' : '500px'
            }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            className={cn(
              "fixed bottom-6 right-6 z-50 w-[380px] max-w-[calc(100vw-3rem)]",
              "bg-white rounded-2xl shadow-2xl overflow-hidden",
              "border border-lavender-200",
              "flex flex-col"
            )}
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-lavender-400 to-lavender-500 p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                  <Bot className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-white flex items-center gap-1">
                    NutriBot
                    <Sparkles className="w-4 h-4 text-orange-300" />
                  </h3>
                  <p className="text-lavender-100 text-xs">Assistente virtuale</p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setIsMinimized(!isMinimized)}
                  className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                  aria-label={isMinimized ? 'Espandi' : 'Minimizza'}
                >
                  <Minimize2 className="w-4 h-4 text-white" />
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                  aria-label="Chiudi chat"
                >
                  <X className="w-4 h-4 text-white" />
                </button>
              </div>
            </div>

            {/* Corpo chat (nascosto se minimizzato) */}
            {!isMinimized && (
              <>
                {/* Messaggi */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-cream-50">
                  {messages.map((message) => (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={cn(
                        "flex gap-2",
                        message.role === 'user' ? 'justify-end' : 'justify-start'
                      )}
                    >
                      {message.role === 'assistant' && (
                        <div className="w-8 h-8 rounded-full bg-lavender-100 flex items-center justify-center flex-shrink-0">
                          <Bot className="w-4 h-4 text-lavender-600" />
                        </div>
                      )}
                      <div
                        className={cn(
                          "max-w-[80%] rounded-2xl px-4 py-2 text-sm",
                          message.role === 'user'
                            ? "bg-sage-500 text-white rounded-br-md"
                            : "bg-white text-sage-800 rounded-bl-md shadow-sm border border-lavender-100"
                        )}
                      >
                        <p className="whitespace-pre-wrap">{message.content}</p>
                      </div>
                      {message.role === 'user' && (
                        <div className="w-8 h-8 rounded-full bg-sage-100 flex items-center justify-center flex-shrink-0">
                          <User className="w-4 h-4 text-sage-600" />
                        </div>
                      )}
                    </motion.div>
                  ))}
                  
                  {/* Indicatore di digitazione */}
                  {isLoading && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex gap-2 items-center"
                    >
                      <div className="w-8 h-8 rounded-full bg-lavender-100 flex items-center justify-center">
                        <Bot className="w-4 h-4 text-lavender-600" />
                      </div>
                      <div className="bg-white rounded-2xl px-4 py-3 shadow-sm border border-lavender-100">
                        <div className="flex gap-1">
                          <span className="w-2 h-2 bg-lavender-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                          <span className="w-2 h-2 bg-lavender-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                          <span className="w-2 h-2 bg-lavender-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                        </div>
                      </div>
                    </motion.div>
                  )}
                  
                  <div ref={messagesEndRef} />
                </div>

                {/* Input */}
                <div className="p-4 border-t border-lavender-100 bg-white">
                  <div className="flex gap-2">
                    <input
                      ref={inputRef}
                      type="text"
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Scrivi un messaggio..."
                      disabled={isLoading}
                      className="flex-1 px-4 py-2 rounded-full border border-lavender-200 
                               focus:border-lavender-400 focus:ring-2 focus:ring-lavender-100
                               outline-none text-sm text-sage-800 placeholder:text-sage-400
                               disabled:opacity-50 disabled:cursor-not-allowed"
                    />
                    <button
                      onClick={sendMessage}
                      disabled={!inputValue.trim() || isLoading}
                      className={cn(
                        "w-10 h-10 rounded-full flex items-center justify-center transition-all",
                        inputValue.trim() && !isLoading
                          ? "bg-lavender-500 text-white hover:bg-lavender-600"
                          : "bg-lavender-100 text-lavender-400 cursor-not-allowed"
                      )}
                      aria-label="Invia messaggio"
                    >
                      {isLoading ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Send className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                  <p className="text-[10px] text-sage-400 text-center mt-2">
                    NutriBot può commettere errori. Per consulenze, prenota una visita.
                  </p>
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
