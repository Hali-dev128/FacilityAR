<script>
    import '../app.css';
    import { page } from '$app/stores';
    import { Toaster } from 'svelte-french-toast';
    import { settings, userProfile } from '$lib/stores';

    let mobileMenuOpen = false;

    // Close menu when route changes
    $: if($page.url.pathname) mobileMenuOpen = false;

    $: isActive = (path) => $page.url.pathname === path 
        ? 'bg-blue-600 text-white shadow-md' 
        : 'text-indigo-100 hover:bg-white/10';
</script>

<Toaster />

<div class="flex h-screen bg-gray-50 overflow-hidden">
    
    {#if mobileMenuOpen}
        <div class="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm" 
             on:click={() => mobileMenuOpen = false}></div>
    {/if}

    <aside class="
        fixed inset-y-0 left-0 z-50 w-64 bg-gradient-to-b from-slate-900 to-slate-800 
        transform transition-transform duration-300 ease-in-out shadow-2xl
        lg:translate-x-0 lg:static lg:shadow-none
        {mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
    ">
        <div class="h-16 flex items-center justify-between px-6 border-b border-white/10">
            <h1 class="text-xl font-bold text-white tracking-tight">{$settings.appName}</h1>
            <button class="lg:hidden text-white" on:click={() => mobileMenuOpen = false}>
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
        </div>

        <nav class="p-4 space-y-2 overflow-y-auto">
            <a href="/" class="flex items-center gap-3 px-4 py-3 rounded-xl transition font-medium {isActive('/')}">
                <span>📊</span> Dashboard
            </a>
            <a href="/tenants" class="flex items-center gap-3 px-4 py-3 rounded-xl transition font-medium {isActive('/tenants')}">
                <span>👥</span> Tenants
            </a>
            <a href="/billing" class="flex items-center gap-3 px-4 py-3 rounded-xl transition font-medium {isActive('/billing')}">
                <span>🧾</span> Billing
            </a>
            <a href="/payments" class="flex items-center gap-3 px-4 py-3 rounded-xl transition font-medium {isActive('/payments')}">
                <span>💰</span> Payments
            </a>
            <a href="/expenses" class="flex items-center gap-3 px-4 py-3 rounded-xl transition font-medium {isActive('/expenses')}">
                <span>💸</span> Expenses
            </a>
            <a href="/settings" class="flex items-center gap-3 px-4 py-3 rounded-xl transition font-medium {isActive('/settings')}">
                <span>⚙️</span> Settings
            </a>
        </nav>

        <div class="p-4 border-t border-white/10 mt-auto">
            <div class="flex items-center gap-3">
                <div class="h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold">
                    {$userProfile.username.charAt(0)}
                </div>
                <div>
                    <p class="text-white text-sm font-semibold">{$userProfile.username}</p>
                    <p class="text-slate-400 text-xs">{$userProfile.role}</p>
                </div>
            </div>
        </div>
    </aside>

    <main class="flex-1 flex flex-col w-full h-full overflow-hidden">
        <header class="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 lg:hidden shrink-0">
            <button on:click={() => mobileMenuOpen = true} class="p-2 -ml-2 text-gray-600">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" /></svg>
            </button>
            <span class="font-bold text-gray-800">{$settings.appName}</span>
            <div class="w-8"></div> </header>

        <div class="flex-1 overflow-auto p-4 lg:p-8">
            <div class="max-w-6xl mx-auto">
                <slot />
            </div>
        </div>
    </main>
</div>
