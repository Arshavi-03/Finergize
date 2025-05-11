'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Info, Sparkles } from 'lucide-react';
import { useSurvey} from '@/contexts/SurveyContext';
import NextButton from './NextButton';

// Reusable UI components
import { Slider } from '@/components/survey/SurveyUIComponents';
import { Checkbox } from '@/components/survey/SurveyUIComponents';
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from '@/components/survey/SurveyUIComponents';

// Define option icon components for added visual appeal
const getOptionIcon = (optionId: string): JSX.Element => {
  // Map options to their respective icons
  const iconMap: Record<string, JSX.Element> = {
    save: <span className="text-xl">💰</span>,
    invest: <span className="text-xl">📈</span>,
    loan: <span className="text-xl">🏦</span>,
    education: <span className="text-xl">📚</span>,
    community: <span className="text-xl">👨‍👩‍👧‍👦</span>,
    track: <span className="text-xl">📊</span>,
    bank: <span className="text-xl">🏛️</span>,
    cash: <span className="text-xl">💵</span>,
    fd: <span className="text-xl">💼</span>,
    post: <span className="text-xl">✉️</span>,
    chit: <span className="text-xl">👥</span>,
    gold: <span className="text-xl">💍</span>,
    mutual_funds: <span className="text-xl">📊</span>,
    stocks: <span className="text-xl">📉</span>,
    no_savings: <span className="text-xl">❌</span>,
    current: <span className="text-xl">✅</span>,
    future: <span className="text-xl">🔜</span>,
    no: <span className="text-xl">❌</span>,
    very: <span className="text-xl">🚀</span>,
    somewhat: <span className="text-xl">👌</span>,
    limited: <span className="text-xl">🤔</span>,
    uncomfortable: <span className="text-xl">😟</span>,
    beginner: <span className="text-xl">🌱</span>,
    basic: <span className="text-xl">📖</span>,
    intermediate: <span className="text-xl">📊</span>,
    advanced: <span className="text-xl">🎓</span>,
    traditional: <span className="text-xl">🏛️</span>,
    atm: <span className="text-xl">💳</span>,
    net_banking: <span className="text-xl">💻</span>,
    mobile: <span className="text-xl">📱</span>,
    upi: <span className="text-xl">📲</span>,
    income_low: <span className="text-xl">💰</span>,
    income_medium_low: <span className="text-xl">💰💰</span>,
    income_medium: <span className="text-xl">💰💰💰</span>,
    income_medium_high: <span className="text-xl">💰💰💰💰</span>,
    income_high: <span className="text-xl">💰💰💰💰💰</span>,
  };

  return iconMap[optionId] || <span className="text-xl">✓</span>;
};

