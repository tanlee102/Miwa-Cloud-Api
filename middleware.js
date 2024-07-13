import { NextResponse } from 'next/server'

const corsOptions = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type, Authorization, Accept, Accept-Version, Content-Length",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Credentials": "true",
}

export async function middleware(request) {

    const isPreflight = request.method === 'OPTIONS';
    if (isPreflight) {
        return NextResponse.json({}, { headers: corsOptions })
    }

    const response = NextResponse.next();
    Object.entries(corsOptions).forEach(([key, value]) => {
        response.headers.set(key, value)
    });
    return response;
    
}
export const config = {
    matcher: ['/api/:path*'],
}