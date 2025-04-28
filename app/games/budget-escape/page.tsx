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

interface AchievementBadge {
id: string;
title: string;
description: string;
icon: string; // Emoji or icon
bgColor: string; // CSS background color
dateEarned?: Date;
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

// Using gradient backgrounds and icons instead of images
const quizzes: QuizContent[] = [
{
    id: 'q1',
    title: 'Savings Superstars',
    description: 'Test your knowledge about various savings strategies and techniques',
    category: 'savings',
    icon: '🏆',
    bgColor: 'from-blue-600 to-blue-900',
    questions: [
    {
        id: 'q1-1',
        question: 'What is the rule of 72?',
        options: [
        'A tax regulation for retirement accounts',
        'A formula to estimate how long it takes money to double with compound interest',
        'The maximum debt-to-income ratio for mortgage approval',
        'A banking regulation limiting transfers between accounts'
        ],
        correctAnswer: 1,
        explanation: 'The rule of 72 is a simple formula to estimate how long it will take for your money to double given a fixed annual interest rate. You divide 72 by the annual interest rate.'
    },
    {
        id: 'q1-2',
        question: 'Which savings account typically offers the highest interest rate?',
        options: [
        'Standard savings account',
        'Certificate of Deposit (CD)',
        'Checking account',
        'Money Market Account'
        ],
        correctAnswer: 1,
        explanation: 'CDs typically offer higher interest rates because you agree to leave your money deposited for a specific period of time.'
    }
    ]
},
{
    id: 'q2',
    title: 'Investment IQ Challenge',
    description: 'Challenge yourself with questions about investments and portfolio management',
    category: 'investment',
    icon: '📝',
    bgColor: 'from-purple-600 to-purple-900',
    questions: [
    {
        id: 'q2-1',
        question: 'What typically happens to bond prices when interest rates rise?',
        options: [
        'Bond prices rise',
        'Bond prices fall',
        'Bond prices remain unchanged',
        'Bonds get automatically converted to stocks'
        ],
        correctAnswer: 1,
        explanation: 'When interest rates rise, newly issued bonds come with higher interest rates, making existing bonds with lower rates less attractive, thus their prices fall.'
    }
    ]
}
];

// Using emoji icons for badges
const badges: AchievementBadge[] = [
{
    id: 'b1',
    title: 'Savings Starter',
    description: 'Completed your first savings module',
    icon: '💸',
    bgColor: 'from-emerald-500 to-emerald-700'
},
{
    id: 'b2',
    title: 'Quiz Master',
    description: 'Aced 5 financial quizzes with perfect scores',
    icon: '🎓',
    bgColor: 'from-blue-500 to-blue-700'
},
{
    id: 'b3',
    title: 'Investment Guru',
    description: 'Successfully completed the advanced investment course',
    icon: '📊',
    bgColor: 'from-indigo-500 to-indigo-700'
},
{
    id: 'b4',
    title: 'Budget Wizard',
    description: 'Created and maintained a budget for 30 days',
    icon: '✨',
    bgColor: 'from-violet-500 to-violet-700'
}
];

// Main component
export default function FinancialEducationPage() {
// State for active sections and interactions
const [activeSection, setActiveSection] = useState<'videos' | 'games' | 'quizzes' | 'achievements'>('videos');
const [currentVideo, setCurrentVideo] = useState<VideoContent | null>(null);
const [activeQuiz, setActiveQuiz] = useState<QuizContent | null>(null);
const [quizProgress, setQuizProgress] = useState<{[key: string]: number}>({});
const [quizAnswers, setQuizAnswers] = useState<{[key: string]: number}>({});
const [showResults, setShowResults] = useState(false);
const [userBadges, setUserBadges] = useState<AchievementBadge[]>([badges[0]]);
const [certificateReady, setCertificateReady] = useState(false);

// Refs for scrolling
const videosRef = useRef<HTMLDivElement>(null);
const gamesRef = useRef<HTMLDivElement>(null);
const quizzesRef = useRef<HTMLDivElement>(null);
const achievementsRef = useRef<HTMLDivElement>(null);

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
const scrollToSection = (section: 'videos' | 'games' | 'quizzes' | 'achievements') => {
    setActiveSection(section);
    
    let ref;
    switch(section) {
    case 'videos': ref = videosRef; break;
    case 'games': ref = gamesRef; break;
    case 'quizzes': ref = quizzesRef; break;
    case 'achievements': ref = achievementsRef; break;
    }
    
    ref?.current?.scrollIntoView({ behavior: 'smooth' });
};

// Quiz handling functions
const startQuiz = (quiz: QuizContent) => {
    setActiveQuiz(quiz);
    setQuizProgress({ [quiz.id]: 0 });
    setQuizAnswers({});
    setShowResults(false);
};

const handleAnswerSelect = (questionId: string, answerIndex: number) => {
    setQuizAnswers(prev => ({
    ...prev,
    [questionId]: answerIndex
    }));
};

const handleNextQuestion = () => {
    if (!activeQuiz) return;
    
    const currentProgress = quizProgress[activeQuiz.id];
    
    if (currentProgress < activeQuiz.questions.length - 1) {
    setQuizProgress(prev => ({ 
        ...prev, 
        [activeQuiz.id]: prev[activeQuiz.id] + 1 
    }));
    } else {
    setShowResults(true);
    checkForNewBadges();
    }
};

const calculateQuizScore = () => {
    if (!activeQuiz) return 0;
    
    let correctCount = 0;
    activeQuiz.questions.forEach(question => {
    if (quizAnswers[question.id] === question.correctAnswer) {
        correctCount++;
    }
    });
    
    return Math.round((correctCount / activeQuiz.questions.length) * 100);
};

const checkForNewBadges = () => {
    const score = calculateQuizScore();
    
    // Award Quiz Master badge if score is 100%
    if (score === 100 && !userBadges.some(badge => badge.id === 'b2')) {
    const newBadge = badges.find(b => b.id === 'b2');
    if (newBadge) {
        setUserBadges(prev => [...prev, {...newBadge, dateEarned: new Date()}]);
        
        // Unlock certificate if user has at least 3 badges
        if (userBadges.length >= 2) {
        setCertificateReady(true);
        }
    }
    }
};

const generateCertificate = () => {
    // In a real app, this would generate a PDF or image certificate
    alert('Certificate generated and sent to your email!');
};

// Video functions
const playVideo = (video: VideoContent) => {
    setCurrentVideo(video);
};

const closeVideo = () => {
    setCurrentVideo(null);
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
            Financial Mastery Hub
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
            onClick={() => scrollToSection('games')}
            className={`px-6 py-3 rounded-full font-bold transition-all transform hover:scale-105 ${activeSection === 'games' ? 'bg-blue-500 text-white' : 'bg-gray-800 text-blue-300 hover:bg-gray-700'}`}
            >
            Financial Games
            </button>
            <button 
            onClick={() => scrollToSection('quizzes')}
            className={`px-6 py-3 rounded-full font-bold transition-all transform hover:scale-105 ${activeSection === 'quizzes' ? 'bg-blue-500 text-white' : 'bg-gray-800 text-blue-300 hover:bg-gray-700'}`}
            >
            Fun Quizzes
            </button>
            <button 
            onClick={() => scrollToSection('achievements')}
            className={`px-6 py-3 rounded-full font-bold transition-all transform hover:scale-105 ${activeSection === 'achievements' ? 'bg-blue-500 text-white' : 'bg-gray-800 text-blue-300 hover:bg-gray-700'}`}
            >
            Achievements
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
        
        {/* Games Section */}
        <section ref={gamesRef} className="py-16 px-4 fade-in-element opacity-0 translate-y-4 transition-all duration-700 bg-gray-900 bg-opacity-70" id="games">
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
        
        {/* Quizzes Section */}
        <section ref={quizzesRef} className="py-16 px-4 fade-in-element opacity-0 translate-y-4 transition-all duration-700" id="quizzes">
        <div className="container mx-auto">
            <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-blue-300">
                <span className="inline-block mr-2">❓</span> 
                Financial Quizzes
            </h2>
            <div className="h-1 flex-grow ml-4 bg-gradient-to-r from-blue-500 to-purple-500 rounded"></div>
            </div>
            
            {!activeQuiz ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {quizzes.map((quiz, idx) => (
                <div key={quiz.id} className="bg-gray-800 bg-opacity-50 rounded-xl p-6 border border-gray-700 hover:border-blue-500 transition-all">
                    <div className="flex items-center mb-4">
                    <div className={`w-14 h-14 rounded-lg bg-gradient-to-br ${quiz.bgColor} flex items-center justify-center mr-4`}>
                        <span className="text-3xl">{quiz.icon}</span>
                    </div>
                    <h3 className="text-xl font-bold text-white">{quiz.title}</h3>
                    </div>
                    
                    <p className="text-gray-300 mb-4">{quiz.description}</p>
                    <div className="flex justify-between items-center">
                    <span className="text-sm text-blue-300">
                        {quiz.questions.length} questions
                    </span>
                    <button 
                        onClick={() => startQuiz(quiz)}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-full text-white font-semibold transition-colors"
                    >
                        Start Quiz
                    </button>
                    </div>
                </div>
                ))}
            </div>
            ) : (
            <div className="bg-gray-800 rounded-xl p-6 max-w-3xl mx-auto border border-blue-900">
                {!showResults ? (
                <div>
                    <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold text-white">{activeQuiz.title}</h3>
                    <div className="flex items-center">
                        <span className="text-sm text-gray-400 mr-2">Question {quizProgress[activeQuiz.id] + 1}/{activeQuiz.questions.length}</span>
                        <div className="w-32 h-3 bg-gray-700 rounded-full overflow-hidden">
                        <div 
                            className="h-full bg-blue-500" 
                            style={{ width: `${((quizProgress[activeQuiz.id] + 1) / activeQuiz.questions.length) * 100}%` }}
                        ></div>
                        </div>
                    </div>
                    </div>
                    
                    <div className="mb-8">
                    <h4 className="text-xl font-medium text-white mb-4">
                        {activeQuiz.questions[quizProgress[activeQuiz.id]].question}
                    </h4>
                    
                    <div className="space-y-3">
                        {activeQuiz.questions[quizProgress[activeQuiz.id]].options.map((option, index) => (
                        <div 
                            key={index}
                            onClick={() => handleAnswerSelect(activeQuiz.questions[quizProgress[activeQuiz.id]].id, index)}
                            className={`p-4 rounded-lg cursor-pointer transition-all border ${
                            quizAnswers[activeQuiz.questions[quizProgress[activeQuiz.id]].id] === index
                                ? 'bg-blue-900 border-blue-500'
                                : 'bg-gray-700 border-gray-600 hover:bg-gray-600'
                            }`}
                        >
                            <div className="flex items-center">
                            <div className={`w-6 h-6 rounded-full flex items-center justify-center mr-3 border ${
                                quizAnswers[activeQuiz.questions[quizProgress[activeQuiz.id]].id] === index
                                ? 'bg-blue-500 border-blue-500 text-white'
                                : 'border-gray-400'
                            }`}>
                                {quizAnswers[activeQuiz.questions[quizProgress[activeQuiz.id]].id] === index && (
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                                )}
                            </div>
                            <span className="text-white">{option}</span>
                            </div>
                        </div>
                        ))}
                    </div>
                    </div>
                    
                    <div className="flex justify-between">
                    <button 
                        onClick={() => setActiveQuiz(null)}
                        className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-white"
                    >
                        Quit Quiz
                    </button>
                    
                    <button 
                        onClick={handleNextQuestion}
                        disabled={!quizAnswers[activeQuiz.questions[quizProgress[activeQuiz.id]].id]}
                        className={`px-6 py-2 rounded-lg text-white font-medium ${
                        quizAnswers[activeQuiz.questions[quizProgress[activeQuiz.id]].id] !== undefined
                            ? 'bg-blue-600 hover:bg-blue-700'
                            : 'bg-gray-600 cursor-not-allowed'
                        }`}
                    >
                        {quizProgress[activeQuiz.id] === activeQuiz.questions.length - 1 ? 'Finish Quiz' : 'Next Question'}
                    </button>
                    </div>
                </div>
                ) : (
                <div className="text-center">
                    <div className="mb-6">
                    <div className="w-24 h-24 rounded-full bg-blue-900 flex items-center justify-center mx-auto mb-4">
                        <span className="text-3xl font-bold text-white">{calculateQuizScore()}%</span>
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-2">Quiz Complete!</h3>
                    <p className="text-gray-300">
                        {calculateQuizScore() >= 80 
                        ? 'Great job! You have a solid understanding of these financial concepts.'
                        : calculateQuizScore() >= 50
                            ? 'Good effort! There are still some concepts you could review.'
                            : 'You might want to review these concepts and try again.'
                        }
                    </p>
                    </div>
                    
                    <div className="space-y-6 mb-8">
                    {activeQuiz.questions.map((question, index) => {
                        const isCorrect = quizAnswers[question.id] === question.correctAnswer;
                        
                        return (
                        <div key={question.id} className="bg-gray-700 rounded-lg p-4 text-left">
                            <div className="flex items-start">
                            <div className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center mt-1 mr-3 ${
                                isCorrect ? 'bg-green-500' : 'bg-red-500'
                            }`}>
                                {isCorrect ? (
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                                ) : (
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                </svg>
                                )}
                            </div>
                            <div>
                                <h4 className="text-white font-medium mb-2">{question.question}</h4>
                                <div className="text-sm text-gray-300 mb-2">
                                Your answer: <span className={isCorrect ? 'text-green-400' : 'text-red-400'}>
                                    {question.options[quizAnswers[question.id]]}
                                </span>
                                </div>
                                {!isCorrect && (
                                <div className="text-sm text-green-400 mb-2">
                                    Correct answer: {question.options[question.correctAnswer]}
                                </div>
                                )}
                                <p className="text-xs bg-gray-800 p-2 rounded text-gray-300 mt-2">
                                {question.explanation}
                                </p>
                            </div>
                            </div>
                        </div>
                        );
                    })}
                    </div>
                    
                    <div className="flex space-x-4 justify-center">
                    <button 
                        onClick={() => setActiveQuiz(null)}
                        className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg text-white font-medium"
                    >
                        Back to Quizzes
                    </button>
                    <button 
                        onClick={() => {
                        setQuizProgress({ [activeQuiz.id]: 0 });
                        setQuizAnswers({});
                        setShowResults(false);
                        }}
                        className="px-6 py-3 bg-gray-700 hover:bg-gray-600 rounded-lg text-white font-medium"
                    >
                        Retry Quiz
                    </button>
                    </div>
                </div>
                )}
            </div>
            )}
        </div>
        </section>
        
        {/* Achievements Section */}
        <section ref={achievementsRef} className="py-16 px-4 fade-in-element opacity-0 translate-y-4 transition-all duration-700 bg-gray-900 bg-opacity-70" id="achievements">
        <div className="container mx-auto">
            <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-purple-300">
                <span className="inline-block mr-2">🏆</span> 
                Your Achievements
            </h2>
            <div className="h-1 flex-grow ml-4 bg-gradient-to-r from-purple-500 to-blue-500 rounded"></div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
                <h3 className="text-2xl font-bold text-white mb-6">Your Badges</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {badges.map((badge, idx) => {
                    const earned = userBadges.some(b => b.id === badge.id);
                    
                    return (
                    <div 
                        key={badge.id} 
                        className={`p-4 rounded-lg border ${
                        earned 
                            ? 'bg-gray-800 border-purple-500' 
                            : 'bg-gray-800 border-gray-700 opacity-50'
                        }`}
                    >
                        <div className="flex items-center mb-3">
                        <div className={`w-12 h-12 rounded-full ${earned ? `bg-gradient-to-br ${badge.bgColor}` : 'bg-gray-700'} flex items-center justify-center mr-3`}>
                            <span className="text-2xl">{badge.icon}</span>
                        </div>
                        <div>
                            <h4 className="font-bold text-white">{badge.title}</h4>
                            {earned && userBadges.find(b => b.id === badge.id)?.dateEarned && (
                            <p className="text-xs text-gray-400">
                                Earned on {userBadges.find(b => b.id === badge.id)?.dateEarned?.toLocaleDateString()}
                            </p>
                            )}
                        </div>
                        </div>
                        <p className="text-sm text-gray-300">
                        {badge.description}
                        </p>
                    </div>
                    );
                })}
                </div>
            </div>
            
            <div className="bg-gray-800 rounded-lg p-6 border border-purple-900">
                <h3 className="text-2xl font-bold text-white mb-4">Your Certificate</h3>
                
                {certificateReady ? (
                <div className="border-2 border-dashed border-purple-500 p-6 rounded-lg bg-black bg-opacity-30 text-center">
                    <div className="mb-4 flex justify-center">
                    <div className="w-24 h-24 rounded-full bg-gradient-to-br from-purple-600 to-indigo-800 flex items-center justify-center">
                        <span className="text-5xl">🎓</span>
                    </div>
                    </div>
                    <h4 className="text-xl font-bold text-white mb-2">Certificate Available!</h4>
                    <p className="text-gray-300 mb-6">
                    Congratulations! You've earned your Financial Literacy Certificate.
                    This certifies your knowledge in basic financial concepts.
                    </p>
                    <button 
                    onClick={generateCertificate}
                    className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-lg transition-colors"
                    >
                    Generate Certificate
                    </button>
                </div>
                ) : (
                <div className="border-2 border-dashed border-gray-600 p-6 rounded-lg bg-black bg-opacity-30">
                    <h4 className="text-xl font-bold text-white mb-2">Certificate Requirements</h4>
                    <p className="text-gray-300 mb-4">
                    Complete the following to earn your Financial Literacy Certificate:
                    </p>
                    <ul className="space-y-2 mb-6">
                    <li className="flex items-center">
                        <span className={`w-5 h-5 rounded-full mr-2 flex items-center justify-center ${userBadges.length >= 1 ? 'bg-green-500' : 'bg-gray-600'}`}>
                        {userBadges.length >= 1 ? (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-white" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                        ) : ''}
                        </span>
                        <span className={userBadges.length >= 1 ? 'text-green-400' : 'text-gray-400'}>
                        Earn your first badge
                        </span>
                    </li>
                    <li className="flex items-center">
                        <span className={`w-5 h-5 rounded-full mr-2 flex items-center justify-center ${userBadges.length >= 3 ? 'bg-green-500' : 'bg-gray-600'}`}>
                        {userBadges.length >= 3 ? (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-white" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                        ) : ''}
                        </span>
                        <span className={userBadges.length >= 3 ? 'text-green-400' : 'text-gray-400'}>
                        Earn at least 3 badges
                        </span>
                    </li>
                    <li className="flex items-center">
                        <span className={`w-5 h-5 rounded-full mr-2 flex items-center justify-center ${calculateQuizScore() >= 80 ? 'bg-green-500' : 'bg-gray-600'}`}>
                        {calculateQuizScore() >= 80 ? (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-white" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                        ) : ''}
                        </span>
                        <span className={calculateQuizScore() >= 80 ? 'text-green-400' : 'text-gray-400'}>
                        Score at least 80% on a quiz
                        </span>
                    </li>
                    </ul>
                    <div className="text-center">
                    <span className="text-sm text-purple-300">
                        {3 - userBadges.length > 0 ? `${3 - userBadges.length} more badge(s) to go!` : 'All requirements complete!'}
                    </span>
                    </div>
                </div>
                )}
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
                Financial Mastery Hub
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
            © 2025 Financial Mastery Hub. All rights reserved.
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