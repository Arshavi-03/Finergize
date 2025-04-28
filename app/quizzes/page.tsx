'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

// Define types for our quizzes
interface QuizCategory {
  id: string;
  title: string;
  description: string;
  icon: string;
  bgColor: string;
  quizCount: number;
}

// Sample quiz categories
const quizCategories: QuizCategory[] = [
  {
    id: 'savings',
    title: 'Savings & Budgeting',
    description: 'Test your knowledge on saving strategies, emergency funds, and budgeting techniques',
    icon: '💰',
    bgColor: 'from-blue-600 to-blue-900',
    quizCount: 3
  },
  {
    id: 'investing',
    title: 'Investing Fundamentals',
    description: 'Challenge yourself on stock markets, diversification, risk management, and more',
    icon: '📈',
    bgColor: 'from-green-600 to-green-900',
    quizCount: 4
  },
  {
    id: 'credit',
    title: 'Credit & Loans',
    description: 'Evaluate your understanding of credit scores, interest rates, and borrowing concepts',
    icon: '💳',
    bgColor: 'from-purple-600 to-purple-900',
    quizCount: 2
  },
  {
    id: 'retirement',
    title: 'Retirement Planning',
    description: 'Assess your knowledge on retirement accounts, pension plans, and long-term financial security',
    icon: '🏖️',
    bgColor: 'from-orange-600 to-orange-900',
    quizCount: 3
  },
];

