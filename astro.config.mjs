import { setMaxListeners } from 'events';
import { defineConfig } from 'astro/config';
import cloudflare from '@astrojs/cloudflare';
import svelte from '@astrojs/svelte';
import tailwindcss from '@tailwindcss/vite';

setMaxListeners(12);

export default defineConfig({
    adapter: cloudflare({
        imageService: 'passthrough',
        session: {
            driver: 'memory',
        },
    }),
    output: 'server',
    vite: {
        plugins: [
            tailwindcss(),
        ],
    },
    integrations: [
        svelte(),
    ],
    server: {
        port: 4000,
    },
});
