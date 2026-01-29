<script>
    import { tenantStats, bills, expenses } from '$lib/stores';
    import { formatMoney } from '$lib/utils';
    import { fade } from 'svelte/transition';

    // Reactive calculations (updates automatically)
    $: totalBilled = $bills.reduce((sum, b) => sum + b.total, 0);
    $: totalExpenses = $expenses.reduce((sum, e) => sum + e.amount, 0);
    $: totalCollected = $tenantStats.reduce((sum, t) => sum + t.paid, 0);
    $: totalOutstanding = $tenantStats.reduce((sum, t) => t.balance > 0 ? sum + t.balance : sum, 0);
    $: totalPrepaid = $tenantStats.reduce((sum, t) => t.balance < 0 ? sum + Math.abs(t.balance) : sum, 0);
</script>

<div in:fade class="space-y-6">
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div class="bg-white p-4 rounded-xl shadow-sm border-l-4 border-l-indigo-500">
            <div class="text-xs font-bold uppercase text-gray-400">Total Billed</div>
            <div class="text-xl font-black text-gray-800">{formatMoney(totalBilled)}</div>
        </div>
        <div class="bg-white p-4 rounded-xl shadow-sm border-l-4 border-l-red-500">
            <div class="text-xs font-bold uppercase text-gray-400">Outstanding</div>
            <div class="text-xl font-black text-red-600">{formatMoney(totalOutstanding)}</div>
        </div>
        <div class="bg-white p-4 rounded-xl shadow-sm border-l-4 border-l-emerald-500">
            <div class="text-xs font-bold uppercase text-gray-400">Total Receipts</div>
            <div class="text-xl font-black text-emerald-600">{formatMoney(totalCollected)}</div>
        </div>
         <div class="bg-white p-4 rounded-xl shadow-sm border-l-4 border-l-orange-500">
            <div class="text-xs font-bold uppercase text-gray-400">Total Expenses</div>
            <div class="text-xl font-black text-orange-600">{formatMoney(totalExpenses)}</div>
        </div>
    </div>

    <div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div class="px-6 py-4 border-b border-gray-100 bg-gray-50">
            <h3 class="font-bold text-gray-800">Financial Overview</h3>
        </div>
        <div class="overflow-x-auto">
            <table class="w-full text-sm text-left">
                <thead class="text-xs text-gray-700 uppercase bg-gray-100">
                    <tr>
                        <th class="px-6 py-3">Tenant</th>
                        <th class="px-6 py-3">Plot</th>
                        <th class="px-6 py-3 text-right">Billed</th>
                        <th class="px-6 py-3 text-right">Paid</th>
                        <th class="px-6 py-3 text-right">Balance</th>
                        <th class="px-6 py-3 text-center">Status</th>
                    </tr>
                </thead>
                <tbody>
                    {#each $tenantStats as t}
                        {#if t.status !== 'deleted'}
                        <tr class="border-b hover:bg-gray-50">
                            <td class="px-6 py-4 font-bold">{t.name}</td>
                            <td class="px-6 py-4">{t.plotNumber}</td>
                            <td class="px-6 py-4 text-right">{formatMoney(t.billed)}</td>
                            <td class="px-6 py-4 text-right">{formatMoney(t.paid)}</td>
                            <td class="px-6 py-4 text-right font-bold" class:text-red-600={t.balance > 0} class:text-green-600={t.balance < 0}>
                                {formatMoney(t.balance)}
                            </td>
                            <td class="px-6 py-4 text-center">
                                {#if t.balance > 0.01}
                                    <span class="bg-red-100 text-red-800 text-xs font-bold px-2 py-1 rounded">DUE</span>
                                {:else if t.balance < -0.01}
                                    <span class="bg-green-100 text-green-800 text-xs font-bold px-2 py-1 rounded">CREDIT</span>
                                {:else}
                                    <span class="bg-gray-100 text-gray-600 text-xs font-bold px-2 py-1 rounded">OK</span>
                                {/if}
                            </td>
                        </tr>
                        {/if}
                    {/each}
                </tbody>
            </table>
        </div>
    </div>
</div>
