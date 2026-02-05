
import React from 'react';
import { Phase } from '../types';

interface PhaseTrackerProps {
  currentPhase: Phase;
}

const PHASES_CONFIG = [
  { id: Phase.WELCOME, title: "Bienvenida y Contexto" },
  { id: Phase.IDENTITY_PURPOSE, title: "1. Identidad y Propósito" },
  { id: Phase.SCOPE_RESPONSIBILITIES, title: "2. Alcance y Responsabilidades" },
  { id: Phase.ORGANIZATIONAL_PROCESSES, title: "3. Procesos Organizacionales" },
  { id: Phase.CORE_TASKS, title: "4. Tareas Fundamentales" },
  { id: Phase.TEAM_STRUCTURE, title: "5. Estructura y Capacidades" },
  { id: Phase.INDICATORS_RESULTS, title: "6. Indicadores y Resultados" },
  { id: Phase.STAKEHOLDERS, title: "7. Relaciones y Stakeholders" },
  { id: Phase.TRANSFORMATION, title: "8. Transformación y Evolución" },
  { id: Phase.SUMMARY, title: "Síntesis y Entregables" }
];

const CheckCircleIcon: React.FC<{className: string}> = ({className}) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" />
  </svg>
);


const PhaseTracker: React.FC<PhaseTrackerProps> = ({ currentPhase }) => {
  console.log(`PhaseTracker.tsx: Renderizando para la fase: ${currentPhase}`);
  const currentPhaseIndex = PHASES_CONFIG.findIndex(p => p.id === currentPhase);
  const visiblePhases = PHASES_CONFIG.slice(0, currentPhaseIndex + 1);

  return (
    <nav>
      <h2 className="text-lg font-semibold mb-4 text-socratic-dark dark:text-white">Fases del Análisis</h2>
      <ol className="space-y-4">
        {visiblePhases.map((phase, index) => {
          const isCompleted = index < currentPhaseIndex;
          const isCurrent = index === currentPhaseIndex;

          return (
            <li key={phase.id} className="flex items-start">
              <div className="flex flex-col items-center mr-4">
                {isCompleted ? (
                    <CheckCircleIcon className="h-6 w-6 text-socratic-medium-blue" />
                ) : (
                    <div className={`h-6 w-6 rounded-full flex items-center justify-center ${
                        isCurrent 
                        ? 'bg-socratic-medium-blue ring-4 ring-socratic-gold/50' 
                        : 'bg-socratic-medium-gray'
                    }`}>
                        {isCurrent && <div className="h-2 w-2 bg-white rounded-full"></div>}
                    </div>
                )}
                {index < visiblePhases.length - 1 && (
                    <div className={`w-0.5 h-8 mt-2 ${isCompleted ? 'bg-socratic-medium-blue' : 'bg-socratic-medium-gray'}`}></div>
                )}
              </div>
              <div className="pt-0.5">
                <p className={`font-medium ${isCurrent ? 'text-socratic-dark-blue dark:text-socratic-gold' : 'text-socratic-dark dark:text-socratic-light-blue'} ${isCompleted ? 'text-socratic-medium-gray dark:text-socratic-light-blue/70' : ''}`}>
                  {phase.title}
                </p>
              </div>
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default PhaseTracker;