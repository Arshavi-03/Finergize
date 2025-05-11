import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(request: NextRequest) {
  // Get the pathname of the request
  const path = request.nextUrl.pathname;
  
  // Skip middleware for public paths
  const publicPaths = [
    '/login',
    '/register',
    '/api',
    '/_next',
    '/survey',
    '/favicon.ico',
    '/', // Allow homepage access
    '/about'
  ];
  
  // Check if path matches any public path
  if (publicPaths.some(publicPath => 
    path === publicPath || 
    path.startsWith(`${publicPath}/`) ||
    path.includes('.')
  )) {
    return NextResponse.next();
  }
  
  // Check for authentication token
  const token = await getToken({ 
    req: request, 
    secret: process.env.NEXTAUTH_SECRET 
  });
  
  // If not logged in, redirect to login
  if (!token) {
    const url = new URL('/login', request.url);
    // Pass the current path as a callback URL
    url.searchParams.set('callbackUrl', encodeURIComponent(path));
    return NextResponse.redirect(url);
  }

  // Continue to the requested page - don't check for survey completion here
  return NextResponse.next();
}

// Configure which routes use this middleware
export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};