<script>
    import { onMount } from 'svelte';
    import ky from 'ky';

    let dataLoading = true;
    let totalWorkers = 0;
    let workers = [];

    onMount(async () => {
        try {
            const { data } = await ky.get('/api/statistics').json();
            totalWorkers = data.totalWorkers;
            workers = data.workers;
            dataLoading = false;
        } catch (e) {
            console.error(e);
            toast.error('Cannot fetch data, please try again later!');
        }
    });
</script>

{#if dataLoading}
    <div
        class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3"
    >
        {#each Array(4) as _, i}
            <div
                class="card bg-gray-200 border-1 border-gray-300 h-30 rounded-lg shadow-lg skeleton"
            ></div>
        {/each}
    </div>
{:else if workers.length}
    <div
        class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3"
    >
        {#each workers as worker, i}
            <div
                class="card flex gap-3 px-6 py-4 border-1 border-gray-300 h-30 rounded-lg shadow-lg"
            >
                <h2 class="font-mono uppercase break-all">
                    {worker.name}
                </h2>
                <div class="flex justify-between items-end">
                    {#if worker.inactive}
                        <div>
                            <div class="block text-xs text-gray-500">
                                Health
                            </div>
                            <div class="text-gray-500 text-2xl font-semibold">
                                -
                            </div>
                        </div>
                        <div class="text-right">
                            <div class="text-gray-500 text-xs">P90 CPU</div>
                            <div class="text-2xl font-semibold">-</div>
                        </div>
                    {:else}
                        <div>
                            <div class="block text-xs text-gray-500">
                                Health
                            </div>
                            <div
                                class="text-2xl font-semibold {parseFloat(
                                    worker.successRate,
                                ) >= 99
                                    ? 'text-green-500'
                                    : parseFloat(worker.successRate) >= 95
                                      ? 'text-orange-500'
                                      : 'text-red-500'}"
                            >
                                {worker.successRate}%
                            </div>
                        </div>
                        <div class="text-right">
                            <div class="text-gray-500 text-xs">P90 CPU</div>
                            <div
                                class="text-2xl font-semibold {worker.cpu > 10
                                    ? 'text-orange-500'
                                    : ''}"
                            >
                                {worker.cpu}ms
                            </div>
                        </div>
                    {/if}
                </div>
            </div>
        {/each}
    </div>
{:else}
    <div
        class="card flex justify-center items-center border-1 border-gray-300 h-30 rounded-lg shadow-lg"
    >
        <span class="text-gray-500">
            - No
            {totalWorkers ? 'data found for specified' : 'registered'}
            workers -
        </span>
    </div>
{/if}
