// Define the interface for course progress data
export interface CourseProgress {
    courseId: string;
    completedModules: string[]; // Array of completed module IDs
    lastAccessedModule: string; // ID of the last accessed module
    lastAccessedAt: Date;
  }
  
  const STORAGE_KEY = 'finergize_course_progress';
  
  /**
   * Get course progress for all courses
   */
  export function getAllCoursesProgress(): Record<string, CourseProgress> {
    if (typeof window === 'undefined') return {};
    
    try {
      const progressData = localStorage.getItem(STORAGE_KEY);
      return progressData ? JSON.parse(progressData) : {};
    } catch (error) {
      console.error('Error getting course progress:', error);
      return {};
    }
  }
  
  /**
   * Get progress for a specific course
   * @param courseId Course ID
   */
  export function getCourseProgress(courseId: string): CourseProgress | null {
    const allProgress = getAllCoursesProgress();
    return allProgress[courseId] || null;
  }
  
  /**
   * Initialize progress for a course if it doesn't exist
   * @param courseId Course ID
   */
  export function initCourseProgress(courseId: string): CourseProgress {
    const allProgress = getAllCoursesProgress();
    
    if (!allProgress[courseId]) {
      const newProgress: CourseProgress = {
        courseId,
        completedModules: [],
        lastAccessedModule: '',
        lastAccessedAt: new Date()
      };
      
      allProgress[courseId] = newProgress;
      saveCourseProgress(allProgress);
      return newProgress;
    }
    
    return allProgress[courseId];
  }
  
  /**
   * Save all course progress data
   * @param progressData Progress data object
   */
  function saveCourseProgress(progressData: Record<string, CourseProgress>): void {
    if (typeof window === 'undefined') return;
    
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(progressData));
    } catch (error) {
      console.error('Error saving course progress:', error);
    }
  }
  
  /**
   * Mark a module as completed
   * @param courseId Course ID
   * @param moduleId Module ID
   */
  export function markModuleAsCompleted(courseId: string, moduleId: string): void {
    const allProgress = getAllCoursesProgress();
    const courseProgress = allProgress[courseId] || initCourseProgress(courseId);
    
    if (!courseProgress.completedModules.includes(moduleId)) {
      courseProgress.completedModules.push(moduleId);
      courseProgress.lastAccessedModule = moduleId;
      courseProgress.lastAccessedAt = new Date();
      
      allProgress[courseId] = courseProgress;
      saveCourseProgress(allProgress);
    }
  }
  
  /**
   * Mark a module as not completed (toggle)
   * @param courseId Course ID
   * @param moduleId Module ID
   */
  export function toggleModuleCompletion(courseId: string, moduleId: string): void {
    const allProgress = getAllCoursesProgress();
    const courseProgress = allProgress[courseId] || initCourseProgress(courseId);
    
    const index = courseProgress.completedModules.indexOf(moduleId);
    if (index > -1) {
      // Remove the module from completed list
      courseProgress.completedModules.splice(index, 1);
    } else {
      // Add the module to completed list
      courseProgress.completedModules.push(moduleId);
    }
    
    courseProgress.lastAccessedModule = moduleId;
    courseProgress.lastAccessedAt = new Date();
    
    allProgress[courseId] = courseProgress;
    saveCourseProgress(allProgress);
  }
  
  /**
   * Update the last accessed module
   * @param courseId Course ID
   * @param moduleId Module ID
   */
  export function updateLastAccessedModule(courseId: string, moduleId: string): void {
    const allProgress = getAllCoursesProgress();
    const courseProgress = allProgress[courseId] || initCourseProgress(courseId);
    
    courseProgress.lastAccessedModule = moduleId;
    courseProgress.lastAccessedAt = new Date();
    
    allProgress[courseId] = courseProgress;
    saveCourseProgress(allProgress);
  }
  
  /**
   * Calculate completion percentage for a course
   * @param courseId Course ID
   * @param totalModules Total number of modules in the course
   */
  export function calculateCourseCompletion(courseId: string, totalModules: number): number {
    const progress = getCourseProgress(courseId);
    
    if (!progress || totalModules === 0) return 0;
    
    return Math.round((progress.completedModules.length / totalModules) * 100);
  }
  
  /**
   * Check if a module is completed
   * @param courseId Course ID
   * @param moduleId Module ID
   */
  export function isModuleCompleted(courseId: string, moduleId: string): boolean {
    const progress = getCourseProgress(courseId);
    
    if (!progress) return false;
    
    return progress.completedModules.includes(moduleId);
  }
  
  /**
   * Reset progress for a course
   * @param courseId Course ID
   */
  export function resetCourseProgress(courseId: string): void {
    const allProgress = getAllCoursesProgress();
    
    if (allProgress[courseId]) {
      delete allProgress[courseId];
      saveCourseProgress(allProgress);
    }
  }