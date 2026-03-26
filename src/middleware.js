import { defineMiddleware } from 'astro:middleware';
import { env } from 'cloudflare:workers';

const UNAUTH_ROUTES = ['/login'];
const PUBLIC_API_ROUTES = ['/api/auth'];

function isRouteMatch(routes, path) {
    return routes.some((route) => path.startsWith(route));
}

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
        isRouteMatch(PUBLIC_API_ROUTES, url.pathname)
    ) return next();

    const accessToken = getCookie(request, 'access_token');

    if (!accessToken && !isRouteMatch(UNAUTH_ROUTES, url.pathname))
        return Response.redirect(new URL('/login', request.url), 303);

    if (accessToken) {
        try {
            const payload = await verifyJWT(accessToken, env.JWT_SECRET);
            ctx.locals.user = payload;

            if (isRouteMatch(UNAUTH_ROUTES, url.pathname))
                return Response.redirect(new URL('/', request.url), 303);
        } catch (e) {
            console.error(e);
            return Response.redirect(new URL('/login', request.url), 303);
        }
    }

    return next();
});
