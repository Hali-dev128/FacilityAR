<script>
    import { tenantStats, bills, expenses } from '$lib/stores';
    import { formatMoney } from '$lib/utils';

    $: totalBilled = $bills.reduce((s, b) => s + b.total, 0);
    $: totalExpenses = $expenses.reduce((s, e) => s + e.amount, 0);
    $: totalPaid = $tenantStats.reduce((s, t) => s + t.paid, 0);
    $: totalOutstanding = $tenantStats.reduce((s, t) => t.balance > 0 ? s + t.balance : s, 0);
</script>

<div class="space-y-6">
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard label="Total Billed" value={totalBilled} color="blue" />
        <KpiCard label="Outstanding" value={totalOutstanding} color="red" />
        <KpiCard label="Receipts" value={totalPaid} color="emerald" />
        <KpiCard label="Expenses" value={totalExpenses} color="orange" />
    </div>

    <div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div class="p-4 border-b border-gray-100 bg-gray-50/50">
            <h3 class="font-bold text-gray-800">Financial Overview</h3>
        </div>

        <div class="hidden md:block overflow-x-auto">
            <table class="w-full text-sm text-left">
                <thead class="text-xs uppercase bg-gray-50 text-gray-500">
                    <tr>
                        <th class="px-6 py-3">Tenant</th>
                        <th class="px-6 py-3 text-right">Billed</th>
                        <th class="px-6 py-3 text-right">Paid</th>
                        <th class="px-6 py-3 text-right">Balance</th>
                        <th class="px-6 py-3 text-center">Status</th>
                    </tr>
                </thead>
                <tbody>
                    {#each $tenantStats.filter(t => t.status !== 'deleted') as t}
                        <tr class="border-b hover:bg-gray-50">
                            <td class="px-6 py-4 font-bold">{t.name} <span class="text-gray-400 font-normal ml-1">#{t.plotNumber}</span></td>
                            <td class="px-6 py-4 text-right">{formatMoney(t.billed)}</td>
                            <td class="px-6 py-4 text-right">{formatMoney(t.paid)}</td>
                            <td class="px-6 py-4 text-right font-bold" class:text-red-600={t.balance > 0.01} class:text-green-600={t.balance < -0.01}>{formatMoney(t.balance)}</td>
                            <td class="px-6 py-4 text-center"><StatusBadge bal={t.balance} /></td>
                        </tr>
                    {/each}
                </tbody>
            </table>
        </div>

        <div class="md:hidden divide-y divide-gray-100">
            {#each $tenantStats.filter(t => t.status !== 'deleted') as t}
                <div class="p-4 flex flex-col gap-3">
                    <div class="flex justify-between items-start">
                        <div>
                            <div class="font-bold text-gray-900">{t.name}</div>
                            <div class="text-xs text-gray-500">Plot: {t.plotNumber}</div>
                        </div>
                        <StatusBadge bal={t.balance} />
                    </div>
                    <div class="grid grid-cols-3 gap-2 text-xs bg-slate-50 p-2 rounded">
                        <div class="text-center"><span class="block text-gray-400">Billed</span>{formatMoney(t.billed)}</div>
                        <div class="text-center border-l"><span class="block text-gray-400">Paid</span>{formatMoney(t.paid)}</div>
                        <div class="text-center border-l font-bold" class:text-red-600={t.balance>0}>{formatMoney(t.balance)}</div>
                    </div>
                </div>
            {/each}
        </div>
    </div>
</div>

<script context="module">
    import { create_ssr_component } from 'svelte/internal';
</script>

{#snippet KpiCard({label, value, color})}
    <div class="bg-white p-4 rounded-xl shadow-sm border-l-4 border-{color}-500">
        <div class="text-xs font-bold uppercase text-gray-400">{label}</div>
        <div class="text-xl font-black text-gray-800">{formatMoney(value)}</div>
    </div>
{/snippet}

{#snippet StatusBadge({bal})}
    {#if bal > 0.01} <span class="bg-red-100 text-red-800 text-xs px-2 py-1 rounded font-bold">DUE</span>
    {:else if bal < -0.01} <span class="bg-green-100 text-green-800 text-xs px-2 py-1 rounded font-bold">CREDIT</span>
    {:else} <span class="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded font-bold">OK</span>
    {/if}
{/snippet}
