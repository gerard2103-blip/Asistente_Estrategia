
import React from 'react';
import { ChatMessage as ChatMessageType } from '../types';
import { BotIcon, UserIcon } from './icons';

interface ChatMessageProps {
  message: ChatMessageType;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isUser = message.sender === 'user';

  return (
    <div className={`flex items-start gap-4 ${isUser ? 'justify-end' : ''}`}>
      {!isUser && (
        <div className="flex-shrink-0 h-10 w-10 rounded-full bg-stone dark:bg-charcoal-light flex items-center justify-center">
          <BotIcon className="h-6 w-6 text-slate-blue dark:text-white" />
        </div>
      )}
      <div
        className={`max-w-xl rounded-lg px-4 py-3 shadow-sm ${
          isUser
            ? 'bg-slate-blue text-white'
            : 'bg-white dark:bg-charcoal-light border border-stone dark:border-transparent'
        }`}
      >
        <div className="prose prose-sm dark:prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: message.content }} />
      </div>
      {isUser && (
        <div className="flex-shrink-0 h-10 w-10 rounded-full bg-stone dark:bg-charcoal-light flex items-center justify-center">
          <UserIcon className="h-6 w-6 text-slate-blue" />
        </div>
      )}
    </div>
  );
};

export default ChatMessage;