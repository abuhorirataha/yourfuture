
import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Bot, User, Minimize2, Loader2 } from 'lucide-react';
import { getChatResponse } from '../services/geminiService';
import { ChatMessage } from '../types';

const AssistantChat: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      text: 'مرحباً بك في بوابة السودان الرقمية. أنا مساعدك الذكي، كيف يمكنني خدمتك اليوم في الإجراءات الحكومية أو الزراعة الذكية؟',
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const toggleChat = () => setIsOpen(!isOpen);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isOpen]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    const replyText = await getChatResponse(input, messages);

    const botMsg: ChatMessage = {
      id: (Date.now() + 1).toString(),
      role: 'assistant',
      text: replyText,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, botMsg]);
    setLoading(false);
  };

  return (
    <>
      {/* Floating Trigger Button */}
      {!isOpen && (
        <button
          onClick={toggleChat}
          className="fixed bottom-6 left-6 z-40 bg-sudan-primary hover:bg-sudan-secondary text-white p-4 rounded-full shadow-2xl shadow-cyan-400/50 transition-all transform hover:scale-110 flex items-center gap-2 group"
        >
          <Bot size={28} className="animate-pulse" />
          <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-300 whitespace-nowrap font-bold pl-1">
             المساعد الذكي
          </span>
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-6 left-6 z-50 w-[350px] md:w-[400px] h-[500px] bg-white rounded-2xl shadow-2xl border border-gray-200 flex flex-col overflow-hidden animate-in slide-in-from-bottom-10 fade-in duration-300">
          
          {/* Header */}
          <div className="bg-sudan-primary p-4 flex justify-between items-center text-white">
            <div className="flex items-center gap-2">
              <div className="bg-white/20 p-1.5 rounded-lg">
                <Bot size={20} />
              </div>
              <div>
                <h3 className="font-bold text-sm">مساعد الحكومة الذكية</h3>
                <span className="text-[10px] text-cyan-100 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></span>
                  متصل الآن (Gemini AI)
                </span>
              </div>
            </div>
            <div className="flex gap-2">
               <button onClick={toggleChat} className="hover:bg-white/10 p-1 rounded transition-colors">
                  <Minimize2 size={16} />
               </button>
               <button onClick={toggleChat} className="hover:bg-white/10 p-1 rounded transition-colors">
                  <X size={16} />
               </button>
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 bg-gray-50 space-y-4">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] p-3 rounded-2xl text-sm leading-relaxed shadow-sm ${
                  msg.role === 'user' 
                    ? 'bg-sudan-primary text-white rounded-br-none' 
                    : 'bg-white text-gray-800 border border-gray-100 rounded-bl-none'
                }`}>
                  {msg.text}
                  <span className={`block text-[9px] mt-1 opacity-60 ${msg.role === 'user' ? 'text-cyan-100' : 'text-gray-400'}`}>
                    {msg.timestamp.toLocaleTimeString('ar-SD', { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                 <div className="bg-white p-3 rounded-2xl rounded-bl-none border border-gray-100 shadow-sm flex items-center gap-2">
                    <Loader2 size={16} className="animate-spin text-sudan-primary" />
                    <span className="text-xs text-gray-400">جاري التحليل...</span>
                 </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-3 bg-white border-t flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="اكتب استفسارك هنا..."
              className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sudan-primary/50"
            />
            <button
              onClick={handleSend}
              disabled={loading || !input.trim()}
              className="bg-sudan-primary hover:bg-sudan-secondary disabled:opacity-50 text-white p-2.5 rounded-xl transition-all shadow-md"
            >
              <Send size={18} className={loading ? 'opacity-0' : 'opacity-100'} />
            </button>
          </div>

        </div>
      )}
    </>
  );
};

export default AssistantChat;
