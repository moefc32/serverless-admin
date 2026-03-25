<script>
    import { onMount } from 'svelte';
    import { Toaster, toast } from 'svelte-sonner';
    import ky from 'ky';
    import datePrettier from '../lib/datePrettier';

    onMount(async () => {
        try {

        } catch (e) {
            console.error(e);
            toast.error('Cannot fetch data, please try again later!');
        }
    });
</script>

<main class="flex flex-1 flex-col gap-9 mx-12 my-6">
</main>

<Toaster
    richColors
    theme="system"
    position="bottom-center"
    toastOptions={{
        style: 'font-size: 1rem;',
    }}
/>
