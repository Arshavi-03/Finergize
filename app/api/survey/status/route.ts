// app/api/survey/status/route.ts
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

    // Get survey status
    const surveyStatus = {
      preliminary_completed: !!(user.survey && user.survey.preliminary),
      survey_completed: !!(user.survey && user.survey.completed),
      preliminary_data: user.survey?.preliminary || null,
      responses: user.survey?.responses || [],
      recommendations: user.survey?.recommendations || null,
    };

    // Get responses in the format the frontend expects
    if (surveyStatus.responses.length > 0) {
      surveyStatus.responses_object = user.getSurveyResponsesForApi();
    }

    // Return survey status
    return NextResponse.json({ 
      success: true, 
      survey_status: surveyStatus,
    });
  } catch (error) {
    console.error('Error fetching survey status:', error);
    return NextResponse.json({ error: 'Failed to fetch survey status' }, { status: 500 });
  }
}