const SurveyModal: React.FC = () => {
  // Get context values
  const {
    showSurvey,
    setShowSurvey,
    surveyResponses,
    setSurveyResponses,
    surveyQuestions,
    submitSurvey,
    loading,
    preliminaryData
  } = useSurvey();
  
  // Component state
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [responses, setResponses] = useState<any>({});
  const [error, setError] = useState<string | null>(null);

  // Initialize with saved responses
  useEffect(() => {
    setResponses(surveyResponses);
  }, [surveyResponses]);
  
  // Reset question index when survey is shown
  useEffect(() => {
    if (showSurvey) {
      setCurrentQuestionIndex(0);
    }
  }, [showSurvey]);

  // Get current question and progress
  const currentQuestion = surveyQuestions[currentQuestionIndex];
  const progress = surveyQuestions.length > 0 
    ? ((currentQuestionIndex + 1) / surveyQuestions.length) * 100 
    : 0;

  // Handle single choice selection
  const handleSingleChoice = (questionId: string, value: string) => {
    setResponses((prev: any) => ({
      ...prev,
      [questionId]: value,
    }));
  };

  // Handle multiple choice selection
  const handleMultipleChoice = (questionId: string, value: string, checked: boolean) => {
    setResponses((prev: any) => {
      const currentValues = Array.isArray(prev[questionId]) ? prev[questionId] : [];
      
      if (checked) {
        return {
          ...prev,
          [questionId]: [...currentValues, value],
        };
      } else {
        return {
          ...prev,
          [questionId]: currentValues.filter((v: string) => v !== value),
        };
      }
    });
  };

  // Handle slider change
  const handleSliderChange = (questionId: string, value: number[]) => {
    setResponses((prev: any) => ({
      ...prev,
      [questionId]: value[0],
    }));
  };

  // Move to next question
  const handleNext = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    console.log("Next button clicked, current index:", currentQuestionIndex);
    setError(null);
    
    try {
      // For multiple choice questions, make sure we have an array (even if empty)
      if (currentQuestion?.type === 'multiple-choice' && !responses[currentQuestion.id]) {
        setResponses((prev: any) => ({
          ...prev,
          [currentQuestion.id]: []
        }));
      }
      
      // Save responses to context
      const updatedResponses = {...responses};
      setSurveyResponses(updatedResponses);
      
      if (currentQuestionIndex < surveyQuestions.length - 1) {
        // Move to next question
        setCurrentQuestionIndex(currentQuestionIndex + 1);
      } else {
        // Submit final responses
        const result = await submitSurvey();
        
        if (result) {
          console.log("Survey completed successfully:", result);
          setShowSurvey(false);
        } else {
          setError("Failed to submit survey. Please try again.");
        }
      }
    } catch (error) {
      console.error('Error in handleNext:', error);
      setError("An unexpected error occurred. Please try again.");
    }
  };

  // Move to previous question
  const handlePrevious = (e: React.MouseEvent) => {
    e.preventDefault();
    
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  // Close modal
  const handleClose = () => {
    setShowSurvey(false);
  };

  // If survey isn't visible, don't render anything
  if (!showSurvey) {
    return null;
  }

  // If no questions are loaded, show loading or error state
  if (surveyQuestions.length === 0) {
    return (
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center"
        >
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ type: 'spring', damping: 25 }}
            className="relative max-w-md w-full mx-4 md:mx-auto bg-gray-900 rounded-xl border border-gray-800 overflow-hidden p-6 text-center"
          >
            {loading ? (
              <div className="py-8">
                <div className="animate-spin w-12 h-12 border-4 border-t-blue-500 border-r-transparent border-b-purple-500 border-l-transparent rounded-full mx-auto mb-4"></div>
                <p className="text-white">Loading your personalized survey...</p>
              </div>
            ) : (
              <div className="py-8">
                <div className="text-red-500 mb-4 text-4xl">⚠️</div>
                <h3 className="text-xl font-bold text-white mb-2">No survey questions available</h3>
                <p className="text-gray-400 mb-4">We couldn't load your survey questions. Please try again later.</p>
                <button
                  onClick={handleClose}
                  className="bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-md"
                >
                  Close
                </button>
              </div>
            )}
          </motion.div>
        </motion.div>
      </AnimatePresence>
    );
  }
  
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center"
      >
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ type: 'spring', damping: 25 }}
          className="relative max-w-2xl w-full mx-4 md:mx-auto overflow-hidden"
        >
          {/* Survey Card */}
          <div className="border border-gray-800 bg-gradient-to-b from-gray-900 to-black rounded-xl relative overflow-hidden">
            {/* Background aurora effects */}
            <div className="absolute -top-20 -left-20 w-60 h-60 bg-blue-500/10 rounded-full blur-3xl"></div>
            <div className="absolute -bottom-20 -right-20 w-60 h-60 bg-purple-500/10 rounded-full blur-3xl"></div>
            
            {/* Close button */}
            <button 
              onClick={handleClose}
              className="absolute top-2 right-2 p-1 rounded-full bg-gray-800/50 text-gray-400 hover:text-white hover:bg-gray-700/50 transition z-10"
              aria-label="Close survey"
              type="button"
            >
              <X size={18} />
            </button>

            <div className="p-6 space-y-6">
              {/* Header */}
              <div className="text-center space-y-2">
                <div className="flex items-center justify-center">
                  <motion.div
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ duration: 5, repeat: Infinity }}
                  >
                    <Sparkles className="w-6 h-6 text-blue-400 mr-2" />
                  </motion.div>
                  <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-blue-400">
                    Personalize Your Experience
                  </h2>
                  <motion.div
                    animate={{ rotate: [0, -10, 10, 0] }}
                    transition={{ duration: 5, repeat: Infinity, delay: 0.5 }}
                  >
                    <Sparkles className="w-6 h-6 text-purple-400 ml-2" />
                  </motion.div>
                </div>
                <p className="text-gray-400 text-sm">
                  Help us tailor Finergize to your financial needs
                </p>
              </div>

              {/* Progress bar */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs text-gray-500">
                  <span>Question {currentQuestionIndex + 1} of {surveyQuestions.length}</span>
                  <span>{Math.round(progress)}% Complete</span>
                </div>
                <div className="h-1 w-full bg-gray-800 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
              </div>

              {/* Question */}
              <motion.div 
                key={`question-${currentQuestionIndex}`}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-4"
              >
                <div className="flex justify-between items-start">
                  <h3 className="text-xl font-medium text-white">
                    {/* Show simplified question if available for low literacy users */}
                    {preliminaryData?.literacy_level === 'beginner' && currentQuestion?.simplified_question
                      ? currentQuestion.simplified_question
                      : currentQuestion?.question}
                  </h3>
                  
                  {/* Help tooltip */}
                  {currentQuestion?.help_text && (
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <button 
                            className="text-gray-400 hover:text-blue-400 transition"
                            aria-label="Show help text"
                            title="Show help information"
                            type="button"
                          >
                            <Info size={18} />
                          </button>
                        </TooltipTrigger>
                        <TooltipContent className="bg-gray-800 border-gray-700 text-gray-200">
                          <p>{currentQuestion.help_text}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  )}
                </div>

                {/* Question content based on type */}
                {currentQuestion?.type === 'single-choice' && currentQuestion.options && (
                  <div className="space-y-2">
                    {currentQuestion.options.map((option) => (
                      <div
                        key={option.id}
                        className={`flex items-center space-x-2 p-3 rounded-lg border ${
                          responses[currentQuestion.id] === option.id
                            ? 'border-blue-600 bg-blue-900/20'
                            : 'border-gray-800 bg-gray-900/50 hover:border-gray-700'
                        } transition cursor-pointer`}
                        onClick={() => handleSingleChoice(currentQuestion.id, option.id)}
                      >
                        <div className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full border ${
                          responses[currentQuestion.id] === option.id
                            ? 'border-blue-500 bg-blue-500'
                            : 'border-gray-700 bg-transparent'
                        }`}>
                          {responses[currentQuestion.id] === option.id && (
                            <div className="h-2 w-2 rounded-full bg-white" />
                          )}
                        </div>
                        <div className="flex-1 flex items-center">
                          <div className="mr-3">
                            {option.icon ? 
                              <span className="text-xl">{option.icon}</span> : 
                              getOptionIcon(option.id)
                            }
                          </div>
                          <label
                            className="flex-1 text-gray-200 text-sm cursor-pointer"
                          >
                            {option.text}
                          </label>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {currentQuestion?.type === 'multiple-choice' && currentQuestion.options && (
                  <div className="space-y-2">
                    {currentQuestion.options.map((option) => {
                      const currentValues = Array.isArray(responses[currentQuestion.id]) 
                        ? responses[currentQuestion.id] 
                        : [];
                      const isChecked = Array.isArray(currentValues) 
                        ? currentValues.includes(option.id)
                        : false;

                      return (
                        <div
                          key={option.id}
                          className={`flex items-center space-x-2 p-3 rounded-lg border ${
                            isChecked
                              ? 'border-blue-600 bg-blue-900/20'
                              : 'border-gray-800 bg-gray-900/50 hover:border-gray-700'
                          } transition cursor-pointer`}
                          onClick={() => handleMultipleChoice(currentQuestion.id, option.id, !isChecked)}
                        >
                          <Checkbox
                            id={`${currentQuestion.id}-${option.id}`}
                            checked={isChecked}
                            onCheckedChange={(checked: boolean) =>
                              handleMultipleChoice(currentQuestion.id, option.id, checked)
                            }
                            className="text-blue-500"
                          />
                          <div className="flex-1 flex items-center">
                            <div className="mr-3">
                              {option.icon ? 
                                <span className="text-xl">{option.icon}</span> : 
                                getOptionIcon(option.id)
                              }
                            </div>
                            <label
                              htmlFor={`${currentQuestion.id}-${option.id}`}
                              className="flex-1 text-gray-200 text-sm cursor-pointer"
                            >
                              {option.text}
                            </label>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                {currentQuestion?.type === 'slider' && (
                  <div className="space-y-4 pt-4">
                    <Slider
                      defaultValue={[
                        responses[currentQuestion.id] as number || 
                        currentQuestion.min || 
                        3
                      ]}
                      min={currentQuestion.min}
                      max={currentQuestion.max}
                      step={1}
                      onValueChange={(value: number[]) => handleSliderChange(currentQuestion.id, value)}
                      className="w-full"
                    />
                    
                    {/* Slider labels */}
                    <div className="flex justify-between text-xs text-gray-400">
                      {currentQuestion.labels && 
                        Object.entries(currentQuestion.labels).map(([value, label]) => (
                          <div key={value} className="text-center">
                            <div>{label}</div>
                          </div>
                        ))
                      }
                    </div>
                    
                    {/* Current value display */}
                    <div className="text-center text-blue-400 font-medium">
                      Selected: {responses[currentQuestion.id] || currentQuestion.min || 3}
                    </div>
                  </div>
                )}
              </motion.div>

              {/* Error message */}
              {error && (
                <div className="bg-red-900/50 border border-red-700 text-red-200 p-3 rounded-md text-sm">
                  {error}
                </div>
              )}

              {/* Navigation buttons */}
              <div className="flex justify-between pt-4">
                <div>
                  {currentQuestionIndex > 0 ? (
                    <button
                      onClick={handlePrevious}
                      className="text-gray-400 hover:text-white border border-gray-800 px-4 py-2 rounded-md hover:bg-gray-800 hover:border-gray-700"
                      type="button"
                    >
                      Previous
                    </button>
                  ) : (
                    <button
                      onClick={handleClose}
                      className="text-gray-500 hover:text-gray-300 px-4 py-2 rounded-md"
                      type="button"
                    >
                      Skip Survey
                    </button>
                  )}
                </div>
                
                {/* Next Button - Using the dedicated component to fix the click issue */}
                <NextButton 
                  onClick={handleNext}
                  isLastQuestion={currentQuestionIndex === surveyQuestions.length - 1}
                  loading={loading}
                />
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default SurveyModal;