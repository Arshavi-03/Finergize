'use client';

import React, { useState, useEffect, useRef } from 'react';

// Define the types for our content
interface VideoContent {
  id: string;
  title: string;
  description: string;
  videoId: string; // YouTube video ID
  duration: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  icon: string; // Emoji or icon
  bgColor: string; // CSS background color
}

interface GameContent {
  id: string;
  title: string;
  description: string;
  gameUrl: string;
  difficulty: 'easy' | 'medium' | 'hard';
  icon: string; // Emoji or icon
  bgColor: string; // CSS background color
}

interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

interface QuizContent {
  id: string;
  title: string;
  description: string;
  questions: QuizQuestion[];
  category: 'savings' | 'investment' | 'budgeting' | 'credit';
  icon: string; // Emoji or icon
  bgColor: string; // CSS background color
}

interface CourseModule {
  id: string;
  title: string;
  description: string;
  videoId: string; // YouTube video ID
  duration: string;
}

interface CourseContent {
  id: string;
  title: string;
  description: string;
  category: string;
  icon: string;
  bgColor: string;
  modules: CourseModule[];
}

// Sample data for our application
const videos: VideoContent[] = [
  {
    id: 'v1',
    title: 'Understanding Compound Interest',
    description: 'Learn how your money can grow exponentially over time with the power of compound interest',
    videoId: 'lNK95khKvSk', // YouTube video ID
    duration: '5:24',
    level: 'beginner',
    icon: '📈',
    bgColor: 'from-green-600 to-green-900'
  },
  {
    id: 'v2',
    title: 'The Psychology of Money',
    description: 'Explore the emotional and psychological aspects that influence our financial decisions',
    videoId: 'QQgOJoZduRc', // YouTube video ID
    duration: '8:15',
    level: 'intermediate',
    icon: '🧠',
    bgColor: 'from-yellow-600 to-yellow-900'
  },
  {
    id: 'v3',
    title: 'Decoding Cryptocurrency',
    description: 'Breaking down the blockchain and how cryptocurrencies function in the modern economy',
    videoId: 'TRbNtJTFDG8', // YouTube video ID
    duration: '10:38',
    level: 'advanced',
    icon: '₿',
    bgColor: 'from-purple-600 to-purple-900'
  },
  {
    id: 'v4',
    title: 'Budget Like a Pro',
    description: 'Simple yet effective techniques to master your personal budget',
    videoId: 'Jkf5pTLTTFY', // YouTube video ID
    duration: '7:12',
    level: 'beginner',
    icon: '💰',
    bgColor: 'from-blue-600 to-blue-900'
  },
];

