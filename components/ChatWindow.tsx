
import React, { useEffect, useRef } from 'react';
import { ChatMessage as ChatMessageType } from '../types';
import ChatMessage from './ChatMessage';
import { BotIcon } from './icons';

interface ChatWindowProps {
  conversation: ChatMessageType[];
  isLoading: boolean;
}

const ChatWindow: React.FC<ChatWindowProps> = ({ conversation, isLoading }) => {
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [conversation, isLoading]);

  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-6">
      {conversation.map((msg, index) => (
        <ChatMessage key={index} message={msg} />
      ))}
      {isLoading && (
        <div className="flex items-start gap-4">
            <div className="flex-shrink-0 h-10 w-10 rounded-full bg-stone dark:bg-charcoal-light flex items-center justify-center">
                <BotIcon className="h-6 w-6 text-slate-blue dark:text-white" />
            </div>
            <div className="flex items-center space-x-2 pt-2">
                <div className="h-2 w-2 bg-accent-emerald rounded-full animate-pulse"></div>
                <div className="h-2 w-2 bg-accent-emerald rounded-full animate-pulse [animation-delay:0.2s]"></div>
                <div className="h-2 w-2 bg-accent-emerald rounded-full animate-pulse [animation-delay:0.4s]"></div>
            </div>
        </div>
      )}
      <div ref={chatEndRef} />
    </div>
  );
};

export default ChatWindow;