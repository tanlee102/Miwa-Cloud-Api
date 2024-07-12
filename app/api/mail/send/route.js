import { NextResponse } from 'next/server';
import dotenv from 'dotenv';
import axios from 'axios';
import { Resend } from 'resend';

export const dynamic = 'force-dynamic';

dotenv.config();

export async function GET(request) {

    try {
        const resend = new Resend('re_MWFdkrPi_5GgJQJTjbmaR9Zpg4uZCR5Qn');
    
        await resend.emails.send({
          from: 'Acme <noreply@miwabox.live>',
          to: ['letanprox@gmail.com'],
          subject: 'his',
          text: 'canu help me!',
        });
        // Return the response from the server
        return NextResponse.json('ok', { status: 200 });   
    } catch (error) {
        return NextResponse.json({ error: error }, { status: 400 });
    }
}
