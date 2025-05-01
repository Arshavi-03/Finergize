import { NextResponse } from 'next/server';

interface SubmitLoanRequest {
  loanType: string;
  personalInfo: {
    fullName: string;
    age: string | number;
    gender: string;
  };
  documentInfo: {
    idType: string;
    idNumber: string;
  };
  contactInfo: {
    email: string;
    phoneNumber: string;
  };
  documentVerified?: boolean;
}

export async function POST(req: Request) {
  try {
    // Parse the request body with error handling
    let data: SubmitLoanRequest;
    try {
      data = await req.json();
    } catch (parseError) {
      console.error('Error parsing request body:', parseError);
      return NextResponse.json(
        { error: 'Invalid request format' },
        { status: 400 }
      );
    }
    
    // Destructure with null checks
    const loanType = data?.loanType;
    const personalInfo = data?.personalInfo;
    const documentInfo = data?.documentInfo;
    const contactInfo = data?.contactInfo;
    const documentVerified = data?.documentVerified;

    // Validate required fields
    if (!loanType || !personalInfo || !documentInfo || !contactInfo) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate ID Number format based on ID type - with safer access
    let idNumberValid = true;
    const idNumber = documentInfo?.idNumber || '';
    const idType = documentInfo?.idType || '';
    
    if (idType === 'aadhaar' && !/^\d{12}$/.test(idNumber)) {
      idNumberValid = false;
    } else if (idType === 'pan' && !/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(idNumber)) {
      idNumberValid = false;
    } else if (idType === 'voter' && !/^[A-Z]{3}\d{7}$/.test(idNumber)) {
      // Basic format check for voter ID (format may vary by state)
      idNumberValid = false;
    }
    
    if (!idNumberValid) {
      return NextResponse.json(
        { error: `Invalid ${idType.toUpperCase()} number format` },
        { status: 400 }
      );
    }

    // For development/testing: Mock database operations
    if (process.env.NODE_ENV === 'development') {
      // Simulate successful operation
      console.log('Development mode: Simulating successful database operation');
      
      // Return mock success response
      return NextResponse.json({
        message: 'Loan application submitted successfully',
        applicationId: 'mock-id-' + Date.now(),
        verificationStatus: documentVerified ? 'verified' : 'pending'
      }, { status: 201 });
    }

    // ----------- ACTUAL DATABASE OPERATIONS --------------
    // These are commented out for testing but will be used in production
    
    // Connect to database (wrapped in try/catch)
    try {
      // Import dynamically to avoid issues with Next.js
      const { default: dbConnect } = await import('@/lib/database/config');
      await dbConnect();
    } catch (dbError) {
      console.error('Database connection error:', dbError);
      return NextResponse.json(
        { error: 'Database connection failed' },
        { status: 500 }
      );
    }

    // Find account with error handling
    let account;
    try {
      const { Account } = await import('@/models/Accounts');
      account = await Account.findOne({ 
        name: personalInfo.fullName.toUpperCase() 
      });

      if (!account) {
        return NextResponse.json(
          { error: 'No account found with this name. Please ensure you enter your name exactly as per your account.' },
          { status: 404 }
        );
      }

      // If account exists, check if it has a userId
      if (!account.userId) {
        return NextResponse.json(
          { error: 'Account exists but is not properly configured. Please contact support.' },
          { status: 400 }
        );
      }
    } catch (accountError) {
      console.error('Error finding account:', accountError);
      return NextResponse.json(
        { error: 'Failed to validate account' },
        { status: 500 }
      );
    }

    // Create and save loan application
    try {
      const { LoanApplication } = await import('@/models/LoanApplication');
      
      const newLoanApplication = new LoanApplication({
        accountId: account._id,
        loanType,
        personalInfo: {
          fullName: personalInfo.fullName,
          age: personalInfo.age,
          gender: personalInfo.gender
        },
        documentInfo: {
          idType: documentInfo.idType,
          idNumber: documentInfo.idNumber,
          verified: documentVerified || false
        },
        contactInfo: {
          email: contactInfo.email,
          phoneNumber: contactInfo.phoneNumber
        },
        applicationStatus: documentVerified ? 'verified' : 'pending_verification'
      });

      await newLoanApplication.save();

      return NextResponse.json({
        message: 'Loan application submitted successfully',
        applicationId: newLoanApplication._id,
        verificationStatus: documentVerified ? 'verified' : 'pending'
      }, { status: 201 });
    } catch (saveError) {
      console.error('Error saving loan application:', saveError);
      return NextResponse.json(
        { error: 'Failed to save loan application' },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error('Error submitting loan application:', error);
    return NextResponse.json(
      { error: 'Failed to submit loan application' },
      { status: 500 }
    );
  }
}