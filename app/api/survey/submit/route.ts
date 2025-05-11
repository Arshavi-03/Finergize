// app/api/survey/submit/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import dbConnect from '@/lib/database/config';
import User from '@/models/User';

interface SurveySubmitRequestBody {
  responses: Record<string, string | number | string[]>;
}

export async function POST(request: NextRequest) {
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

    // Get request body
    const body = await request.json() as SurveySubmitRequestBody;

    // Validate survey responses
    const { responses } = body;
    if (!responses || typeof responses !== 'object') {
      return NextResponse.json({ error: 'Invalid survey responses' }, { status: 400 });
    }

    // Clear previous responses
    user.survey.responses = [];

    // Save each response
    for (const [questionId, response] of Object.entries(responses)) {
      await user.addSurveyResponse(questionId, response);
    }

    try {
      // Submit survey to external API and get recommendations
      const recommendations = await user.submitSurvey();
      
      // Return success with recommendations
      return NextResponse.json({ 
        success: true, 
        message: 'Survey completed successfully',
        recommendations
      });
    } catch (apiError) {
      console.error('Error from external recommendation API:', apiError);
      return NextResponse.json({ error: 'Failed to get recommendations from external API' }, { status: 502 });
    }
  } catch (error) {
    console.error('Error submitting survey:', error);
    return NextResponse.json({ error: 'Failed to submit survey' }, { status: 500 });
  }
}