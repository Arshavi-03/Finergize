import { NextResponse } from 'next/server';
import dbConnect from '@/lib/database/config';
import Course from '@/models/Course';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Get the course ID from the URL
    const { id } = params;

    // Connect to the database
    await dbConnect();

    // Find the course by ID
    const course = await Course.findById(id);

    // If course not found
    if (!course) {
      return NextResponse.json(
        { error: 'Course not found' },
        { status: 404 }
      );
    }

    // Return the course
    return NextResponse.json(course, { status: 200 });
  } catch (error) {
    console.error('Error fetching course by ID:', error);
    return NextResponse.json(
      { error: 'Failed to fetch course' },
      { status: 500 }
    );
  }
}