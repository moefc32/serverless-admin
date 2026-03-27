import { setMaxListeners } from 'events';
import { defineConfig } from 'astro/config';
import cloudflare from '@astrojs/cloudflare';
import svelte from '@astrojs/svelte';
import tailwindcss from '@tailwindcss/vite';

setMaxListeners(12);

export default defineConfig({
    output: 'server',
    adapter: cloudflare({
        imageService: 'passthrough',
        platformProxy: {
            enabled: true,
        },
    }),
    session: {
        driver: 'null',
    },
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
