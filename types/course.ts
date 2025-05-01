// Define the types for our content
export interface CourseModule {
    _id?: string;
    title: string;
    description: string;
    videoId: string; // YouTube video ID
    duration: string;
  }
  
  export interface CourseContent {
    _id: string;
    title: string;
    description: string;
    category: string;
    icon: string;
    bgColor: string;
    modules: CourseModule[];
    createdAt?: string;
    updatedAt?: string;
  }
  
  // Response type for the API
  export interface ApiResponse {
    success: boolean;
    data?: any;
    error?: string;
  }