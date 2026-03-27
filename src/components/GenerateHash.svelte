<script>
    import { Check } from 'lucide-svelte';
    import hashPassword from '../lib/hashPassword';

    let hash = {
        account: '',
        password: '',
        output: '',
        loading: false,
    };

    async function handleKeydown(event) {
        if (event.key === 'Enter' && hash.account && hash.password) {
            generateHash();
        }
    }

    async function generateHash() {
        try {
            hash.loading = true;
            hash.output = await hashPassword(hash.account, hash.password);
        } catch (e) {
            console.error(e);
        } finally {
            hash.loading = false;
        }
    }
</script>

<div class="flex flex-col gap-3">
    <label class="floating-label w-full max-w-100">
        <span>New Account ID</span>
        <input
            type="text"
            class="input input-md w-full"
            placeholder="New account ID"
            bind:value={hash.account}
            on:keydown={handleKeydown}
        />
    </label>
    <label class="floating-label w-full max-w-100">
        <span>New Password</span>
        <input
            type="text"
            class="input input-md w-full"
            placeholder="New password"
            bind:value={hash.password}
            on:keydown={handleKeydown}
        />
    </label>
    <input
        type="text"
        class="input input-md bg-gray-100 w-full max-w-100"
        placeholder="Generated hash"
        readonly
        bind:value={hash.output}
    />
    <button
        class="btn btn-primary self-start"
        disabled={!hash.account || !hash.password || hash.loading}
        on:click={() => generateHash()}
    >
        {#if hash.loading}
            <span class="loading loading-spinner loading-xs"></span> Loading...
        {:else}
            <Check size={16} /> Generate Hash
        {/if}
    </button>
</div>
