<script>
    import { tenants, payments, banks, tenantStats } from '$lib/stores';
    import { formatMoney, formatDate } from '$lib/utils';
    import toast from 'svelte-french-toast';

    let tenantId = '';
    let bankId = '';
    let date = new Date().toISOString().split('T')[0];
    let amount = ''; // String to allow empty state
    let reference = '';
    
    let isEditing = null;

    // Reactive: Find outstanding balance for selected tenant hint
    $: currentTenant = $tenantStats.find(t => t.id === tenantId);
    $: outstandingHint = currentTenant ? currentTenant.balance : 0;

    // Search filter
    let searchTerm = '';
    $: sortedPayments = $payments
        .filter(p => {
            const tName = $tenants.find(t => t.id === p.tenantId)?.name.toLowerCase() || '';
            const ref = p.reference?.toLowerCase() || '';
            const term = searchTerm.toLowerCase();
            return tName.includes(term) || ref.includes(term);
        })
        .sort((a, b) => new Date(b.date) - new Date(a.date));

    function handleSubmit() {
        const val = parseFloat(amount);
        if(!val || val <= 0) return toast.error('Enter a valid amount');
        if(!tenantId) return toast.error('Select a tenant');
        if(!bankId) return toast.error('Select a bank account');

        const payload = {
            tenantId, bankId, date, reference,
            amount: val
        };

        if(isEditing) {
            payments.update(curr => curr.map(p => p.id === isEditing ? { ...p, ...payload } : p));
            toast.success('Payment updated');
        } else {
            payments.update(curr => [...curr, { id: Date.now().toString(), ...payload }]);
            toast.success('Payment recorded');
        }
        resetForm();
    }

    function edit(p) {
        tenantId = p.tenantId;
        bankId = p.bankId;
        date = p.date;
        amount = p.amount;
        reference = p.reference;
        isEditing = p.id;
    }

    function remove(id) {
        if(confirm('Delete this payment record?')) {
            payments.update(curr => curr.filter(p => p.id !== id));
        }
    }

    function resetForm() {
        tenantId = ''; bankId = ''; amount = ''; reference = ''; isEditing = null;
        date = new Date().toISOString().split('T')[0];
    }
</script>

<div class="grid lg:grid-cols-3 gap-6">
    <div class="bg-white p-6 rounded-xl shadow-sm h-fit sticky top-6 border border-gray-100">
        <div class="flex justify-between items-center mb-4 pb-2 border-b">
            <h3 class="font-bold text-gray-800">{isEditing ? 'Edit Receipt' : 'Record Receipt'}</h3>
            <div class="h-8 w-8 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-600">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a1 1 0 100-2 1 1 0 000 2z" clip-rule="evenodd" /></svg>
            </div>
        </div>

        <form on:submit|preventDefault={handleSubmit} class="space-y-4">
            <div>
                <label class="block text-sm font-bold text-gray-700 mb-1">Tenant</label>
                <select bind:value={tenantId} required class="w-full border border-gray-300 p-2 rounded-lg bg-gray-50 focus:bg-white transition">
                    <option value="">Select Tenant...</option>
                    {#each $tenants.filter(t => t.status !== 'deleted') as t}
                        <option value={t.id}>{t.name}</option>
                    {/each}
                </select>
                {#if tenantId}
                    <div class="text-xs mt-1 font-bold px-1" 
                         class:text-red-500={outstandingHint > 0} 
                         class:text-green-600={outstandingHint <= 0}>
                        {outstandingHint > 0 ? `Owes: ${formatMoney(outstandingHint)}` : `Credit: ${formatMoney(Math.abs(outstandingHint))}`}
                    </div>
                {/if}
            </div>

            <div>
                <label class="block text-sm font-bold text-gray-700 mb-1">Deposit To</label>
                <select bind:value={bankId} required class="w-full border border-gray-300 p-2 rounded-lg bg-gray-50 focus:bg-white transition">
                    <option value="">Select Bank...</option>
                    {#each $banks as b}
                        <option value={b.id}>{b.name}</option>
                    {/each}
                </select>
            </div>

            <div class="grid grid-cols-2 gap-3">
                <div>
                    <label class="block text-sm font-bold text-gray-700 mb-1">Date</label>
                    <input type="date" bind:value={date} required class="w-full border border-gray-300 p-2 rounded-lg" />
                </div>
                <div>
                    <label class="block text-sm font-bold text-gray-700 mb-1">Amount</label>
                    <input type="number" step="0.01" bind:value={amount} required class="w-full border border-gray-300 p-2 rounded-lg font-bold text-gray-800" placeholder="0.00" />
                </div>
            </div>

            <input bind:value={reference} placeholder="Reference / Check #" class="w-full border border-gray-300 p-2 rounded-lg" />

            <div class="flex gap-2 pt-2">
                <button class="bg-emerald-600 hover:bg-emerald-700 text-white w-full py-2.5 rounded-lg font-bold shadow-sm transition">
                    {isEditing ? 'Update Receipt' : 'Record Receipt'}
                </button>
                {#if isEditing}
                    <button type="button" on:click={resetForm} class="bg-gray-100 hover:bg-gray-200 text-gray-600 px-4 rounded-lg font-bold">X</button>
                {/if}
            </div>
        </form>
    </div>

    <div class="lg:col-span-2 space-y-4">
        <div class="flex justify-between items-center bg-white p-4 rounded-xl shadow-sm border border-gray-100">
            <h3 class="font-bold text-gray-800">History</h3>
            <input bind:value={searchTerm} placeholder="Search payments..." class="text-sm border p-2 rounded-lg w-48" />
        </div>

        <div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <table class="w-full text-sm text-left">
                <thead class="bg-gray-50 text-xs uppercase text-gray-500">
                    <tr>
                        <th class="px-6 py-3">Date</th>
                        <th class="px-6 py-3">Tenant</th>
                        <th class="px-6 py-3">Bank</th>
                        <th class="px-6 py-3 text-right">Amount</th>
                        <th class="px-6 py-3 text-center">Action</th>
                    </tr>
                </thead>
                <tbody>
                    {#each sortedPayments as p}
                        {@const t = $tenants.find(x => x.id === p.tenantId)}
                        {@const b = $banks.find(x => x.id === p.bankId)}
                        <tr class="border-b hover:bg-gray-50">
                            <td class="px-6 py-4 whitespace-nowrap">{formatDate(p.date)}</td>
                            <td class="px-6 py-4 font-bold text-gray-900">
                                {t?.name || 'Unknown'}
                                <div class="text-xs text-gray-400 font-normal">{p.reference || ''}</div>
                            </td>
                            <td class="px-6 py-4 text-xs text-blue-600 font-medium">{b?.name || '-'}</td>
                            <td class="px-6 py-4 text-right font-bold text-emerald-600">{formatMoney(p.amount)}</td>
                            <td class="px-6 py-4 text-center space-x-2">
                                <button on:click={() => edit(p)} class="text-blue-600 font-bold text-xs hover:underline">EDIT</button>
                                <button on:click={() => remove(p.id)} class="text-red-500 font-bold text-xs hover:underline">DEL</button>
                            </td>
                        </tr>
                    {:else}
                        <tr><td colspan="5" class="p-8 text-center text-gray-400">No payments found.</td></tr>
                    {/each}
                </tbody>
            </table>
        </div>
    </div>
</div>