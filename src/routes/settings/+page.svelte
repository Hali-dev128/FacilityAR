<script>
    import { settings, userProfile, banks, tenants, bills, payments, expenses } from '$lib/stores';
    import toast from 'svelte-french-toast';

    let appName = $settings.appName, currency = $settings.currency;
    let username = $userProfile.username, role = $userProfile.role;
    let newBank = '';

    function saveSys() { settings.set({ appName, currency }); toast.success('Saved'); }
    function saveProf() { userProfile.set({ username, role }); toast.success('Saved'); }
    function addBank() { if(newBank) { banks.update(n => [...n, { id: Date.now().toString(), name: newBank }]); newBank=''; } }
    function nuke() { 
        if(confirm('DELETE EVERYTHING?')) { 
            tenants.set([]); bills.set([]); payments.set([]); expenses.set([]); 
            toast.success('Reset Complete');
        } 
    }
</script>

<div class="grid lg:grid-cols-2 gap-6">
    <div class="bg-white p-5 rounded-xl shadow-sm">
        <h3 class="font-bold mb-3 border-b pb-2">System</h3>
        <div class="space-y-3">
            <input bind:value={appName} class="w-full border p-2 rounded" placeholder="App Name" />
            <select bind:value={currency} class="w-full border p-2 rounded bg-white">
                <option value="USD">USD ($)</option>
                <option value="NGN">NGN (₦)</option>
            </select>
            <button on:click={saveSys} class="w-full bg-slate-800 text-white py-2 rounded font-bold">Save</button>
        </div>
    </div>

    <div class="bg-white p-5 rounded-xl shadow-sm">
        <h3 class="font-bold mb-3 border-b pb-2">User</h3>
        <div class="space-y-3">
            <input bind:value={username} class="w-full border p-2 rounded" placeholder="Name" />
            <input bind:value={role} class="w-full border p-2 rounded" placeholder="Role" />
            <button on:click={saveProf} class="w-full bg-slate-800 text-white py-2 rounded font-bold">Save</button>
        </div>
    </div>

    <div class="bg-white p-5 rounded-xl shadow-sm lg:col-span-2">
        <h3 class="font-bold mb-3 border-b pb-2">Banks</h3>
        <div class="flex gap-2 mb-4">
            <input bind:value={newBank} placeholder="New Bank Name" class="flex-1 border p-2 rounded" />
            <button on:click={addBank} class="bg-green-600 text-white px-4 rounded font-bold">Add</button>
        </div>
        <div class="space-y-2">
            {#each $banks as b}
                <div class="flex justify-between p-3 bg-gray-50 rounded border">
                    <span>{b.name}</span>
                    <button on:click={() => banks.update(n => n.filter(x => x.id !== b.id))} class="text-red-500 font-bold">X</button>
                </div>
            {/each}
        </div>
    </div>

    <div class="lg:col-span-2">
        <button on:click={nuke} class="w-full py-4 border-2 border-red-100 bg-red-50 text-red-600 font-bold rounded-xl hover:bg-red-100 transition">
            Reset All Data (Danger)
        </button>
    </div>
</div>
