import { NextResponse } from 'next/server';
import { OAuth2Client } from 'google-auth-library';
import dotenv from 'dotenv';

// Load environment variables from .env.local
dotenv.config();

const clientId = process.env.GOOGLE_CLIENT_ID;
const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
const redirectUri = process.env.GOOGLE_REDIRECT_URI; // This should point to the redirect API route

// Log environment variables for debugging
console.log('Client ID:', clientId);
console.log('Client Secret:', clientSecret);
console.log('Redirect URI:', redirectUri);

const oauth2Client = new OAuth2Client(clientId, clientSecret, redirectUri);

export const dynamic = 'force-dynamic';

export async function GET(request) {
  try {
    
    const authUrl = oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: ['https://www.googleapis.com/auth/userinfo.profile', 'https://www.googleapis.com/auth/userinfo.email'],
    });

    console.log(authUrl);

    return NextResponse.redirect(authUrl);

  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'Error when getting login url.' }, { status: 400 });
  }
}