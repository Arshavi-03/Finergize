'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { useSurvey } from '@/contexts/SurveyContext';
import { useUser } from '@/contexts/UserContext';
import FeatureCard from './FeatureCard';
import Link from 'next/link';

// Map feature IDs to their corresponding app routes
const featureRoutes: Record<string, string> = {
  digital_banking: '/banking/dashboard',
  community_savings: '/savings/groups',
  micro_loans: '/loans/apply',
  financial_education: '/education/courses',
  analytics_profile: '/analytics/dashboard',
  mutual_funds: '/banking/investments',
  secure_transactions: '/security/overview'
};

const RecommendedSection: React.FC = () => {
  const { recommendations, surveyCompleted, loading, setShowSurvey } = useSurvey();
  const { isAuthenticated } = useUser();
  const [hoveredFeature, setHoveredFeature] = useState<string | null>(null);
  const [visible, setVisible] = useState(false);

  // Show section when recommendations are available
  useEffect(() => {
    if (surveyCompleted && recommendations) {
      setVisible(true);
    } else {
      setVisible(false);
    }
  }, [surveyCompleted, recommendations]);

  // If loading, show skeleton loader
  if (loading) {
    return (
      <section className="py-20 px-4 relative">
        <div className="container mx-auto">
          <div className="animate-pulse">
            <div className="h-10 bg-gray-800 rounded mb-6 w-64 mx-auto"></div>
            <div className="h-5 bg-gray-800 rounded mb-10 w-96 mx-auto"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-80 bg-gray-800 rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  // If user is not authenticated or survey not completed, show CTA section
  if (!isAuthenticated || !visible || !recommendations) {
    return (
      <section className="py-20 px-4 relative">
        <div className="absolute inset-0 bg-gradient-radial from-blue-900/10 via-purple-900/5 to-transparent opacity-70 pointer-events-none"></div>
        
        <div className="container mx-auto">
          <motion.div 
            className="relative text-center mb-16"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true, margin: "-100px" }}
          >
            <div className="relative">
              <div className="flex items-center justify-center gap-3 mb-4">
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 5, repeat: Infinity }}
                >
                  <Sparkles className="w-8 h-8 text-blue-400" />
                </motion.div>
                <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-blue-400 text-transparent bg-clip-text animate-gradient bg-300% py-2">
                  Personalize Your Experience
                </h2>
                <motion.div
                  animate={{ rotate: [0, -10, 10, 0] }}
                  transition={{ duration: 5, repeat: Infinity, delay: 0.5 }}
                >
                  <Sparkles className="w-8 h-8 text-purple-400" />
                </motion.div>
              </div>
              
              <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                {isAuthenticated 
                  ? "Complete a short survey to receive personalized financial feature recommendations tailored to your needs."
                  : "Sign up and complete a short survey to receive personalized financial feature recommendations tailored to your needs."}
              </p>
              
              {/* Button */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                viewport={{ once: true }}
                className="mt-8"
              >
                {isAuthenticated ? (
                  <button
                    onClick={() => setShowSurvey(true)}
                    className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-full text-white font-medium transition-all duration-300 hover:shadow-lg hover:shadow-blue-700/20"
                  >
                    <span className="flex items-center justify-center">
                      Take the Survey
                      <Sparkles className="ml-2 h-4 w-4" />
                    </span>
                  </button>
                ) : (
                  <Link 
                    href="/register" 
                    className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-full text-white font-medium transition-all duration-300 hover:shadow-lg hover:shadow-blue-700/20"
                  >
                    <span className="flex items-center justify-center">
                      Create Account to Start
                      <Sparkles className="ml-2 h-4 w-4" />
                    </span>
                  </Link>
                )}
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>
    );
  }

  // Get prioritized features and user profile
  const { prioritized_features, user_profile } = recommendations;

  return (
    <section className="py-20 px-4 relative">
      {/* Background effects */}
      <div className="absolute inset-0 bg-gradient-radial from-blue-900/10 via-purple-900/5 to-transparent opacity-70 pointer-events-none"></div>
      
      <div className="container mx-auto">
        {/* Heading */}
        <motion.div 
          className="relative text-center mb-16"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true, margin: "-100px" }}
        >
          <div className="relative">
            <div className="flex items-center justify-center gap-3 mb-4">
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 5, repeat: Infinity }}
              >
                <Sparkles className="w-8 h-8 text-blue-400" />
              </motion.div>
              <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-blue-400 text-transparent bg-clip-text animate-gradient bg-300% py-2">
                Your Personalized Features
              </h2>
              <motion.div
                animate={{ rotate: [0, -10, 10, 0] }}
                transition={{ duration: 5, repeat: Infinity, delay: 0.5 }}
              >
                <Sparkles className="w-8 h-8 text-purple-400" />
              </motion.div>
            </div>
            
            <p className="text-gray-400 text-lg">
              Recommended based on your financial profile
            </p>
            
            {/* User profile display */}
            {user_profile && (
              <div className="mt-6 inline-block px-6 py-3 bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700/50">
                <div className="flex gap-4 justify-center text-sm">
                  <span className="px-3 py-1 bg-blue-900/30 rounded-full text-blue-300 border border-blue-700/30">
                    {user_profile.knowledge_level === 'beginner' ? 'Beginner' : 
                     user_profile.knowledge_level === 'basic' ? 'Basic' : 
                     user_profile.knowledge_level === 'intermediate' ? 'Intermediate' : 
                     user_profile.knowledge_level === 'advanced' ? 'Advanced' : 
                     'Moderate'} Knowledge
                  </span>
                  <span className="px-3 py-1 bg-purple-900/30 rounded-full text-purple-300 border border-purple-700/30">
                    Income: {user_profile.income_level.replace(/_/g, ' ')}
                  </span>
                </div>
              </div>
            )}
            
            {/* Decorative line */}
            <div className="mt-4 relative h-1 max-w-xs mx-auto overflow-hidden">
              <motion.div 
                className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-500 to-transparent blur-sm"
                animate={{ x: ["-100%", "100%"] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              />
              <motion.div 
                className="absolute inset-0 bg-gradient-to-r from-transparent via-purple-500 to-transparent opacity-50"
                animate={{ x: ["100%", "-100%"] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              />
            </div>
          </div>
        </motion.div>

        {/* Features grid */}
        <AnimatePresence>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {prioritized_features.map((feature) => (
              <Link 
                href={featureRoutes[feature.id] || '/banking/dashboard'} 
                key={feature.id}
              >
                <FeatureCard
                  feature={feature}
                  isHovered={hoveredFeature === feature.id}
                  onHover={setHoveredFeature}
                />
              </Link>
            ))}
          </div>
        </AnimatePresence>
      </div>
    </section>
  );
};

export default RecommendedSection;