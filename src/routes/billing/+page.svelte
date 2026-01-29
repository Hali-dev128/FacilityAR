<script>
    import { tenants, bills } from '$lib/stores';
    import { formatMoney, formatDate } from '$lib/utils';
    import toast from 'svelte-french-toast';

    let tenantId = '', date = new Date().toISOString().split('T')[0];
    let service = 0, infra = 0, fittings = 0, other = 0;

    function save() {
        const total = service + infra + fittings + other;
        if(total <= 0) return toast.error('Total must be > 0');
        bills.update(n => [...n, { id: Date.now().toString(), tenantId, date, service, infra, fittings, other, total }]);
        toast.success('Bill Generated');
        service = 0; infra = 0; fittings = 0; other = 0;
    }
</script>

<div class="grid lg:grid-cols-3 gap-6">
    <div class="bg-white p-5 rounded-xl shadow-sm h-fit">
        <h3 class="font-bold text-gray-800 mb-4">Create Bill</h3>
        <form on:submit|preventDefault={save} class="space-y-3">
            <select bind:value={tenantId} required class="w-full border p-2 rounded-lg bg-white">
                <option value="">Select Tenant...</option>
                {#each $tenants.filter(t => t.status !== 'deleted') as t} <option value={t.id}>{t.name}</option> {/each}
            </select>
            <input type="date" bind:value={date} required class="w-full border p-2 rounded-lg" />
            
            <div class="grid grid-cols-2 gap-3">
                <label class="text-xs font-bold text-gray-500">Service <input type="number" bind:value={service} class="w-full border p-2 rounded mt-1" /></label>
                <label class="text-xs font-bold text-gray-500">Infra <input type="number" bind:value={infra} class="w-full border p-2 rounded mt-1" /></label>
                <label class="text-xs font-bold text-gray-500">Fittings <input type="number" bind:value={fittings} class="w-full border p-2 rounded mt-1" /></label>
                <label class="text-xs font-bold text-gray-500">Other <input type="number" bind:value={other} class="w-full border p-2 rounded mt-1" /></label>
            </div>
            
            <button class="w-full bg-indigo-600 text-white py-3 rounded-lg font-bold shadow-md">
                Total: {formatMoney(service + infra + fittings + other)} &rarr;
            </button>
        </form>
    </div>

    <div class="lg:col-span-2 space-y-3">
        {#each $bills.sort((a,b) => new Date(b.date) - new Date(a.date)) as bill}
            {@const t = $tenants.find(x => x.id === bill.tenantId)}
            <div class="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex justify-between items-center">
                <div>
                    <div class="text-xs text-gray-400">{formatDate(bill.date)}</div>
                    <div class="font-bold text-gray-900">{t?.name || 'Unknown'}</div>
                </div>
                <div class="text-right">
                    <div class="font-black text-indigo-600">{formatMoney(bill.total)}</div>
                    <button on:click={() => {if(confirm('Delete?')) bills.update(n=>n.filter(b=>b.id!==bill.id))}} class="text-xs text-red-400 font-bold px-2 py-1 bg-red-50 rounded">DEL</button>
                </div>
            </div>
        {/each}
    </div>
</div>
