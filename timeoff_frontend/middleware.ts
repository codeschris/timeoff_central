// '192.168.1.19', '192.168.21.87', '41.139.159.153',

import { NextResponse } from 'next/server';

interface MiddlewareRequest {
    headers: Headers;
    ip?: string;
    url: string;
}

export function middleware(req: MiddlewareRequest): NextResponse {
    const allowedIP = ['::1'];
    const forwardedFor = req.headers.get('x-forwarded-for') || '';
    const realIp = forwardedFor.split(',')[0].trim() || req.ip || 'Unknown';
    
    if (!allowedIP.includes(realIp)) {
        return new NextResponse("You don't have access to this page at the moment. Contact Support.", {
            status: 403,
            headers: { 'Content-Type': 'text/plain' },
        });
    }

    return NextResponse.next();
}

export const config = {
    matcher: '/:path*', // Apply to all routes
};