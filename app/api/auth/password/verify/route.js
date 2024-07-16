import { NextResponse } from 'next/server';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import axios from 'axios';

export const dynamic = 'force-dynamic';

dotenv.config();

export async function GET(request) {
  try {

    const url = new URL(request.url);
    const token = url.searchParams.get('token');

    const API_KEY = process.env.API_KEY; // Replace with your actual API key
    const JWT_KEY = process.env.JWT_SECRET; // Replace with your JWT secret
    const API_URL = 'http://localhost:8080/api/v1/auth/register'; // Replace with your actual backend API endpoint

    try {

        const decoded = jwt.verify(token, JWT_KEY);
        const {email ,password, username} = decoded;

        const response = await axios.post(API_URL, {
                "email": email,
                "password": password,
                "username": username,
                "role": "USER"
            }, {
                headers: {
                    'API-KEY': API_KEY
                }
            });

              // Create a new response with a redirect
      const redirectResponse = NextResponse.redirect('http://localhost:3001');

      // Set the cookies in the redirect response
      const cookieOptions = {
        // httpOnly: true,
        // secure: process.env.NODE_ENV === 'production',
        path: '/',
        // sameSite: 'strict'
        expires: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000) // 7 days from now
      };

      redirectResponse.cookies.set('token', response.data.token, cookieOptions);
      redirectResponse.cookies.set('email', email, cookieOptions);
      redirectResponse.cookies.set('username', username, cookieOptions);

      return redirectResponse;
    
    } catch (error) {
        console.log(error);
        return new NextResponse('Invalid token', { status: 401 });
    }

  } catch (error) {
    return NextResponse.json({ error: 'Error handling callback.' }, { status: 400 });
  }
}
