<script>
    import '../app.css'; // Make sure Tailwind is setup
    import { page } from '$app/stores';
    import { Toaster } from 'svelte-french-toast';
    import { settings, userProfile } from '$lib/stores';

    let sidebarCollapsed = false;

    // Helper to check active route
    $: isActive = (path) => $page.url.pathname === path ? 'bg-white/10 border-l-4 border-blue-400' : 'hover:bg-white/5';

    function getInitials(name) {
        const names = name.split(' ');
        let initials = names[0][0];
        if(names.length > 1) initials += names[names.length - 1][0];
        return initials.toUpperCase();
    }
</script>

<Toaster />

<div class="bg-gray-50 text-gray-800 font-sans h-screen flex overflow-hidden">
    <aside class="transition-all duration-300 bg-gradient-to-b from-indigo-900 to-indigo-800 text-white flex flex-col shadow-xl z-20 {sidebarCollapsed ? 'w-20' : 'w-64'}">
        <div class="p-6 border-b border-indigo-800 flex justify-between items-center">
            {#if !sidebarCollapsed}
                <div>
                    <h1 class="text-2xl font-bold tracking-tight">{$settings.appName}</h1>
                    <p class="text-xs text-indigo-200 opacity-80">AR System</p>
                </div>
            {/if}
            <button on:click={() => sidebarCollapsed = !sidebarCollapsed} class="p-1 rounded hover:bg-white/10 ml-auto">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
            </button>
        </div>

        <nav class="flex-1 p-4 space-y-2 overflow-y-auto">
            <a href="/" class="block px-4 py-3 rounded-lg transition flex items-center gap-3 {isActive('/')}">
                <span>📊</span> {#if !sidebarCollapsed}<span>Dashboard</span>{/if}
            </a>
            <a href="/tenants" class="block px-4 py-3 rounded-lg transition flex items-center gap-3 {isActive('/tenants')}">
                <span>👥</span> {#if !sidebarCollapsed}<span>Tenants</span>{/if}
            </a>
            <a href="/billing" class="block px-4 py-3 rounded-lg transition flex items-center gap-3 {isActive('/billing')}">
                <span>🧾</span> {#if !sidebarCollapsed}<span>Billing</span>{/if}
            </a>
            <a href="/payments" class="block px-4 py-3 rounded-lg transition flex items-center gap-3 {isActive('/payments')}">
                <span>💰</span> {#if !sidebarCollapsed}<span>Payments</span>{/if}
            </a>
            <a href="/expenses" class="block px-4 py-3 rounded-lg transition flex items-center gap-3 {isActive('/expenses')}">
                <span>💸</span> {#if !sidebarCollapsed}<span>Expenses</span>{/if}
            </a>
            <a href="/settings" class="block px-4 py-3 rounded-lg transition flex items-center gap-3 {isActive('/settings')}">
                <span>⚙️</span> {#if !sidebarCollapsed}<span>Settings</span>{/if}
            </a>
        </nav>
    </aside>

    <main class="flex-1 overflow-auto bg-slate-50 relative flex flex-col">
        <header class="bg-white shadow-sm sticky top-0 z-10 px-8 py-4 flex justify-between items-center border-b border-gray-100 h-18">
            <h2 class="text-xl font-bold text-gray-800 capitalize">{$page.url.pathname === '/' ? 'Dashboard' : $page.url.pathname.replace('/', '')}</h2>
            <div class="flex items-center space-x-4">
                <div class="text-sm text-right hidden sm:block">
                    <p class="font-bold text-gray-900">{$userProfile.username}</p>
                    <p class="text-xs text-blue-600 font-medium">{$userProfile.role}</p>
                </div>
                <div class="h-10 w-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold shadow-md">
                    {getInitials($userProfile.username)}
                </div>
            </div>
        </header>

        <div class="p-8 pb-20 max-w-7xl mx-auto w-full">
            <slot />
        </div>
    </main>
</div>
