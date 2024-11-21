import React, { useState, useEffect, useRef } from 'react';
import { format } from 'date-fns';
import { Send } from 'lucide-react';
import { useMediaQuery } from 'react-responsive';
import type { Message } from '../types';

interface MessageThreadProps {
  messages: Message[];
  currentUserId: string;
  onSendMessage: (content: string) => Promise<void>;
}

export default function MessageThread({ messages, currentUserId, onSendMessage }: MessageThreadProps) {
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const isMobile = useMediaQuery({ maxWidth: 768 });

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    await onSendMessage(newMessage);
    setNewMessage('');
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-lg shadow-md">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message, index) => {
          const isOwnMessage = message.senderId === currentUserId;
          return (
            <div
              key={message.id}
              className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'} 
                         animate-slide-up`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div
                className={`max-w-[80%] ${isMobile ? 'max-w-[90%]' : ''} rounded-lg p-3 
                          shadow-sm transition-all duration-200 hover:shadow-md
                          ${isOwnMessage
                            ? 'bg-gray-800 text-white'
                            : 'bg-gray-100 text-gray-900'
                          }`}
              >
                <p className="break-words">{message.content}</p>
                <p
                  className={`text-xs mt-1 ${
                    isOwnMessage ? 'text-gray-300' : 'text-gray-500'
                  }`}
                >
                  {format(new Date(message.createdAt), 'HH:mm')}
                </p>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSubmit} className="border-t p-4">
        <div className="flex space-x-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type your message..."
            className="input-field"
          />
          <button
            type="submit"
            className="btn-primary"
          >
            <Send className={`${isMobile ? 'w-5 h-5' : 'w-6 h-6'}`} />
          </button>
        </div>
      </form>
    </div>
  );
}