'use client';

import React, { useState, useEffect } from 'react';
import { useSurvey } from '@/contexts/SurveyContext';
import { useUser } from '@/contexts/UserContext';
import { usePathname } from 'next/navigation';
import PreliminarySurveyForm from './PreliminarySurveyForm';
import SurveyModal from './SurveyModal';

const SurveyWrapper: React.FC = () => {
  const { 
    preliminarySurveyCompleted, 
    surveyCompleted,
    showSurvey,
    setShowSurvey,
    checkSurveyStatus,
    loading
  } = useSurvey();
  
  const { isAuthenticated, loading: userLoading } = useUser();
  const [initialized, setInitialized] = useState(false);
  const pathname = usePathname();

  // Don't show survey on the survey page (avoid duplication)
  const isSurveyPage = pathname === '/survey';
  
  // Check survey status when component mounts or user changes
  useEffect(() => {
    const loadSurveyStatus = async () => {
      if (isAuthenticated && !isSurveyPage) {
        try {
          await checkSurveyStatus();
        } catch (error) {
          console.error("Error checking survey status:", error);
        } finally {
          setInitialized(true);
        }
      } else if (!userLoading) {
        setInitialized(true);
      }
    };
    
    loadSurveyStatus();
  }, [isAuthenticated, checkSurveyStatus, userLoading, isSurveyPage]);
  
  // Don't render anything while loading
  if (!initialized || loading || userLoading || isSurveyPage) {
    return null;
  }

  // Don't render if survey isn't meant to be shown
  if (!showSurvey || !isAuthenticated) {
    return null;
  }

  // Render preliminary survey if needed
  if (!preliminarySurveyCompleted) {
    return <PreliminarySurveyForm />;
  }
  
  // Otherwise render main survey if not completed yet
  if (!surveyCompleted) {
    return <SurveyModal />;
  }

  // Don't render anything if survey is completed
  return null;
};

export default SurveyWrapper;