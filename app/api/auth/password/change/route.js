import { NextResponse } from 'next/server';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import axios from 'axios';

export const dynamic = 'force-dynamic';

dotenv.config();

export async function POST(request) {
  try {

    // Parse the body of the request
    const body = await request.json();

    // Extract email and password from the body
    const { token, password } = body;

    const API_KEY = process.env.API_KEY; // Replace with your actual API key
    const JWT_KEY = process.env.JWT_SECRET; // Replace with your JWT secret
    const API_URL = 'http://localhost:8080/api/v1/auth/password/change'; // Replace with your actual backend API endpoint

    try {

        const decoded = jwt.verify(token, JWT_KEY);
        const {email} = decoded;

        const response = await axios.post(API_URL, {
                "email": email,
                "password": password,
            }, {
                headers: {
                    'API-KEY': API_KEY
                }
            });

        return NextResponse.json(response.data, { status: 200 });
    
    } catch (error) {
        console.log(error)
        return new NextResponse('Invalid token', { status: 401 });
    }

  } catch (error) {
    return NextResponse.json({ error: 'Error handling callback.' }, { status: 400 });
  }
}
