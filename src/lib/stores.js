import { writable, derived } from 'svelte/store';
import { browser } from '$app/environment';

function createPersistentStore(key, startValue) {
    const saved = browser ? localStorage.getItem(key) : null;
    const initial = saved ? JSON.parse(saved) : startValue;
    const store = writable(initial);
    if (browser) store.subscribe(v => localStorage.setItem(key, JSON.stringify(v)));
    return store;
}

export const tenants = createPersistentStore('ar_tenants', []);
export const bills = createPersistentStore('ar_bills', []);
export const payments = createPersistentStore('ar_payments', []);
export const expenses = createPersistentStore('ar_expenses', []);
export const banks = createPersistentStore('ar_banks', [{ id: '1', name: 'Corporate Account' }]);
export const settings = createPersistentStore('ar_settings', { currency: 'USD', appName: 'FacilityAR' });
export const userProfile = createPersistentStore('ar_profile', { username: 'Admin', role: 'Manager' });

export const tenantStats = derived([tenants, bills, payments], ([$t, $b, $p]) => {
    return $t.map(tenant => {
        const billed = $b.filter(b => b.tenantId === tenant.id).reduce((s, x) => s + x.total, 0);
        const paid = $p.filter(p => p.tenantId === tenant.id).reduce((s, x) => s + x.amount, 0);
        return { ...tenant, billed, paid, balance: billed - paid };
    });
});
