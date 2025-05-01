import { NextResponse } from 'next/server';
import dbConnect from '@/lib/database/config';
import { LoanProvider } from '@/models/LoanProvider';

export async function GET(
  req: Request,
  { params }: { params: { providerId: string } }
) {
  try {
    await dbConnect();
    
    const { providerId } = params;
    
    if (!providerId) {
      return NextResponse.json(
        { error: 'Provider ID is required' },
        { status: 400 }
      );
    }
    
    const provider = await LoanProvider.findById(providerId);
    
    if (!provider) {
      return NextResponse.json(
        { error: 'Provider not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(provider);
    
  } catch (error) {
    console.error('Error fetching loan provider:', error);
    return NextResponse.json(
      { error: 'Failed to fetch loan provider' },
      { status: 500 }
    );
  }
}