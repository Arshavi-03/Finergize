'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { getCourseById } from '@/services/courseService';
import { CourseContent } from '@/types/course';

export default function CourseDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [course, setCourse] = useState<CourseContent | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'modules' | 'reviews'>('modules');
  const courseId = Array.isArray(params.id) ? params.id[0] : params.id;
  const headerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        setIsLoading(true);
        const courseData = await getCourseById(courseId);
        if (courseData) {
          setCourse(courseData);
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

  // For parallax effect on header
  useEffect(() => {
    const handleScroll = () => {
      if (headerRef.current) {
        const scrollPosition = window.scrollY;
        headerRef.current.style.transform = `translateY(${scrollPosition * 0.4}px)`;
        headerRef.current.style.opacity = `${1 - scrollPosition / 700}`;
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const startCourse = () => {
    router.push(`/courses/${courseId}/learn`);
  };

  // For hover effect on the module cards
  const [hoveredModule, setHoveredModule] = useState<number | null>(null);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900 text-white flex items-center justify-center">
        <div className="relative h-32 w-32">
          <div className="absolute inset-0 rounded-full border-t-4 border-blue-500 border-opacity-50 animate-spin"></div>
          <div className="absolute inset-0 rounded-full border-r-4 border-purple-500 border-opacity-50 animate-spin animate-delay-200"></div>
          <div className="absolute inset-0 rounded-full border-b-4 border-pink-500 border-opacity-50 animate-spin animate-delay-400"></div>
          <div className="absolute inset-8 flex items-center justify-center">
            <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${course?.bgColor || 'from-blue-600 to-blue-900'} flex items-center justify-center`}>
              <svg className="animate-pulse" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <polyline points="12 6 12 12 16 14"></polyline>
              </svg>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900 text-white flex flex-col items-center justify-center">
        <div className="p-8 bg-gray-800 bg-opacity-80 backdrop-blur-lg rounded-2xl shadow-2xl border border-gray-700 max-w-md mx-auto text-center">
          <div className="w-24 h-24 mx-auto mb-6 bg-red-500 bg-opacity-20 rounded-full flex items-center justify-center">
            <svg className="w-12 h-12 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="12"></line>
              <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>
          </div>
          <h1 className="text-3xl font-bold mb-4">Course Not Found</h1>
          <p className="mb-8 text-gray-300">The course you are looking for does not exist or has been removed.</p>
          <Link href="/education" 
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white font-bold rounded-lg transition-all transform hover:scale-105 inline-flex items-center shadow-lg hover:shadow-blue-500/20">
            <svg className="w-5 h-5 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="19" y1="12" x2="5" y2="12"></line>
              <polyline points="12 19 5 12 12 5"></polyline>
            </svg>
            Back to Education
          </Link>
        </div>
      </div>
    );
  }

  const totalDuration = course.modules.reduce((total, module) => {
    const parts = module.duration.split(':');
    const minutes = parseInt(parts[0]);
    const seconds = parseInt(parts[1]);
    return total + minutes + (seconds / 60);
  }, 0);

  const totalDurationFormatted = `${Math.floor(totalDuration)} min`;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 text-white overflow-x-hidden">
      {/* Animated background elements */}
      <div className="fixed inset-0 z-0 overflow-hidden opacity-40">
        <div className="absolute -top-20 -right-20 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-5xl opacity-30 animate-blob animation-delay-2000"></div>
        <div className="absolute top-60 -left-20 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-5xl opacity-30 animate-blob animation-delay-4000"></div>
        <div className="absolute -bottom-20 right-60 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-5xl opacity-30 animate-blob"></div>
      </div>

      {/* Hero header with parallax effect */}
      <div ref={headerRef} className="relative h-[45vh] bg-gray-900 overflow-hidden">
        {/* Course icon overlay */}
        <div className="absolute right-0 top-0 -m-16 opacity-40 z-0">
          <div className={`w-96 h-96 bg-gradient-to-br ${course.bgColor} rounded-full flex items-center justify-center blur-lg`}>
            <span className="text-[20rem] transform -translate-y-16">{course.icon}</span>
          </div>
        </div>

        {/* Course details */}
        <div className="absolute inset-0 flex items-center z-10">
          <div className="container mx-auto px-6 lg:px-14 py-8">
            <div className="max-w-4xl relative">
              {/* Category tag */}
              <div className="mb-4 transform -translate-y-1 animate-fade-in">
                <span className="bg-gradient-to-r from-blue-600 to-blue-400 text-sm px-4 py-1.5 rounded-full font-medium text-white inline-flex items-center shadow-lg shadow-blue-900/30">
                  {course.category.charAt(0).toUpperCase() + course.category.slice(1).replace('-', ' ')}
                  <span className="flex h-2 w-2 ml-2">
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-white">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                    </span>
                  </span>
                </span>
              </div>
              
              {/* Course title with animated gradient */}
              <h1 className="text-4xl md:text-6xl font-extrabold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-white via-blue-100 to-white animate-shine">
                {course.title}
              </h1>
              
              {/* Course stats */}
              <div className="flex flex-wrap items-center gap-4 text-gray-300 mb-8">
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-blue-600 bg-opacity-20 flex items-center justify-center mr-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span>{totalDurationFormatted}</span>
                </div>
                
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-purple-600 bg-opacity-20 flex items-center justify-center mr-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-purple-400" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z" />
                    </svg>
                  </div>
                  <span>{course.modules.length} modules</span>
                </div>
                
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-green-600 bg-opacity-20 flex items-center justify-center mr-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span>Certificate included</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Curved divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" className="fill-gray-900">
            <path fillOpacity="1" d="M0,224L48,213.3C96,203,192,181,288,181.3C384,181,480,203,576,202.7C672,203,768,181,864,165.3C960,149,1056,139,1152,144C1248,149,1344,171,1392,181.3L1440,192L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
          </svg>
        </div>
      </div>

      {/* Fixed top navigation */}
      <div className="sticky top-0 z-30 bg-gray-900 bg-opacity-90 backdrop-blur-lg border-b border-gray-800 shadow-lg animate-fade-in-down">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Link href="/education" className="text-gray-400 hover:text-white transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </Link>
              <div className="flex items-center">
                <div className={`w-8 h-8 rounded-md bg-gradient-to-br ${course.bgColor} flex items-center justify-center mr-2`}>
                  <span className="text-xl">{course.icon}</span>
                </div>
                <h1 className="text-lg font-bold truncate max-w-xs">{course.title}</h1>
              </div>
            </div>
            
            <button onClick={startCourse} className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white font-semibold rounded-lg text-sm transition-all transform hover:scale-105 shadow-lg hover:shadow-blue-500/20 hidden sm:flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
              </svg>
              Start Learning
            </button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="container mx-auto px-4 py-8 relative z-10">
        <div className="flex flex-wrap -mx-4">
          {/* Left column - Main content */}
          <div className="w-full lg:w-8/12 px-4 mb-8 lg:mb-0">
            {/* Tabs navigation */}
            <div className="flex mb-8 border-b border-gray-800 overflow-x-auto no-scrollbar">
              <button 
                onClick={() => setActiveTab('overview')}
                className={`px-6 py-3 font-medium text-sm whitespace-nowrap ${activeTab === 'overview' ? 'text-blue-400 border-b-2 border-blue-400' : 'text-gray-400 hover:text-gray-200'}`}
              >
                Overview
              </button>
              <button 
                onClick={() => setActiveTab('modules')}
                className={`px-6 py-3 font-medium text-sm whitespace-nowrap ${activeTab === 'modules' ? 'text-blue-400 border-b-2 border-blue-400' : 'text-gray-400 hover:text-gray-200'}`}
              >
                Course Content
              </button>
              <button 
                onClick={() => setActiveTab('reviews')}
                className={`px-6 py-3 font-medium text-sm whitespace-nowrap ${activeTab === 'reviews' ? 'text-blue-400 border-b-2 border-blue-400' : 'text-gray-400 hover:text-gray-200'}`}
              >
                Reviews & Feedback
              </button>
            </div>

            {/* Overview tab */}
            {activeTab === 'overview' && (
              <div className="space-y-8 animate-fade-in-up">
                <div className="bg-gray-800 bg-opacity-50 backdrop-filter backdrop-blur-lg rounded-2xl overflow-hidden shadow-xl border border-gray-700">
                  <div className="p-6">
                    <h2 className="text-2xl font-bold mb-4 flex items-center">
                      <span className="w-10 h-10 rounded-full bg-blue-500 bg-opacity-20 flex items-center justify-center mr-3">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                        </svg>
                      </span>
                      About This Course
                    </h2>
                    <p className="text-gray-300 leading-relaxed text-lg">{course.description}</p>
                  </div>
                </div>

                <div className="bg-gray-800 bg-opacity-50 backdrop-filter backdrop-blur-lg rounded-2xl overflow-hidden shadow-xl border border-gray-700">
                  <div className="p-6">
                    <h2 className="text-2xl font-bold mb-4 flex items-center">
                      <span className="w-10 h-10 rounded-full bg-green-500 bg-opacity-20 flex items-center justify-center mr-3">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                      </span>
                      What You'll Learn
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {course.modules.map((module, index) => (
                        <div key={index} className="flex items-start group">
                          <div className="w-10 h-10 mt-0.5 rounded-full bg-gray-700 bg-opacity-70 flex-shrink-0 flex items-center justify-center mr-3 group-hover:bg-blue-900 transition-colors">
                            <span className="text-gray-300 group-hover:text-blue-300 transition-colors">{index + 1}</span>
                          </div>
                          <div>
                            <p className="font-medium text-white group-hover:text-blue-300 transition-colors">{module.title}</p>
                            <p className="text-sm text-gray-400 mt-1">{module.duration}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="bg-gray-800 bg-opacity-50 backdrop-filter backdrop-blur-lg rounded-2xl overflow-hidden shadow-xl border border-gray-700 relative">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-600 to-indigo-700 rounded-bl-3xl opacity-20 transform rotate-12"></div>
                  <div className="p-6 relative z-10">
                    <h2 className="text-2xl font-bold mb-4 flex items-center">
                      <span className="w-10 h-10 rounded-full bg-purple-500 bg-opacity-20 flex items-center justify-center mr-3">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-purple-400" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
                        </svg>
                      </span>
                      Skills You'll Gain
                    </h2>
                    <div className="flex flex-wrap gap-3">
                      <span className="px-4 py-2 rounded-full bg-purple-900 bg-opacity-40 text-purple-300 text-sm border border-purple-700">Problem Solving</span>
                      <span className="px-4 py-2 rounded-full bg-blue-900 bg-opacity-40 text-blue-300 text-sm border border-blue-700">Critical Thinking</span>
                      <span className="px-4 py-2 rounded-full bg-green-900 bg-opacity-40 text-green-300 text-sm border border-green-700">Financial Analysis</span>
                      <span className="px-4 py-2 rounded-full bg-pink-900 bg-opacity-40 text-pink-300 text-sm border border-pink-700">Strategic Planning</span>
                      <span className="px-4 py-2 rounded-full bg-yellow-900 bg-opacity-40 text-yellow-300 text-sm border border-yellow-700">Decision Making</span>
                      <span className="px-4 py-2 rounded-full bg-indigo-900 bg-opacity-40 text-indigo-300 text-sm border border-indigo-700">Data Analysis</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Modules tab */}
            {activeTab === 'modules' && (
              <div className="animate-fade-in-up">
                <div className="bg-gray-800 bg-opacity-50 backdrop-filter backdrop-blur-lg rounded-2xl overflow-hidden shadow-xl border border-gray-700">
                  <div className="p-6">
                    <div className="flex justify-between items-center mb-6">
                      <h2 className="text-2xl font-bold flex items-center">
                        <span className="w-10 h-10 rounded-full bg-blue-500 bg-opacity-20 flex items-center justify-center mr-3">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z" />
                          </svg>
                        </span>
                        Course Content
                      </h2>
                      <div className="text-sm text-gray-400">
                        {course.modules.length} modules • {totalDurationFormatted}
                      </div>
                    </div>
                    
                    <div className="space-y-4 relative">
                      {/* Vertical timeline line */}
                      <div className="absolute left-5 top-8 bottom-8 w-0.5 bg-gray-700 z-0"></div>
                      
                      {course.modules.map((module, index) => (
                        <div 
                          key={index} 
                          className={`relative z-10 flex transition-all duration-300 transform ${
                            hoveredModule === index ? 'scale-102 -translate-y-1' : ''
                          }`}
                          onMouseEnter={() => setHoveredModule(index)}
                          onMouseLeave={() => setHoveredModule(null)}
                        >
                          {/* Timeline dot */}
                          <div className="flex-shrink-0 z-10">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${
                              hoveredModule === index 
                                ? 'bg-blue-600 border-blue-400' 
                                : 'bg-gray-800 border-gray-600'
                            } transition-colors`}>
                              <span className={`text-sm font-medium ${
                                hoveredModule === index ? 'text-white' : 'text-gray-400'
                              }`}>{index + 1}</span>
                            </div>
                          </div>
                          
                          {/* Module card */}
                          <div className={`flex-grow ml-4 p-5 rounded-xl ${
                            hoveredModule === index 
                              ? 'bg-gradient-to-r from-gray-800 to-gray-900 shadow-lg border border-blue-800'
                              : 'bg-gray-800 bg-opacity-60 border border-gray-700'
                            } transition-all`}>
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between">
                              <div className="mb-2 sm:mb-0">
                                <h3 className={`font-semibold ${
                                  hoveredModule === index ? 'text-blue-300' : 'text-white'
                                } transition-colors`}>{module.title}</h3>
                                <p className={`text-sm ${
                                  hoveredModule === index ? 'text-gray-300' : 'text-gray-400'
                                } mt-1 transition-colors`}>{module.description}</p>
                              </div>
                              <div className="flex items-center">
                                <span className="text-xs bg-gray-700 px-2 py-1 rounded-full mr-3 text-gray-300">
                                  {module.duration}
                                </span>
                                <button className={`w-8 h-8 rounded-full flex items-center justify-center ${
                                  hoveredModule === index 
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-gray-700 text-gray-300'
                                  } transition-colors`}>
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                                  </svg>
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Certification section */}
                  <div className="border-t border-gray-700 bg-gradient-to-r from-blue-900 via-indigo-900 to-purple-900 p-6 relative overflow-hidden">
                    {/* Decorative elements */}
                    <div className="absolute -right-12 -top-12 w-48 h-48 bg-blue-500 opacity-20 rounded-full"></div>
                    <div className="absolute right-12 bottom-6 w-24 h-24 bg-purple-500 opacity-20 rounded-full"></div>
                    
                    <div className="flex flex-col md:flex-row items-center justify-between relative z-10">
                      <div className="mb-4 md:mb-0">
                        <h3 className="text-xl font-bold text-white">Course Completion Certificate</h3>
                        <p className="text-gray-300 mt-1">Earn a certificate upon completion of the entire course</p>
                      </div>
                      <button onClick={startCourse} className="px-6 py-3 bg-white text-indigo-900 hover:bg-gray-100 font-bold rounded-lg transition-all transform hover:scale-105 shadow-xl inline-flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V7.414A2 2 0 0015.414 6L12 2.586A2 2 0 0010.586 2H6zm5 6a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V8z" clipRule="evenodd" />
                        </svg>
                        Start Course Now
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Reviews tab */}
            {activeTab === 'reviews' && (
              <div className="animate-fade-in-up">
                <div className="bg-gray-800 bg-opacity-50 backdrop-filter backdrop-blur-lg rounded-2xl overflow-hidden shadow-xl border border-gray-700">
                  <div className="p-6">
                    <h2 className="text-2xl font-bold mb-6 flex items-center">
                      <span className="w-10 h-10 rounded-full bg-yellow-500 bg-opacity-20 flex items-center justify-center mr-3">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      </span>
                      Student Reviews
                    </h2>
                    
                    {/* Rating summary */}
                    <div className="flex flex-col md:flex-row bg-gray-900 bg-opacity-50 rounded-xl p-6 mb-6">
                      <div className="mb-6 md:mb-0 md:mr-6 md:w-1/3 flex flex-col items-center justify-center">
                        <div className="text-5xl font-bold text-white mb-2">4.8</div>
                        <div className="flex mb-2">
                          {[1, 2, 3, 4].map(star => (
                            <svg key={star} xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          ))}
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        </div>
                        <p className="text-gray-400 text-sm">Course Rating</p>
                      </div>
                      
                      <div className="md:w-2/3">
                        {[5, 4, 3, 2, 1].map(rating => (
                          <div key={rating} className="flex items-center mb-2">
                            <div className="flex items-center mr-2 w-16">
                              <span className="text-sm text-gray-400">{rating} stars</span>
                            </div>
                            <div className="flex-grow bg-gray-700 h-2 rounded-full">
                              <div 
                                className={`h-full rounded-full ${
                                  rating >= 4 ? 'bg-green-500' : rating >= 3 ? 'bg-yellow-500' : 'bg-red-500'
                                }`}
                                style={{ width: `${
                                  rating === 5 ? '75%' : 
                                  rating === 4 ? '20%' : 
                                  rating === 3 ? '3%' : 
                                  rating === 2 ? '1%' : '1%'
                                }` }}
                              ></div>
                            </div>
                            <div className="ml-2 w-10 text-right">
                              <span className="text-sm text-gray-400">
                                {rating === 5 ? '75%' : 
                                 rating === 4 ? '20%' : 
                                 rating === 3 ? '3%' : 
                                 rating === 2 ? '1%' : '1%'}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    {/* Sample reviews */}
                    <div className="space-y-6">
                      {[
                        {
                          name: "Alex Johnson",
                          avatar: "AJ",
                          rating: 5,
                          date: "2 weeks ago",
                          comment: "This course exceeded my expectations! The instructor explains complex concepts in a way that's easy to understand. I particularly enjoyed the practical examples."
                        },
                        {
                          name: "Maria Garcia",
                          avatar: "MG",
                          rating: 4,
                          date: "1 month ago",
                          comment: "Very informative course with great content. Would have given 5 stars if there were more interactive elements, but the video quality and explanations are excellent."
                        },
                        {
                          name: "David Lee",
                          avatar: "DL",
                          rating: 5,
                          date: "2 months ago",
                          comment: "The course was well-structured and provided valuable insights that I could immediately apply. Looking forward to more advanced courses from this instructor!"
                        }
                      ].map((review, idx) => (
                        <div key={idx} className="bg-gray-900 bg-opacity-50 rounded-xl p-6">
                          <div className="flex items-start">
                            <div className="flex-shrink-0 mr-4">
                              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center font-semibold text-white">
                                {review.avatar}
                              </div>
                            </div>
                            <div className="flex-grow">
                              <div className="flex justify-between items-center mb-2">
                                <h4 className="font-semibold text-white">{review.name}</h4>
                                <span className="text-sm text-gray-400">{review.date}</span>
                              </div>
                              <div className="flex mb-2">
                                {[...Array(5)].map((_, star) => (
                                  <svg 
                                    key={star} 
                                    xmlns="http://www.w3.org/2000/svg" 
                                    className={`h-4 w-4 ${star < review.rating ? 'text-yellow-400' : 'text-gray-600'}`} 
                                    viewBox="0 0 20 20" 
                                    fill="currentColor"
                                  >
                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                  </svg>
                                ))}
                              </div>
                              <p className="text-gray-300">{review.comment}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Load more button */}
                    <div className="mt-6 text-center">
                      <button className="px-6 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors">
                        Load More Reviews
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right column - Call to Action */}
          <div className="w-full lg:w-4/12 px-4">
            <div className="sticky top-24">
              <div className="bg-gray-800 bg-opacity-50 backdrop-filter backdrop-blur-lg rounded-2xl overflow-hidden shadow-xl border border-gray-700 mb-6">
                <div className="p-6">
                  <div className="flex flex-col sm:flex-row lg:flex-col items-center sm:items-start lg:items-center mb-6 relative">
                    {/* Course preview video thumbnail */}
                    <div className={`w-full h-48 flex-shrink-0 rounded-xl overflow-hidden mb-4 sm:mb-0 sm:mr-4 lg:mb-4 lg:mr-0 bg-gradient-to-br ${course.bgColor} relative group cursor-pointer`}>
                      {/* Play button overlay */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-16 h-16 rounded-full bg-white bg-opacity-25 backdrop-filter backdrop-blur-md flex items-center justify-center group-hover:bg-opacity-30 transform group-hover:scale-110 transition-all">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                          </svg>
                        </div>
                      </div>
                      
                      {/* Course icon */}
                      <div className="absolute inset-0 flex items-center justify-center opacity-20">
                        <span className="text-[150px] text-white">{course.icon}</span>
                      </div>
                      
                      {/* Text overlay */}
                      <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black to-transparent">
                        <p className="text-white font-semibold">Preview this course</p>
                        <p className="text-gray-300 text-sm">2:15 min preview</p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Course includes section */}
                  <div className="mb-6">
                    <h3 className="font-semibold text-lg mb-4">This course includes:</h3>
                    <ul className="space-y-3">
                      <li className="flex items-center text-gray-300">
                        <div className="w-10 h-10 rounded-full bg-blue-600 bg-opacity-20 flex items-center justify-center mr-3 flex-shrink-0">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <div>
                          <span className="font-medium text-white">{course.modules.length} on-demand videos</span>
                          <p className="text-xs text-gray-400">Watch anytime, anywhere</p>
                        </div>
                      </li>
                      <li className="flex items-center text-gray-300">
                        <div className="w-10 h-10 rounded-full bg-purple-600 bg-opacity-20 flex items-center justify-center mr-3 flex-shrink-0">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-purple-400" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M2 5a2 2 0 012-2h7a2 2 0 012 2v4a2 2 0 01-2 2H9l-3 3v-3H4a2 2 0 01-2-2V5z" />
                            <path d="M15 7v2a4 4 0 01-4 4H9.828l-1.766 1.767c.28.149.599.233.938.233h2l3 3v-3h2a2 2 0 002-2V9a2 2 0 00-2-2h-1z" />
                          </svg>
                        </div>
                        <div>
                          <span className="font-medium text-white">Direct mentor support</span>
                          <p className="text-xs text-gray-400">Get answers when you need them</p>
                        </div>
                      </li>
                      <li className="flex items-center text-gray-300">
                        <div className="w-10 h-10 rounded-full bg-green-600 bg-opacity-20 flex items-center justify-center mr-3 flex-shrink-0">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
                          </svg>
                        </div>
                        <div>
                          <span className="font-medium text-white">Completion certificate</span>
                          <p className="text-xs text-gray-400">Shareable on LinkedIn</p>
                        </div>
                      </li>
                      <li className="flex items-center text-gray-300">
                        <div className="w-10 h-10 rounded-full bg-yellow-600 bg-opacity-20 flex items-center justify-center mr-3 flex-shrink-0">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <div>
                          <span className="font-medium text-white">Full lifetime access</span>
                          <p className="text-xs text-gray-400">Learn at your own pace</p>
                        </div>
                      </li>
                    </ul>
                  </div>
                  
                  {/* CTA button */}
                  <button 
                    onClick={startCourse} 
                    className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white font-bold rounded-xl text-center transition-all transform hover:scale-105 hover:shadow-blue-900/40 shadow-xl uppercase tracking-wider flex items-center justify-center relative overflow-hidden group"
                  >
                    {/* Animated button shine effect */}
                    <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white to-transparent opacity-20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></span>
                    
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                    </svg>
                    Start Learning Now
                  </button>
                  
                  {/* Money-back guarantee */}
                  <div className="mt-4 flex items-center justify-center text-sm text-gray-400">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1.5 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    30-Day Money-Back Guarantee
                  </div>
                </div>
                
                {/* Social sharing */}
                <div className="border-t border-gray-700 p-6">
                  <h3 className="font-semibold mb-3">Share this course:</h3>
                  <div className="flex items-center space-x-2">
                    <button className="w-10 h-10 rounded-full bg-blue-800 hover:bg-blue-700 flex items-center justify-center transition-colors shadow-lg">
                      <svg className="h-5 w-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M22.675 0h-21.35c-.732 0-1.325.593-1.325 1.325v21.351c0 .731.593 1.324 1.325 1.324h11.495v-9.294h-3.128v-3.622h3.128v-2.671c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12v9.293h6.116c.73 0 1.323-.593 1.323-1.325v-21.35c0-.732-.593-1.325-1.325-1.325z" />
                      </svg>
                    </button>
                    <button className="w-10 h-10 rounded-full bg-blue-400 hover:bg-blue-500 flex items-center justify-center transition-colors shadow-lg">
                      <svg className="h-5 w-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                      </svg>
                    </button>
                    <button className="w-10 h-10 rounded-full bg-red-600 hover:bg-red-700 flex items-center justify-center transition-colors shadow-lg">
                      <svg className="h-5 w-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M21.593 7.203a2.506 2.506 0 0 0-1.762-1.766C18.265 5.007 12 5 12 5s-6.264-.007-7.831.404a2.56 2.56 0 0 0-1.766 1.778C2.017 8.765 2 12 2 12s.017 3.234.403 4.795c.222.786.823 1.384 1.766 1.766 1.582.43 7.83.437 7.83.437s6.265.007 7.831-.403a2.548 2.548 0 0 0 1.767-1.8c.387-1.56.404-4.795.404-4.795s-.017-3.234-.404-4.797zM9.996 15.005l.001-6 5.207 3-5.208 3z" />
                      </svg>
                    </button>
                    <button className="w-10 h-10 rounded-full bg-green-600 hover:bg-green-700 flex items-center justify-center transition-colors shadow-lg">
                      <svg className="h-5 w-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
              
              {/* Related courses card */}
              <div className="bg-gray-800 bg-opacity-50 backdrop-filter backdrop-blur-lg rounded-2xl overflow-hidden shadow-xl border border-gray-700">
                <div className="p-6">
                  <h3 className="font-semibold text-lg mb-4">Related Courses</h3>
                  <div className="space-y-4">
                    {[
                      {
                        title: "Advanced Financial Analysis",
                        icon: "📊",
                        bgColor: "from-purple-600 to-purple-900",
                        duration: "3 hours"
                      },
                      {
                        title: "Investment Strategies",
                        icon: "💹",
                        bgColor: "from-green-600 to-green-900",
                        duration: "4.5 hours"
                      },
                      {
                        title: "Risk Management",
                        icon: "🛡️",
                        bgColor: "from-red-600 to-red-900",
                        duration: "2.5 hours"
                      }
                    ].map((relatedCourse, idx) => (
                      <div key={idx} className="flex items-center p-3 rounded-xl transition-colors hover:bg-gray-700 cursor-pointer group">
                        <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${relatedCourse.bgColor} flex items-center justify-center mr-3 flex-shrink-0 transition-transform group-hover:scale-110`}>
                          <span className="text-2xl">{relatedCourse.icon}</span>
                        </div>
                        <div className="flex-grow">
                          <h4 className="font-medium text-white group-hover:text-blue-300 transition-colors">
                            {relatedCourse.title}
                          </h4>
                          <p className="text-sm text-gray-400">
                            {relatedCourse.duration}
                          </p>
                        </div>
                        <div className="flex-shrink-0 ml-2">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500 group-hover:text-blue-400 transition-colors" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Floating action button (mobile only) */}
      <div className="fixed bottom-6 right-6 sm:hidden z-20">
        <button
          onClick={startCourse}
          className="h-14 w-14 rounded-full bg-gradient-to-r from-blue-600 to-indigo-700 flex items-center justify-center shadow-lg shadow-blue-900/50 animate-pulse"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
          </svg>
        </button>
      </div>
      
      {/* Custom animations */}
      <style jsx>{`
        @keyframes blob {
          0%, 100% {
            transform: translate(0, 0) scale(1);
          }
          25% {
            transform: translate(10px, -10px) scale(1.05);
          }
          50% {
            transform: translate(0, 20px) scale(0.95);
          }
          75% {
            transform: translate(-10px, -10px) scale(1.05);
          }
        }
        
        @keyframes shine {
          from {
            background-position: 200% center;
          }
          to {
            background-position: -200% center;
          }
        }
        
        .animate-blob {
          animation: blob 8s infinite ease-in-out;
        }
        
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        
        .animate-shine {
          background-size: 200% auto;
          animation: shine 4s linear infinite;
        }
        
        .animate-fade-in {
          animation: fadeIn 0.5s ease-out forwards;
        }
        
        .animate-fade-in-down {
          animation: fadeInDown 0.5s ease-out forwards;
        }
        
        .animate-fade-in-up {
          animation: fadeInUp 0.5s ease-out forwards;
        }
        
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        
        @keyframes fadeInDown {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .scale-102 {
          transform: scale(1.02);
        }
        
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        
        .blur-5xl {
          --tw-blur: blur(100px);
          filter: var(--tw-blur) var(--tw-brightness) var(--tw-contrast) var(--tw-grayscale) var(--tw-hue-rotate) var(--tw-invert) var(--tw-saturate) var(--tw-sepia) var(--tw-drop-shadow);
        }
      `}</style>
    </div>
  );
}