// New courses data
const courses: CourseContent[] = [
  {
    id: 'c1',
    title: 'Stock Market Basics',
    description: 'Learn the fundamentals of how stock markets operate and the key concepts every investor should know',
    category: 'investing',
    icon: '📊',
    bgColor: 'from-blue-600 to-blue-900',
    modules: [
      {
        id: 'c1-m1',
        title: 'Introduction to Stocks',
        description: 'Understanding what stocks are and how the stock market works',
        videoId: 'p7HKvqRI_Bo',
        duration: '8:42'
      },
      {
        id: 'c1-m2',
        title: 'How to Read Stock Charts',
        description: 'Learning the essentials of understanding stock price charts and key indicators',
        videoId: 'cQiPUHgKBNg',
        duration: '12:15'
      },
      {
        id: 'c1-m3',
        title: 'Building Your First Portfolio',
        description: 'Strategies for creating a diversified starter portfolio',
        videoId: 'Kab5YNoqCZQ',
        duration: '10:37'
      }
    ]
  },
  {
    id: 'c2',
    title: 'Technical Analysis',
    description: 'Master the art of analyzing stock price movements and patterns to predict future price movements',
    category: 'investing',
    icon: '📉',
    bgColor: 'from-purple-600 to-purple-900',
    modules: [
      {
        id: 'c2-m1',
        title: 'Support and Resistance Levels',
        description: 'Understanding key price levels that act as barriers to price movement',
        videoId: 'tkwUOCNmfxE',
        duration: '9:18'
      },
      {
        id: 'c2-m2',
        title: 'Trend Lines and Chart Patterns',
        description: 'Identifying and interpreting common chart formations',
        videoId: 'eynxyoKgpng',
        duration: '15:24'
      },
      {
        id: 'c2-m3',
        title: 'Moving Averages and Indicators',
        description: 'Using technical indicators to enhance your analysis',
        videoId: 'TL0sB-HGMWk',
        duration: '11:49'
      }
    ]
  },
  {
    id: 'c3',
    title: 'Market Trends',
    description: 'Understand how market trends develop and how to position your investments accordingly',
    category: 'investing',
    icon: '📈',
    bgColor: 'from-green-600 to-green-900',
    modules: [
      {
        id: 'c3-m1',
        title: 'Bull vs Bear Markets',
        description: 'Understanding the characteristics of different market cycles',
        videoId: 'tKxgvY1z8eM',
        duration: '7:52'
      },
      {
        id: 'c3-m2',
        title: 'Sector Rotation',
        description: 'How different market sectors perform throughout economic cycles',
        videoId: 'fgI1DqUGFEM',
        duration: '10:05'
      }
    ]
  },
  {
    id: 'c4',
    title: 'Stock Valuation',
    description: 'Learn various methods to determine whether a stock is overvalued or undervalued',
    category: 'investing',
    icon: '🔍',
    bgColor: 'from-yellow-600 to-yellow-900',
    modules: [
      {
        id: 'c4-m1',
        title: 'Price-to-Earnings Ratio',
        description: 'Understanding the most common valuation metric used by investors',
        videoId: 'cI8ZSf0nxFs',
        duration: '8:36'
      },
      {
        id: 'c4-m2',
        title: 'Discounted Cash Flow Analysis',
        description: 'Calculating the intrinsic value of a stock based on future cash flows',
        videoId: '8j9Sj8_SkPI',
        duration: '14:27'
      },
      {
        id: 'c4-m3',
        title: 'Comparative Valuation Methods',
        description: 'Using industry comparisons to evaluate stock prices',
        videoId: 'NQ2WrVua6mg',
        duration: '9:55'
      }
    ]
  },
  {
    id: 'c5',
    title: 'Financial News Impact',
    description: 'Understand how news events affect financial markets and how to interpret market reactions',
    category: 'market-analysis',
    icon: '📰',
    bgColor: 'from-red-600 to-red-900',
    modules: [
      {
        id: 'c5-m1',
        title: 'Economic Indicators',
        description: 'Key economic reports and how they move markets',
        videoId: 'iKxFysXmCPo',
        duration: '11:03'
      },
      {
        id: 'c5-m2',
        title: 'Earnings Reports',
        description: 'How to read quarterly earnings reports and understand their impact',
        videoId: 'W-NbQJJgfSA',
        duration: '9:48'
      }
    ]
  },
  {
    id: 'c6',
    title: 'Banking Services',
    description: 'Discover the range of banking products and services available and how to use them effectively',
    category: 'banking',
    icon: '🏦',
    bgColor: 'from-indigo-600 to-indigo-900',
    modules: [
      {
        id: 'c6-m1',
        title: 'Types of Bank Accounts',
        description: 'Understanding checking, savings, and other account types',
        videoId: 'YHYj87sr7Ws',
        duration: '7:16'
      },
      {
        id: 'c6-m2',
        title: 'Loans and Credit Products',
        description: 'Navigating the world of loans, credit cards, and lines of credit',
        videoId: 'S9pCGB7XD1U',
        duration: '12:30'
      },
      {
        id: 'c6-m3',
        title: 'Digital Banking Tools',
        description: 'Maximizing the benefits of online and mobile banking',
        videoId: 'v2jxhmXGX9Y',
        duration: '8:42'
      }
    ]
  },
  {
    id: 'c7',
    title: 'Credit Risk',
    description: 'Learn how to analyze credit risk and understand factors that predict default probability',
    category: 'banking',
    icon: '⚠️',
    bgColor: 'from-orange-600 to-orange-900',
    modules: [
      {
        id: 'c7-m1',
        title: 'Credit Scores Explained',
        description: 'Understanding what goes into your credit score and how to improve it',
        videoId: 'Vn9ounAgG3w',
        duration: '10:14'
      },
      {
        id: 'c7-m2',
        title: 'Debt-to-Income Ratios',
        description: 'The key metrics lenders use to evaluate borrowers',
        videoId: 'k-VS_ZpH-Gg',
        duration: '7:55'
      }
    ]
  },
  {
    id: 'c8',
    title: 'Index Analysis',
    description: 'Understanding market indices, their composition, and what they tell us about the market',
    category: 'market-analysis',
    icon: '📋',
    bgColor: 'from-teal-600 to-teal-900',
    modules: [
      {
        id: 'c8-m1',
        title: 'Major Market Indices',
        description: 'Understanding the S&P 500, Dow Jones, NASDAQ, and other key indices',
        videoId: 'vGZlwWrD-JI',
        duration: '9:37'
      },
      {
        id: 'c8-m2',
        title: 'Index Investing Strategies',
        description: 'How to build a portfolio based on index investing',
        videoId: 'Kic2X9glKX0',
        duration: '13:22'
      },
      {
        id: 'c8-m3',
        title: 'Index Weighting Methodologies',
        description: 'How different indices are calculated and what it means for investors',
        videoId: 'Y8hVrw1QGTk',
        duration: '8:50'
      }
    ]
  },
  {
    id: 'c9',
    title: 'Sector Distribution',
    description: 'Learn about different industry sectors, their characteristics, and market representation',
    category: 'market-analysis',
    icon: '🏭',
    bgColor: 'from-pink-600 to-pink-900',
    modules: [
      {
        id: 'c9-m1',
        title: 'The 11 Market Sectors',
        description: 'An overview of the major market sectors and their key characteristics',
        videoId: 'tTMxO5jBqFk',
        duration: '11:28'
      },
      {
        id: 'c9-m2',
        title: 'Cyclical vs Defensive Sectors',
        description: 'Understanding how different sectors perform in various economic conditions',
        videoId: 'qHrQ5DP9W2c',
        duration: '9:42'
      }
    ]
  }
];

