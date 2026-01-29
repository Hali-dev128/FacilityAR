<script>
    import { tenants } from '$lib/stores';
    import toast from 'svelte-french-toast';

    let name = '';
    let address = '';
    let plotNumber = '';
    let isEditing = null;

    function handleSubmit() {
        if(isEditing) {
            tenants.update(current => 
                current.map(t => t.id === isEditing ? {...t, name, address, plotNumber} : t)
            );
            toast.success('Tenant updated');
        } else {
            tenants.update(current => [
                ...current, 
                { id: Date.now().toString(), name, address, plotNumber, status: 'active' }
            ]);
            toast.success('Tenant added');
        }
        resetForm();
    }

    function edit(t) {
        name = t.name;
        address = t.address;
        plotNumber = t.plotNumber;
        isEditing = t.id;
    }

    function remove(id) {
        if(confirm('Archive this tenant?')) {
            tenants.update(current => 
                current.map(t => t.id === id ? {...t, status: 'deleted'} : t)
            );
        }
    }

    function resetForm() {
        name = ''; address = ''; plotNumber = ''; isEditing = null;
    }
</script>

<div class="grid lg:grid-cols-3 gap-6">
    <div class="bg-white p-6 rounded-xl shadow-sm h-fit">
        <h3 class="font-bold mb-4">{isEditing ? 'Edit Tenant' : 'Add New Tenant'}</h3>
        <form on:submit|preventDefault={handleSubmit} class="space-y-4">
            <input bind:value={name} placeholder="Name" required class="w-full border p-2 rounded" />
            <input bind:value={address} placeholder="Address" required class="w-full border p-2 rounded" />
            <input bind:value={plotNumber} placeholder="Plot Number" required class="w-full border p-2 rounded" />
            <div class="flex gap-2">
                <button class="bg-blue-600 text-white w-full py-2 rounded hover:bg-blue-700">Save</button>
                {#if isEditing}
                    <button type="button" on:click={resetForm} class="bg-gray-200 px-4 rounded">Cancel</button>
                {/if}
            </div>
        </form>
    </div>

    <div class="lg:col-span-2 bg-white rounded-xl shadow-sm overflow-hidden">
        <table class="w-full text-sm text-left">
            <thead class="bg-gray-100 uppercase text-xs">
                <tr>
                    <th class="px-6 py-3">Name</th>
                    <th class="px-6 py-3">Plot</th>
                    <th class="px-6 py-3 text-right">Actions</th>
                </tr>
            </thead>
            <tbody>
                {#each $tenants as t (t.id)}
                    {#if t.status !== 'deleted'}
                    <tr class="border-b">
                        <td class="px-6 py-4 font-bold">{t.name}</td>
                        <td class="px-6 py-4">{t.plotNumber}</td>
                        <td class="px-6 py-4 text-right space-x-2">
                            <button on:click={() => edit(t)} class="text-blue-600 font-bold text-xs">EDIT</button>
                            <button on:click={() => remove(t.id)} class="text-red-600 font-bold text-xs">DELETE</button>
                        </td>
                    </tr>
                    {/if}
                {/each}
            </tbody>
        </table>
    </div>
</div>