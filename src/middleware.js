import { defineMiddleware } from 'astro:middleware';

const PUBLIC_PATHS = [
    '/login',
    '/api/auth'
];

function getCookie(req, name) {
    const cookie = req.headers.get('cookie');
    if (!cookie) return null;

    const match = cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
    return match ? match[1] : null;
}

function base64urlDecode(input) {
    input = input.replace(/-/g, '+').replace(/_/g, '/');

    const pad = input.length % 4;
    if (pad) input += '='.repeat(4 - pad);

    return atob(input);
}

function base64urlToUint8Array(input) {
    input = input.replace(/-/g, '+').replace(/_/g, '/');

    const pad = input.length % 4;
    if (pad) input += '='.repeat(4 - pad);

    return Uint8Array.from(atob(input), c => c.charCodeAt(0));
}

async function verifyJWT(token, secret) {
    const parts = token.split('.');
    if (parts.length !== 3) throw new Error('Malformed token!');

    const headerB64 = parts[0];
    const payloadB64 = parts[1];
    const signatureB64 = parts[2];

    const header = JSON.parse(base64urlDecode(headerB64));
    if (header.alg !== 'HS256') throw new Error('Invalid algorithm!');

    const data = headerB64 + '.' + payloadB64;
    const key = await crypto.subtle.importKey(
        'raw', new TextEncoder().encode(secret),
        { name: 'HMAC', hash: 'SHA-256' },
        false, ['verify']
    );

    const signature = base64urlToUint8Array(signatureB64);
    const valid = await crypto.subtle.verify(
        'HMAC', key, signature,
        new TextEncoder().encode(data)
    );

    if (!valid) throw new Error('Invalid signature!');
    const payload = JSON.parse(base64urlDecode(payloadB64));

    if (payload.exp && Date.now() >= payload.exp * 1000)
        throw new Error('Token expired!');

    return payload;
}

export const onRequest = defineMiddleware(async (ctx, next) => {
    const request = ctx.request;
    const url = new URL(request.url);

    if (
        url.pathname.startsWith('/_astro') ||
        PUBLIC_PATHS.some((p) => url.pathname.startsWith(p))
    ) return next();

    const accessToken = getCookie(request, 'access_token');

    if (!accessToken)
        return Response.redirect(new URL('/login', request.url), 303);

    try {
        const secret = ctx.locals.runtime.env.JWT_SECRET;
        const payload = await verifyJWT(accessToken, secret);

        ctx.locals.user = payload;

        return next();
    } catch (e) {
        console.error(e);
        return Response.redirect(new URL('/login', request.url), 303);
    }
});
