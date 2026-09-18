import { defineConfig } from 'astro/config';
import cloudflare from '@astrojs/cloudflare';
import svelte from '@astrojs/svelte';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
    output: 'server',
    adapter: cloudflare({
        imageService: 'passthrough',
        platformProxy: {
            enabled: true,
        },
    }),
    session: false,
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
