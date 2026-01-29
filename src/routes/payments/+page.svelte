<script>
    import { tenants, payments, banks, tenantStats } from '$lib/stores';
    import { formatMoney, formatDate } from '$lib/utils';
    import toast from 'svelte-french-toast';

    let tenantId = '', bankId = '', date = new Date().toISOString().split('T')[0], amount = '', ref = '';
    
    $: balanceHint = $tenantStats.find(t => t.id === tenantId)?.balance || 0;

    function save() {
        if(!amount || !tenantId) return toast.error('Missing data');
        payments.update(n => [...n, { id: Date.now().toString(), tenantId, bankId, date, amount: parseFloat(amount), ref }]);
        toast.success('Receipt Recorded');
        amount = ''; ref = '';
    }
</script>

<div class="grid lg:grid-cols-3 gap-6">
    <div class="bg-white p-5 rounded-xl shadow-sm h-fit border-t-4 border-emerald-500">
        <h3 class="font-bold text-gray-800 mb-4">Record Receipt</h3>
        <form on:submit|preventDefault={save} class="space-y-3">
            <select bind:value={tenantId} required class="w-full border p-2 rounded-lg bg-white">
                <option value="">Select Tenant...</option>
                {#each $tenants.filter(t => t.status !== 'deleted') as t} <option value={t.id}>{t.name}</option> {/each}
            </select>
            {#if tenantId}
                <div class="text-xs text-right font-bold" class:text-red-500={balanceHint>0}>
                    Current Balance: {formatMoney(balanceHint)}
                </div>
            {/if}

            <select bind:value={bankId} required class="w-full border p-2 rounded-lg bg-white">
                <option value="">Deposit To...</option>
                {#each $banks as b} <option value={b.id}>{b.name}</option> {/each}
            </select>

            <div class="flex gap-3">
                <input type="date" bind:value={date} class="w-1/3 border p-2 rounded-lg" />
                <input type="number" bind:value={amount} placeholder="0.00" class="w-2/3 border p-2 rounded-lg font-bold text-lg" required />
            </div>
            <input bind:value={ref} placeholder="Reference (Check #)" class="w-full border p-2 rounded-lg" />

            <button class="w-full bg-emerald-600 text-white py-3 rounded-lg font-bold shadow-md">Record Payment</button>
        </form>
    </div>

    <div class="lg:col-span-2 space-y-3">
        {#each $payments.sort((a,b) => new Date(b.date) - new Date(a.date)) as p}
            {@const t = $tenants.find(x => x.id === p.tenantId)}
            <div class="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex justify-between items-center">
                <div>
                    <div class="text-xs text-gray-400">{formatDate(p.date)} &bull; {p.ref || '-'}</div>
                    <div class="font-bold text-gray-900">{t?.name || 'Unknown'}</div>
                </div>
                <div class="text-right">
                    <div class="font-black text-emerald-600">{formatMoney(p.amount)}</div>
                    <button on:click={() => {if(confirm('Delete?')) payments.update(n=>n.filter(x=>x.id!==p.id))}} class="text-xs text-red-400 font-bold">DEL</button>
                </div>
            </div>
        {/each}
    </div>
</div>
