<script>
  import { goto } from '$app/navigation';
  import { page } from '$app/state';
  import { login, signup } from '$lib/api';
  import { ArrowRight } from '@lucide/svelte';
  import Logo from '$lib/components/Logo.svelte';

  let mode = 'login';
  let name = '';
  let email = '';
  let password = '';
  let err = '';
  let busy = false;

  async function submit(e) {
    e.preventDefault(); err = ''; busy = true;
    try {
      if (mode === 'signup') await signup(name, email, password);
      else await login(email, password);
      goto(page.url.searchParams.get('next') || '/konto');
    } catch (e) { err = e.message; }
    busy = false;
  }
</script>

<svelte:head><title>{mode === 'signup' ? 'Opprett konto' : 'Logg inn'} — MediWeb Solutions</title></svelte:head>

<section class="relative min-h-[80vh] flex items-center py-20 overflow-hidden">
  <div class="pointer-events-none absolute inset-0 hero-glow"></div>
  <div class="container-rhythm relative w-full max-w-md">
    <div class="mb-8 flex justify-center"><Logo /></div>
    <form onsubmit={submit} class="card !p-8 space-y-5 rise">
      <div class="text-center mb-2">
        <h1 class="text-2xl">{mode === 'signup' ? 'Opprett konto' : 'Logg inn'}</h1>
        <p class="mt-1.5 text-sm text-muted">
          {mode === 'signup' ? 'Få tilgang til kursene dine på ett sted.' : 'Velkommen tilbake.'}
        </p>
      </div>
      {#if mode === 'signup'}
        <label class="block"><span class="field-label">Navn</span>
          <input data-testid="name-input" bind:value={name} required autocomplete="name" class="field" />
        </label>
      {/if}
      <label class="block"><span class="field-label">E-post</span>
        <input data-testid="email-input" type="email" bind:value={email} required autocomplete="email" class="field" />
      </label>
      <label class="block"><span class="field-label">Passord</span>
        <input data-testid="password-input" type="password" bind:value={password} required minlength="6" autocomplete={mode === 'signup' ? 'new-password' : 'current-password'} class="field" />
      </label>

      {#if err}<div class="rounded-lg border border-danger/30 bg-danger/10 px-3 py-2 text-sm text-danger" data-testid="auth-error">{err}</div>{/if}

      <button type="submit" disabled={busy} class="btn-primary w-full" data-testid="submit-auth">
        {busy ? 'Vent …' : (mode === 'signup' ? 'Opprett konto' : 'Logg inn')} <ArrowRight size={16} />
      </button>
      <button type="button" onclick={() => { mode = mode === 'signup' ? 'login' : 'signup'; err = ''; }} class="w-full text-sm text-muted hover:text-fg transition-colors" data-testid="toggle-mode">
        {mode === 'signup' ? 'Har du allerede en konto? Logg inn' : 'Ny her? Opprett en konto'}
      </button>
    </form>
  </div>
</section>
