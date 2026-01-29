// src/lib/utils.js
import { get } from 'svelte/store';
import { settings } from './stores';

export const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric', month: 'short', day: 'numeric'
    });
};

export const formatMoney = (amount) => {
    const currentSettings = get(settings);
    const val = parseFloat(amount) || 0;
    
    let sign = '';
    if (currentSettings.currency === 'USD') sign = '$';
    else if (currentSettings.currency === 'NGN') sign = '₦';

    return sign + val.toLocaleString('en-US', { 
        minimumFractionDigits: 2, 
        maximumFractionDigits: 2 
    });
};