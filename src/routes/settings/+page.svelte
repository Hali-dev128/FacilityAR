<script>
    import { settings, userProfile, banks, tenants, bills, payments, expenses } from '$lib/stores';
    import toast from 'svelte-french-toast';

    // Local state for forms
    let appName = $settings.appName;
    let currency = $settings.currency;
    
    let username = $userProfile.username;
    let role = $userProfile.role;

    let newBankName = '';

    function saveSystem() {
        settings.set({ appName, currency });
        toast.success('System preferences saved');
        // Force reload to update sidebar title if needed immediately, 
        // though Svelte stores usually handle this reactively.
    }

    function saveProfile() {
        userProfile.set({ username, role });
        toast.success('Profile updated');
    }

    function addBank() {
        if(!newBankName.trim()) return;
        banks.update(curr => [...curr, { id: Date.now().toString(), name: newBankName }]);
        newBankName = '';
        toast.success('Bank account added');
    }

    function removeBank(id) {
        if(confirm('Remove this bank account?')) {
            banks.update(curr => curr.filter(b => b.id !== id));
        }
    }

    function resetData() {
        if(confirm('WARNING: This will delete ALL data. Are you sure?')) {
            tenants.set([]);
            bills.set([]);
            payments.set([]);
            expenses.set([]);
            // Optional: Keep banks and settings
            toast.success('System reset complete');
        }
    }
</script>

<div class="grid lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
    
    <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-fit">
        <h3 class="text-lg font-bold text-gray-800 mb-4 pb-2 border-b">System Preferences</h3>
        <form on:submit|preventDefault={saveSystem} class="space-y-4">
            <div>
                <label class="block text-sm font-bold text-gray-700 mb-1">Application Name</label>
                <input bind:value={appName} class="w-full border p-2 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" />
            </div>
            <div>
                <label class="block text-sm font-bold text-gray-700 mb-1">Currency Symbol</label>
                <select bind:value={currency} class="w-full border p-2 rounded-lg bg-white">
                    <option value="USD">USD ($)</option>
                    <option value="NGN">NGN (₦)</option>
                    <option value="NONE">None</option>
                </select>
            </div>
            <button class="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-lg w-full transition">
                Save Preferences
            </button>
        </form>
    </div>

    <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-fit">
        <h3 class="text-lg font-bold text-gray-800 mb-4 pb-2 border-b">User Profile</h3>
        <form on:submit|preventDefault={saveProfile} class="space-y-4">
            <div>
                <label class="block text-sm font-bold text-gray-700 mb-1">Display Name</label>
                <input bind:value={username} class="w-full border p-2 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" />
            </div>
            <div>
                <label class="block text-sm font-bold text-gray-700 mb-1">Job Title / Role</label>
                <input bind:value={role} class="w-full border p-2 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" />
            </div>
            <button class="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-lg w-full transition">
                Update Profile
            </button>
        </form>
    </div>

    <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-fit">
        <h3 class="text-lg font-bold text-gray-800 mb-4 pb-2 border-b">Bank Accounts</h3>
        
        <form on:submit|preventDefault={addBank} class="flex gap-2 mb-4">
            <input bind:value={newBankName} placeholder="New Bank Name" class="flex-1 border p-2 rounded-lg" />
            <button class="bg-green-600 hover:bg-green-700 text-white font-bold px-4 rounded-lg">Add</button>
        </form>

        <ul class="space-y-2">
            {#each $banks as bank}
                <li class="flex justify-between items-center p-3 bg-gray-50 rounded-lg border border-gray-100">
                    <span class="font-medium text-gray-700">{bank.name}</span>
                    <button on:click={() => removeBank(bank.id)} class="text-red-500 hover:bg-red-50 p-1 rounded">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                    </button>
                </li>
            {/each}
        </ul>
    </div>

    <div class="bg-red-50 p-6 rounded-xl border border-red-100 h-fit">
        <h3 class="text-lg font-bold text-red-800 mb-2">Danger Zone</h3>
        <p class="text-sm text-red-600 mb-4">This action cannot be undone. This will wipe all financial records.</p>
        <button on:click={resetData} class="bg-white border border-red-300 text-red-600 hover:bg-red-600 hover:text-white font-bold py-2 px-4 rounded-lg w-full transition">
            Reset System Data
        </button>
    </div>

</div>