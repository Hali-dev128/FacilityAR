<script>
    import { tenantStats, bills, expenses } from '$lib/stores';
    import { formatMoney } from '$lib/utils';
    import { fade } from 'svelte/transition';

    // Reactive calculations (updates automatically)
    $: totalBilled = $bills.reduce((sum, b) => sum + b.total, 0);
    $: totalExpenses = $expenses.reduce((sum, e) => sum + e.amount, 0);
    $: totalCollected = $tenantStats.reduce((sum, t) => sum + t.paid, 0);
    $: totalOutstanding = $tenantStats.reduce((sum, t) => t.balance > 0 ? sum + t.balance : sum, 0);
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

        <div class="hidden md:block overflow-x-auto">
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
                        <tr class="border-b hover:bg-gray-50 transition-colors">
                            <td class="px-6 py-4 font-bold">{t.name}</td>
                            <td class="px-6 py-4">{t.plotNumber}</td>
                            <td class="px-6 py-4 text-right text-gray-600">{formatMoney(t.billed)}</td>
                            <td class="px-6 py-4 text-right text-gray-600">{formatMoney(t.paid)}</td>
                            <td class="px-6 py-4 text-right font-bold" class:text-red-600={t.balance > 0} class:text-green-600={t.balance < 0}>
                                {formatMoney(t.balance)}
                            </td>
                            <td class="px-6 py-4 text-center">
                                <StatusBadge balance={t.balance} />
                            </td>
                        </tr>
                        {/if}
                    {/each}
                </tbody>
            </table>
        </div>

        <div class="md:hidden">
            {#each $tenantStats as t}
                {#if t.status !== 'deleted'}
                <div class="p-4 border-b border-gray-100 flex flex-col gap-3">
                    <div class="flex justify-between items-start">
                        <div>
                            <div class="font-bold text-gray-900">{t.name}</div>
                            <div class="text-xs text-gray-500 font-medium">Plot: {t.plotNumber}</div>
                        </div>
                        <StatusBadge balance={t.balance} />
                    </div>

                    <div class="grid grid-cols-3 gap-2 text-sm bg-gray-50 p-2 rounded-lg">
                        <div class="text-center">
                            <div class="text-[10px] uppercase text-gray-400 font-bold">Billed</div>
                            <div class="text-gray-600">{formatMoney(t.billed)}</div>
                        </div>
                        <div class="text-center border-l border-gray-200">
                            <div class="text-[10px] uppercase text-gray-400 font-bold">Paid</div>
                            <div class="text-gray-600">{formatMoney(t.paid)}</div>
                        </div>
                        <div class="text-center border-l border-gray-200">
                            <div class="text-[10px] uppercase text-gray-400 font-bold">Balance</div>
                            <div class="font-bold" class:text-red-600={t.balance > 0} class:text-green-600={t.balance < 0}>
                                {formatMoney(t.balance)}
                            </div>
                        </div>
                    </div>
                </div>
                {/if}
            {/each}
            
            {#if $tenantStats.length === 0}
                <div class="p-8 text-center text-gray-500 italic">No records found.</div>
            {/if}
        </div>
    </div>
</div>

<script context="module">
    import { create_ssr_component } from 'svelte/internal';
</script>

{#snippet StatusBadge({ balance })}
    {#if balance > 0.01}
        <span class="bg-red-100 text-red-800 text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wide border border-red-200">Due</span>
    {:else if balance < -0.01}
        <span class="bg-green-100 text-green-800 text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wide border border-green-200">Credit</span>
    {:else}
        <span class="bg-gray-100 text-gray-600 text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wide border border-gray-200">Settled</span>
    {/if}
{/snippet}
