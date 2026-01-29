<script>
    import { expenses, banks } from '$lib/stores';
    import { formatMoney, formatDate } from '$lib/utils';
    import toast from 'svelte-french-toast';

    let description = '';
    let bankId = '';
    let date = new Date().toISOString().split('T')[0];
    let amount = '';
    let isEditing = null;

    $: sortedExpenses = $expenses.sort((a, b) => new Date(b.date) - new Date(a.date));
    $: totalExpenses = $expenses.reduce((sum, e) => sum + e.amount, 0);

    function handleSubmit() {
        const val = parseFloat(amount);
        if(!val || val <= 0) return toast.error('Enter valid amount');
        if(!bankId) return toast.error('Select funding account');

        const payload = { description, bankId, date, amount: val };

        if(isEditing) {
            expenses.update(curr => curr.map(e => e.id === isEditing ? { ...e, ...payload } : e));
            toast.success('Expense updated');
        } else {
            expenses.update(curr => [...curr, { id: Date.now().toString(), ...payload }]);
            toast.success('Expense recorded');
        }
        resetForm();
    }

    function edit(e) {
        description = e.description; bankId = e.bankId; date = e.date; amount = e.amount; isEditing = e.id;
    }

    function remove(id) {
        if(confirm('Remove this expense?')) expenses.update(curr => curr.filter(e => e.id !== id));
    }

    function resetForm() {
        description = ''; bankId = ''; amount = ''; isEditing = null;
        date = new Date().toISOString().split('T')[0];
    }
</script>

<div class="grid lg:grid-cols-3 gap-6">
    <div class="bg-white p-6 rounded-xl shadow-sm h-fit sticky top-6 border-t-4 border-orange-500">
        <h3 class="font-bold text-gray-800 mb-4">{isEditing ? 'Edit Expense' : 'Record Expense'}</h3>
        <form on:submit|preventDefault={handleSubmit} class="space-y-4">
            <input bind:value={description} required placeholder="Description (e.g. Repairs)" class="w-full border p-2 rounded-lg" />
            
            <select bind:value={bankId} required class="w-full border p-2 rounded-lg bg-gray-50">
                <option value="">Select Funding Account...</option>
                {#each $banks as b}
                    <option value={b.id}>{b.name}</option>
                {/each}
            </select>

            <div class="grid grid-cols-2 gap-2">
                <input type="date" bind:value={date} required class="border p-2 rounded-lg" />
                <input type="number" step="0.01" bind:value={amount} required placeholder="0.00" class="border p-2 rounded-lg font-bold" />
            </div>

            <button class="bg-orange-600 hover:bg-orange-700 text-white w-full py-2 rounded-lg font-bold transition">Save Expense</button>
            {#if isEditing}
                <button type="button" on:click={resetForm} class="text-gray-500 text-xs w-full text-center mt-2 hover:underline">Cancel Edit</button>
            {/if}
        </form>
    </div>

    <div class="lg:col-span-2 space-y-4">
        <div class="bg-orange-50 p-4 rounded-xl border border-orange-100 flex justify-between items-center text-orange-800">
            <span class="font-bold">Total Expenses</span>
            <span class="text-xl font-black">{formatMoney(totalExpenses)}</span>
        </div>

        <div class="bg-white rounded-xl shadow-sm overflow-hidden">
            <table class="w-full text-sm text-left">
                <thead class="bg-gray-100 uppercase text-xs">
                    <tr>
                        <th class="px-6 py-3">Date</th>
                        <th class="px-6 py-3">Description</th>
                        <th class="px-6 py-3">Source</th>
                        <th class="px-6 py-3 text-right">Amount</th>
                        <th class="px-6 py-3 text-center">Action</th>
                    </tr>
                </thead>
                <tbody>
                    {#each sortedExpenses as e}
                        {@const bank = $banks.find(b => b.id === e.bankId)}
                        <tr class="border-b hover:bg-gray-50">
                            <td class="px-6 py-4">{formatDate(e.date)}</td>
                            <td class="px-6 py-4 font-bold">{e.description}</td>
                            <td class="px-6 py-4 text-xs text-gray-500">{bank?.name || '-'}</td>
                            <td class="px-6 py-4 text-right font-bold text-orange-600">{formatMoney(e.amount)}</td>
                            <td class="px-6 py-4 text-center">
                                <button on:click={() => edit(e)} class="text-blue-600 font-bold text-xs px-1">EDIT</button>
                                <button on:click={() => remove(e.id)} class="text-red-500 font-bold text-xs px-1">DEL</button>
                            </td>
                        </tr>
                    {/each}
                </tbody>
            </table>
        </div>
    </div>
</div>