'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useSurvey } from '@/contexts/SurveyContext';
import Link from 'next/link';

interface FeatureLinkHandlerProps {
  children: React.ReactNode;
  href: string;
  className?: string;
  onClick?: (e: React.MouseEvent) => void;
}

const FeatureLinkHandler: React.FC<FeatureLinkHandlerProps> = ({ 
  children, 
  href,
  className,
  onClick
}) => {
  // SIMPLIFIED VERSION - just navigate directly without any checks
  // We'll let the page handle authentication/survey requirements
  
  return (
    <Link 
      href={href}
      className={`cursor-pointer ${className || ''}`}
      onClick={onClick}
    >
      {children}
    </Link>
  );
};

export default FeatureLinkHandler;