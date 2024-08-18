import { NextResponse } from 'next/server';
import dotenv from 'dotenv';
import axios from 'axios';

export const dynamic = 'force-dynamic';

dotenv.config();

export async function POST(request) {
  try {
    // Parse the body of the request
    const body = await request.json();

    // Extract email and password from the body
    const { email, password } = body;
    const API_KEY = process.env.API_KEY; // Replace with your actual API key
    const API_URL = 'http://8.219.96.109/api/v1/auth/login'; // Replace with your actual backend API endpoint

    const response = await axios.post(API_URL, {
            "email": email,
            "password": password,
        }, {
            headers: {
                'API-KEY': API_KEY
            }
        });

    // Return the response from the server
    return NextResponse.json(response.data, { status: response.status });
  } catch (error) {
    console.error('Error handling callback:', error);
    return NextResponse.json({ error: 'Error handling callback.' }, { status: 400 });
  }
}
