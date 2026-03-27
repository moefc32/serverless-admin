export default async function (token, ip, secret) {
    const formData = new URLSearchParams();
    formData.append('secret', secret);
    formData.append('response', token);

    if (ip) formData.append('remoteip', ip);

    const response =
        await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
            method: 'POST',
            body: formData,
        });

    return response.json();
}
