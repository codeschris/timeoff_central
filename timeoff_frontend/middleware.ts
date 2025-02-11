import { NextResponse } from 'next/server';

interface MiddlewareRequest {
    headers: Headers;
    ip?: string;
}

{/** 
    The IPs below represent the following:
    - '::1': localhost (represents IPv6 loopback address and 127.0.0.1)
    - '192.168.1.19' - Solfruit
    - '192.168.21.87' - WSH (Westerwelle Haus) (Testing purposes only; to be removed)
*/}

export function middleware(req: MiddlewareRequest): NextResponse {
    const allowedIP = ['192.168.1.19', '192.168.21.87', '41.139.159.153', '::1'];

    const forwardedFor = req.headers.get('x-forwarded-for') || '';
    const realIp = forwardedFor.split(',')[0].trim() || req.ip || 'Unknown';

    // console.log(`Request received from IP: ${realIp}`);

    if (!allowedIP.includes(realIp)) {
        return new NextResponse(`Access Denied. Your IP: ${realIp}`, { status: 403 });
    }

    return NextResponse.next();
}

export const config = {
    matcher: '/:path*', // including all routes
};