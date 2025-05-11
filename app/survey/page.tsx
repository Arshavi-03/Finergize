'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowLeft, Sparkles, Check } from 'lucide-react';
import { useSurvey } from '@/contexts/SurveyContext';
import PreliminarySurveyForm from '@/components/survey/PreliminarySurveyForm';
import SurveyModal from '@/components/survey/SurveyModal';
import Link from 'next/link';
import { useUser } from '@/contexts/UserContext';

export default function SurveyPage() {
  const searchParams = useSearchParams();
  const returnTo = searchParams.get('returnTo'); // Get return URL if provided
  
  const { 
    surveyCompleted, 
    preliminarySurveyCompleted, 
    setShowSurvey,
    checkSurveyStatus,
    loading 
  } = useSurvey();
  
  const { isAuthenticated, user } = useUser();
  const router = useRouter();
  const [initialized, setInitialized] = useState(false);
  
  // Check survey status when page loads
  useEffect(() => {
    const initializeSurvey = async () => {
      if (isAuthenticated) {
        try {
          await checkSurveyStatus();
          // Always show survey on this page
          setShowSurvey(true);
        } catch (error) {
          console.error('Error checking survey status:', error);
        } finally {
          setInitialized(true);
        }
      } else {
        setInitialized(true);
      }
    };
    
    initializeSurvey();
  }, [isAuthenticated, checkSurveyStatus, setShowSurvey]);
  
  // Redirect after survey is completed
  useEffect(() => {
    if (surveyCompleted && !loading && initialized) {
      // Short delay before redirect
      const timer = setTimeout(() => {
        if (returnTo) {
          // Redirect to the originally requested feature
          router.push(decodeURIComponent(returnTo));
        } else {
          // Default redirect
          router.push('/banking');
        }
      }, 2000);
      
      return () => clearTimeout(timer);
    }
  }, [surveyCompleted, loading, initialized, router, returnTo]);
  
  // Show loading state
  if (loading || !initialized) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-12 h-12 border-4 border-t-blue-500 border-r-transparent border-b-purple-500 border-l-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-white">Loading survey...</p>
        </div>
      </div>
    );
  }
  
  // Show unauthorized message if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md p-6 bg-gray-800 rounded-lg">
          <h2 className="text-2xl font-bold text-white mb-4">Authentication Required</h2>
          <p className="text-gray-300 mb-6">You need to log in to access this survey.</p>
          <Link 
            href={`/login?callbackUrl=${encodeURIComponent(returnTo ? `/survey?returnTo=${returnTo}` : '/survey')}`}
            className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-md"
          >
            Go to Login
          </Link>
        </div>
      </div>
    );
  }
  
  // Show survey complete state with redirect message
  if (surveyCompleted) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="max-w-lg w-full p-8 bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700/50 text-center">
          <div className="mb-6 mx-auto w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center">
            <Check className="w-10 h-10 text-green-400" />
          </div>
          
          <h1 className="text-3xl font-bold text-white mb-4">Survey Completed!</h1>
          
          <p className="text-gray-300 mb-4">
            Thank you for completing your financial survey. Your personalized recommendations are ready!
          </p>
          
          <p className="text-blue-300 mb-8">
            Redirecting you to {returnTo ? 'your requested feature' : 'the dashboard'}...
          </p>
          
          <Link 
            href={returnTo ? decodeURIComponent(returnTo) : '/banking'}
            className="inline-block px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-full text-white font-medium transition-all duration-300"
          >
            <span className="flex items-center justify-center">
              Continue Now
              <Sparkles className="ml-2 h-4 w-4" />
            </span>
          </Link>
        </div>
      </div>
    );
  }
  
  // Show preliminary survey if not completed
  if (!preliminarySurveyCompleted) {
    return (
      <div className="min-h-screen flex items-center justify-center relative">
        <Link
          href="/"
          className="absolute top-4 left-4 flex items-center text-gray-400 hover:text-white"
        >
          <ArrowLeft className="mr-2" />
          Back to Home
        </Link>
        
        <div className="w-full max-w-md">
          <PreliminarySurveyForm />
        </div>
      </div>
    );
  }
  
  // Show main survey
  return (
    <div className="min-h-screen flex items-center justify-center relative">
      <Link
        href="/"
        className="absolute top-4 left-4 flex items-center text-gray-400 hover:text-white"
      >
        <ArrowLeft className="mr-2" />
        Back to Home
      </Link>
      
      <div className="w-full">
        <SurveyModal />
      </div>
    </div>
  );
}