import { CourseContent } from '@/types/course';

export async function getAllCourses(): Promise<CourseContent[]> {
  try {
    const response = await fetch('/api/courses', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    });

    if (!response.ok) {
      throw new Error('Failed to fetch courses');
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching courses:', error);
    return [];
  }
}

export async function getCoursesByCategory(category: string): Promise<CourseContent[]> {
  try {
    const response = await fetch(`/api/courses?category=${category}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch courses for category: ${category}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`Error fetching courses for category ${category}:`, error);
    return [];
  }
}

export async function getCourseById(id: string): Promise<CourseContent | null> {
  try {
    const response = await fetch(`/api/courses/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch course with id: ${id}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`Error fetching course with id ${id}:`, error);
    return null;
  }
}