'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

// Feature mapping for icons
const featureIcons: Record<string, JSX.Element> = {
  digital_banking: <span className="text-3xl">🏦</span>,
  community_savings: <span className="text-3xl">👥</span>,
  micro_loans: <span className="text-3xl">💰</span>,
  secure_transactions: <span className="text-3xl">🔒</span>,
  financial_education: <span className="text-3xl">📚</span>,
  analytics_profile: <span className="text-3xl">📊</span>,
  mutual_funds: <span className="text-3xl">📈</span>,
  investment_options: <span className="text-3xl">💼</span>
};

// Color mapping for each feature type
const featureColors: Record<string, string> = {
  digital_banking: "from-blue-500 to-blue-700",
  community_savings: "from-purple-500 to-purple-700",
  micro_loans: "from-green-500 to-green-700",
  secure_transactions: "from-red-500 to-red-700",
  financial_education: "from-cyan-500 to-cyan-700",
  analytics_profile: "from-orange-500 to-orange-700",
  mutual_funds: "from-indigo-500 to-indigo-700",
  investment_options: "from-pink-500 to-pink-700"
};

// Use a fallback gradient if feature color isn't defined
const getFeatureColor = (featureId: string): string => {
  return featureColors[featureId] || "from-blue-500 to-purple-700";
};

// Default icon if none is defined
const getFeatureIcon = (featureId: string): JSX.Element => {
  return featureIcons[featureId] || <span className="text-3xl">✨</span>;
};

interface FeatureCardProps {
  feature: {
    id: string;
    name: string;
    score: number;
    explanation: string;
    tip: string;
  };
  isHovered: boolean;
  onHover: (id: string | null) => void;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ feature, isHovered, onHover }) => {
  return (
    <motion.div
      className="h-full cursor-pointer"
      onHoverStart={() => onHover(feature.id)}
      onHoverEnd={() => onHover(null)}
      whileHover={{ scale: 1.03 }}
      transition={{ type: 'spring', stiffness: 300 }}
    >
      <div className="h-full rounded-xl border border-gray-800 bg-gray-900/50 backdrop-blur-sm overflow-hidden relative group">
        {/* Score indicator */}
        <div className="absolute top-3 right-3 bg-gray-800/70 rounded-full px-2 py-1 text-xs font-medium backdrop-blur-sm">
          <div className="flex items-center gap-1">
            <span className="text-yellow-400">★</span>
            <span className="text-gray-300">{feature.score}/10</span>
          </div>
        </div>
        
        {/* Card content */}
        <div className="p-6 h-full flex flex-col">
          {/* Icon section with gradient background */}
          <div className={`w-14 h-14 rounded-lg flex items-center justify-center bg-gradient-to-br ${getFeatureColor(feature.id)} mb-4 shadow-lg`}>
            {getFeatureIcon(feature.id)}
          </div>
          
          {/* Feature name */}
          <h3 className="text-xl font-semibold text-white mb-3 group-hover:text-blue-400 transition-colors">
            {feature.name}
          </h3>
          
          {/* Explanation */}
          <p className="text-gray-400 mb-4 text-sm flex-grow">
            {feature.explanation}
          </p>
          
          {/* Tip section */}
          <div className="bg-blue-900/20 rounded-lg p-3 border border-blue-800/30 mt-auto">
            <p className="text-blue-300 text-sm">
              <span className="font-semibold">Tip:</span> {feature.tip}
            </p>
          </div>
          
          {/* Action link */}
          <motion.div 
            className="mt-4 flex items-center text-blue-400 group-hover:text-blue-300 transition-colors"
            animate={isHovered ? { x: [0, 5, 0] } : {}}
            transition={{ duration: 1, repeat: isHovered ? Infinity : 0 }}
          >
            <span className="text-sm font-medium">Explore Feature</span>
            <ArrowRight className="ml-2 h-4 w-4" />
          </motion.div>
        </div>
        
        {/* Animated border effect on hover */}
        <motion.div 
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
          animate={isHovered ? { opacity: 1 } : { opacity: 0 }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-blue-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-blue-500" />
        </motion.div>
      </div>
    </motion.div>
  );
};

export default FeatureCard;