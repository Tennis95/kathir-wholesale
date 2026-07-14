'use client';

import { useState, useEffect } from 'react';
import { getSocket } from '@/lib/socket';
import { motion, AnimatePresence } from 'motion/react';

export default function LiveChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Array<{ id: string; text: string; sender: string; time: string }>>([]);
  const [newMessage, setNewMessage] = useState('');

  useEffect(() => {
    const socket = getSocket();

    socket.on('chat:message', (data: { message: string; sender?: string }) => {
      setMessages(prev => [...prev, {
        id: Math.random().toString(),
        text: data.message,
        sender: data.sender || 'Support',
        time: new Date().toLocaleTimeString()
      }]);
    });

    return () => {
      socket.off('chat:message');
    };
  }, []);

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;

    const socket = getSocket();
    const message = {
      id: Math.random().toString(),
      text: newMessage,
      sender: 'You',
      time: new Date().toLocaleTimeString()
    };

    setMessages(prev => [...prev, message]);
    socket.emit('chat:send-message', {
      message: newMessage,
      roomId: 'support',
      sender: 'Customer'
    });

    setNewMessage('');
  };

  return (
    <>
      {/* Chat Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 w-16 h-16 rounded-full text-3xl shadow-lg transition transform hover:scale-110 z-40"
        style={{
          background: 'linear-gradient(135deg, #2D7BA8 0%, #1E5A7A 100%)',
          boxShadow: '0 4px 12px rgba(45, 123, 168, 0.25)',
        }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        💬
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed bottom-24 right-6 w-80 bg-white rounded-2xl shadow-2xl overflow-hidden z-40 flex flex-col"
            style={{ height: '500px' }}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.3 }}
          >
            {/* Header */}
            <div
              className="p-4 text-white flex items-center justify-between"
              style={{
                background: 'linear-gradient(135deg, #2D7BA8 0%, #1E5A7A 100%)',
              }}
            >
              <h3 className="font-bold">KATHIR Support</h3>
              <button
                onClick={() => setIsOpen(false)}
                className="text-xl font-bold hover:opacity-80"
              >
                ✕
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
              {messages.length === 0 ? (
                <p className="text-center text-gray-500 text-sm">Start a conversation!</p>
              ) : (
                messages.map(msg => (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, x: msg.sender === 'You' ? 10 : -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className={`flex ${msg.sender === 'You' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className="max-w-xs px-4 py-2 rounded-lg"
                      style={{
                        background: msg.sender === 'You' ? '#2D7BA8' : '#E8F4FB',
                        color: msg.sender === 'You' ? '#FFF' : '#1F2937'
                      }}
                    >
                      <p className="text-sm">{msg.text}</p>
                      <p className="text-xs opacity-70 mt-1">{msg.time}</p>
                    </div>
                  </motion.div>
                ))
              )}
            </div>

            {/* Input */}
            <div className="p-4 border-t flex gap-2">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Type a message..."
                className="flex-1 px-3 py-2 border-2 rounded-lg focus:outline-none"
                style={{ borderColor: '#8FD3F4' }}
              />
              <button
                onClick={handleSendMessage}
                className="px-4 py-2 rounded-lg font-bold text-white"
                style={{
                  background: 'linear-gradient(135deg, #2D7BA8 0%, #1E5A7A 100%)',
                }}
              >
                Send
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
