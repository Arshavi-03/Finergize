'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Check } from 'lucide-react';
import { useSurvey } from '@/contexts/SurveyContext';
import { useUser } from '@/contexts/UserContext';
import { usePathname, useRouter } from 'next/navigation';

/**
 * A floating action button to trigger the survey
 */
const SurveyButton: React.FC = () => {
  const { 
    setShowSurvey, 
    surveyCompleted, 
    preliminarySurveyCompleted,
    loading 
  } = useSurvey();
  
  const { isAuthenticated } = useUser();
  const pathname = usePathname();
  const router = useRouter();
  
  // Don't show button on the survey page itself
  if (pathname === '/survey') {
    return null;
  }

  // Don't show if not authenticated
  if (!isAuthenticated) {
    return null;
  }
  
  // Show loading indicator
  if (loading) {
    return (
      <motion.button
        className="w-12 h-12 rounded-full bg-gray-700 text-white flex items-center justify-center"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        whileHover={{ scale: 1.1 }}
      >
        <div className="animate-spin w-5 h-5 border-2 border-t-blue-500 border-r-transparent border-b-purple-500 border-l-transparent rounded-full" />
      </motion.button>
    );
  }
  
  // Show completed button
  if (surveyCompleted) {
    return (
      <motion.button
        className="w-12 h-12 rounded-full bg-gradient-to-r from-green-500 to-emerald-600 text-white flex items-center justify-center shadow-lg shadow-green-500/20"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        whileHover={{ scale: 1.1 }}
        title="Survey completed"
      >
        <Check className="w-6 h-6" />
      </motion.button>
    );
  }
  
  // Handle click based on survey state
  const handleClick = () => {
    if (preliminarySurveyCompleted) {
      // If they completed preliminary survey, just show the main survey
      setShowSurvey(true);
    } else {
      // Otherwise navigate to dedicated survey page with return path
      router.push(`/survey?returnTo=${encodeURIComponent(pathname || '/')}`);
    }
  };
  
  // Show standard button to open survey
  return (
    <motion.button
      onClick={handleClick}
      className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 text-white flex items-center justify-center shadow-lg shadow-blue-500/20"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      title={preliminarySurveyCompleted ? "Continue your survey" : "Start your survey"}
    >
      <Sparkles className="w-6 h-6" />
    </motion.button>
  );
};

export default SurveyButton;