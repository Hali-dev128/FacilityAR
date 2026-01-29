// src/lib/stores.js
import { writable, derived } from 'svelte/store';
import { browser } from '$app/environment';

// Helper to create a store that syncs with localStorage
function createPersistentStore(key, startValue) {
    const saved = browser ? localStorage.getItem(key) : null;
    const initial = saved ? JSON.parse(saved) : startValue;
    const store = writable(initial);

    if (browser) {
        store.subscribe(value => {
            localStorage.setItem(key, JSON.stringify(value));
        });
    }
    return store;
}

// Data Stores
export const tenants = createPersistentStore('ar_tenants', []);
export const bills = createPersistentStore('ar_bills', []);
export const payments = createPersistentStore('ar_payments', []);
export const expenses = createPersistentStore('ar_expenses', []);
export const banks = createPersistentStore('ar_banks', [
    { id: '1', name: 'Main Corporate Account' },
    { id: '2', name: 'Petty Cash' }
]);

// Settings & Profile
export const settings = createPersistentStore('ar_settings', { 
    currency: 'USD', 
    appName: 'FacilityAR' 
});

export const userProfile = createPersistentStore('ar_profile', {
    username: 'Admin User',
    role: 'Facility Manager'
});

// Derived Stores (Calculations)
// This automatically calculates stats whenever tenants, bills, or payments change
export const tenantStats = derived(
    [tenants, bills, payments],
    ([$tenants, $bills, $payments]) => {
        return $tenants.map(tenant => {
            const tenantBills = $bills.filter(b => b.tenantId === tenant.id);
            const tenantPayments = $payments.filter(p => p.tenantId === tenant.id);
            
            const totalBilled = tenantBills.reduce((sum, b) => sum + b.total, 0);
            const totalPaid = tenantPayments.reduce((sum, p) => sum + p.amount, 0);
            
            return {
                ...tenant,
                billed: totalBilled,
                paid: totalPaid,
                balance: totalBilled - totalPaid
            };
        });
    }
);