<script>
    import { onMount } from 'svelte';
    import { Search, Pencil, Plus, Trash2, Check } from '@lucide/svelte';
    import { toast } from 'svelte-sonner';
    import Fuse from 'fuse.js';
    import ky from 'ky';

    import fuseOptions from '../lib/fuseOptions';

    let rawData = [];
    let dataLoading = true;
    let pageItems = [];
    let searchKeyword = '';
    let searchResult = [];
    let editContext = {
        address: '',
        hit: 0,
        note: '',
        isEdit: false,
    };

    function search() {
        if (!searchKeyword) {
            searchResult = [];
            return;
        }

        let searchData = rawData;

        if (searchKeyword) {
            const fuse = new Fuse(searchData, fuseOptions.emailBlacklist);
            searchData = fuse.search(searchKeyword);
            searchData = searchData.map(item => item.item);
        }

        searchResult = searchData;
    }

    function openCreate() {
        editContext = {
            address: '',
            hit: 0,
            note: '',
            isEdit: false,
        };

        entry_detail.showModal();
    }

    async function submitCreate() {
        try {
            // const { data } = await ky
            //     .post('/api/email-blacklist', {
            //         json: editContext,
            //     })
            //     .json();

            // rawData = data;

            entry_detail.close();
            toast.success('New entry created successfully.');
        } catch (e) {
            console.error(e);
            toast.error('Error when creating new entry!');
        }
    }

    async function submitUpdate() {
        try {
            // const { data } = await ky
            //     .patch('/api/email-blacklist', {
            //         searchParams: { id: editContext?.id },
            //         json: editContext,
            //     })
            //     .json();

            // rawData = data;

            entry_detail.close();
            toast.success('Entry updated successfully.');
        } catch (e) {
            console.error(e);
            toast.error('Error when updating the entry!');
        }
    }

    async function submitDelete() {
        try {
            // const { data } = await ky
            //     .delete('/api/email-blacklist', {
            //         searchParams: { id: editContext?.id },
            //     })
            //     .json();

            // rawData = data;

            entry_delete.close();
            toast.success('Entry deleted successfully.');
        } catch (e) {
            console.error(e);
            toast.error('Error when deleting the entry!');
        }
    }

    onMount(async () => {
        try {
            const { data } = await ky.get('/api/email-blacklist').json();
            rawData = data;
            dataLoading = false;
        } catch (e) {
            console.error(e);
            toast.error('Cannot fetch data, please try again later!');
        }
    });

    $: {
        [rawData, searchKeyword], search();
        pageItems = searchKeyword ? searchResult : rawData;
    }
</script>

<div class="flex flex-col gap-3">
    <div class="flex justify-end items-center gap-3 w-full">
        <label class="input flex-1">
            <Search size={16} />
            <input
                type="text"
                placeholder="Search..."
                bind:value={searchKeyword}
            />
        </label>
        <button class="btn btn-success ms-auto" on:click={() => openCreate()}>
            <Plus size={16} /> Add New
        </button>
    </div>
    <div class="overflow-x-auto w-full max-h-[calc(100dvh-350px)]">
        <table class="table">
            <thead class="sticky bg-white top-0 z-10">
                <tr>
                    <th class="w-[1%] whitespace-nowrap">No.</th>
                    <th>Email</th>
                    <th>Hit Count</th>
                    <th>Note</th>
                    <th class="w-[1%] whitespace-nowrap">Actions</th>
                </tr>
            </thead>
            <tbody>
                {#if pageItems.length}
                    {#each pageItems as item, i}
                        <tr
                            class="{i % 2 === 0
                                ? 'bg-black/5 hover:bg-black/9'
                                : 'hover:bg-black/7'} transition duration-100"
                        >
                            <td class="text-right w-15 whitespace-nowrap">
                                {i + 1}
                            </td>
                            <td>{item.address}</td>
                            <td>{item.hit}</td>
                            <td>{item.note || '-'}</td>
                            <td class="w-[1%] whitespace-nowrap">
                                <button
                                    class="btn btn-sm btn-warning"
                                    title="Edit this entry"
                                    on:click={() => {
                                        editContext = { ...item, isEdit: true };
                                        entry_detail.showModal();
                                    }}
                                >
                                    <Pencil size={12} />
                                </button>
                                <button
                                    class="btn btn-sm btn-error text-white"
                                    title="Delete this entry"
                                    on:click={() => {
                                        editContext = { ...item, isEdit: true };
                                        entry_delete.showModal();
                                    }}
                                >
                                    <Trash2 size={12} />
                                </button>
                            </td>
                        </tr>
                    {/each}
                {:else if dataLoading}
                    <tr>
                        <td class="py-12 text-gray-500 text-center" colspan="5">
                            Loading data, please wait...
                        </td>
                    </tr>
                {:else}
                    <tr>
                        <td class="py-12 text-gray-500 text-center" colspan="5">
                            - No blocked email found -
                        </td>
                    </tr>
                {/if}
            </tbody>
        </table>
    </div>
</div>

<dialog id="entry_detail" class="modal">
    <div class="modal-box">
        <h3 class="text-lg font-bold">
            {editContext?.isEdit ? 'Edit' : 'Add New'} Entry
        </h3>
        <div class="flex flex-col gap-2 pt-4">
            <input
                type="text"
                class="input w-full"
                placeholder="Email address"
                bind:value={editContext.address}
            />
            <input
                type="number"
                class="input w-full"
                min="0"
                bind:value={editContext.hit}
            />
            <input
                type="text"
                class="input w-full"
                placeholder="Additional note"
                bind:value={editContext.note}
            />
        </div>
        <div class="modal-action">
            <button
                class="btn {editContext?.isEdit
                    ? 'btn-warning'
                    : 'btn-success'}"
                disabled={!editContext.name || !editContext.slug}
                on:click={() => {
                    editContext?.isEdit ? submitUpdate() : submitCreate();
                }}
            >
                <Check size={16} />
                {editContext?.isEdit ? 'Save Changes' : 'Add New'}
            </button>
            <button class="btn" on:click={() => entry_detail.close()}>
                Cancel
            </button>
        </div>
    </div>
    <form method="dialog" class="modal-backdrop">
        <button>close</button>
    </form>
</dialog>

<dialog id="entry_delete" class="modal">
    <div class="modal-box">
        <h3 class="text-lg font-bold">Delete Entry</h3>
        <p class="py-4">Are you sure you want to delete this entry?</p>
        <div class="modal-action">
            <button
                class="btn btn-error text-white"
                on:click={() => submitDelete()}
            >
                <Trash2 size={16} /> Yes, Delete
            </button>
            <button class="btn" on:click={() => entry_delete.close()}>
                Cancel
            </button>
        </div>
    </div>
    <form method="dialog" class="modal-backdrop">
        <button>close</button>
    </form>
</dialog>
