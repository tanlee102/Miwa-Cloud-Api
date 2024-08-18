import { NextResponse } from 'next/server';
import { OAuth2Client } from 'google-auth-library';
import dotenv from 'dotenv';
import axios from 'axios';

export const dynamic = 'force-dynamic';

dotenv.config();

const clientId = process.env.GOOGLE_CLIENT_ID;
const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
const redirectUri = process.env.GOOGLE_REDIRECT_URI;

const oauth2Client = new OAuth2Client(clientId, clientSecret, redirectUri);

function generateRandomPassword(length) {
  const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let password = "";
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charset.length);
    password += charset[randomIndex];
  }
  return password;
}

export async function GET(request) {

  try {
    
    const url = new URL(request.url);
    const code = url.searchParams.get('code');

    if (!code) {
      throw new Error('No code provided');
    }

    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);

    const userInfoResponse = await oauth2Client.request({
      url: 'https://www.googleapis.com/oauth2/v2/userinfo',
    });
    const userInfo = userInfoResponse.data;

    if(userInfo?.email){

      const API_URL = 'http://8.219.96.109/api/v1/auth/third'; // Replace with your actual backend API endpoint
      const API_KEY = process.env.API_KEY; // Replace with your actual API key
      const randomPassword = generateRandomPassword(13); // Generates an 13-character random password

      const randomUsername = (userInfo?.name + generateRandomPassword(7)).toLowerCase().replace(/\s/g, '');

      try {
        const response = await axios.post(API_URL, {
          "username": randomUsername,
          "email": userInfo?.email,
          "password": randomPassword,
          "role": "USER"
        }, {
          headers: {
            'API-KEY': API_KEY
          }
        });

        // Create a new response with a redirect
        const redirectResponse = NextResponse.redirect('https://miwabox.netlify.app?token='+response.data.token);

        // Set the cookies in the redirect response
        const cookieOptions = {
          // httpOnly: true,
          // secure: process.env.NODE_ENV === 'production',
          path: '/',
          // sameSite: 'strict'
          expires: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000) // 7 days from now
        };
  
        redirectResponse.cookies.set('token', response.data.token, cookieOptions);
        redirectResponse.cookies.set('email', userInfo?.email, cookieOptions);
        redirectResponse.cookies.set('username', randomUsername, cookieOptions);

        return redirectResponse;

      } catch (error) {
        return NextResponse.json({ error: error }, { status: error.response?.status });
      }

    }else{
      return NextResponse.json({ error: error }, { status: 400 });
    }

  } catch (error) {
    console.error('Error handling callback:', error);
    return NextResponse.json({ error: error }, { status: 400 });

  }
}
