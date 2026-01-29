<script>
    import { expenses, banks } from '$lib/stores';
    import { formatMoney, formatDate } from '$lib/utils';
    import toast from 'svelte-french-toast';

    let desc = '', bankId = '', date = new Date().toISOString().split('T')[0], amount = '';

    function save() {
        if(!amount || !desc) return;
        expenses.update(n => [...n, { id: Date.now().toString(), description: desc, bankId, date, amount: parseFloat(amount) }]);
        toast.success('Expense Saved');
        amount = ''; desc = '';
    }
</script>

<div class="grid lg:grid-cols-3 gap-6">
    <div class="bg-white p-5 rounded-xl shadow-sm h-fit border-t-4 border-orange-500">
        <h3 class="font-bold text-gray-800 mb-4">Record Expense</h3>
        <form on:submit|preventDefault={save} class="space-y-3">
            <input bind:value={desc} required placeholder="Description" class="w-full border p-2 rounded-lg" />
            <select bind:value={bankId} required class="w-full border p-2 rounded-lg bg-white">
                <option value="">Paid From...</option>
                {#each $banks as b} <option value={b.id}>{b.name}</option> {/each}
            </select>
            <div class="flex gap-3">
                <input type="date" bind:value={date} class="w-1/3 border p-2 rounded-lg" />
                <input type="number" bind:value={amount} placeholder="0.00" required class="w-2/3 border p-2 rounded-lg font-bold text-lg" />
            </div>
            <button class="w-full bg-orange-600 text-white py-3 rounded-lg font-bold shadow-md">Save Expense</button>
        </form>
    </div>

    <div class="lg:col-span-2 space-y-3">
        {#each $expenses.sort((a,b) => new Date(b.date) - new Date(a.date)) as e}
            <div class="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex justify-between items-center">
                <div>
                    <div class="text-xs text-gray-400">{formatDate(e.date)}</div>
                    <div class="font-bold text-gray-900">{e.description}</div>
                </div>
                <div class="text-right">
                    <div class="font-black text-orange-600">{formatMoney(e.amount)}</div>
                    <button on:click={() => {if(confirm('Delete?')) expenses.update(n=>n.filter(x=>x.id!==e.id))}} class="text-xs text-red-400 font-bold">DEL</button>
                </div>
            </div>
        {/each}
    </div>
</div>
