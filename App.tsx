
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { ChatMessage, Phase } from './types';
import { getNextResponse } from './services/geminiService';
import ChatWindow from './components/ChatWindow';
import InputArea from './components/InputArea';
import PhaseBanner from './components/PhaseBanner';
import { BotIcon } from './components/icons';
import { marked } from 'marked';

const App: React.FC = () => {
    const [conversation, setConversation] = useState<ChatMessage[]>([]);
    const [currentPhase, setCurrentPhase] = useState<Phase>(Phase.WELCOME);
    const [analysisData, setAnalysisData] = useState<Record<string, any>>({});
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [userInput, setUserInput] = useState('');
    const [uploadedFiles, setUploadedFiles] = useState<string[]>([]);

    const isMounted = useRef(true);

    const addMessage = useCallback((sender: 'user' | 'ai', content: string) => {
        setConversation(prev => [...prev, { sender, content }]);
    }, []);

    const processAiResponse = useCallback(async (prompt: string, isInitialization: boolean = false) => {
        setIsLoading(true);
        try {
            const history = isInitialization ? [] : conversation;
            const res = await getNextResponse(prompt, history, currentPhase, analysisData, uploadedFiles);
            
            if (isMounted.current) {
                const htmlContent = marked.parse(res) as string;
                addMessage('ai', htmlContent);

                // Phase transition logic
                if (res.includes("FASE 1: Identidad y Propósito")) { setCurrentPhase(Phase.IDENTITY_PURPOSE); }
                else if (res.includes("FASE 2: Alcance y Responsabilidades")) { setCurrentPhase(Phase.SCOPE_RESPONSIBILITIES); }
                else if (res.includes("FASE 3: Procesos Organizacionales")) { setCurrentPhase(Phase.ORGANIZATIONAL_PROCESSES); }
                else if (res.includes("FASE 4: Tareas Fundamentales")) { setCurrentPhase(Phase.CORE_TASKS); }
                else if (res.includes("FASE 5: Estructura y Capacidades")) { setCurrentPhase(Phase.TEAM_STRUCTURE); }
                else if (res.includes("FASE 6: Indicadores y Resultados")) { setCurrentPhase(Phase.INDICATORS_RESULTS); }
                else if (res.includes("FASE 7: Relaciones y Stakeholders")) { setCurrentPhase(Phase.STAKEHOLDERS); }
                else if (res.includes("FASE 8: Transformación y Evolución")) { setCurrentPhase(Phase.TRANSFORMATION); }
                else if (res.includes("Hemos completado el análisis")) { setCurrentPhase(Phase.SUMMARY); }
            }
        } catch (error) {
            console.error("App.tsx: Error en processAiResponse:", error);
            if(isMounted.current) {
                addMessage('ai', "Lo siento, ha ocurrido un error. Por favor, inténtelo de nuevo.");
            }
        } finally {
            if (isMounted.current) {
                setIsLoading(false);
            }
        }
    }, [addMessage, conversation, currentPhase, analysisData, uploadedFiles]);

    useEffect(() => {
        isMounted.current = true;
        processAiResponse("Iniciar la conversación.", true);

        return () => {
            isMounted.current = false;
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleSendMessage = async (message: string) => {
        if (!message.trim()) {
            return;
        }
        addMessage('user', message);
        setUserInput('');
        await processAiResponse(message);
    };

    const handleFileUpload = (file: File) => {
        const fileName = file.name;
        setUploadedFiles(prev => [...prev, fileName]);
        const uploadMessage = `Archivo cargado: **${fileName}**. He tomado nota de su contenido para enriquecer nuestro análisis.`;
        addMessage('ai', uploadMessage);
    };
    
    return (
        <div className="flex h-screen w-screen flex-col font-sans text-charcoal dark:text-paper-white">
            <header className="flex items-center justify-between border-b border-stone dark:border-charcoal-light bg-white dark:bg-graphite p-4 shadow-sm">
                <div className="flex items-center gap-3">
                    <BotIcon className="h-8 w-8 text-slate-blue dark:text-white" />
                    <div>
                        <h1 className="text-2xl font-bold font-serif-elegant text-socratic-gold">Asistente Socrático</h1>
                        <p className="text-sm text-slate-blue dark:text-stone">Análisis y Documentación Organizacional</p>
                    </div>
                </div>
            </header>
            
            <div className="flex flex-1 overflow-hidden">
                <main className="flex-1 flex flex-col bg-paper-white dark:bg-graphite overflow-hidden">
                    <PhaseBanner currentPhase={currentPhase} />
                    <ChatWindow conversation={conversation} isLoading={isLoading} />
                    <InputArea
                        onSendMessage={handleSendMessage}
                        onFileUpload={handleFileUpload}
                        isLoading={isLoading}
                        userInput={userInput}
                        setUserInput={setUserInput}
                    />
                    {currentPhase === Phase.SUMMARY && (
                        <div className="p-4 text-center bg-socratic-gold/10 border-t border-socratic-gold/20">
                            <h3 className="font-semibold text-socratic-dark dark:text-socratic-gold">Análisis Completado</h3>
                            <p className="text-sm text-charcoal-light dark:text-stone">El proceso de análisis guiado ha finalizado. Puede revisar la conversación para ver el resumen completo.</p>
                        </div>
                    )}
                </main>
            </div>
            <footer className="p-2 text-center text-xs text-slate-blue dark:text-stone bg-paper-white dark:bg-graphite border-t border-stone dark:border-charcoal-light">
                Desarrollado por la Jefatura de Analítica Institucional - Dirección de Desarrollo Estratégico🎯 usando IA-Gen✨|Versión 1.0
            </footer>
        </div>
    );
};

export default App;