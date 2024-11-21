import React from 'react';
import { useMediaQuery } from 'react-responsive';
import type { AdPlacement } from '../types';

interface AdDisplayProps {
  placement: AdPlacement;
  className?: string;
}

export default function AdDisplay({ placement, className = '' }: AdDisplayProps) {
  const isMobile = useMediaQuery({ maxWidth: 768 });

  if (!placement.active) return null;

  return (
    <div 
      className={`ad-container ${className} ${
        isMobile ? 'my-4' : 'my-6'
      }`}
      dangerouslySetInnerHTML={{ __html: placement.adCode }}
    />
  );
}