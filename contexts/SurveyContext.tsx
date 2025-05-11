'use client';

import React, { createContext, useState, useContext, useEffect } from 'react';
import { useUser } from '@/contexts/UserContext';

// Define types for the survey responses
export interface SurveyResponses {
  financial_goals?: string[];
  income_range?: string;
  financial_knowledge?: string;
  banking_habits?: string;
  savings_method?: string[];
  loan_needs?: string;
  digital_comfort?: string;
  tracking_interest?: number;
  [key: string]: string | string[] | number | undefined;
}

// Define types for preliminary data
export interface PreliminaryData {
  location: string;
  age: string;
  interest: string;
  literacy_level: string;
}

// Define types for the survey question
export interface SurveyQuestionOption {
  id: string;
  text: string;
  icon?: string;
}

export interface SurveyQuestion {
  id: string;
  question: string;
  simplified_question?: string;
  type: 'single-choice' | 'multiple-choice' | 'slider';
  options?: SurveyQuestionOption[];
  min?: number;
  max?: number;
  labels?: Record<string, string>;
  allowMultiple?: boolean;
  help_text?: string;
}

// Define types for the feature recommendation
export interface FeatureRecommendation {
  id: string;
  name: string;
  score: number;
  explanation: string;
  tip: string;
}

export interface RecommendationResult {
  prioritized_features: FeatureRecommendation[];
  user_profile: {
    knowledge_level: string;
    income_level: string;
  };
}

interface SurveyContextProps {
  // Survey state
  showSurvey: boolean;
  setShowSurvey: (show: boolean) => void;
  surveyResponses: SurveyResponses;
  setSurveyResponses: (responses: SurveyResponses) => void;
  
  // Preliminary survey state
  preliminaryData: PreliminaryData | null;
  setPreliminaryData: (data: PreliminaryData) => void;
  preliminarySurveyCompleted: boolean;
  setPreliminarySurveyCompleted: (completed: boolean) => void;
  
  // Survey questions
  surveyQuestions: SurveyQuestion[];
  setSurveyQuestions: (questions: SurveyQuestion[]) => void;
  
  // Recommendations
  recommendations: RecommendationResult | null;
  setRecommendations: (recs: RecommendationResult | null) => void;
  surveyCompleted: boolean;
  setSurveyCompleted: (completed: boolean) => void;
  
  // API functions
  fetchSurveyQuestions: (preliminaryData: PreliminaryData) => Promise<SurveyQuestion[]>;
  submitSurvey: () => Promise<RecommendationResult | null>;
  submitPreliminarySurvey: (data: PreliminaryData) => Promise<boolean>;
  checkSurveyStatus: () => Promise<void>;
  error: string | null;
  setError: (error: string | null) => void;
  loading: boolean;
}

const SurveyContext = createContext<SurveyContextProps | undefined>(undefined);

// Default preliminary data
const defaultPreliminaryData: PreliminaryData = {
  location: "Delhi NCR",
  age: "25-34",
  interest: "General",
  literacy_level: "moderate"
};

// Fallback survey questions for development/offline mode
import { surveyQuestions as fallbackQuestions } from '@/data/fallbackSurveyQuestions';

