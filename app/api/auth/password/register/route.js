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
    const { email, password, username } = body;

    const API_KEY = process.env.API_KEY; // Replace with your actual API key
    const JWT_KEY = process.env.JWT_SECRET; // Replace with your JWT secret
    const API_URL = "http://localhost:3000/api/mail/send3";

    try {

      // Create JWT
      const token = jwt.sign({ email, password, username }, JWT_KEY, { expiresIn: '1h' });
      const verificationLink = `http://localhost:3000/api/auth/password/verify?token=${token}`;

      const htmlContent = `
          <html>
              <body>
                  <p>Verify user:</p>
                  <a href="${verificationLink}">Click here to verify your email</a>
              </body>
          </html>
      `;
  
      const response = await axios.post(API_URL, {
          email: email,
          subject: "Verify",
          text: htmlContent
      }, {
          headers: {
              'API-KEY': API_KEY
          }
      });

      // Return the response from the server
      return NextResponse.json(response.data, { status: 200 });

    } catch (error) {
      console.log(error)
      return NextResponse.json({ error: 'Registration failed' }, { status: error.response.status });
    }

  } catch (error) {
    return NextResponse.json({ error: 'Error handling callback.' }, { status: 400 });
  }
}
