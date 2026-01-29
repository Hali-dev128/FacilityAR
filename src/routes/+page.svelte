<div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
    <div class="px-6 py-4 border-b border-gray-100 bg-gray-50">
        <h3 class="font-bold text-gray-800">Financial Overview</h3>
    </div>
    
    <div class="hidden md:block overflow-x-auto">
        <table class="w-full text-sm text-left">
            <thead class="text-xs text-gray-700 uppercase bg-gray-100">
                <tr>
                    <th class="px-6 py-3">Tenant</th>
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
                        <td class="px-6 py-4 font-bold">
                            {t.name} <span class="text-xs font-normal text-gray-500 block">{t.plotNumber}</span>
                        </td>
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

    <div class="md:hidden">
        {#each $tenantStats as t}
            {#if t.status !== 'deleted'}
            <div class="p-4 border-b border-gray-100 space-y-2">
                <div class="flex justify-between items-start">
                    <div>
                        <div class="font-bold text-gray-800">{t.name}</div>
                        <div class="text-xs text-gray-500">{t.plotNumber}</div>
                    </div>
                    {#if t.balance > 0.01}
                        <span class="bg-red-100 text-red-800 text-xs font-bold px-2 py-1 rounded">DUE</span>
                    {:else if t.balance < -0.01}
                        <span class="bg-green-100 text-green-800 text-xs font-bold px-2 py-1 rounded">CREDIT</span>
                    {:else}
                        <span class="bg-gray-100 text-gray-600 text-xs font-bold px-2 py-1 rounded">OK</span>
                    {/if}
                </div>
                <div class="grid grid-cols-3 gap-2 text-sm pt-2">
                    <div>
                        <div class="text-xs text-gray-400 uppercase">Billed</div>
                        <div>{formatMoney(t.billed)}</div>
                    </div>
                    <div>
                        <div class="text-xs text-gray-400 uppercase">Paid</div>
                        <div>{formatMoney(t.paid)}</div>
                    </div>
                    <div class="text-right">
                        <div class="text-xs text-gray-400 uppercase">Balance</div>
                        <div class="font-bold" class:text-red-600={t.balance > 0} class:text-green-600={t.balance < 0}>
                            {formatMoney(t.balance)}
                        </div>
                    </div>
                </div>
            </div>
            {/if}
        {/each}
    </div>
</div>