// Using gradient backgrounds and icons instead of images
const games: GameContent[] = [
  {
    id: 'g1',
    title: 'Stock Market Simulator',
    description: 'Practice investing with virtual money before risking real funds in the market',
    gameUrl: '/games/stock-simulator', // Correct URL
    difficulty: 'medium',
    icon: '📊',
    bgColor: 'from-indigo-600 to-indigo-900'
  },
  {
    id: 'g2',
    title: 'Budget Escape Room',
    description: 'Solve financial puzzles to escape from a debt crisis in this immersive game',
    gameUrl: '/games/budget-escape', // This is correct already
    difficulty: 'hard',
    icon: '🔐',
    bgColor: 'from-red-600 to-red-900'
  },
  {
    id: 'g3',
    title: 'Money Flow Adventure',
    description: 'Guide your money through different financial scenarios in this fun adventure game',
    gameUrl: '/games/money-fall', // This is correct already
    difficulty: 'easy',
    icon: '🏦',
    bgColor: 'from-green-600 to-green-900'
  },
];

// Main component
export default function FinancialEducationPage() {
  // State for active sections and interactions
  const [activeSection, setActiveSection] = useState<'videos' | 'courses' | 'games' | 'quiz-redirect'>('videos');
  const [currentVideo, setCurrentVideo] = useState<VideoContent | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [expandedCourse, setExpandedCourse] = useState<string | null>(null);
  const [currentCourseVideo, setCurrentCourseVideo] = useState<{courseId: string, module: CourseModule} | null>(null);
  const [courseFilter, setCourseFilter] = useState<string | null>(null);
  const [userName, setUserName] = useState<string>("");

  // Refs for scrolling
  const videosRef = useRef<HTMLDivElement>(null);
  const coursesRef = useRef<HTMLDivElement>(null);
  const gamesRef = useRef<HTMLDivElement>(null);
  const quizRedirectRef = useRef<HTMLDivElement>(null);

 // Fetch user info on component mount
  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        setIsLoading(true);
        
        // Fetch session directly
        const response = await fetch('/api/auth/session');
        if (!response.ok) {
          setUserName("Guest User");
          return;
        }
        
        const session = await response.json();
        
        if (session && session.user && session.user.name) {
          setUserName(session.user.name);
        } else {
          setUserName("Guest User");
        }
      } catch (error) {
        console.error("Error fetching session:", error);
        setUserName("Guest User");
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchUserInfo();
  }, []);

  // Add custom animation classes
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

  // Navigation function
  const scrollToSection = (section: 'videos' | 'courses' | 'games' | 'quiz-redirect') => {
    setActiveSection(section);
    
    let ref;
    switch(section) {
      case 'videos': ref = videosRef; break;
      case 'courses': ref = coursesRef; break;
      case 'games': ref = gamesRef; break;
      case 'quiz-redirect': ref = quizRedirectRef; break;
    }
    
    ref?.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Video functions
  const playVideo = (video: VideoContent) => {
    setCurrentVideo(video);
  };

  const closeVideo = () => {
    setCurrentVideo(null);
  };

  // Course functions
  const toggleCourseExpand = (courseId: string) => {
    if (expandedCourse === courseId) {
      setExpandedCourse(null);
    } else {
      setExpandedCourse(courseId);
    }
  };

  const playCourseVideo = (courseId: string, module: CourseModule) => {
    setCurrentCourseVideo({ courseId, module });
  };

  const closeCourseVideo = () => {
    setCurrentCourseVideo(null);
  };

  const filterCourses = (category: string | null) => {
    setCourseFilter(category);
  };

  // Get filtered courses
  const getFilteredCourses = () => {
    if (!courseFilter) return courses;
    return courses.filter(course => course.category === courseFilter);
  };

  // Render level badge for videos
  const renderLevelBadge = (level: 'beginner' | 'intermediate' | 'advanced') => {
    const colors = {
      beginner: 'bg-green-500 text-green-100',
      intermediate: 'bg-yellow-500 text-yellow-900',
      advanced: 'bg-purple-600 text-purple-100'
    };
    
    return (
      <span className={`text-xs font-semibold px-2 py-1 rounded-full ${colors[level]}`}>
        {level.charAt(0).toUpperCase() + level.slice(1)}
      </span>
    );
  };

  // Render difficulty label for games
  const renderDifficultyLabel = (difficulty: 'easy' | 'medium' | 'hard') => {
    const colors = {
      easy: 'border-green-500 text-green-500',
      medium: 'border-yellow-500 text-yellow-500',
      hard: 'border-red-500 text-red-500'
    };
    
    return (
      <span className={`text-xs font-bold px-2 py-1 rounded border ${colors[difficulty]}`}>
        {difficulty.toUpperCase()}
      </span>
    );
  };

  // Generate a pattern for background
  const generatePattern = (index: number, seed: string) => {
    const patterns = [
      'radial-gradient(circle at 10% 20%, rgba(255,255,255,0.05) 0%, transparent 20%)',
      'linear-gradient(30deg, rgba(255,255,255,0.03) 12%, transparent 12.5%, transparent 87%, rgba(255,255,255,0.03) 87.5%, rgba(255,255,255,0.03) 100%)',
      'repeating-linear-gradient(45deg, rgba(255,255,255,0.05) 0, rgba(255,255,255,0.05) 1px, transparent 1px, transparent 4px)',
      'linear-gradient(60deg, rgba(255,255,255,0.1) 25%, transparent 25%, transparent 75%, rgba(255,255,255,0.1) 75%, rgba(255,255,255,0.1))'
    ];
    
    return patterns[index % patterns.length];
  };

  // Main render
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 text-white">
      {/* Header with animated background */}
      <header className="relative py-16 overflow-hidden">
        <div className="absolute inset-0 z-0">
          {/* Animated elements */}
          <div className="absolute w-24 h-24 bg-blue-500 rounded-full opacity-20 top-10 left-1/4 animate-pulse" style={{animationDuration: '7s'}}></div>
          <div className="absolute w-32 h-32 bg-purple-500 rounded-full opacity-10 top-20 right-1/4 animate-pulse" style={{animationDuration: '5s'}}></div>
          <div className="absolute w-16 h-16 bg-blue-300 rounded-full opacity-15 bottom-10 left-1/3 animate-pulse" style={{animationDuration: '9s'}}></div>
          
          {/* Pattern overlay */}
          <div className="absolute inset-0" style={{
            backgroundImage: `repeating-linear-gradient(45deg, rgba(255,255,255,0.03) 0, rgba(255,255,255,0.03) 1px, transparent 1px, transparent 20px)`,
            backgroundSize: '30px 30px'
          }}></div>
        </div>
        
        <div className="relative z-10 container mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-6xl font-extrabold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
            Finergize
          </h1>
          <p className="text-xl md:text-2xl text-blue-200 max-w-3xl mx-auto">
            Your journey to financial independence starts with education that's
            actually fun and engaging
          </p>
          
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <button 
              onClick={() => scrollToSection('videos')}
              className={`px-6 py-3 rounded-full font-bold transition-all transform hover:scale-105 ${activeSection === 'videos' ? 'bg-blue-500 text-white' : 'bg-gray-800 text-blue-300 hover:bg-gray-700'}`}
            >
              Video Lessons
            </button>
            <button 
              onClick={() => scrollToSection('courses')}
              className={`px-6 py-3 rounded-full font-bold transition-all transform hover:scale-105 ${activeSection === 'courses' ? 'bg-blue-500 text-white' : 'bg-gray-800 text-blue-300 hover:bg-gray-700'}`}
            >
              Courses
            </button>
            <button 
              onClick={() => scrollToSection('games')}
              className={`px-6 py-3 rounded-full font-bold transition-all transform hover:scale-105 ${activeSection === 'games' ? 'bg-blue-500 text-white' : 'bg-gray-800 text-blue-300 hover:bg-gray-700'}`}
            >
              Financial Games
            </button>
            <button 
              onClick={() => scrollToSection('quiz-redirect')}
              className={`px-6 py-3 rounded-full font-bold transition-all transform hover:scale-105 ${activeSection === 'quiz-redirect' ? 'bg-blue-500 text-white' : 'bg-gray-800 text-blue-300 hover:bg-gray-700'}`}
            >
              Quiz Challenge
            </button>
          </div>
        </div>
        
        {/* Animated wave separator */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" className="w-full">
            <path fill="rgba(17, 24, 39, 0.8)" fillOpacity="1" d="M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,112C672,96,768,96,864,117.3C960,139,1056,181,1152,186.7C1248,192,1344,160,1392,144L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
          </svg>
        </div>
      </header>
      
      {/* Main content */}
      <main className="relative z-10 pb-20">
        {/* Videos Section */}
        <section ref={videosRef} className="py-16 px-4 fade-in-element opacity-0 translate-y-4 transition-all duration-700" id="videos">
          <div className="container mx-auto">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-bold text-blue-300">
                <span className="inline-block mr-2">📺</span> 
                Interactive Video Lessons
              </h2>
              <div className="h-1 flex-grow ml-4 bg-gradient-to-r from-blue-500 to-purple-500 rounded"></div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {videos.map((video, idx) => (
                <div 
                  key={video.id} 
                  className="relative group bg-gray-800 bg-opacity-50 rounded-xl overflow-hidden transition-all duration-300 transform hover:scale-105 hover:shadow-lg border border-gray-700 hover:border-blue-500"
                >
                  <div className={`relative pb-[56.25%] bg-gradient-to-br ${video.bgColor}`}> 
                    {/* Pattern overlay */}
                    <div className="absolute inset-0" style={{
                      backgroundImage: generatePattern(idx, video.id)
                    }}></div>
                    
                    {/* Icon */}
                    <div className="absolute inset-0 flex items-center justify-center text-7xl opacity-30">
                      {video.icon}
                    </div>
                    
                    <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-70"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <button 
                        onClick={() => playVideo(video)}
                        className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center transform transition-transform group-hover:scale-110"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </div>
                    <div className="absolute bottom-2 right-2 z-10">
                      {renderLevelBadge(video.level)}
                    </div>
                    <div className="absolute bottom-2 left-2 z-10 bg-gray-900 bg-opacity-80 px-2 py-1 rounded text-xs">
                      {video.duration}
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="text-lg font-semibold mb-1 text-white group-hover:text-blue-300 transition-colors">
                      {video.title}
                    </h3>
                    <p className="text-sm text-gray-400 overflow-hidden line-clamp-2">
                      {video.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Courses Section */}
        <section ref={coursesRef} className="py-16 px-4 fade-in-element opacity-0 translate-y-4 transition-all duration-700 bg-gray-900 bg-opacity-70" id="courses">
          <div className="container mx-auto">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-bold text-blue-300">
                <span className="inline-block mr-2">🎓</span> 
                Financial Courses
              </h2>
              <div className="h-1 flex-grow ml-4 bg-gradient-to-r from-blue-500 to-purple-500 rounded"></div>
            </div>

            {/* Category filter */}
            <div className="mb-8 flex flex-wrap gap-2">
              <button 
                onClick={() => filterCourses(null)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  courseFilter === null 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                All Courses
              </button>
              <button 
                onClick={() => filterCourses('investing')}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  courseFilter === 'investing' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                Investing
              </button>
              <button 
                onClick={() => filterCourses('market-analysis')}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  courseFilter === 'market-analysis' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                Market Analysis
              </button>
              <button 
                onClick={() => filterCourses('banking')}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  courseFilter === 'banking' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                Banking
              </button>
            </div>
            
            <div className="space-y-6">
              {getFilteredCourses().map((course, idx) => (
                <div 
                  key={course.id} 
                  className="bg-gray-800 bg-opacity-60 rounded-xl overflow-hidden border border-gray-700 hover:border-blue-500 transition-colors"
                >
                  <div 
                    className="p-6 cursor-pointer"
                    onClick={() => toggleCourseExpand(course.id)}
                  >
                    <div className="flex items-start">
                      <div className={`w-16 h-16 flex-shrink-0 rounded-lg bg-gradient-to-br ${course.bgColor} flex items-center justify-center mr-4`}>
                        <span className="text-4xl">{course.icon}</span>
                      </div>
                      <div className="flex-grow">
                        <div className="flex justify-between items-center">
                          <h3 className="text-xl font-bold text-white mb-1">{course.title}</h3>
                          <button 
                            className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-700 hover:bg-gray-600 transition-colors"
                          >
                            <svg 
                              xmlns="http://www.w3.org/2000/svg" 
                              className={`h-5 w-5 text-blue-300 transition-transform ${expandedCourse === course.id ? 'rotate-180' : ''}`} 
                              viewBox="0 0 20 20" 
                              fill="currentColor"
                            >
                              <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                          </button>
                        </div>
                        <p className="text-gray-300 text-sm mb-2">{course.description}</p>
                        <div className="flex items-center justify-between">
                          <span className="text-xs bg-blue-900 text-blue-200 px-2 py-1 rounded">
                            {course.category.charAt(0).toUpperCase() + course.category.slice(1).replace('-', ' ')}
                          </span>
                          <span className="text-xs text-gray-400">
                            {course.modules.length} modules
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Modules - shown when expanded */}
                  {expandedCourse === course.id && (
                    <div className="border-t border-gray-700 px-6 py-4">
                      <h4 className="text-lg font-semibold text-blue-300 mb-4">Course Modules</h4>
                      <div className="space-y-4">
                        {course.modules.map((module, moduleIdx) => (
                          <div 
                            key={module.id} 
                            className="bg-gray-700 bg-opacity-50 rounded-lg p-4 transition-all hover:bg-gray-600"
                          >
                            <div className="flex items-center justify-between">
                              <div>
                                <h5 className="font-medium text-white">{module.title}</h5>
                                <p className="text-sm text-gray-300 mt-1">{module.description}</p>
                              </div>
                              <div className="flex items-center space-x-3">
                                <span className="text-xs text-gray-400">{module.duration}</span>
                                <button 
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    playCourseVideo(course.id, module);
                                  }}
                                  className="bg-blue-600 hover:bg-blue-700 text-white rounded-full p-2 transition-colors"
                                >
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                                  </svg>
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
        
        {/* Games Section */}
        <section ref={gamesRef} className="py-16 px-4 fade-in-element opacity-0 translate-y-4 transition-all duration-700" id="games">
          <div className="container mx-auto">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-bold text-purple-300">
                <span className="inline-block mr-2">🎮</span> 
                Financial Games
              </h2>
              <div className="h-1 flex-grow ml-4 bg-gradient-to-r from-purple-500 to-blue-500 rounded"></div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {games.map((game, idx) => (
                <div 
                  key={game.id} 
                  className="relative bg-gray-800 rounded-xl overflow-hidden transition-all duration-300 transform hover:scale-105 border border-gray-700 hover:border-purple-500 flex flex-col"
                >
                  <div className={`h-48 relative bg-gradient-to-br ${game.bgColor}`}>
                    {/* Pattern overlay */}
                    <div className="absolute inset-0" style={{
                      backgroundImage: generatePattern(idx, game.id)
                    }}></div>
                    
                    {/* Icon */}
                    <div className="flex items-center justify-center h-full">
                      <span className="text-8xl opacity-50">{game.icon}</span>
                    </div>
                    
                    <div className="absolute top-0 right-0 m-2">
                      {renderDifficultyLabel(game.difficulty)}
                    </div>
                  </div>
                  
                  <div className="p-4 flex flex-col flex-grow">
                    <h3 className="text-xl font-bold mb-2 text-white">
                      {game.title}
                    </h3>
                    <p className="text-gray-300 text-sm mb-4 flex-grow">
                      {game.description}
                    </p>
                    <a 
                      href={game.gameUrl} 
                      className="block w-full py-3 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-lg text-center transition-colors"
                    >
                      Play Now
                    </a>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-12 bg-purple-900 bg-opacity-30 border border-purple-800 rounded-lg p-6">
              <h3 className="text-xl font-bold text-purple-300 mb-2">Why Games?</h3>
              <p className="text-gray-300">
                Playing games is one of the most effective ways to learn financial concepts. 
                Our games simulate real-world scenarios in a risk-free environment, allowing you to 
                practice decision-making and see the consequences without risking real money.
              </p>
            </div>
          </div>
        </section>
        
        {/* Quiz Redirect Section */}
        <section ref={quizRedirectRef} className="py-16 px-4 fade-in-element opacity-0 translate-y-4 transition-all duration-700 bg-gray-900 bg-opacity-70" id="quiz-redirect">
          <div className="container mx-auto">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-bold text-blue-300">
                <span className="inline-block mr-2">❓</span> 
                Test Your Financial Knowledge
              </h2>
              <div className="h-1 flex-grow ml-4 bg-gradient-to-r from-blue-500 to-purple-500 rounded"></div>
            </div>
            
            <div className="bg-gray-800 rounded-xl p-10 max-w-3xl mx-auto border border-blue-900 text-center">
              <div className="mb-6 mx-auto w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <span className="text-5xl">🧠</span>
              </div>
              
              <h3 className="text-2xl font-bold text-white mb-4">Ready to Challenge Yourself?</h3>
              
              <p className="text-gray-300 mb-8 text-lg max-w-lg mx-auto">
                Now that you've explored our educational content, it's time to put your knowledge to the test! Our comprehensive financial literacy quizzes will help you measure your understanding and identify areas for further learning.
              </p>
              
              <div className="flex flex-col items-center space-y-4">
                <a 
                  href="/quizzes"
                  className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition-colors inline-flex items-center text-lg"
                >
                  Take the Quiz Challenge
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </a>
                
                <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
                  <div className="bg-gray-700 bg-opacity-50 p-4 rounded-lg">
                    <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mb-4">
                      <span className="text-2xl">📈</span>
                    </div>
                    <h4 className="font-semibold text-blue-300 mb-2">Track Your Progress</h4>
                    <p className="text-sm text-gray-300">Monitor your learning journey and see your knowledge grow over time</p>
                  </div>
                  
                  <div className="bg-gray-700 bg-opacity-50 p-4 rounded-lg">
                    <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center mb-4">
                      <span className="text-2xl">🏆</span>
                    </div>
                    <h4 className="font-semibold text-purple-300 mb-2">Earn Achievements</h4>
                    <p className="text-sm text-gray-300">Complete quizzes successfully to unlock special badges and rewards</p>
                  </div>
                  
                  <div className="bg-gray-700 bg-opacity-50 p-4 rounded-lg">
                    <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center mb-4">
                      <span className="text-2xl">🎯</span>
                    </div>
                    <h4 className="font-semibold text-green-300 mb-2">Personalized Insights</h4>
                    <p className="text-sm text-gray-300">Get tailored recommendations based on your quiz performance</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      {/* Video Modal */}
      {currentVideo && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-90 flex items-center justify-center p-4">
          <div className="relative bg-gray-900 rounded-xl overflow-hidden max-w-4xl w-full">
            <button 
              onClick={closeVideo}
              className="absolute top-4 right-4 bg-gray-800 rounded-full p-2 z-10"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            
            <div className="relative pb-[56.25%]"> {/* 16:9 aspect ratio */}
              <iframe 
                className="absolute top-0 left-0 w-full h-full"
                src={`https://www.youtube.com/embed/${currentVideo.videoId}?autoplay=1`}
                title={currentVideo.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
            
            <div className="p-4">
              <h3 className="text-xl font-bold text-white mb-2">{currentVideo.title}</h3>
              <p className="text-gray-300">{currentVideo.description}</p>
            </div>
          </div>
        </div>
      )}

      {/* Course Video Modal */}
      {currentCourseVideo && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-90 flex items-center justify-center p-4">
          <div className="relative bg-gray-900 rounded-xl overflow-hidden max-w-4xl w-full">
            <button 
              onClick={closeCourseVideo}
              className="absolute top-4 right-4 bg-gray-800 rounded-full p-2 z-10"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            
            <div className="relative pb-[56.25%]"> {/* 16:9 aspect ratio */}
              <iframe 
                className="absolute top-0 left-0 w-full h-full"
                src={`https://www.youtube.com/embed/${currentCourseVideo.module.videoId}?autoplay=1`}
                title={currentCourseVideo.module.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
            
            <div className="p-4">
              <div className="flex items-center mb-2">
                <span className="text-xs bg-blue-600 text-white px-2 py-1 rounded-full mr-2">
                  {courses.find(c => c.id === currentCourseVideo.courseId)?.title}
                </span>
                <span className="text-xs text-gray-400">{currentCourseVideo.module.duration}</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">{currentCourseVideo.module.title}</h3>
              <p className="text-gray-300">{currentCourseVideo.module.description}</p>
            </div>
          </div>
        </div>
      )}

      {/* Interactive Floating Elements */}
      <div className="hidden md:block">
        <div className="fixed right-8 bottom-32 w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center cursor-pointer transform hover:scale-110 transition-transform animate-bounce" style={{animationDuration: '2s'}}>
          <span className="text-xl">💡</span>
        </div>
        <div className="fixed left-8 bottom-24 w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center cursor-pointer transform hover:scale-110 transition-transform animate-pulse" style={{animationDuration: '3s'}}>
          <span className="text-lg">📊</span>
        </div>
      </div>
      
      {/* Footer */}
      <footer className="bg-gray-900 py-8 px-4 relative z-10 border-t border-gray-800">
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