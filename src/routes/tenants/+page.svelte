<script>
    import { tenants } from '$lib/stores';
    import toast from 'svelte-french-toast';

    let name = '', address = '', plotNumber = '', isEditing = null;

    function save() {
        const payload = { name, address, plotNumber };
        if (isEditing) tenants.update(n => n.map(t => t.id === isEditing ? { ...t, ...payload } : t));
        else tenants.update(n => [...n, { id: Date.now().toString(), status: 'active', ...payload }]);
        toast.success(isEditing ? 'Updated' : 'Created');
        reset();
    }

    function edit(t) { name = t.name; address = t.address; plotNumber = t.plotNumber; isEditing = t.id; }
    function del(id) { if(confirm('Archive?')) tenants.update(n => n.map(t => t.id === id ? { ...t, status: 'deleted' } : t)); }
    function reset() { name = ''; address = ''; plotNumber = ''; isEditing = null; }
</script>

<div class="grid lg:grid-cols-3 gap-6">
    <div class="bg-white p-5 rounded-xl shadow-sm h-fit">
        <h3 class="font-bold text-gray-800 mb-4">{isEditing ? 'Edit' : 'Add'} Tenant</h3>
        <form on:submit|preventDefault={save} class="space-y-3">
            <input bind:value={name} required placeholder="Full Name" class="w-full border p-2 rounded-lg" />
            <input bind:value={address} required placeholder="Address" class="w-full border p-2 rounded-lg" />
            <input bind:value={plotNumber} required placeholder="Plot No." class="w-full border p-2 rounded-lg" />
            <div class="flex gap-2">
                <button class="flex-1 bg-blue-600 text-white py-2 rounded-lg font-bold">Save</button>
                {#if isEditing} <button type="button" on:click={reset} class="px-4 bg-gray-100 rounded-lg">X</button> {/if}
            </div>
        </form>
    </div>

    <div class="lg:col-span-2 space-y-3">
        {#each $tenants.filter(t => t.status !== 'deleted') as t}
            <div class="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex justify-between items-center">
                <div>
                    <div class="font-bold text-gray-900">{t.name}</div>
                    <div class="text-sm text-gray-500">{t.plotNumber} &bull; {t.address}</div>
                </div>
                <div class="flex gap-3">
                    <button on:click={() => edit(t)} class="text-blue-600 font-bold text-sm">Edit</button>
                    <button on:click={() => del(t.id)} class="text-red-500 font-bold text-sm">Del</button>
                </div>
            </div>
        {:else}
            <div class="text-center p-8 text-gray-400">No tenants yet.</div>
        {/each}
    </div>
</div>
