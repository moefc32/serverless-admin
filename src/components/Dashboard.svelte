<script>
    import { onMount } from 'svelte';
    import { Toaster, toast } from 'svelte-sonner';
    import ky from 'ky';
    import datePrettier from '../lib/datePrettier';

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

<main class="flex flex-1 flex-col gap-9 mx-12 my-6">
    <button class="btn btn-primary" on:click={() => doLogout()}>Logout</button>
</main>

<Toaster
    richColors
    theme="system"
    position="bottom-right"
    toastOptions={{
        style: 'font-size: 1rem;',
    }}
/>
