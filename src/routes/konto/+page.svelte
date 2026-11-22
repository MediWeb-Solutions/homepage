<script>
  import { goto } from '$app/navigation';
  import { onMount } from 'svelte';
  import { get } from 'svelte/store';
  import { api, auth, authReady } from '$lib/api';
  import { PlayCircle, ArrowRight, BookOpen } from '@lucide/svelte';
  import ProgressBar from '$lib/components/ProgressBar.svelte';

  let enrollments = [];
  let loading = true;
  let user = null;

  onMount(async () => {
    await authReady;
    if (!get(auth).user) { goto('/logg-inn?next=/konto'); return; }
    try {
      user = (await api('/api/auth/me')).user;
      enrollments = (await api('/api/me/enrollments')).enrollments;
    } catch {
      goto('/logg-inn?next=/konto');
      return;
    }
    loading = false;
  });
</script>

<svelte:head><title>Min konto — MediWeb Solutions</title></svelte:head>

<section class="py-16 md:py-20">
  <div class="container-rhythm">
    {#if loading}
      <div class="h-9 w-56 rounded-lg bg-panel animate-pulse mb-10"></div>
      <div class="grid md:grid-cols-2 gap-5">
        {#each Array(2) as _}<div class="card h-48 animate-pulse"></div>{/each}
      </div>
    {:else}
      <div class="mb-10 flex flex-wrap items-end justify-between gap-4">
        <div>
          <div class="eyebrow mb-2">Min konto</div>
          <h1 class="text-3xl md:text-4xl" data-testid="account-greeting">Hei, {user?.name?.split(' ')[0] || 'der'}</h1>
          <p class="mt-1.5 text-sm text-muted">{user?.email}</p>
        </div>
        <a href="/kurs" class="btn-outline">Se alle kurs</a>
      </div>

      <h2 class="text-lg mb-4">Dine kurs</h2>
      {#if enrollments.length === 0}
        <div class="card !py-14 text-center" data-testid="no-enrollments">
          <BookOpen size={28} class="mx-auto mb-4 text-muted" strokeWidth={1.6} />
          <p class="text-lg font-medium">Ingen kurs enda</p>
          <p class="mt-1.5 mb-7 text-sm text-muted">Når du kjøper et kurs, dukker det opp her.</p>
          <a href="/kurs" class="btn-primary">Utforsk kurs <ArrowRight size={16} /></a>
        </div>
      {:else}
        <div class="grid md:grid-cols-2 gap-5">
          {#each enrollments as e}
            {@const c = e.course}
            <div class="card" data-testid="enrollment-{e.course_slug}">
              <div class="flex items-center justify-between mb-5">
                <span class="pill !text-mint !border-mint/30"><span class="h-1.5 w-1.5 rounded-full bg-mint"></span>Aktiv</span>
                <PlayCircle class="text-mint" size={22} strokeWidth={1.6} />
              </div>
              <h3 class="text-xl mb-2">{c?.title}</h3>
              <p class="text-sm leading-relaxed text-muted mb-5">{c?.summary}</p>
              <div class="mb-1.5 text-xs text-muted">{e.progress.completed.length} av {e.progress.total} leksjoner fullført</div>
              <ProgressBar percent={e.progress.percent} />
              <a href="/kurs/{e.course_slug}/laer" class="btn-primary w-full mt-6" data-testid="continue-{e.course_slug}">
                {e.progress.percent === 0 ? 'Start kurset' : e.progress.percent === 100 ? 'Se kurset igjen' : 'Fortsett'} <ArrowRight size={16} />
              </a>
            </div>
          {/each}
        </div>
      {/if}
    {/if}
  </div>
</section>