export const SurveyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Get user context
  const { user, isAuthenticated } = useUser();
  
  // Survey state
  const [showSurvey, setShowSurvey] = useState(false);
  const [surveyResponses, setSurveyResponses] = useState<SurveyResponses>({});
  
  // Preliminary survey state
  const [preliminaryData, setPreliminaryData] = useState<PreliminaryData | null>(null);
  const [preliminarySurveyCompleted, setPreliminarySurveyCompleted] = useState(false);
  
  // Survey questions
  const [surveyQuestions, setSurveyQuestions] = useState<SurveyQuestion[]>([]);
  
  // Recommendations
  const [recommendations, setRecommendations] = useState<RecommendationResult | null>(null);
  const [surveyCompleted, setSurveyCompleted] = useState(false);
  
  // Error and loading state
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Initialize by checking survey status from the server when user logs in
  useEffect(() => {
    if (isAuthenticated && user) {
      checkSurveyStatus();
    } else {
      // Reset survey state when user logs out
      resetSurveyState();
    }
  }, [isAuthenticated, user]);

  // Reset survey state
  const resetSurveyState = () => {
    setPreliminaryData(defaultPreliminaryData);
    setPreliminarySurveyCompleted(false);
    setSurveyResponses({});
    setSurveyQuestions([]);
    setRecommendations(null);
    setSurveyCompleted(false);
  };

  // Check survey status from API
  const checkSurveyStatus = async () => {
    if (!isAuthenticated) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/survey/status');
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || 'Failed to fetch survey status');
      }
      
      const { survey_status } = data;
      
      // Update context state with server data
      setPreliminarySurveyCompleted(survey_status.preliminary_completed);
      setSurveyCompleted(survey_status.survey_completed);
      
      if (survey_status.preliminary_data) {
        setPreliminaryData(survey_status.preliminary_data);
      }
      
      if (survey_status.responses_object) {
        setSurveyResponses(survey_status.responses_object);
      }
      
      if (survey_status.recommendations) {
        setRecommendations(survey_status.recommendations);
      }
      
      // If user hasn't completed preliminary survey, show it
      if (!survey_status.preliminary_completed && !survey_status.survey_completed) {
        setTimeout(() => {
          setShowSurvey(true);
        }, 1500);
      }
      
    } catch (error) {
      console.error('Error checking survey status:', error);
      setError('Failed to check survey status. Please refresh the page.');
    } finally {
      setLoading(false);
    }
  };

  // Submit preliminary survey to API
  const submitPreliminarySurvey = async (data: PreliminaryData): Promise<boolean> => {
    if (!isAuthenticated) return false;
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/survey/preliminary', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      
      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to save preliminary survey');
      }
      
      setPreliminaryData(data);
      setPreliminarySurveyCompleted(true);
      
      return true;
    } catch (error) {
      console.error('Error submitting preliminary survey:', error);
      setError('Failed to save preliminary survey. Please try again.');
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Function to fetch survey questions from API
  const fetchSurveyQuestions = async (data: PreliminaryData): Promise<SurveyQuestion[]> => {
    if (!isAuthenticated) return [];
    
    setLoading(true);
    setError(null);
    
    try {
      // First ensure preliminary data is saved
      await submitPreliminarySurvey(data);
      
      // Then fetch questions
      const response = await fetch('/api/survey/questions');
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      
      const result = await response.json();
      
      if (!result.success || !Array.isArray(result.survey)) {
        throw new Error(result.error || 'Invalid survey questions format');
      }
      
      console.log("Fetched survey questions:", result.survey);
      setSurveyQuestions(result.survey);
      return result.survey;
    } catch (error) {
      console.error("Error fetching survey questions:", error);
      
      // Fallback to static questions in development/offline mode
      if (process.env.NODE_ENV === 'development') {
        console.log("Using fallback survey questions for development");
        setSurveyQuestions(fallbackQuestions);
        return fallbackQuestions;
      }
      
      setError('Failed to load survey questions. Please try again.');
      return [];
    } finally {
      setLoading(false);
    }
  };

  // Function to submit survey and get recommendations
  const submitSurvey = async (): Promise<RecommendationResult | null> => {
    if (!isAuthenticated) return null;
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/survey/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ responses: surveyResponses }),
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();
      
      if (!data.success || !data.recommendations) {
        throw new Error(data.error || 'Invalid response format');
      }
      
      const result = data.recommendations as RecommendationResult;
      
      // Update state
      setRecommendations(result);
      setSurveyCompleted(true);
      
      return result;
    } catch (error) {
      console.error('Error submitting survey:', error);
      
      // In development/offline mode, provide mock recommendations
      if (process.env.NODE_ENV === 'development') {
        const mockResult: RecommendationResult = {
          prioritized_features: [
            {
              id: "digital_banking",
              name: "Digital Banking",
              score: 9,
              explanation: "Based on your comfort with mobile apps and banking habits, you would benefit greatly from our digital banking features.",
              tip: "Start with the mobile app for checking balances and simple transactions."
            },
            {
              id: "community_savings",
              name: "Community Savings Groups",
              score: 8,
              explanation: "Your interest in community-based savings aligns with our group savings feature.",
              tip: "Join an existing community savings group or create one with family members."
            },
            {
              id: "micro_loans",
              name: "Micro Loans",
              score: 7,
              explanation: "Based on your income range and potential loan needs, our micro loans feature would be beneficial.",
              tip: "Start with a small loan to build your credit history."
            },
            {
              id: "financial_education",
              name: "Financial Education",
              score: 8,
              explanation: "Your self-assessment as a basic-level financial user suggests educational content would be valuable.",
              tip: "Check out our weekly financial literacy modules to increase your knowledge."
            },
            {
              id: "analytics_profile",
              name: "Spending Analytics",
              score: 6,
              explanation: "Your interest in tracking expenditures matches well with our analytics tools.",
              tip: "Enable spending categories to get better insights into your money habits."
            },
            {
              id: "mutual_funds",
              name: "Investment Options",
              score: 5,
              explanation: "While not an immediate priority based on your goals, our investment features offer future growth potential.",
              tip: "Start with small systematic investments once you've built an emergency fund."
            }
          ],
          user_profile: {
            knowledge_level: "basic",
            income_level: "medium_low"
          }
        };
        
        setRecommendations(mockResult);
        setSurveyCompleted(true);
        return mockResult;
      }
      
      setError('Failed to submit survey. Please try again.');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const value = {
    showSurvey,
    setShowSurvey,
    surveyResponses,
    setSurveyResponses,
    preliminaryData,
    setPreliminaryData,
    preliminarySurveyCompleted,
    setPreliminarySurveyCompleted,
    surveyQuestions,
    setSurveyQuestions,
    recommendations,
    setRecommendations,
    surveyCompleted,
    setSurveyCompleted,
    fetchSurveyQuestions,
    submitSurvey,
    submitPreliminarySurvey,
    checkSurveyStatus,
    error,
    setError,
    loading
  };

  return <SurveyContext.Provider value={value}>{children}</SurveyContext.Provider>;
};

export const useSurvey = (): SurveyContextProps => {
  const context = useContext(SurveyContext);
  if (context === undefined) {
    throw new Error('useSurvey must be used within a SurveyProvider');
  }
  return context;
};