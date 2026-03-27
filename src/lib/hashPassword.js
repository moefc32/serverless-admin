import base64urlEncode from './base64urlEncode';

export default async function (account, password, iterations = 100_000) {
    const enc = new TextEncoder();
    const key = await crypto.subtle.importKey(
        'raw', enc.encode(password),
        { name: 'PBKDF2' }, false, ['deriveBits']
    );
    const bits = await crypto.subtle.deriveBits(
        {
            name: 'PBKDF2', salt: enc.encode(account),
            iterations, hash: 'SHA-256'
        }, key, 256);

    return base64urlEncode(bits);
}
