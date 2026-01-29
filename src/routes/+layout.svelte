<script>
    import '../app.css';
    import { page } from '$app/stores';
    import { Toaster } from 'svelte-french-toast';
    import { settings, userProfile } from '$lib/stores';
    import { onMount } from 'svelte';

    let sidebarCollapsed = false; // Desktop state
    let mobileMenuOpen = false;   // Mobile state

    // Helper to check active route
    $: isActive = (path) => $page.url.pathname === path 
        ? 'bg-white/10 border-l-4 border-blue-400 text-white' 
        : 'text-indigo-100 hover:bg-white/5 hover:text-white';

    function getInitials(name) {
        if (!name) return 'U';
        const names = name.split(' ');
        let initials = names[0][0];
        if(names.length > 1) initials += names[names.length - 1][0];
        return initials.toUpperCase();
    }

    // Close mobile menu when navigating
    $: if ($page.url.pathname) {
        mobileMenuOpen = false;
    }
</script>

<Toaster />

<div class="bg-gray-50 text-gray-800 font-sans h-screen flex overflow-hidden">
    
    {#if mobileMenuOpen}
        <div 
            class="fixed inset-0 bg-gray-900/50 z-20 lg:hidden backdrop-blur-sm transition-opacity"
            on:click={() => mobileMenuOpen = false}
        ></div>
    {/if}

    <aside class="
        fixed lg:static inset-y-0 left-0 z-30
        flex flex-col
        bg-gradient-to-b from-indigo-900 to-indigo-800 text-white shadow-xl
        transition-all duration-300 ease-in-out
        {mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} 
        lg:translate-x-0 
        {sidebarCollapsed ? 'lg:w-20' : 'lg:w-64'}
        w-64
    ">
        <div class="h-16 flex items-center justify-between px-6 border-b border-indigo-700/50">
            {#if !sidebarCollapsed}
                <div class="overflow-hidden whitespace-nowrap">
                    <h1 class="text-xl font-bold tracking-tight">{$settings.appName}</h1>
                    <p class="text-xs text-indigo-300">AR System</p>
                </div>
            {/if}
            
            <button 
                on:click={() => sidebarCollapsed = !sidebarCollapsed} 
                class="hidden lg:block p-1.5 rounded-lg hover:bg-white/10 text-indigo-200 hover:text-white transition"
            >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 {sidebarCollapsed ? 'rotate-180' : ''} transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
                </svg>
            </button>

            <button 
                on:click={() => mobileMenuOpen = false} 
                class="lg:hidden p-1 rounded hover:bg-white/10"
            >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>
        </div>

        <nav class="flex-1 p-4 space-y-1 overflow-y-auto">
            <a href="/" class="flex items-center gap-3 px-3 py-3 rounded-lg transition-colors {isActive('/')}">
                <span class="text-xl">📊</span> 
                <span class="{sidebarCollapsed ? 'lg:hidden' : 'block'} font-medium">Dashboard</span>
            </a>
            <a href="/tenants" class="flex items-center gap-3 px-3 py-3 rounded-lg transition-colors {isActive('/tenants')}">
                <span class="text-xl">👥</span> 
                <span class="{sidebarCollapsed ? 'lg:hidden' : 'block'} font-medium">Tenants</span>
            </a>
            <a href="/billing" class="flex items-center gap-3 px-3 py-3 rounded-lg transition-colors {isActive('/billing')}">
                <span class="text-xl">🧾</span> 
                <span class="{sidebarCollapsed ? 'lg:hidden' : 'block'} font-medium">Billing</span>
            </a>
            <a href="/payments" class="flex items-center gap-3 px-3 py-3 rounded-lg transition-colors {isActive('/payments')}">
                <span class="text-xl">💰</span> 
                <span class="{sidebarCollapsed ? 'lg:hidden' : 'block'} font-medium">Payments</span>
            </a>
            <a href="/expenses" class="flex items-center gap-3 px-3 py-3 rounded-lg transition-colors {isActive('/expenses')}">
                <span class="text-xl">💸</span> 
                <span class="{sidebarCollapsed ? 'lg:hidden' : 'block'} font-medium">Expenses</span>
            </a>
            <a href="/settings" class="flex items-center gap-3 px-3 py-3 rounded-lg transition-colors {isActive('/settings')}">
                <span class="text-xl">⚙️</span> 
                <span class="{sidebarCollapsed ? 'lg:hidden' : 'block'} font-medium">Settings</span>
            </a>
        </nav>

        <div class="p-4 border-t border-indigo-700/50 bg-black/20">
            <div class="flex items-center gap-3">
                <div class="h-9 w-9 bg-indigo-500 rounded-full flex items-center justify-center font-bold text-sm shadow-inner">
                    {getInitials($userProfile.username)}
                </div>
                {#if !sidebarCollapsed}
                    <div class="overflow-hidden">
                        <p class="text-sm font-semibold truncate">{$userProfile.username}</p>
                        <p class="text-xs text-indigo-300 truncate">{$userProfile.role}</p>
                    </div>
                {/if}
            </div>
        </div>
    </aside>

    <main class="flex-1 flex flex-col h-full overflow-hidden bg-slate-50 relative w-full">
        
        <header class="bg-white border-b border-gray-200 h-16 flex items-center justify-between px-4 lg:px-8 shrink-0 z-10">
            
            <div class="flex items-center gap-3 lg:hidden">
                <button 
                    on:click={() => mobileMenuOpen = true}
                    class="text-gray-500 hover:text-gray-700 focus:outline-none p-1"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                </button>
                <span class="font-bold text-lg text-indigo-900 truncate">{$settings.appName}</span>
            </div>

            <h2 class="hidden md:block text-xl font-bold text-gray-800 capitalize">
                {$page.url.pathname === '/' ? 'Financial Dashboard' : $page.url.pathname.replace('/', '')}
            </h2>

            <div class="flex items-center gap-4">
                <button class="text-gray-400 hover:text-gray-600 transition">
                    <span class="sr-only">Notifications</span>
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                    </svg>
                </button>
            </div>
        </header>

        <div class="flex-1 overflow-auto p-4 lg:p-8 w-full">
            <div class="max-w-7xl mx-auto">
                <slot />
            </div>
        </div>
    </main>
</div>
