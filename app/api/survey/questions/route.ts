// app/api/survey/questions/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import dbConnect from '@/lib/database/config';
import User from '@/models/User';

export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Connect to database
    await dbConnect();

    // Find user
    const user = await User.findOne({ phone: session.user.phone });
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Check if user has preliminary data
    if (!user.survey || !user.survey.preliminary) {
      return NextResponse.json({ 
        error: 'Missing preliminary survey data',
        preliminary_completed: false
      }, { status: 400 });
    }

    try {
      // Use the user model method to fetch questions from external API
      const questions = await user.fetchSurveyQuestions();
      
      // Return survey questions
      return NextResponse.json({ 
        success: true, 
        survey: questions,
        user_context: {
          location: user.survey.preliminary.location,
          age: user.survey.preliminary.age,
          interest: user.survey.preliminary.interest,
          literacy_level: user.survey.preliminary.literacy_level
        }
      });
    } catch (apiError) {
      console.error('Error from external survey API:', apiError);
      return NextResponse.json({ error: 'Failed to fetch survey questions from external API' }, { status: 502 });
    }
  } catch (error) {
    console.error('Error fetching survey questions:', error);
    return NextResponse.json({ error: 'Failed to fetch survey questions' }, { status: 500 });
  }
}