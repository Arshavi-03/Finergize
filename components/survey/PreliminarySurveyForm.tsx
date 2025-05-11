'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles } from 'lucide-react';
import { useSurvey, PreliminaryData } from '@/contexts/SurveyContext';
import { useUser } from '@/contexts/UserContext';

// Location options
const locationOptions = [
  "Delhi NCR",
  "Mumbai",
  "Bangalore",
  "Chennai",
  "Kolkata",
  "Hyderabad",
  "Pune",
  "Ahmedabad",
  "Jaipur",
  "Lucknow",
  "Other"
];

// Age group options
const ageGroupOptions = [
  "18-24",
  "25-34",
  "35-44",
  "45-54",
  "55+"
];

// Financial interest options
const interestOptions = [
  "General",
  "Savings",
  "Investments",
  "Loans",
  "Education",
  "Retirement"
];

// Literacy level options
const literacyLevelOptions = [
  { value: "beginner", label: "Beginner" },
  { value: "moderate", label: "Moderate" },
  { value: "advanced", label: "Advanced" }
];

const PreliminarySurveyForm: React.FC = () => {
  // Get context values
  const { 
    setPreliminaryData, 
    setPreliminarySurveyCompleted, 
    fetchSurveyQuestions,
    submitPreliminarySurvey,
    setShowSurvey,
    loading,
    error,
    setError
  } = useSurvey();
  
  const { user } = useUser();

  // Form state
  const [location, setLocation] = useState("Delhi NCR");
  const [ageGroup, setAgeGroup] = useState("25-34");
  const [interest, setInterest] = useState("General");
  const [literacyLevel, setLiteracyLevel] = useState("moderate");
  const [formVisible, setFormVisible] = useState(true);
  const [localError, setLocalError] = useState<string | null>(null);

  // Handle form submission
  const handleSubmit = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    setLocalError(null);
    setError(null);
    
    try {
      // Create preliminary data object
      const preliminaryData: PreliminaryData = {
        location,
        age: ageGroup,
        interest,
        literacy_level: literacyLevel
      };
      
      console.log("Submitting preliminary data:", preliminaryData);
      
      // Save to API
      const success = await submitPreliminarySurvey(preliminaryData);
      
      if (!success) {
        throw new Error("Failed to save preliminary data");
      }
      
      // Update context
      setPreliminaryData(preliminaryData);
      setPreliminarySurveyCompleted(true);
      
      // Fetch survey questions based on preliminary data
      await fetchSurveyQuestions(preliminaryData);
      
      // Close the preliminary form
      setFormVisible(false);
      
      // Show the main survey after a short delay
      setTimeout(() => {
        setShowSurvey(true);
      }, 300);
      
    } catch (error) {
      console.error("Error completing preliminary survey:", error);
      setLocalError("Failed to get personalized survey. Please try again.");
    }
  };

  // Handle closing the form
  const handleClose = () => {
    setFormVisible(false);
    setPreliminarySurveyCompleted(true);
  };

  // Hide the component if it's not visible
  if (!formVisible) {
    return null;
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
          className="relative max-w-md w-full mx-4 md:mx-auto bg-gray-900 rounded-xl border border-gray-800 overflow-hidden"
        >
          {/* Background effects */}
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
          
          {/* Content */}
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
                  {user?.name ? `Welcome, ${user.name}` : 'Welcome to Finergize'}
                </h2>
                <motion.div
                  animate={{ rotate: [0, -10, 10, 0] }}
                  transition={{ duration: 5, repeat: Infinity, delay: 0.5 }}
                >
                  <Sparkles className="w-6 h-6 text-purple-400 ml-2" />
                </motion.div>
              </div>
              <p className="text-gray-400 text-sm">
                Let&apos;s personalize your financial journey
              </p>
            </div>

            {/* Form */}
            <form className="space-y-4">
              {/* Location field */}
              <div className="space-y-2">
                <label htmlFor="location" className="block text-sm font-medium text-gray-300">
                  Location:
                </label>
                <select
                  id="location"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full p-2 rounded-md bg-gray-800 border border-gray-700 text-white cursor-pointer"
                >
                  {locationOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>

              {/* Age Group field */}
              <div className="space-y-2">
                <label htmlFor="ageGroup" className="block text-sm font-medium text-gray-300">
                  Age Group:
                </label>
                <select
                  id="ageGroup"
                  value={ageGroup}
                  onChange={(e) => setAgeGroup(e.target.value)}
                  className="w-full p-2 rounded-md bg-gray-800 border border-gray-700 text-white cursor-pointer"
                >
                  {ageGroupOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>

              {/* Financial Interest field */}
              <div className="space-y-2">
                <label htmlFor="interest" className="block text-sm font-medium text-gray-300">
                  Main Financial Interest:
                </label>
                <select
                  id="interest"
                  value={interest}
                  onChange={(e) => setInterest(e.target.value)}
                  className="w-full p-2 rounded-md bg-gray-800 border border-gray-700 text-white cursor-pointer"
                >
                  {interestOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>

              {/* Literacy Level field */}
              <div className="space-y-2">
                <label htmlFor="literacyLevel" className="block text-sm font-medium text-gray-300">
                  Financial Literacy Level:
                </label>
                <select
                  id="literacyLevel"
                  value={literacyLevel}
                  onChange={(e) => setLiteracyLevel(e.target.value)}
                  className="w-full p-2 rounded-md bg-gray-800 border border-gray-700 text-white cursor-pointer"
                >
                  {literacyLevelOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </form>

            {/* Error message */}
            {(localError || error) && (
              <div className="bg-red-900/50 border border-red-700 text-red-200 p-3 rounded-md text-sm">
                {localError || error}
              </div>
            )}

            {/* Submit button */}
            <div className="flex justify-between">
              <button
                onClick={handleClose}
                className="text-gray-500 hover:text-gray-300 px-4 py-2 rounded-md"
                type="button"
              >
                Skip
              </button>
              
              <button 
                onClick={handleSubmit}
                disabled={loading}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-4 py-2 rounded-md flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                type="button"
              >
                {loading ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Loading...
                  </span>
                ) : (
                  <span className="flex items-center">
                    Start Survey
                    <Sparkles className="ml-2 h-4 w-4" />
                  </span>
                )}
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default PreliminarySurveyForm;