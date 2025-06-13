import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Bot, User, Loader2, X } from 'lucide-react';
import { aiService } from '../../services/aiService';
import { TradingSession, Trade } from '../../types';
import toast from 'react-hot-toast';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'sydney';
  timestamp: Date;
}

interface ChatInterfaceProps {
  isOpen: boolean;
  onClose: () => void;
  currentSession: TradingSession | null;
  trades: Trade[];
  sessions: TradingSession[];
  onSwitchSession: (sessionId: string) => void;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({
  isOpen,
  onClose,
  currentSession,
  trades,
  sessions,
  onSwitchSession,
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: "Hi! I'm Sydney, your AI trading assistant. I can help you analyze your trades, switch between sessions, and provide insights to improve your trading performance. How can I help you today?",
      sender: 'sydney',
      timestamp: new Date(),
    },
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputMessage,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      // Check if user wants to switch sessions
      const sessionSwitchMatch = inputMessage.toLowerCase().match(/(?:load|switch to|open)\s+(?:the\s+)?(.+?)\s+session/i);
      if (sessionSwitchMatch) {
        const sessionName = sessionSwitchMatch[1].trim();
        const matchingSession = sessions.find(s => 
          s.name.toLowerCase().includes(sessionName.toLowerCase())
        );
        
        if (matchingSession) {
          onSwitchSession(matchingSession.id);
          const sydneyResponse: Message = {
            id: (Date.now() + 1).toString(),
            content: `I've switched you to the "${matchingSession.name}" session. You can now view and manage trades for this session.`,
            sender: 'sydney',
            timestamp: new Date(),
          };
          setMessages(prev => [...prev, sydneyResponse]);
          setIsLoading(false);
          return;
        }
      }

      // Send message to AI service
      const response = await aiService.sendChatMessage(
        inputMessage,
        currentSession,
        trades,
        messages.slice(-10) // Send last 10 messages for context
      );

      const sydneyResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: response,
        sender: 'sydney',
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, sydneyResponse]);
    } catch (error) {
      console.error('Chat error:', error);
      const errorResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: "I'm sorry, I'm having trouble connecting right now. Please try again in a moment. In the meantime, I can help you switch sessions by saying something like 'Load the BTC session' or 'Switch to Apple Scalping'.",
        sender: 'sydney',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorResponse]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="bg-slate-800 rounded-xl border border-slate-700 w-full max-w-2xl h-[600px] flex flex-col"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-slate-700">
            <div className="flex items-center">
              <div className="bg-blue-600 rounded-full p-2 mr-3">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">Sydney</h3>
                <p className="text-sm text-slate-400">AI Trading Assistant</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-lg p-3 ${
                    message.sender === 'user'
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-700 text-slate-100'
                  }`}
                >
                  <div className="flex items-start space-x-2">
                    {message.sender === 'sydney' && (
                      <Bot className="w-4 h-4 mt-0.5 text-blue-400 flex-shrink-0" />
                    )}
                    {message.sender === 'user' && (
                      <User className="w-4 h-4 mt-0.5 text-blue-200 flex-shrink-0" />
                    )}
                    <div className="flex-1">
                      <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                      <p className="text-xs opacity-70 mt-1">
                        {message.timestamp.toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-slate-700 rounded-lg p-3">
                  <div className="flex items-center space-x-2">
                    <Bot className="w-4 h-4 text-blue-400" />
                    <Loader2 className="w-4 h-4 animate-spin text-blue-400" />
                    <span className="text-sm text-slate-300">Sydney is thinking...</span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 border-t border-slate-700">
            <div className="flex space-x-2">
              <textarea
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask Sydney about your trades, request analysis, or say 'Load [session name]' to switch sessions..."
                className="flex-1 px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                rows={2}
                disabled={isLoading}
              />
              <button
                onClick={handleSendMessage}
                disabled={!inputMessage.trim() || isLoading}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ChatInterface;