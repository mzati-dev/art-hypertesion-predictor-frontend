import { NextResponse } from 'next/server';
import { adminAuth } from '@/lib/firebase-admin';
import { DecodedIdToken } from 'firebase-admin/auth';

export async function POST(request: Request) {
  try {
    // 1. Parse and validate request body
    const requestBody = await request.json().catch(() => null);
    
    if (!requestBody || !requestBody.idToken || typeof requestBody.idToken !== 'string') {
      return NextResponse.json(
        { error: 'Invalid request: ID token is required' },
        { status: 400 }
      );
    }

    const { idToken } = requestBody;

    // 2. Verify the ID token
    let decodedToken: DecodedIdToken;
    try {
      decodedToken = await adminAuth.verifyIdToken(idToken);
    } catch (error) {
      return NextResponse.json(
        { error: 'Invalid or expired authentication token' },
        { status: 401 }
      );
    }

    // 3. Create session cookie (5 days expiration)
    const expiresIn = 5 * 24 * 60 * 60 * 1000; // 5 days in ms
    const sessionCookie = await adminAuth.createSessionCookie(idToken, { expiresIn });

    // 4. Create response with cookie
    const response = NextResponse.json(
      { 
        status: 'success',
        uid: decodedToken.uid,
        email: decodedToken.email 
      },
      { status: 200 }
    );

    response.cookies.set({
      name: 'session',
      value: sessionCookie,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: expiresIn / 1000, // Convert to seconds
      path: '/',
    });

    return response;

  } catch (error: any) {
    console.error('Session creation error:', error);
    
    // Handle specific Firebase errors
    let errorMessage = 'Authentication failed';
    let statusCode = 500;
    
    if (error.code === 'auth/id-token-expired') {
      errorMessage = 'Session expired - please sign in again';
      statusCode = 401;
    } else if (error.code === 'auth/invalid-id-token') {
      errorMessage = 'Invalid authentication token';
      statusCode = 401;
    }

    return NextResponse.json(
      { 
        error: errorMessage,
        code: error.code || 'authentication_error' 
      },
      { status: statusCode }
    );
  }
}