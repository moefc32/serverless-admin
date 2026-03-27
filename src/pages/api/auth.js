import { env } from 'cloudflare:workers';
import base64urlEncode from '../../lib/base64urlEncode';
import hashPassword from '../../lib/hashPassword';

const JWT_EXPIRATION = 60 * 60;
const IS_SECURE = import.meta.env.PROD;

async function verifyTurnstile(token, ip) {
    const formData = new URLSearchParams();
    formData.append('secret', env.GUARD_TS_SECRET);
    formData.append('response', token);

    if (ip) formData.append('remoteip', ip);

    const response =
        await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
            method: 'POST',
            body: formData,
        });

    return response.json();
}

async function signJWT(payload) {
    const enc = new TextEncoder();
    const header = { alg: 'HS256', typ: 'JWT' };
    const headerB64 = base64urlEncode(enc.encode(JSON.stringify(header)));
    const payloadB64 = base64urlEncode(enc.encode(JSON.stringify(payload)));
    const data = headerB64 + '.' + payloadB64;

    const key = await crypto.subtle.importKey(
        'raw', enc.encode(env.JWT_SECRET),
        { name: 'HMAC', hash: 'SHA-256' },
        false, ['sign']
    );

    const sig = await crypto.subtle.sign('HMAC', key, enc.encode(data));
    const sigB64 = base64urlEncode(sig);

    return `${headerB64}.${payloadB64}.${sigB64}`;
}

export async function POST({ cookies, request }) {
    const ip = request.headers.get('CF-Connecting-IP');
    const body = await request.json();
    const { account, password, 'cf-turnstile-response': turnstileToken } = body;

    if (!account || !password) {
        return new Response(JSON.stringify({
            message: 'All data must be filled, please try again!',
        }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' },
        });
    }

    if (!turnstileToken) {
        return new Response(JSON.stringify({
            message: 'Turnstile verification required!',
        }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' },
        });
    }

    if (!(await verifyTurnstile(turnstileToken, ip))) {
        return new Response(JSON.stringify({
            message: 'Turnstile verification failed!',
        }), {
            status: 403,
            headers: { 'Content-Type': 'application/json' },
        });
    }

    try {
        const hashed = await hashPassword(account, password);

        if (hashed !== env.PASSWORD_HASH) {
            return new Response(JSON.stringify({
                message: 'Invalid account id or password, please try again!',
            }), {
                status: import.meta.env.DEV ? 403 : 401,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        const token = await signJWT({
            exp: Math.floor(Date.now() / 1000) + JWT_EXPIRATION,
        });

        cookies.set('access_token', token, {
            path: '/',
            httpOnly: true,
            sameSite: 'strict',
            secure: IS_SECURE,
            maxAge: JWT_EXPIRATION,
        });

        return new Response(JSON.stringify({
            message: 'Login success.',
        }), {
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (e) {
        console.error(e);

        return new Response(JSON.stringify({ message: e }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}

export async function DELETE({ cookies }) {
    try {
        cookies.delete('access_token', {
            path: '/',
            httpOnly: true,
            sameSite: 'strict',
        });

        return new Response(JSON.stringify({
            message: 'Logout success.',
        }), {
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (e) {
        console.error(e);

        return new Response(JSON.stringify({ message: e }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}
