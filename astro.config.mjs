import { setMaxListeners } from 'events';
import { defineConfig } from 'astro/config';
import cloudflare from '@astrojs/cloudflare';
import svelte from '@astrojs/svelte';
import tailwindcss from '@tailwindcss/vite';

setMaxListeners(12);

export default defineConfig({
    adapter: cloudflare(),
    output: 'server',
    vite: {
        plugins: [
            tailwindcss(),
        ],
        resolve: {
            noExternal: [
                'lucide-svelte',
                'svelte-sonner',
            ],
        },
    },
    integrations: [
        svelte(),
    ],
    server: {
        port: 4000,
    },
});
