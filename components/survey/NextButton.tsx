'use client';

import React from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';

interface NextButtonProps {
  onClick: (e: React.MouseEvent) => void;
  isLastQuestion: boolean;
  loading: boolean;
  className?: string;
}

/**
 * Dedicated component for the Next button to ensure consistent behavior
 * This focuses solely on fixing the button behavior issue
 */
const NextButton: React.FC<NextButtonProps> = ({ 
  onClick, 
  isLastQuestion, 
  loading,
  className = ''
}) => {
  // Handle the click with extra safeguards
  const handleClick = (e: React.MouseEvent) => {
    // Prevent any default behavior
    e.preventDefault();
    e.stopPropagation();
    
    console.log('NextButton: Click handled');
    
    // Call the passed onClick handler
    onClick(e);
  };

  return (
    <button 
      onClick={handleClick}
      disabled={loading}
      className={`bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-4 py-2 rounded-md flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
      type="button"
    >
      {isLastQuestion ? (
        <span className="flex items-center">
          {loading ? 'Processing...' : 'Get Recommendations'}
          {!loading && <Sparkles className="ml-2 h-4 w-4" />}
        </span>
      ) : (
        <span className="flex items-center">
          Next
          <ArrowRight className="ml-2 h-4 w-4" />
        </span>
      )}
    </button>
  );
};

export default NextButton;