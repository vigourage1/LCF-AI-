import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, X, MessageCircle } from 'lucide-react';
import { User } from '../../types';

interface SydneyGreetingProps {
  user: User;
  onOpenChat: () => void;
}

const SydneyGreeting: React.FC<SydneyGreetingProps> = ({ user, onOpenChat }) => {
  const [isVisible, setIsVisible] = useState(true);
  const [greeting, setGreeting] = useState('');

  useEffect(() => {
    const generateGreeting = () => {
      const hour = new Date().getHours();
      const userName = user.email.split('@')[0]; // Extract name from email
      
      let timeGreeting = '';
      if (hour < 12) timeGreeting = 'Good morning';
      else if (hour < 17) timeGreeting = 'Good afternoon';
      else timeGreeting = 'Good evening';

      // Check for holidays (basic implementation)
      const today = new Date();
      const month = today.getMonth() + 1;
      const day = today.getDate();
      
      let holidayGreeting = '';
      if (month === 12 && day === 25) holidayGreeting = '🎄 Merry Christmas! ';
      else if (month === 1 && day === 1) holidayGreeting = '🎉 Happy New Year! ';
      else if (month === 10 && day === 31) holidayGreeting = '🎃 Happy Halloween! ';
      else if (month === 2 && day === 14) holidayGreeting = '💝 Happy Valentine\'s Day! ';

      const greetings = [
        `${holidayGreeting}${timeGreeting}, ${userName}! Ready to analyze your trades today?`,
        `${holidayGreeting}${timeGreeting}! I'm Sydney, here to help you improve your trading performance.`,
        `${holidayGreeting}Hey ${userName}! ${timeGreeting}. Let's make today a profitable one!`,
        `${holidayGreeting}${timeGreeting}, ${userName}! I'm here to help you spot patterns and optimize your strategy.`,
      ];

      setGreeting(greetings[Math.floor(Math.random() * greetings.length)]);
    };

    generateGreeting();
  }, [user]);

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="sticky top-20 z-40 mx-6 mb-6"
      >
        <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 backdrop-blur-sm border border-blue-500/30 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-blue-600 rounded-full p-2">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <p className="text-white font-medium">Sydney</p>
                <p className="text-blue-200 text-sm">{greeting}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={onOpenChat}
                className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                title="Chat with Sydney"
              >
                <MessageCircle className="w-4 h-4" />
              </button>
              <button
                onClick={() => setIsVisible(false)}
                className="p-2 text-blue-200 hover:text-white transition-colors"
                title="Dismiss"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default SydneyGreeting;