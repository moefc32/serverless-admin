<script>
    import { onMount } from 'svelte';
    import { LogOut } from 'lucide-svelte';
    import { Toaster, toast } from 'svelte-sonner';
    import ky from 'ky';

    async function doLogout() {
        try {
            await ky.delete('/api/auth');

            localStorage.setItem(
                'toast',
                JSON.stringify({
                    state: 'success',
                    message: 'You are now logged out',
                }),
            );
            window.location.assign('/login');
        } catch (e) {
            console.error(e);
            toast.error('Logout failed, please try again!');
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

<header class="fixed px-6 py-[15px] top-0 left-0 w-full z-1000">
    <div
        class="flex justify-center items-center px-6 h-[70px] bg-white/85 border-1 border-gray-300 rounded-xl shadow-lg backdrop-blur-xs"
    >
        <a
            href="/"
            class="text-2xl me-auto cursor-pointer outline-none ring-0 active:ring-0 focus:ring-0"
        >
            {import.meta.env.PUBLIC_APP_NAME}
        </a>
        <nav class="flex items-center gap-6">
            <a href="/url-shortener">URL Shortener</a>
            <!-- <a href="/wedding">Wedding</a> -->
            <a href="/settings">Settings</a>
            <button class="btn btn-primary" on:click={() => doLogout()}>
                <LogOut size={14} />
                Logout
            </button>
        </nav>
    </div>
</header>

<Toaster
    richColors
    theme="system"
    position="bottom-center"
    toastOptions={{
        style: 'font-size: 1rem;',
    }}
/>
