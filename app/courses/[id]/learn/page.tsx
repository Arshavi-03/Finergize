'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { getCourseById } from '@/services/courseService';
import { CourseContent, CourseModule } from '@/types/course';
import {
  initCourseProgress,
  updateLastAccessedModule,
  isModuleCompleted,
  toggleModuleCompletion,
  calculateCourseCompletion
} from '@/services/courseProgressService';

export default function CourseLearnPage() {
  const params = useParams();
  const router = useRouter();
  const [course, setCourse] = useState<CourseContent | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [currentModule, setCurrentModule] = useState<CourseModule | null>(null);
  const [currentModuleIndex, setCurrentModuleIndex] = useState<number>(0);
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true);
  const [isCompleted, setIsCompleted] = useState<boolean[]>([]);
  const [progress, setProgress] = useState<number>(0);
  const [activeTab, setActiveTab] = useState<'video' | 'quiz'>('video');
  const [expandedNotes, setExpandedNotes] = useState<boolean>(false);
  const [noteText, setNoteText] = useState<string>('');
  const [notesMap, setNotesMap] = useState<{[key: string]: string}>({});
  const [theme, setTheme] = useState<'cosmic' | 'cyber' | 'aurora'>('cosmic');
  const [isVideoPlaying, setIsVideoPlaying] = useState<boolean>(false);
  const [showCompletionAnimation, setShowCompletionAnimation] = useState<boolean>(false);
  const [hoveredModule, setHoveredModule] = useState<number | null>(null);
  
  const courseId = Array.isArray(params.id) ? params.id[0] : params.id;
  const contentRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLIFrameElement>(null);
  const timelineRef = useRef<HTMLDivElement>(null);

  // Theme color schemes
  const themeColors = {
    cosmic: {
      primary: 'from-purple-600 to-blue-600',
      secondary: 'from-pink-500 to-purple-600',
      accent: 'from-indigo-500 to-blue-600',
      text: 'text-purple-300',
      border: 'border-purple-900',
      highlight: 'bg-purple-600',
      bgStart: 'from-gray-900',
      bgEnd: 'to-indigo-900',
      glow: 'purple',
      sidebar: 'from-gray-900 to-indigo-950',
      button: 'from-purple-600 to-blue-600',
      completedIcon: 'text-purple-300',
      moduleHover: 'bg-purple-900 bg-opacity-40',
      quizBg: 'from-indigo-800 to-purple-900'
    },
    cyber: {
      primary: 'from-cyan-500 to-blue-600',
      secondary: 'from-emerald-400 to-cyan-500',
      accent: 'from-blue-500 to-cyan-400',
      text: 'text-cyan-300',
      border: 'border-cyan-900',
      highlight: 'bg-cyan-500',
      bgStart: 'from-gray-900',
      bgEnd: 'to-blue-950',
      glow: 'cyan',
      sidebar: 'from-gray-900 to-blue-950',
      button: 'from-cyan-500 to-blue-600',
      completedIcon: 'text-cyan-300',
      moduleHover: 'bg-cyan-900 bg-opacity-40',
      quizBg: 'from-blue-800 to-cyan-900'
    },
    aurora: {
      primary: 'from-green-500 to-emerald-600',
      secondary: 'from-amber-500 to-lime-600',
      accent: 'from-emerald-400 to-teal-600',
      text: 'text-emerald-300',
      border: 'border-emerald-900',
      highlight: 'bg-emerald-600',
      bgStart: 'from-gray-900',
      bgEnd: 'to-emerald-950',
      glow: 'emerald',
      sidebar: 'from-gray-900 to-emerald-950',
      button: 'from-green-600 to-emerald-600',
      completedIcon: 'text-emerald-300',
      moduleHover: 'bg-emerald-900 bg-opacity-40',
      quizBg: 'from-emerald-800 to-teal-900'
    }
  };

  // Current theme colors
  const currentTheme = themeColors[theme];

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        setIsLoading(true);
        const courseData = await getCourseById(courseId);
        if (courseData) {
          setCourse(courseData);
          
          // Initialize course progress
          initCourseProgress(courseId);
          
          // Set the first module as current by default or use last accessed
          if (courseData.modules && courseData.modules.length > 0) {
            const progress = initCourseProgress(courseId);
            let moduleToLoad = 0;
            
            // If there's a last accessed module, use that
            if (progress.lastAccessedModule) {
              const index = courseData.modules.findIndex(
                module => module._id === progress.lastAccessedModule
              );
              if (index !== -1) {
                moduleToLoad = index;
              }
            }
            
            setCurrentModule(courseData.modules[moduleToLoad]);
            setCurrentModuleIndex(moduleToLoad);
            updateLastAccessedModule(courseId, courseData.modules[moduleToLoad]._id || '');
            
            // Initialize completion status array
            const completionStatus = courseData.modules.map((module, index) => 
              isModuleCompleted(courseId, module._id || '')
            );
            setIsCompleted(completionStatus);
            
            // Calculate progress
            setProgress(calculateCourseCompletion(courseId, courseData.modules.length));
          }
        }
      } catch (error) {
        console.error('Error fetching course:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (courseId) {
      fetchCourse();
    }
  }, [courseId]);

  // Mouse trail effect
  useEffect(() => {
    const handleMouseMove = (e) => {
      const trail = document.createElement('div');
      trail.className = `pointer-events-none fixed w-6 h-6 rounded-full bg-gradient-to-r ${currentTheme.primary} mix-blend-screen opacity-70 z-50`;
      trail.style.left = `${e.clientX - 12}px`;
      trail.style.top = `${e.clientY - 12}px`;
      document.body.appendChild(trail);
      
      setTimeout(() => {
        trail.style.transition = 'transform 0.5s, opacity 0.5s';
        trail.style.transform = 'scale(0.1)';
        trail.style.opacity = '0';
      }, 10);
      
      setTimeout(() => {
        if (trail && document.body.contains(trail)) {
          document.body.removeChild(trail);
        }
      }, 500);
    };
    
    if (!isLoading) {
      window.addEventListener('mousemove', handleMouseMove);
    }
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [isLoading, currentTheme.primary]);
  
  // Timeline progress effect
  useEffect(() => {
    if (timelineRef.current && !isLoading && course) {
      const timelineDots = timelineRef.current.querySelectorAll('.timeline-dot');
      const timelineLines = timelineRef.current.querySelectorAll('.timeline-line');
      
      timelineDots.forEach((dot, index) => {
        if (index <= currentModuleIndex) {
          dot.classList.add('active');
        } else {
          dot.classList.remove('active');
        }
      });
      
      timelineLines.forEach((line, index) => {
        if (index < currentModuleIndex) {
          line.classList.add('active');
        } else {
          line.classList.remove('active');
        }
      });
    }
  }, [currentModuleIndex, isLoading, course]);

  const selectModule = (module: CourseModule, index: number) => {
    setCurrentModule(module);
    setCurrentModuleIndex(index);
    setActiveTab('video');
    setExpandedNotes(false);
    
    // Save note for current module before switching
    if (currentModule && currentModule._id) {
      saveNote(currentModule._id);
    }
    
    // Load note for new module
    if (module._id && notesMap[module._id]) {
      setNoteText(notesMap[module._id]);
    } else {
      setNoteText('');
    }
    
    // Update last accessed module in progress
    if (module._id) {
      updateLastAccessedModule(courseId, module._id);
    }
    
    // On mobile, close the sidebar when a module is selected
    if (window.innerWidth < 1024) {
      setIsSidebarOpen(false);
    }
    
    // Scroll to top of content area
    if (contentRef.current) {
      contentRef.current.scrollTop = 0;
    }
    
    // Reset video playing state
    setIsVideoPlaying(false);
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const markAsCompleted = (index: number) => {
    const module = course?.modules[index];
    
    if (module && module._id) {
      // Toggle module completion in storage
      toggleModuleCompletion(courseId, module._id);
      
      // Update local state
      const newCompletionStatus = [...isCompleted];
      const wasCompleted = newCompletionStatus[index];
      newCompletionStatus[index] = !wasCompleted;
      setIsCompleted(newCompletionStatus);
      
      // Update progress
      const newProgress = calculateCourseCompletion(courseId, course.modules.length);
      setProgress(newProgress);
      
      // Show completion animation if marking as completed
      if (!wasCompleted) {
        setShowCompletionAnimation(true);
        setTimeout(() => setShowCompletionAnimation(false), 2000);
      }
    }
  };

  const saveNote = (moduleId: string) => {
    if (noteText) {
      setNotesMap({
        ...notesMap,
        [moduleId]: noteText
      });
    }
  };

  const toggleTheme = () => {
    if (theme === 'cosmic') setTheme('cyber');
    else if (theme === 'cyber') setTheme('aurora');
    else setTheme('cosmic');
  };

  const goToNextModule = () => {
    if (course && currentModuleIndex < course.modules.length - 1) {
      // Save current notes
      if (currentModule && currentModule._id) {
        saveNote(currentModule._id);
      }
      
      selectModule(course.modules[currentModuleIndex + 1], currentModuleIndex + 1);
    }
  };

  const goToPreviousModule = () => {
    if (course && currentModuleIndex > 0) {
      // Save current notes
      if (currentModule && currentModule._id) {
        saveNote(currentModule._id);
      }
      
      selectModule(course.modules[currentModuleIndex - 1], currentModuleIndex - 1);
    }
  };

  if (isLoading) {
    return (
      <div className={`min-h-screen bg-gradient-to-br ${currentTheme.bgStart} ${currentTheme.bgEnd} text-white flex items-center justify-center`}>
        <div className="relative w-32 h-32">
          <div className="absolute inset-0 rounded-full border-t-4 border-b-4 border-purple-500 animate-spin"></div>
          <div className="absolute inset-0 rounded-full border-l-4 border-r-4 border-blue-500 animate-spin animation-delay-150 animate-spin-reverse"></div>
          <div className="absolute inset-12 rounded-full border-t-4 border-b-4 border-cyan-500 animate-spin animation-delay-300"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-500 animate-pulse">
              Loading
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!course || !currentModule) {
    return (
      <div className={`min-h-screen bg-gradient-to-br ${currentTheme.bgStart} ${currentTheme.bgEnd} text-white flex flex-col items-center justify-center`}>
        <div className="p-8 bg-gray-800 bg-opacity-30 backdrop-blur-xl rounded-2xl border border-gray-700 text-center max-w-md">
          <div className="mb-6 w-24 h-24 mx-auto relative">
            <div className="absolute inset-0 rounded-full bg-red-500 bg-opacity-20 animate-ping animation-duration-2000"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
          <h1 className="text-3xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-red-400 to-orange-500">Course Not Found</h1>
          <p className="mb-8 text-gray-300">The course you are looking for does not exist or has been removed.</p>
          <Link href="/education" className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-xl transition-all transform hover:scale-105 hover:shadow-lg hover:shadow-purple-500/20 inline-flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
            Back to Education
          </Link>
        </div>
      </div>
    );
  }

  // Sample quiz questions for UI display
  const sampleQuizQuestions = [
    {
      id: 'q1',
      question: 'Which of the following is a correct way to initialize an array in JavaScript?',
      options: [
        { id: 'a', text: 'var arr = Array(3, 4, 5)' },
        { id: 'b', text: 'var arr = [3, 4, 5]' },
        { id: 'c', text: 'var arr = new Array[3, 4, 5]' },
        { id: 'd', text: 'var arr = (3, 4, 5)' }
      ],
      correctAnswer: 'b'
    },
    {
      id: 'q2',
      question: 'What does the "P" stand for in the MERN stack?',
      options: [
        { id: 'a', text: 'Python' },
        { id: 'b', text: 'PHP' },
        { id: 'c', text: 'PostgreSQL' },
        { id: 'd', text: 'None of the above' }
      ],
      correctAnswer: 'd'
    },
    {
      id: 'q3',
      question: 'Which MongoDB method is used to find documents that match certain criteria?',
      options: [
        { id: 'a', text: 'search()' },
        { id: 'b', text: 'filter()' },
        { id: 'c', text: 'find()' },
        { id: 'd', text: 'lookup()' }
      ],
      correctAnswer: 'c'
    }
  ];

  return (
    <div className={`h-screen flex flex-col bg-gradient-to-br ${currentTheme.bgStart} ${currentTheme.bgEnd} text-white relative overflow-hidden`}>
      {/* Animated background elements */}
      <div className="fixed inset-0 z-0 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxkZWZzPjxwYXR0ZXJuIGlkPSJncmlkIiB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHBhdHRlcm5Vbml0cz0idXNlclNwYWNlT25Vc2UiPjxwYXRoIGQ9Ik0gNDAgMCBMIDAgMCAwIDQwIiBmaWxsPSJub25lIiBzdHJva2U9InJnYmEoMTI4LCAxMjgsIDI1NSwgMC4wOCkiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3QgeD0iMCIgeT0iMCIgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')]"></div>
        <div className="absolute -top-20 -right-20 w-96 h-96 bg-purple-500 rounded-full mix-blend-screen filter blur-[100px] opacity-20 animate-blob animation-delay-1000"></div>
        <div className="absolute top-60 -left-20 w-96 h-96 bg-blue-500 rounded-full mix-blend-screen filter blur-[100px] opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-20 right-60 w-96 h-96 bg-pink-500 rounded-full mix-blend-screen filter blur-[100px] opacity-20 animate-blob"></div>
      </div>

      {/* Theme toggle */}
      <button 
        onClick={toggleTheme}
        className="absolute top-4 right-20 z-50 w-10 h-10 rounded-full bg-gray-800 bg-opacity-70 backdrop-blur-md flex items-center justify-center hover:bg-opacity-90 transition-all shadow-lg border border-gray-700"
        aria-label="Toggle theme"
      >
        {theme === 'cosmic' ? (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-purple-400" viewBox="0 0 20 20" fill="currentColor">
            <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
          </svg>
        ) : theme === 'cyber' ? (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-cyan-400" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-emerald-400" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
          </svg>
        )}
      </button>

      {/* Header */}
      <header className="bg-gray-900 bg-opacity-70 backdrop-blur-xl border-b border-gray-800 py-3 px-4 flex items-center justify-between z-20 relative">
        <div className="flex items-center">
          <button 
            onClick={toggleSidebar}
            className="mr-3 lg:hidden p-2 rounded-full bg-gray-800 hover:bg-gray-700 transition-all"
            aria-label="Toggle sidebar"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
            </svg>
          </button>
          <Link href={`/courses/${courseId}`} className="text-white hover:text-gray-300 transition-colors flex items-center">
            <div className={`hidden sm:flex h-9 w-9 rounded-lg bg-gradient-to-br ${currentTheme.primary} items-center justify-center mr-3 shadow-lg shadow-${currentTheme.glow}-500/20`}>
              <span className="text-xl animate-pulse">{course.icon}</span>
            </div>
            <div>
              <h1 className="font-bold text-lg truncate max-w-[200px] bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
                {course.title}
              </h1>
              <div className="text-xs text-gray-400 flex items-center">
                <span className="inline-block w-2 h-2 rounded-full bg-green-500 mr-1.5 animate-pulse"></span>
                Learning in progress
              </div>
            </div>
          </Link>
        </div>

        <div className="flex items-center space-x-4">
          <div className="hidden md:flex items-center">
            <div className="relative w-48 h-2 bg-gray-800 rounded-full overflow-hidden mr-2 shadow-inner">
              <div 
                className={`absolute inset-y-0 left-0 bg-gradient-to-r ${currentTheme.primary} transition-all duration-1000 ease-out`} 
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            <span className={`text-xs ${currentTheme.text} font-medium`}>{progress}%</span>
          </div>

          <Link 
            href={`/courses/${courseId}`}
            className="p-2 bg-gray-800 hover:bg-gray-700 rounded-full transition-all hover:scale-110"
            aria-label="Return to course page"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </Link>
        </div>
        
        {/* Shimmer effect on header */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gray-500 to-transparent"></div>
      </header>

      <div className="flex flex-1 overflow-hidden relative z-10">
        {/* Course Content Sidebar */}
        <aside 
          className={`bg-gradient-to-b ${currentTheme.sidebar} w-full lg:w-96 fixed lg:relative inset-0 z-20 transform ${
            isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
          } transition-transform duration-500 ease-in-out lg:block overflow-y-auto flex-shrink-0 border-r ${currentTheme.border} shadow-xl`}
        >
          <div className="sticky top-0 z-10 backdrop-blur-md bg-gray-900 bg-opacity-80 px-4 py-3 border-b border-gray-800 flex items-center justify-between">
            <h2 className="font-bold text-lg bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 mr-2 ${currentTheme.text}`} viewBox="0 0 20 20" fill="currentColor">
                <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
              </svg>
              Course Journey
            </h2>
            <button 
              onClick={toggleSidebar}
              className="lg:hidden p-2 rounded-full hover:bg-gray-700 transition-colors"
              aria-label="Close sidebar"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>

          <div className="px-4 py-3 flex items-center justify-between backdrop-blur-sm bg-gray-800 bg-opacity-30">
            <div className="text-sm flex items-center gap-2">
              <div className="relative h-6 w-6 flex-shrink-0">
                <div className="absolute inset-0 rounded-full border-2 border-gray-700"></div>
                <div 
                  className={`absolute inset-0 rounded-full border-2 border-${currentTheme.glow}-500`}
                  style={{ clipPath: `polygon(0 0, ${progress}% 0, ${progress}% 100%, 0 100%)` }}
                ></div>
                <div className="absolute inset-0 flex items-center justify-center text-xs font-bold">
                  {progress}%
                </div>
              </div>
              <span className="text-gray-400">
                {course.modules.length} lessons • {isCompleted.filter(Boolean).length} completed
              </span>
            </div>
            <div className="flex items-center gap-1 text-blue-400 hover:text-blue-300 cursor-pointer">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
              </svg>
              <span className="text-xs">Expand all</span>
            </div>
          </div>

          {/* Timeline view of modules */}
          <div className="py-4 px-2 relative" ref={timelineRef}>
            <div className="absolute left-[22px] top-12 bottom-12 w-0.5 bg-gray-700 z-0"></div>
            
            {/* Modules section */}
            <div className="bg-gray-800 bg-opacity-40 backdrop-blur-sm px-3 py-2 text-sm font-semibold text-white mb-4 rounded-lg flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 mr-1.5 ${currentTheme.text}`} viewBox="0 0 20 20" fill="currentColor">
                <path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z" />
              </svg>
              Learning Modules
            </div>
            
            {course.modules.map((module, index) => (
              <div 
                key={index} 
                className={`relative z-10 mb-6 ml-2 transition-all duration-300 ease-in-out ${
                  hoveredModule === index ? 'transform scale-102 -translate-y-1' : ''
                }`}
                onMouseEnter={() => setHoveredModule(index)}
                onMouseLeave={() => setHoveredModule(null)}
              >
                <div 
                  className={`timeline-dot absolute left-3 top-4 w-4 h-4 rounded-full border-2 border-gray-700 bg-gray-900 z-20 transition-all duration-300 ${
                    isCompleted[index] ? 'border-green-500 bg-green-900' : 
                    currentModuleIndex === index ? `border-${currentTheme.glow}-500 bg-${currentTheme.glow}-900` : ''
                  }`}
                ></div>
                {index < course.modules.length - 1 && (
                  <div className="timeline-line absolute left-5 top-8 w-0.5 h-12 bg-gray-700 z-10"></div>
                )}
                <button
                  onClick={() => selectModule(module, index)}
                  className={`w-full pl-10 pr-4 py-3 rounded-xl ${
                    currentModuleIndex === index 
                      ? `bg-gray-800 bg-opacity-60 backdrop-filter backdrop-blur-lg shadow-lg border border-${currentTheme.glow}-900` 
                      : hoveredModule === index 
                        ? `${currentTheme.moduleHover} backdrop-filter backdrop-blur-md` 
                        : 'hover:bg-gray-800 hover:bg-opacity-30'
                  } transition-all duration-300 text-left relative overflow-hidden group`}
                >
                  {/* Shimmer effect on hover */}
                  <div className={`absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-5 transform -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out ${hoveredModule === index ? 'animate-shimmer' : ''}`}></div>
                  
                  <div className="relative z-10 flex items-start">
                    <div className="flex-shrink-0 mt-0.5 w-6">
                      {isCompleted[index] ? (
                        <div className="animate-pulse-slow">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                        </div>
                      ) : (
                        <div className={`w-5 h-5 rounded-full border border-gray-600 flex items-center justify-center ${
                          currentModuleIndex === index ? `text-${currentTheme.glow}-400` : 'text-gray-500'
                        }`}>
                          {index + 1}
                        </div>
                      )}
                    </div>
                    
                    <div className="flex-1 min-w-0 ml-3">
                      <div className="flex items-center text-sm">
                        <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 mr-1.5 ${
                          currentModuleIndex === index ? currentTheme.text : 'text-gray-500'
                        }`} viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                        </svg>
                        <p className={`truncate pr-1 ${
                          currentModuleIndex === index 
                            ? 'text-white font-medium' 
                            : isCompleted[index]
                              ? currentTheme.completedIcon
                              : 'text-gray-400'
                        }`}>
                          {module.title}
                        </p>
                      </div>
                      <div className="mt-1 flex justify-between items-center">
                        <span className="text-xs text-gray-500">{module.duration}</span>
                        {isCompleted[index] && (
                          <span className="text-xs text-green-500 flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-0.5" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                            Completed
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </button>
              </div>
            ))}

            {/* Quizzes section */}
            <div className="bg-gray-800 bg-opacity-40 backdrop-blur-sm px-3 py-2 text-sm font-semibold text-white mb-4 rounded-lg flex items-center mt-8">
              <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 mr-1.5 ${currentTheme.text}`} viewBox="0 0 20 20" fill="currentColor">
                <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
              </svg>
              Knowledge Checks
            </div>
            
            {/* Module quiz item */}
            <div className="relative z-10 mb-6 ml-2">
              <div className="absolute left-3 top-4 w-4 h-4 rounded-full border-2 border-yellow-600 bg-yellow-900 z-20"></div>
              {/* Connect to final quiz */}
              <div className="absolute left-5 top-8 w-0.5 h-12 bg-gray-700 z-10"></div>
              
              <button
                onClick={() => setActiveTab('quiz')}
                className={`w-full pl-10 pr-4 py-3 rounded-xl ${
                  activeTab === 'quiz' 
                    ? `bg-gray-800 bg-opacity-60 backdrop-filter backdrop-blur-lg shadow-lg border border-yellow-900` 
                    : 'hover:bg-gray-800 hover:bg-opacity-30'
                } transition-all duration-300 text-left relative overflow-hidden group`}
              >
                {/* Shimmer effect on hover */}
                <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-5 transform -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out"></div>
                
                <div className="flex items-start">
                  <div className="flex-shrink-0 mt-0.5 w-6">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-500" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                      <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0 ml-3">
                    <div className="flex items-center text-sm">
                      <p className={`truncate pr-1 ${activeTab === 'quiz' ? 'text-white font-medium' : 'text-yellow-300'}`}>
                        Module {currentModuleIndex + 1} Quiz
                      </p>
                    </div>
                    <div className="mt-1 flex items-center justify-between">
                      <span className="text-xs text-gray-500">3 questions • 5 min</span>
                      <span className="text-xs px-1.5 py-0.5 rounded bg-yellow-900 bg-opacity-50 text-yellow-300">Required</span>
                    </div>
                  </div>
                </div>
              </button>
            </div>

            {/* Final course quiz */}
            <div className="relative z-10 mb-6 ml-2">
              <div className="absolute left-3 top-4 w-4 h-4 rounded-full border-2 border-orange-600 bg-orange-900 z-20"></div>
              
              <button
                className="w-full pl-10 pr-4 py-3 rounded-xl hover:bg-gray-800 hover:bg-opacity-30 transition-all duration-300 text-left relative overflow-hidden group"
              >
                {/* Shimmer effect on hover */}
                <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-5 transform -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out"></div>
                
                <div className="flex items-start">
                  <div className="flex-shrink-0 mt-0.5 w-6">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-orange-500" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0 ml-3">
                    <div className="flex items-center text-sm">
                      <p className="truncate pr-1 text-orange-300">
                        Final Course Assessment
                      </p>
                    </div>
                    <div className="mt-1 flex items-center justify-between">
                      <span className="text-xs text-gray-500">10 questions • 15 min</span>
                      <span className="text-xs px-1.5 py-0.5 rounded bg-gray-700 text-gray-300">Locked</span>
                    </div>
                  </div>
                </div>
              </button>
            </div>
            
            {/* Certificate section */}
            <div className="mt-8 p-4 rounded-xl bg-gradient-to-r from-gray-800 to-gray-900 border border-gray-700 relative overflow-hidden group">
              {/* Animated glow */}
              <div className={`absolute inset-0 bg-gradient-to-r ${currentTheme.secondary} opacity-0 group-hover:opacity-10 transition-opacity duration-1000`}></div>
              
              {/* Certificate Badge */}
              <div className="flex items-center">
                <div className={`flex-shrink-0 mr-4 w-12 h-12 rounded-full bg-gradient-to-br ${currentTheme.primary} flex items-center justify-center shadow-lg`}>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="text-sm font-semibold text-white">Course Certificate</h3>
                  <p className="text-xs text-gray-400 mt-1">Complete all modules and quizzes to earn your certificate</p>
                  <div className="mt-2 w-full bg-gray-700 h-1.5 rounded-full overflow-hidden">
                    <div 
                      className={`h-full bg-gradient-to-r ${currentTheme.secondary}`}
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* Content area with overlay when sidebar is open on mobile */}
        <main 
          ref={contentRef}
          className="flex-1 overflow-auto relative"
          onClick={() => window.innerWidth < 1024 && isSidebarOpen && setIsSidebarOpen(false)}
        >
          {/* Black overlay for mobile */}
          {isSidebarOpen && window.innerWidth < 1024 && (
            <div className="absolute inset-0 bg-black bg-opacity-50 z-10" />
          )}

          <div className="max-w-5xl mx-auto px-4 lg:px-8 py-5">
            <div className="flex flex-col space-y-4">
              {/* Video/Quiz tab navigation */}
              <div className="flex border-b border-gray-700">
                <button
                  onClick={() => setActiveTab('video')}
                  className={`px-6 py-3 font-medium text-sm rounded-t-lg relative overflow-hidden transition-all duration-300 ${
                    activeTab === 'video'
                      ? `text-white bg-gray-800 bg-opacity-50 border-b-2 border-${currentTheme.glow}-500`
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  {activeTab === 'video' && (
                    <div className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-blue-500 to-transparent transform translate-x-[-100%] animate-slide-right"></div>
                  )}
                  <div className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                    </svg>
                    <span>Video Lesson</span>
                  </div>
                </button>
                <button
                  onClick={() => setActiveTab('quiz')}
                  className={`px-6 py-3 font-medium text-sm rounded-t-lg relative overflow-hidden transition-all duration-300 ${
                    activeTab === 'quiz'
                      ? `text-white bg-gray-800 bg-opacity-50 border-b-2 border-${currentTheme.glow}-500`
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  {activeTab === 'quiz' && (
                    <div className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-yellow-500 to-transparent transform translate-x-[-100%] animate-slide-right"></div>
                  )}
                  <div className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                      <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
                    </svg>
                    <span>Module Quiz</span>
                  </div>
                </button>
              </div>

              {/* Content header with title and navigation */}
              <div className="flex justify-between items-center">
                <div>
                  <h1 className={`text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white via-${currentTheme.glow}-200 to-white flex items-center`}>
                    <span className="bg-gray-800 rounded-full w-8 h-8 flex items-center justify-center mr-2 text-sm text-white">
                      {currentModuleIndex + 1}
                    </span>
                    {activeTab === 'video' ? currentModule.title : `Knowledge Check: ${currentModule.title}`}
                  </h1>
                  <div className="flex items-center mt-1 text-sm text-gray-400">
                    {activeTab === 'video' ? (
                      <>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                        </svg>
                        {currentModule.duration}
                        {isVideoPlaying && (
                          <span className="flex items-center ml-3">
                            <span className="h-1.5 w-1.5 rounded-full bg-red-500 mr-1 animate-ping-slow"></span>
                            <span className="text-red-400">Now playing</span>
                          </span>
                        )}
                      </>
                    ) : (
                      <>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                        </svg>
                        5 min • 3 questions • Unlock next module
                      </>
                    )}
                  </div>
                </div>
                <div className="flex gap-2 items-center">
                  {/* Module navigation */}
                  <div className="flex shadow-lg rounded-lg overflow-hidden">
                    <button
                      onClick={goToPreviousModule}
                      disabled={currentModuleIndex === 0}
                      className={`p-2 transition-all duration-300 ${
                        currentModuleIndex === 0
                          ? 'bg-gray-800 opacity-50 cursor-not-allowed'
                          : 'bg-gray-800 hover:bg-gray-700'
                      }`}
                      aria-label="Previous module"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </button>
                    <div className="bg-gray-800 px-3 py-2 text-sm flex items-center text-gray-300">
                      Module {currentModuleIndex + 1}/{course.modules.length}
                    </div>
                    <button
                      onClick={goToNextModule}
                      disabled={currentModuleIndex === course.modules.length - 1}
                      className={`p-2 transition-all duration-300 ${
                        currentModuleIndex === course.modules.length - 1
                          ? 'bg-gray-800 opacity-50 cursor-not-allowed'
                          : 'bg-gray-800 hover:bg-gray-700'
                      }`}
                      aria-label="Next module"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>

              {/* Video player or Quiz content */}
              {activeTab === 'video' ? (
                // Video content
                <>
                 <div className="relative aspect-video bg-black rounded-lg overflow-hidden shadow-lg border border-gray-800 group transition-all duration-300 transform hover:scale-[1.01] hover:shadow-xl">
                    {/* Video play button overlay - only show when not playing */}
                    {!isVideoPlaying && (
                      <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center group-hover:bg-opacity-40 transition-all duration-300 z-20">
                        <button
                          onClick={() => setIsVideoPlaying(true)}
                          className={`w-20 h-20 rounded-full bg-opacity-80 backdrop-blur-sm bg-gradient-to-br ${currentTheme.primary} flex items-center justify-center transform transition-all duration-300 group-hover:scale-110 hover:scale-105 hover:shadow-xl hover:shadow-${currentTheme.glow}-500/20`}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-9 w-9 text-white" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                          </svg>
                        </button>
                      </div>
                    )}
                    
                    {/* Video thumbnail overlay - only show when not playing */}
                    {!isVideoPlaying && (
                      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black opacity-80 z-10"></div>
                    )}
                    
                    {/* Video player */}
                    <iframe
                      ref={videoRef}
                      className="absolute inset-0 w-full h-full"
                      src={`https://www.youtube.com/embed/${currentModule.videoId}?${isVideoPlaying ? 'autoplay=1' : 'controls=0'}`}
                      title={currentModule.title}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    ></iframe>
                    
                    {/* Video title overlay at bottom */}
                    {!isVideoPlaying && (
                      <div className="absolute bottom-0 left-0 right-0 p-4 z-30">
                        <h3 className="text-white font-medium">{currentModule.title}</h3>
                        <div className="flex items-center text-sm text-gray-300 mt-1">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                          </svg>
                          {currentModule.duration}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Controls under video */}
                  <div className={`rounded-lg shadow-lg backdrop-filter backdrop-blur-lg bg-opacity-20 border overflow-hidden transition-all duration-500 ${expandedNotes ? 'bg-gray-800 border-gray-700' : `bg-gray-800 border-${currentTheme.glow}-900`}`}>
                    <div className={`p-4 border-b ${expandedNotes ? 'border-gray-700' : 'border-transparent'} transition-all duration-300`}>
                      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => markAsCompleted(currentModuleIndex)}
                            className={`px-4 py-2 rounded-lg flex items-center space-x-2 transition-all duration-300 ${
                              isCompleted[currentModuleIndex] 
                                ? 'bg-green-600 hover:bg-green-700 text-white shadow-lg shadow-green-500/20' 
                                : `bg-gradient-to-r ${currentTheme.button} text-white shadow-lg shadow-${currentTheme.glow}-500/20 hover:shadow-${currentTheme.glow}-500/40 hover:scale-105`
                            }`}
                          >
                            {isCompleted[currentModuleIndex] ? (
                              <>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                                <span>Completed</span>
                              </>
                            ) : (
                              <>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v3.586L7.707 9.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 10.586V7z" clipRule="evenodd" />
                                </svg>
                                <span>Mark as Completed</span>
                              </>
                            )}
                          </button>
                        </div>

                        <div className="flex items-center space-x-3 text-sm">
                          <button 
                            className={`text-gray-400 hover:text-white transition-colors flex items-center gap-1.5 px-3 py-1.5 rounded-lg ${expandedNotes ? 'bg-gray-700' : 'hover:bg-gray-700 hover:bg-opacity-40'}`}
                            onClick={() => setExpandedNotes(!expandedNotes)}
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                              <path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" />
                              <path fillRule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd" />
                            </svg>
                            <span>{expandedNotes ? 'Hide Notes' : 'Take Notes'}</span>
                          </button>
                          <button className="text-gray-400 hover:text-white transition-colors flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-gray-700 hover:bg-opacity-40">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                              <path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z" />
                            </svg>
                            <span>Share</span>
                          </button>
                          <button className="text-gray-400 hover:text-white transition-colors flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-gray-700 hover:bg-opacity-40">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                            </svg>
                            <span>Help</span>
                          </button>
                        </div>
                      </div>
                    </div>
                    
                    {/* Expandable notes area */}
                    {expandedNotes && (
                      <div className="p-4">
                        <h3 className="text-sm font-medium text-gray-300 mb-2 flex items-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                          </svg>
                          Personal Notes for this Module
                        </h3>
                        <textarea
                          className="w-full h-32 bg-gray-700 bg-opacity-50 rounded-lg p-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                          placeholder="Type your notes here... They will be saved automatically when you switch modules."
                          value={noteText}
                          onChange={(e) => setNoteText(e.target.value)}
                        ></textarea>
                        <div className="mt-2 text-xs text-gray-500 flex items-center justify-between">
                          <div>Notes are saved locally in your browser</div>
                          <button 
                            className="text-blue-400 hover:text-blue-300 flex items-center gap-1"
                            onClick={() => {
                              if (currentModule._id) {
                                saveNote(currentModule._id);
                              }
                            }}
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
                              <path d="M7.707 10.293a1 1 0 10-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 11.586V6h5a2 2 0 012 2v7a2 2 0 01-2 2H4a2 2 0 01-2-2V8a2 2 0 012-2h5v5.586l-1.293-1.293zM9 4a1 1 0 012 0v2H9V4z" />
                            </svg>
                            Save Now
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Module content/description */}
                  <div className="bg-gray-800 bg-opacity-30 backdrop-filter backdrop-blur-lg rounded-lg p-6 shadow-lg border border-gray-800">
                    <h2 className="text-lg font-semibold mb-4 flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 mr-2 ${currentTheme.text}`} viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                      </svg>
                      About this module
                    </h2>
                    <p className="text-gray-300 mb-6 leading-relaxed">{currentModule.description}</p>
                    
                    <div className="flex flex-wrap gap-3 mt-4">
                      <div className="px-3 py-1.5 rounded-full bg-gray-700 bg-opacity-50 text-gray-300 text-sm flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
                        </svg>
                        Learning
                      </div>
                      <div className="px-3 py-1.5 rounded-full bg-gray-700 bg-opacity-50 text-gray-300 text-sm flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5 text-purple-400" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z" />
                        </svg>
                        Beginner Friendly
                      </div>
                      <div className="px-3 py-1.5 rounded-full bg-gray-700 bg-opacity-50 text-gray-300 text-sm flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        Credit Eligible
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                // Quiz content
                <div className="bg-gray-800 bg-opacity-30 backdrop-filter backdrop-blur-lg rounded-lg overflow-hidden shadow-lg border border-gray-800">
                  {/* Quiz header */}
                  <div className={`bg-gradient-to-r ${currentTheme.quizBg} p-6 border-b border-gray-700 relative overflow-hidden`}>
                    {/* Decorative shapes */}
                    <div className="absolute top-0 right-0 w-60 h-60 bg-white opacity-5 rounded-full -mt-20 -mr-20"></div>
                    <div className="absolute bottom-0 left-0 w-40 h-40 bg-white opacity-5 rounded-full -mb-20 -ml-20"></div>
                    
                    <h2 className="text-xl font-bold mb-2 relative">Knowledge Check: Module {currentModuleIndex + 1}</h2>
                    <p className="text-gray-300 relative">Test your understanding of the concepts from this module. Complete this quiz to unlock the next section.</p>
                    
                    <div className="flex flex-wrap items-center gap-3 mt-5 relative">
                      <div className="bg-black bg-opacity-30 backdrop-filter backdrop-blur-sm rounded-full text-sm px-3 py-1.5 flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                        </svg>
                        3 questions
                      </div>
                      <div className="bg-black bg-opacity-30 backdrop-filter backdrop-blur-sm rounded-full text-sm px-3 py-1.5 flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                        </svg>
                        5 minutes
                      </div>
                      <div className="bg-black bg-opacity-30 backdrop-filter backdrop-blur-sm rounded-full text-sm px-3 py-1.5 flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M18 8a6 6 0 01-7.743 5.743L10 14l-1 1-1 1H6v-1l1-1 1-1 .257-.257A6 6 0 1118 8zm-6-4a1 1 0 100 2 2 2 0 012 2 1 1 0 102 0 4 4 0 00-4-4z" clipRule="evenodd" />
                        </svg>
                        Pass score: 70%
                      </div>
                    </div>
                  </div>

                  {/* Quiz questions */}
                  <div className="p-6 space-y-8">
                    {sampleQuizQuestions.map((question, qIndex) => (
                      <div 
                        key={question.id} 
                        className={`rounded-xl p-6 transition-all duration-500 ${
                          qIndex === 0 
                            ? 'bg-gray-700 border border-gray-600 shadow-lg' 
                            : 'opacity-50 bg-gray-800 bg-opacity-30'
                        }`}
                      >
                        <div className="flex items-center mb-4">
                          <div className={`h-8 w-8 rounded-full flex items-center justify-center font-bold mr-3 ${
                            qIndex === 0 ? 'bg-blue-600 text-white' : 'bg-gray-600 text-gray-300'
                          }`}>
                            {qIndex + 1}
                          </div>
                          <h3 className="text-lg font-medium">{question.question}</h3>
                        </div>
                        
                        <div className="space-y-3 ml-10">
                          {question.options.map((option) => (
                            <div key={option.id} className="flex items-center">
                              <div className="relative">
                                <input
                                  type="radio"
                                  id={`${question.id}-${option.id}`}
                                  name={question.id}
                                  value={option.id}
                                  className="sr-only"
                                  disabled={qIndex !== 0}
                                />
                                <label 
                                  htmlFor={`${question.id}-${option.id}`}
                                  className={`flex items-center p-3 border rounded-lg transition-all duration-300 cursor-pointer ${
                                    qIndex === 0 
                                      ? 'border-gray-600 hover:border-blue-500 hover:bg-gray-600 hover:bg-opacity-30' 
                                      : 'border-gray-700 cursor-not-allowed'
                                  }`}
                                >
                                  <span className={`flex-shrink-0 h-5 w-5 rounded-full border mr-3 flex items-center justify-center ${
                                    qIndex === 0 ? 'border-gray-500' : 'border-gray-600'
                                  }`}>
                                    <span className="h-2.5 w-2.5 rounded-full bg-blue-500 opacity-0 transition-opacity duration-300 peer-checked:opacity-100"></span>
                                  </span>
                                  <span className={`block ${qIndex === 0 ? 'text-white' : 'text-gray-400'}`}>
                                    {option.text}
                                  </span>
                                </label>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Quiz footer */}
                  <div className="px-6 py-4 bg-gray-900 border-t border-gray-700 flex justify-between items-center">
                    <div>
                      <span className="text-sm text-gray-400">Question 1 of 3</span>
                    </div>
                    <div className="flex space-x-3">
                      <button className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg text-sm font-medium transition-colors cursor-not-allowed opacity-50" disabled>
                        Previous
                      </button>
                      <button className={`px-4 py-2 bg-gradient-to-r ${currentTheme.primary} text-white rounded-lg text-sm font-medium transition-all hover:shadow-lg hover:shadow-${currentTheme.glow}-500/20 transform hover:scale-105 flex items-center space-x-1`}>
                        <span>Next Question</span>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Navigation controls (only shown in video tab) */}
              {activeTab === 'video' && (
                <div className="flex justify-between mt-6">
                  <button
                    onClick={goToPreviousModule}
                    disabled={currentModuleIndex === 0}
                    className={`flex items-center px-5 py-2.5 rounded-lg transition-all duration-300 ${
                      currentModuleIndex === 0
                        ? 'bg-gray-800 text-gray-500 cursor-not-allowed'
                        : 'bg-gray-800 hover:bg-gray-700 text-white'
                    }`}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Previous Module
                  </button>

                  <button
                    onClick={() => {
                      if (currentModuleIndex === course.modules.length - 1) {
                        // If last module, navigate to quiz
                        setActiveTab('quiz');
                      } else {
                        // Otherwise go to next module
                        goToNextModule();
                      }
                    }}
                    className={`flex items-center px-5 py-2.5 rounded-lg transition-all duration-300 ${
                      currentModuleIndex === course.modules.length - 1
                        ? `bg-gradient-to-r from-yellow-500 to-orange-600 text-white shadow-lg hover:shadow-yellow-500/20 transform hover:scale-105`
                        : `bg-gradient-to-r ${currentTheme.button} text-white shadow-lg hover:shadow-${currentTheme.glow}-500/20 transform hover:scale-105`
                    }`}
                  >
                    <span>{currentModuleIndex === course.modules.length - 1 ? 'Take Final Quiz' : 'Next Module'}</span>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
      
      {/* Module completion animation - only shown when completing a module */}
      {showCompletionAnimation && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-60 backdrop-filter backdrop-blur-sm">
          <div className="relative">
            <div className={`w-32 h-32 rounded-full bg-gradient-to-r ${currentTheme.primary} flex items-center justify-center animate-ping-slow absolute inset-0`}></div>
            <div className={`w-32 h-32 rounded-full bg-gradient-to-r ${currentTheme.primary} flex items-center justify-center relative`}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-white animate-bounce-slow" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
          <div className="absolute mt-40 text-center">
            <h2 className="text-2xl font-bold text-white mb-2">Module Completed!</h2>
            <p className="text-gray-300 mb-4">You've successfully completed this module.</p>
            <div className="flex justify-center">
              <div className="bg-gray-800 bg-opacity-50 backdrop-blur-md rounded-full px-3 py-1.5 text-sm text-gray-300">
                {progress}% of course complete
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Custom animated styles */}
      <style jsx>{`
        /* Animation utilities */
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          25% { transform: translate(10px, -10px) scale(1.05); }
          50% { transform: translate(0, 20px) scale(0.95); }
          75% { transform: translate(-10px, -10px) scale(1.05); }
        }
        
        @keyframes ping-slow {
          75%, 100% { transform: scale(2); opacity: 0; }
        }
        
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(-5%); animation-timing-function: cubic-bezier(0.8, 0, 1, 1); }
          50% { transform: translateY(0); animation-timing-function: cubic-bezier(0, 0, 0.2, 1); }
        }
        
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        
        @keyframes slide-right {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(0); }
        }
        
        @keyframes spin-reverse {
          from { transform: rotate(0deg); }
          to { transform: rotate(-360deg); }
        }
        
        .animation-delay-150 {
          animation-delay: 150ms;
        }
        
        .animation-delay-300 {
          animation-delay: 300ms;
        }
        
        .animation-delay-1000 {
          animation-delay: 1000ms;
        }
        
        .animation-delay-2000 {
          animation-delay: 2000ms;
        }
        
        .animation-duration-2000 {
          animation-duration: 2000ms;
        }
        
        .animate-blob {
          animation: blob 8s infinite ease-in-out;
        }
        
        .animate-ping-slow {
          animation: ping-slow 2s cubic-bezier(0, 0, 0.2, 1) infinite;
        }
        
        .animate-bounce-slow {
          animation: bounce-slow 2s infinite;
        }
        
        .animate-shimmer {
          animation: shimmer 2s linear infinite;
        }
        
        .animate-slide-right {
          animation: slide-right 0.5s ease-out forwards;
        }
        
        .animate-spin-reverse {
          animation: spin-reverse 1s linear infinite;
        }
        
        .scale-102 {
          --tw-scale-x: 1.02;
          --tw-scale-y: 1.02;
          transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));
        }
        
        /* Timeline styles */
        .timeline-dot.active {
          @apply bg-blue-500 border-blue-300;
          box-shadow: 0 0 0 2px rgba(96, 165, 250, 0.3);
        }
        
        .timeline-line.active {
          @apply bg-blue-500;
        }
      `}</style>
    </div>
  );
}