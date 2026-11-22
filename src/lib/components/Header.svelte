<script lang="ts">
  import { page } from '$app/state';
  import { goto } from '$app/navigation';
  import { auth, logout } from '$lib/api';
  import { Menu, X } from '@lucide/svelte';
  import Logo from './Logo.svelte';
  let open = false;
  const signOut = async () => {
    try {
      await logout();
      open = false;
      goto('/');
    } catch (error) {
      console.error('Could not sign out.', error);
    }
  };

  const nav = [
    { href: '/', label: 'Hjem' },
    { href: '/tjenester/webutvikling', label: 'Webutvikling' },
    { href: '/tjenester/legetjenester', label: 'Legetjenester' },
    { href: '/kurs', label: 'Kurs' },
    { href: '/om-oss', label: 'Om oss' },
    { href: '/kontakt', label: 'Kontakt' }
  ];

  const isActive = (href: string) => (href === '/' ? page.url.pathname === '/' : page.url.pathname.startsWith(href));
</script>

<header class="sticky top-0 z-50 border-b border-line bg-ink/80 backdrop-blur-xl">
  <div class="container-rhythm flex h-16 items-center justify-between">
    <a href="/" data-testid="brand-link"><Logo /></a>

    <nav class="hidden lg:flex items-center gap-1" aria-label="Hovednavigasjon">
      {#each nav as item}
        <a
          href={item.href}
          class="rounded-md px-3 py-1.5 text-sm transition-colors duration-200 {isActive(item.href) ? 'text-fg bg-panel' : 'text-muted hover:text-fg'}"
          data-testid="nav-{item.href.replaceAll('/','-')}"
        >{item.label}</a>
      {/each}
    </nav>

    <div class="hidden lg:flex items-center gap-3">
      {#if $auth.user}
        <a href="/konto" class="text-sm text-muted hover:text-fg transition-colors" data-testid="account-link">Min konto</a>
        <button onclick={signOut} class="btn-outline !py-1.5 !px-3" data-testid="logout-btn">Logg ut</button>
      {:else}
        <a href="/logg-inn" class="text-sm text-muted hover:text-fg transition-colors" data-testid="login-link">Logg inn</a>
        <a href="/kurs" class="btn-primary !py-1.5 !px-3.5" data-testid="header-cta">Se kurs</a>
      {/if}
    </div>

    <button class="lg:hidden text-fg" onclick={() => (open = !open)} aria-label="Meny" data-testid="mobile-menu-btn">
      {#if open}<X size={22} />{:else}<Menu size={22} />{/if}
    </button>
  </div>

  {#if open}
    <div class="lg:hidden border-t border-line bg-ink">
      <nav class="container-rhythm py-5 flex flex-col gap-1">
        {#each nav as item}
          <a href={item.href} onclick={() => (open = false)} class="rounded-md px-3 py-2 text-sm {isActive(item.href) ? 'bg-panel text-fg' : 'text-muted'}" data-testid="m-nav-{item.href.replaceAll('/','-')}">{item.label}</a>
        {/each}
        <div class="mt-3 pt-3 border-t border-line flex flex-col gap-1">
          {#if $auth.user}
            <a href="/konto" onclick={() => (open = false)} class="px-3 py-2 text-sm text-fg">Min konto</a>
            <button onclick={signOut} class="px-3 py-2 text-left text-sm text-muted">Logg ut</button>
          {:else}
            <a href="/logg-inn" onclick={() => (open = false)} class="px-3 py-2 text-sm text-fg">Logg inn</a>
          {/if}
        </div>
      </nav>
    </div>
  {/if}
</header>
