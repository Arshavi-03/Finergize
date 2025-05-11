// app/api/survey/preliminary/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import dbConnect from '@/lib/database/config';
import User from '@/models/User';

interface PreliminaryRequestBody {
  location: string;
  age: string;
  interest: string;
  literacy_level: string;
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
    const body = await request.json() as PreliminaryRequestBody;

    // Validate preliminary data
    const { location, age, interest, literacy_level } = body;
    if (!location || !age || !interest || !literacy_level) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Save preliminary survey data
    await user.setPreliminarySurvey({
      location,
      age,
      interest,
      literacy_level
    });

    // Return success
    return NextResponse.json({ 
      success: true, 
      message: 'Preliminary survey saved successfully',
      preliminary_data: user.survey.preliminary
    });
  } catch (error) {
    console.error('Error saving preliminary survey:', error);
    return NextResponse.json({ error: 'Failed to save preliminary survey' }, { status: 500 });
  }
}