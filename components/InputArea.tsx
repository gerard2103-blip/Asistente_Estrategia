
import React, { useRef } from 'react';
import { SendIcon, UploadIcon } from './icons';

interface InputAreaProps {
  onSendMessage: (message: string) => void;
  onFileUpload: (file: File) => void;
  isLoading: boolean;
  userInput: string;
  setUserInput: (value: string) => void;
}

const InputArea: React.FC<InputAreaProps> = ({ onSendMessage, onFileUpload, isLoading, userInput, setUserInput }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (userInput.trim() && !isLoading) {
      onSendMessage(userInput);
    }
  };
  
  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleSubmit(e as any);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onFileUpload(e.target.files[0]);
    }
  };

  return (
    <div className="border-t border-stone dark:border-charcoal-light bg-white dark:bg-graphite p-4">
      <form onSubmit={handleSubmit} className="flex items-center gap-4">
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
          disabled={isLoading}
        />
        <button
          type="button"
          onClick={handleUploadClick}
          disabled={isLoading}
          className="p-2 text-slate-blue dark:text-stone hover:text-accent-emerald dark:hover:text-white disabled:opacity-50 transition-colors"
          aria-label="Upload document"
        >
          <UploadIcon className="h-6 w-6" />
        </button>
        <textarea
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Escriba su respuesta aquí..."
          className="flex-1 resize-none rounded-lg border border-stone dark:border-charcoal-light bg-paper-white dark:bg-charcoal-light p-2 focus:outline-none focus:ring-2 focus:ring-accent-emerald"
          rows={1}
          disabled={isLoading}
        />
        <button
          type="submit"
          disabled={isLoading || !userInput.trim()}
          className="p-2 bg-accent-emerald text-white rounded-full hover:opacity-90 disabled:opacity-50 transition-opacity"
          aria-label="Send message"
        >
          <SendIcon className="h-6 w-6" />
        </button>
      </form>
    </div>
  );
};

export default InputArea;