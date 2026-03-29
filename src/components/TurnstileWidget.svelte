<!-- 
MIT License

Copyright (c) 2026 Faizal Chan.

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
-->

<script>
    import { onMount } from 'svelte';

    let {
        turnstile = $bindable(),
        turnstileKey = '',
        turnstileToken = $bindable(''),
        turnstileLoading = $bindable(true),
    } = $props();

    let isTurnstileError = $state(false);

    function retryTurnstile(force = false) {
        if (isTurnstileError || force) {
            if (window.turnstile) {
                window.turnstile.reset();

                turnstileToken = '';
                turnstileLoading = true;
                isTurnstileError = false;
            }
        }
    }

    onMount(async () => {
        if (window.turnstile && turnstileKey) {
            window.turnstile.render(turnstile, {
                sitekey: turnstileKey,
                size: 'normal',
                callback: token => {
                    turnstileToken = token;
                    turnstileLoading = false;
                },
                'error-callback': e => {
                    console.error('Turnstile error:', e);
                    isTurnstileError = true;
                },
                'expired-callback': () => {
                    retryTurnstile(true);
                },
            });
        }
    });

    let classes = $derived(
        isTurnstileError
            ? 'bg-red-100 text-red-400 border-red-300 cursor-pointer'
            : turnstileLoading
              ? 'bg-gray-100 text-gray-500 border-gray-300'
              : 'bg-green-100 text-green-500 border-green-300',
    );
</script>

<!-- svelte-ignore a11y_click_events_have_key_events -->
<svelte:element this={turnstileKey ? 'div' : null} class="text-sm select-none">
    <div
        role="button"
        tabindex="0"
        class="flex items-center gap-1 ps-3 pe-4 border-1 h-9 rounded-md {classes}"
        title={isTurnstileError ? 'Click to retry verification' : ''}
        onclick={() => retryTurnstile()}
        onkeydown={e => {
            if (e.key === 'Enter') retryTurnstile();
            if (e.key === ' ') {
                e.preventDefault();
                retryTurnstile();
            }
        }}
    >
        {#if isTurnstileError}
            <svg class="animated-icon text-red-400" viewBox="0 0 24 24">
                <path class="draw-path" d="M6 6L18 18" />
                <path class="draw-path" d="M6 18L18 6" />
            </svg>
            Verification error. Retry?
        {:else}
            {#if turnstileLoading}
                <svg class="animated-spinner text-gray-500" viewBox="0 0 24 24">
                    <circle class="spinner-circle" cx="12" cy="12" r="8" />
                </svg>
            {:else}
                <svg class="animated-icon text-green-500" viewBox="0 0 24 24">
                    <path class="draw-path" d="M4 12L9 18L20 6" />
                </svg>
            {/if}
            <a
                href="https://www.cloudflare.com/turnstile-privacy-policy/"
                target="_blank"
                class="font-semibold"
                title="Cloudflare Turnstile"
                onclick={e => e.stopPropagation()}>Turnstile</a
            >
            {turnstileLoading ? 'checking...' : 'verified.'}
        {/if}
    </div>
    <div bind:this={turnstile}></div>
</svelte:element>

<style>
    .animated-icon {
        display: block;
        width: 16px;
        height: 16px;
        fill: none;
        stroke: currentColor;
        stroke-width: 4;
        stroke-linecap: round;
        stroke-linejoin: round;
        overflow: visible;
    }

    .animated-spinner {
        display: block;
        width: 16px;
        height: 16px;
        fill: none;
        stroke: currentColor;
        stroke-width: 4;
        stroke-linecap: round;
        stroke-linejoin: round;
        animation: rotate-loop 0.8s linear infinite;
        overflow: visible;
    }

    .draw-path {
        stroke-dasharray: 26;
        stroke-dashoffset: 26;
        animation: animate 0.4s cubic-bezier(0.5, 0, 0.5, 1) forwards;
    }

    .spinner-circle {
        stroke-dasharray: 37.7 12.57;
        stroke-dashoffset: 0;
    }

    @keyframes animate {
        to {
            stroke-dashoffset: 0;
        }
    }

    @keyframes rotate-loop {
        from {
            transform: rotate(0deg);
        }

        to {
            transform: rotate(360deg);
        }
    }
</style>
