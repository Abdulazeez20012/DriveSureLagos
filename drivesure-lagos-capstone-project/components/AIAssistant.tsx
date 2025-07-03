import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenAI, Chat } from '@google/genai';
import { useLocalization } from '../App';
import { ChatMessage } from '../types';
import { XMarkIcon, PaperAirplaneIcon, SparklesIcon } from './icons';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface AIAssistantProps {
  isOnline: boolean;
  onClose: () => void;
}

const AIAssistant: React.FC<AIAssistantProps> = ({ isOnline, onClose }) => {
  const { t } = useLocalization();
  const [chat, setChat] = useState<Chat | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOnline) {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
      const chatSession = ai.chats.create({
        model: 'gemini-2.5-flash-preview-04-17',
        config: {
          systemInstruction: "You are 'Lagos Drive-Law Assistant', an expert on Lagos State traffic laws. Provide clear, concise answers to questions from drivers and law enforcement officers. If possible, cite the relevant section of the law. Your tone should be helpful and authoritative. Format your responses using markdown for readability (including lists, bolding, etc.).",
        },
      });
      setChat(chatSession);
      setMessages([{ role: 'model', content: t('aiAssistantWelcome') }]);
    }
  }, [isOnline, t]);
  
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !chat || isLoading) return;

    const userMessage: ChatMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage, { role: 'model', content: '' }]);
    setInput('');
    setIsLoading(true);

    try {
      const result = await chat.sendMessageStream({ message: input });
      
      let text = '';
      for await (const chunk of result) {
        text += chunk.text;
        setMessages(prev => {
          const newMessages = [...prev];
          newMessages[newMessages.length - 1] = { role: 'model', content: text };
          return newMessages;
        });
      }
    } catch (error) {
      console.error('Gemini API Error:', error);
      setMessages(prev => {
          const newMessages = [...prev];
          newMessages[newMessages.length - 1] = { role: 'model', content: 'Sorry, I encountered an error. Please try again.' };
          return newMessages;
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col justify-end z-40">
      <div className="bg-gray-100 rounded-t-2xl h-[95%] w-full flex flex-col shadow-2xl animate-slide-up">
        {/* Header */}
        <header className="flex items-center justify-between p-4 border-b border-gray-200 bg-white rounded-t-2xl">
          <div className="flex items-center space-x-2">
            <SparklesIcon className="w-6 h-6 text-blue-600" />
            <h2 className="text-lg font-bold text-gray-800">{t('aiAssistantTitle')}</h2>
          </div>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-200">
            <XMarkIcon className="w-6 h-6 text-gray-600" />
          </button>
        </header>

        {/* Chat Messages */}
        <div className="flex-grow p-4 overflow-y-auto">
          <div className="space-y-4">
            {messages.map((msg, index) => (
              <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`max-w-[85%] px-4 py-2 rounded-2xl ${
                    msg.role === 'user' ? 'bg-blue-600 text-white' : 'bg-white text-gray-800 shadow-sm'
                  }`}
                >
                  {msg.role === 'model' ? (
                      <div className="prose prose-sm max-w-none text-gray-800">
                          <ReactMarkdown remarkPlugins={[remarkGfm]}>
                              {isLoading && index === messages.length - 1 ? msg.content + '...' : msg.content}
                          </ReactMarkdown>
                      </div>
                  ) : (
                      msg.content
                  )}
                </div>
              </div>
            ))}
             {isLoading && messages[messages.length - 1]?.role === 'user' && (
              <div className="flex justify-start">
                  <div className="px-4 py-2 rounded-2xl bg-white text-gray-800 shadow-sm">
                      <div className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse delay-75"></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse delay-150"></div>
                      </div>
                  </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Input Form */}
        <div className="p-4 border-t border-gray-200 bg-white">
          <form onSubmit={handleSend} className="flex items-center space-x-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={t('aiAssistantPlaceholder')}
              className="flex-grow p-3 bg-gray-100 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={isLoading || !isOnline}
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim() || !isOnline}
              className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            >
              <PaperAirplaneIcon className="w-6 h-6" />
            </button>
          </form>
        </div>
      </div>
       <style>{`
        @keyframes slide-up {
          from { transform: translateY(100%); }
          to { transform: translateY(0); }
        }
        .animate-slide-up { animation: slide-up 0.3s ease-out; }
        .prose { font-size: 0.9rem; line-height: 1.5; }
        .prose h1, .prose h2, .prose h3 { margin-bottom: 0.5em; margin-top: 1em; font-weight: bold;}
        .prose p { margin-bottom: 0.5em; margin-top: 0.5em; }
        .prose ul, .prose ol { margin-left: 1.5em; margin-bottom: 0.5em; padding-left: 1em;}
        .prose li { margin-bottom: 0.25em; }
        .prose strong { font-weight: bold; }
        .prose a { color: #2563eb; text-decoration: underline; }
        .prose code { background-color: #f3f4f6; padding: 0.2em 0.4em; font-size: 85%; border-radius: 3px;}
        .prose pre { background-color: #f3f4f6; padding: 1em; border-radius: 6px; overflow-x: auto; }
      `}</style>
    </div>
  );
};

export default AIAssistant;