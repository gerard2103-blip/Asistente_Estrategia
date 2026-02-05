
import React, { useRef, useState, useEffect } from 'react';
import { SendIcon, UploadIcon, MicrophoneIcon } from './icons';

// TypeScript definitions for the Web Speech API
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

interface InputAreaProps {
  onSendMessage: (message: string) => void;
  onFileUpload: (file: File) => void;
  isLoading: boolean;
  userInput: string;
  setUserInput: (value: string) => void;
}

const InputArea: React.FC<InputAreaProps> = ({ onSendMessage, onFileUpload, isLoading, userInput, setUserInput }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isRecording, setIsRecording] = useState(false);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
    };
  }, []);


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

  const handleMicClick = () => {
    if (isRecording) {
      recognitionRef.current?.stop();
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Lo siento, la API de reconocimiento de voz no es compatible con este navegador.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognitionRef.current = recognition;
    recognition.lang = 'es-ES';
    recognition.continuous = false;
    recognition.interimResults = true;

    let latestTranscript = '';

    recognition.onresult = (event: any) => {
      let interimTranscript = '';
      let finalTranscript = '';
      for (let i = 0; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript;
        } else {
          interimTranscript += event.results[i][0].transcript;
        }
      }
      latestTranscript = finalTranscript + interimTranscript;
      setUserInput(latestTranscript);
    };

    recognition.onstart = () => {
      setIsRecording(true);
      setUserInput('');
    };

    recognition.onend = () => {
      setIsRecording(false);
      const transcriptToSend = latestTranscript.trim();
      if (transcriptToSend) {
        onSendMessage(transcriptToSend);
      }
      setUserInput('');
    };

    recognition.onerror = (event: any) => {
      console.error('Error en el reconocimiento de voz:', event.error);
      if (event.error === 'no-speech') {
        alert('No se detectó voz. Por favor, inténtelo de nuevo.');
      } else if (event.error === 'not-allowed') {
        alert('Permiso para acceder al micrófono denegado. Por favor, habilite el acceso en la configuración de su navegador.');
      } else {
        alert(`Ocurrió un error con el reconocimiento de voz: ${event.error}`);
      }
      setIsRecording(false);
    };

    recognition.start();
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
          disabled={isLoading || isRecording}
          className="p-2 text-slate-blue dark:text-stone hover:text-accent-emerald dark:hover:text-white disabled:opacity-50 transition-colors"
          aria-label="Upload document"
        >
          <UploadIcon className="h-6 w-6" />
        </button>
        <button
          type="button"
          onClick={handleMicClick}
          disabled={isLoading}
          className="p-2 text-slate-blue dark:text-stone hover:text-accent-emerald dark:hover:text-white disabled:opacity-50 transition-colors"
          aria-label={isRecording ? "Detener grabación" : "Iniciar grabación"}
        >
          <MicrophoneIcon className={`h-6 w-6 ${isRecording ? 'text-red-500 animate-pulse' : ''}`} />
        </button>
        <textarea
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder={isRecording ? "Escuchando..." : "Escriba su respuesta aquí..."}
          className="flex-1 resize-none rounded-lg border border-stone dark:border-charcoal-light bg-paper-white dark:bg-charcoal-light p-2 focus:outline-none focus:ring-2 focus:ring-accent-emerald"
          rows={1}
          disabled={isLoading || isRecording}
        />
        <button
          type="submit"
          disabled={isLoading || !userInput.trim() || isRecording}
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