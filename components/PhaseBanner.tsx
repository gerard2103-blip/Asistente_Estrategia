
import React from 'react';
import { Phase } from '../types';
import { PHASE_BANNER_CONTENT } from '../constants';

interface PhaseBannerProps {
  currentPhase: Phase;
}

const PhaseBanner: React.FC<PhaseBannerProps> = ({ currentPhase }) => {
  const { title, description } = PHASE_BANNER_CONTENT[currentPhase];
  const isWelcomePhase = currentPhase === Phase.WELCOME;

  const bannerClass = isWelcomePhase
    ? "bg-midnight-blue p-4 shadow-md text-white"
    : "bg-accent-emerald p-4 shadow-md text-white";

  return (
    <div className={bannerClass}>
      <h2 className="text-lg font-bold">{title}</h2>
      <p className="text-sm opacity-90 mt-1">{description}</p>
    </div>
  );
};

export default PhaseBanner;