export default function QuizPage() {
  const [userName, setUserName] = useState<string>("Learner");
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Fetch user info on component mount
  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        setIsLoading(true);
        
        // Fetch session directly
        const response = await fetch('/api/auth/session');
        if (!response.ok) {
          setUserName("Learner");
          return;
        }
        
        const session = await response.json();
        
        if (session && session.user && session.user.name) {
          setUserName(session.user.name);
        } else {
          setUserName("Learner");
        }
      } catch (error) {
        console.error("Error fetching session:", error);
        setUserName("Learner");
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchUserInfo();
  }, []);

  // Add animation for elements as they come into view
  useEffect(() => {
    const fadeInElements = document.querySelectorAll('.fade-in-element');
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('opacity-100');
          entry.target.classList.remove('opacity-0');
          entry.target.classList.add('translate-y-0');
          entry.target.classList.remove('translate-y-4');
        }
      });
    }, { threshold: 0.1 });
    
    fadeInElements.forEach(el => observer.observe(el));
    
    return () => {
      fadeInElements.forEach(el => observer.unobserve(el));
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 text-white">
      {/* Header */}
      <header className="relative py-16 overflow-hidden">
        <div className="absolute inset-0 z-0">
          {/* Animated elements */}
          <div className="absolute w-24 h-24 bg-blue-500 rounded-full opacity-20 top-10 left-1/4 animate-pulse" style={{animationDuration: '7s'}}></div>
          <div className="absolute w-32 h-32 bg-purple-500 rounded-full opacity-10 top-20 right-1/4 animate-pulse" style={{animationDuration: '5s'}}></div>
          
          {/* Pattern overlay */}
          <div className="absolute inset-0" style={{
            backgroundImage: `repeating-linear-gradient(45deg, rgba(255,255,255,0.03) 0, rgba(255,255,255,0.03) 1px, transparent 1px, transparent 20px)`,
            backgroundSize: '30px 30px'
          }}></div>
        </div>
        
        <div className="relative z-10 container mx-auto px-4 text-center">
          <Link href="/" className="inline-block mb-8 text-blue-300 hover:text-blue-200 transition-colors">
            <div className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
              </svg>
              Back to Learning Center
            </div>
          </Link>
          
          <h1 className="text-5xl md:text-6xl font-extrabold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
            Financial Knowledge Quiz
          </h1>
          <p className="text-xl md:text-2xl text-blue-200 max-w-3xl mx-auto mb-6">
            Test your understanding and earn badges as you learn
          </p>
          
          <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto rounded-full mb-12"></div>
          
          <div className="inline-block bg-gray-800 bg-opacity-70 px-6 py-4 rounded-lg border border-blue-800 text-center mb-12">
            <h2 className="text-2xl font-bold text-white">
              Welcome, {isLoading ? "..." : userName}!
            </h2>
            <p className="text-blue-300 mt-2">
              Ready to test your financial knowledge?
            </p>
          </div>
        </div>
      </header>
      
      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Quiz Instructions */}
        <section className="max-w-4xl mx-auto mb-16 fade-in-element opacity-0 translate-y-4 transition-all duration-700">
          <div className="bg-gray-800 bg-opacity-50 rounded-xl p-8 border border-gray-700">
            <div className="flex flex-col md:flex-row items-center mb-6">
              <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center mb-4 md:mb-0 md:mr-6 flex-shrink-0">
                <span className="text-4xl">🎓</span>
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white">How Quizzes Work</h3>
                <p className="text-gray-300 mt-2">Complete quizzes to test your knowledge and earn badges that showcase your financial expertise</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">
              <div className="bg-gray-700 bg-opacity-50 p-5 rounded-lg border border-gray-600">
                <div className="flex items-center mb-3">
                  <span className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center mr-3 text-lg font-bold">1</span>
                  <h4 className="font-semibold text-blue-300">Choose a Topic</h4>
                </div>
                <p className="text-sm text-gray-300">Select from our range of financial quiz categories based on your interests</p>
              </div>
              
              <div className="bg-gray-700 bg-opacity-50 p-5 rounded-lg border border-gray-600">
                <div className="flex items-center mb-3">
                  <span className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center mr-3 text-lg font-bold">2</span>
                  <h4 className="font-semibold text-blue-300">Answer Questions</h4>
                </div>
                <p className="text-sm text-gray-300">Complete multiple-choice questions that test your understanding of key concepts</p>
              </div>
              
              <div className="bg-gray-700 bg-opacity-50 p-5 rounded-lg border border-gray-600">
                <div className="flex items-center mb-3">
                  <span className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center mr-3 text-lg font-bold">3</span>
                  <h4 className="font-semibold text-blue-300">Track Progress</h4>
                </div>
                <p className="text-sm text-gray-300">See your results, earn badges, and identify areas where you can improve</p>
              </div>
            </div>
          </div>
        </section>
        
        {/* Quiz Categories */}
        <section className="py-10 fade-in-element opacity-0 translate-y-4 transition-all duration-700">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-blue-300">
              <span className="inline-block mr-2">📝</span> 
              Quiz Categories
            </h2>
            <div className="h-1 flex-grow ml-4 bg-gradient-to-r from-blue-500 to-purple-500 rounded"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-6xl mx-auto">
            {quizCategories.map((category, idx) => (
              <div 
                key={category.id}
                className="bg-gray-800 bg-opacity-60 rounded-xl overflow-hidden transition-all duration-300 transform hover:scale-105 border border-gray-700 hover:border-blue-500 flex flex-col"
              >
                <div className={`relative h-32 bg-gradient-to-br ${category.bgColor}`}>
                  {/* Pattern overlay */}
                  <div className="absolute inset-0" style={{
                    backgroundImage: `radial-gradient(circle at 10% 20%, rgba(255,255,255,0.05) 0%, transparent 20%)`
                  }}></div>
                  
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-7xl">{category.icon}</span>
                  </div>
                </div>
                
                <div className="p-6 flex-grow">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-xl font-bold text-white">{category.title}</h3>
                    <span className="text-xs px-2 py-1 bg-blue-900 text-blue-200 rounded-full">
                      {category.quizCount} {category.quizCount === 1 ? 'Quiz' : 'Quizzes'}
                    </span>
                  </div>
                  <p className="text-gray-300 text-sm mb-6">
                    {category.description}
                  </p>
                  
                  <button 
                    className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition-colors mt-auto"
                    // This would link to actual quizzes in the future
                    onClick={() => alert('Quiz functionality coming soon!')}
                  >
                    Start Quizzes
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
        
        {/* Coming Soon Section */}
        <section className="py-16 max-w-4xl mx-auto text-center fade-in-element opacity-0 translate-y-4 transition-all duration-700">
          <div className="bg-gray-800 bg-opacity-70 rounded-xl p-10 border border-blue-900">
            <div className="w-20 h-20 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-3xl">🚀</span>
            </div>
            
            <h3 className="text-2xl font-bold text-white mb-4">Quiz Content Coming Soon!</h3>
            
            <p className="text-gray-300 mb-6 max-w-lg mx-auto">
              We're working on creating engaging quiz content to help test your financial knowledge. 
              Check back soon for new quizzes across all categories!
            </p>
            
            <div className="inline-block bg-blue-900 bg-opacity-50 px-4 py-2 rounded-lg border border-blue-700">
              <p className="text-blue-300 text-sm">
                <span className="font-semibold">Tip:</span> While you wait, explore our video lessons and courses to prepare!
              </p>
            </div>
          </div>
        </section>
      </main>
      
      {/* Footer */}
      <footer className="bg-gray-900 py-8 px-4 border-t border-gray-800">
        <div className="container mx-auto text-center">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
                Finergize
              </h2>
              <p className="text-gray-400 mt-2">Your journey to financial independence</p>
            </div>
            
            <div className="mt-6 md:mt-0">
              <div className="flex space-x-4 justify-center">
                <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-blue-400 hover:bg-blue-900 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                  </svg>
                </a>
                <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-blue-400 hover:bg-blue-900 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                  </svg>
                </a>
                <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-blue-400 hover:bg-blue-900 transition-colors">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                  </svg>
                </a>
                <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-blue-400 hover:bg-blue-900 transition-colors">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8">
            <p className="text-sm text-gray-500">
              © 2025 Finergize. All rights reserved.
            </p>
          </div>
        </div>
      </footer>

      {/* Add custom animations */}
      <style jsx global>{`
        .fade-in-element {
          transition: opacity 0.7s ease-out, transform 0.5s ease-out;
        }
        
        /* For browsers that don't support scroll-based animations */
        @media (prefers-reduced-motion: no-preference) {
          .fade-in-element.opacity-100 {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}