<script>
    import { tenants, bills } from '$lib/stores';
    import { formatMoney, formatDate } from '$lib/utils';
    import toast from 'svelte-french-toast';

    let tenantId = '';
    let date = new Date().toISOString().split('T')[0];
    let service = 0, infra = 0, fittings = 0, other = 0;

    $: activeTenants = $tenants.filter(t => t.status !== 'deleted');

    function createBill() {
        const total = service + infra + fittings + other;
        if(total <= 0) return toast.error('Total must be greater than 0');

        bills.update(curr => [
            { 
                id: Date.now().toString(), 
                tenantId, date, 
                serviceCharge: service, infraCharge: infra, 
                fittingsCharge: fittings, otherCharge: other, 
                total 
            },
            ...curr
        ]);
        
        toast.success('Bill generated');
        service = 0; infra = 0; fittings = 0; other = 0;
    }

    function deleteBill(id) {
        if(confirm('Delete bill?')) {
            bills.update(curr => curr.filter(b => b.id !== id));
        }
    }
</script>

<div class="grid lg:grid-cols-3 gap-6">
    <div class="bg-white p-6 rounded-xl shadow-sm h-fit sticky top-6">
        <h3 class="font-bold mb-4">Generate Bill</h3>
        <form on:submit|preventDefault={createBill} class="space-y-4">
            <select bind:value={tenantId} required class="w-full border p-2 rounded bg-white">
                <option value="">Select Tenant...</option>
                {#each activeTenants as t}
                    <option value={t.id}>{t.name} ({t.plotNumber})</option>
                {/each}
            </select>
            <input type="date" bind:value={date} required class="w-full border p-2 rounded" />
            
            <div class="grid grid-cols-2 gap-2">
                <label>Service <input type="number" bind:value={service} class="border w-full p-1 rounded" /></label>
                <label>Infra <input type="number" bind:value={infra} class="border w-full p-1 rounded" /></label>
                <label>Fittings <input type="number" bind:value={fittings} class="border w-full p-1 rounded" /></label>
                <label>Other <input type="number" bind:value={other} class="border w-full p-1 rounded" /></label>
            </div>

            <div class="pt-2 border-t flex justify-between font-bold">
                <span>Total:</span>
                <span>{formatMoney(service + infra + fittings + other)}</span>
            </div>

            <button class="bg-indigo-600 text-white w-full py-2 rounded hover:bg-indigo-700">Generate Bill</button>
        </form>
    </div>

    <div class="lg:col-span-2 bg-white rounded-xl shadow-sm overflow-hidden">
        <table class="w-full text-sm text-left">
            <thead class="bg-gray-100">
                <tr>
                    <th class="px-4 py-3">Date</th>
                    <th class="px-4 py-3">Tenant</th>
                    <th class="px-4 py-3 text-right">Total</th>
                    <th class="px-4 py-3 text-right">Action</th>
                </tr>
            </thead>
            <tbody>
                {#each $bills as bill}
                    {@const t = $tenants.find(x => x.id === bill.tenantId)}
                    <tr class="border-b">
                        <td class="px-4 py-3">{formatDate(bill.date)}</td>
                        <td class="px-4 py-3 font-bold">{t?.name || 'Unknown'}</td>
                        <td class="px-4 py-3 text-right">{formatMoney(bill.total)}</td>
                        <td class="px-4 py-3 text-right">
                            <button on:click={() => deleteBill(bill.id)} class="text-red-500 font-bold text-xs">DEL</button>
                        </td>
                    </tr>
                {/each}
            </tbody>
        </table>
    </div>
</div>