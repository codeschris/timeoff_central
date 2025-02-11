import { NextResponse } from 'next/server';

interface MiddlewareRequest {
    headers: Headers;
    ip?: string;
    url: string;
}

export function middleware(req: MiddlewareRequest): NextResponse {
    const allowedIP = ['192.168.1.19', '192.168.21.87', '41.139.159.153', '::1'];
    const forwardedFor = req.headers.get('x-forwarded-for') || '';
    const realIp = forwardedFor.split(',')[0].trim() || req.ip || 'Unknown';

    const url = new URL(req.url);
    
    if (url.pathname === '/access-denied' || url.pathname.startsWith('/_next')) {
        return NextResponse.next();
    }

    if (!allowedIP.includes(realIp)) {
        return NextResponse.redirect(new URL('/access-denied', req.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: '/:path*', // Apply to all routes
};