import { NextResponse } from 'next/server';
import dbConnect from '@/lib/database/config';
import Course from '@/models/Course';

export async function GET(request: Request) {
  try {
    // Extract query parameters
    const url = new URL(request.url);
    const category = url.searchParams.get('category');
    
    // Connect to the database
    await dbConnect();
    
    // Build the query
    const query = category ? { category } : {};
    
    // Fetch courses from the database
    const courses = await Course.find(query).sort({ createdAt: -1 });
    
    // Return the courses
    return NextResponse.json(courses, { status: 200 });
  } catch (error) {
    console.error('Error fetching courses:', error);
    return NextResponse.json(
      { error: 'Failed to fetch courses' },
      { status: 500 }
    );
  }
}