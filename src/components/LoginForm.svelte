<script>
    import { onMount } from 'svelte';
    import { Eye, EyeOff, LogIn } from 'lucide-svelte';
    import { Toaster, toast } from 'svelte-sonner';
    import ky from 'ky';

    const getYear = new Date().getFullYear();
    const currentYear = (getYear > 2018 ? `2018 - ` : '') + getYear;

    let login = {
        account: '',
        password: '',
        loading: false,
    };
    let showPassword = false;

    async function handleKeydown(event) {
        if (event.key === 'Enter' && login.account && login.password) {
            doLogin();
        }
    }

    async function doLogin() {
        try {
            login.loading = true;

            await ky.post('/api/auth', {
                json: login,
            });

            localStorage.setItem(
                'toast',
                JSON.stringify({
                    state: 'success',
                    message: 'You have successfully logged in',
                }),
            );
            window.location.assign('/');
        } catch (e) {
            login.loading = false;

            console.error(e);
            toast.error('Login failed, please check all data and try again!');
        }
    }

    onMount(async () => {
        const savedToast = localStorage.getItem('toast');

        if (savedToast) {
            const toastData = JSON.parse(savedToast);
            toast[toastData.state](toastData.message);
            localStorage.removeItem('toast');
        }

        try {
        } catch (e) {
            console.error(e);
            toast.error('Cannot fetch data, please try again later!');
        }
    });
</script>

<main
    class="card flex flex-col gap-2 m-auto p-6 bg-white w-full max-w-[320px] shadow-2xl"
>
    <h1 class="my-2 text-3xl text-center">Login</h1>
    <input
        type="text"
        class="input input-bordered w-full"
        placeholder="Account ID"
        bind:value={login.account}
        on:keydown={handleKeydown}
    />
    <label class="input input-bordered flex items-center gap-2 w-full">
        {#if !showPassword}
            <input
                type="password"
                class="grow"
                placeholder="Password"
                bind:value={login.password}
                on:keydown={handleKeydown}
            />
            <button
                class="-ms-8 text-black z-[100] cursor-pointer"
                title="Click to show password"
                on:click={() => (showPassword = !showPassword)}
            >
                <Eye size={18} />
            </button>
        {:else}
            <input
                type="text"
                class="grow"
                placeholder="Password"
                bind:value={login.password}
                on:keydown={handleKeydown}
            />
            <button
                class="-ms-8 text-black z-[100] cursor-pointer"
                title="Click to hide password"
                on:click={() => (showPassword = !showPassword)}
            >
                <EyeOff size={18} />
            </button>
        {/if}
    </label>
    <button
        class="btn btn-primary mt-2"
        title="Login to application"
        disabled={!login.account || !login.password || login.loading}
        on:click={() => doLogin()}
    >
        {#if login.loading}
            <span class="loading loading-spinner loading-xs"></span> Loading...
        {:else}
            <LogIn size={16} /> Login
        {/if}
    </button>
</main>

<Toaster
    richColors
    theme="system"
    position="bottom-center"
    toastOptions={{
        style: 'font-size: 1rem;',
    }}
/>
