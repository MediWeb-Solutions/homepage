<script>
  import { page } from '$app/state';
  import { goto } from '$app/navigation';
  import { onMount } from 'svelte';
  import { get } from 'svelte/store';
  import { api, auth, authReady } from '$lib/api';
  import { ArrowRight, Clock, MonitorPlay, Check, Lock, ShieldCheck, PlayCircle } from '@lucide/svelte';
  import InstructorCard from '$lib/components/InstructorCard.svelte';

  let course = null;
  let enrolled = false;
  let loading = true;
  let buying = false;
  let error = '';

  onMount(async () => {
    try {
      course = await api(`/api/courses/${page.params.slug}`);
      await authReady;
      if (get(auth).user) {
        const d = await api('/api/me/enrollments').catch(() => ({ enrollments: [] }));
        enrolled = (d.enrollments || []).some((e) => e.course_slug === course.slug);
      }
    } catch (e) { error = e.message; }
    loading = false;
  });

  async function startCheckout() {
    error = '';
    if (!get(auth).user) { goto(`/logg-inn?next=/kurs/${course.slug}`); return; }
    buying = true;
    try {
      const r = await api('/api/payments/checkout', {
        method: 'POST',
        body: { course_slug: course.slug }
      });
      window.location.href = r.checkout_url;
    } catch (e) { error = e.message; buying = false; }
  }
</script>

<svelte:head><title>{course?.title ?? 'Kurs'} — MediWeb Solutions</title></svelte:head>

{#if loading}
  <div class="container-rhythm py-32 text-center text-sm text-muted">Laster …</div>
{:else if !course}
  <div class="container-rhythm py-32 text-center">
    <h1 class="text-3xl mb-6">Kurset finnes ikke</h1>
    <a href="/kurs" class="btn-primary">Tilbake til kursoversikt</a>
  </div>
{:else}
  <section class="py-14 md:py-20">
    <div class="container-rhythm grid lg:grid-cols-12 gap-10">
      <div class="lg:col-span-8">
        <nav class="text-sm text-muted mb-6 rise" aria-label="Brødsmuler">
          <a href="/kurs" class="hover:text-fg transition-colors">Kurs</a>
          <span class="mx-2 text-line2">/</span><span class="text-fg">{course.title}</span>
        </nav>
        <h1 class="rise rise-delay-1 text-4xl md:text-5xl leading-[1.08]">{course.title}</h1>
        <p class="rise rise-delay-2 lead mt-5 max-w-2xl">{course.summary}</p>
        <div class="rise rise-delay-3 mt-6 flex flex-wrap gap-2">
          <span class="pill"><Clock size={13} /> {course.duration}</span>
          <span class="pill"><MonitorPlay size={13} /> {course.format}</span>
        </div>

        <div class="mt-12 card !p-0 overflow-hidden">
          <div class="flex items-center justify-between border-b border-line px-6 py-4">
            <h2 class="text-base">Innhold</h2>
            <span class="text-xs text-muted">{course.lessons.length} leksjoner · {course.lessons.reduce((s, l) => s + l.minutes, 0)} min video</span>
          </div>
          <ul>
            {#each course.lessons as l, i}
              <li class="flex items-center gap-4 px-6 py-4 {i > 0 ? 'border-t border-line' : ''}">
                <span class="font-mono text-xs text-muted w-6">{String(i + 1).padStart(2, '0')}</span>
                <span class="flex-1 text-sm">{l.title}</span>
                <span class="font-mono text-xs text-muted">{l.minutes} min</span>
                {#if enrolled}<PlayCircle size={15} class="text-mint" />{:else}<Lock size={14} class="text-muted" />{/if}
              </li>
            {/each}
          </ul>
        </div>
      </div>

      <aside class="lg:col-span-4">
        <div class="sticky top-24 space-y-5">
        <div class="card rise rise-delay-2">
          <div class="text-xs text-muted mb-1">Pris</div>
          <div class="text-4xl font-semibold tracking-tight mb-6">{course.price_nok.toLocaleString('nb-NO')} <span class="text-base font-normal text-muted">kr</span></div>

          {#if enrolled}
            <div class="mb-4 flex items-center gap-2 rounded-lg border border-mint/30 bg-mint/10 px-3 py-2.5 text-sm text-mint">
              <Check size={16} /> Du er påmeldt dette kurset
            </div>
            <a href="/kurs/{course.slug}/laer" class="btn-primary w-full" data-testid="goto-player">Gå til kurset <ArrowRight size={16} /></a>
          {:else}
            <button onclick={startCheckout} disabled={buying} class="btn-primary w-full" data-testid="buy-course-btn">
              {#if buying}Sender deg videre …{:else}
                {#if !$auth.user}<Lock size={14} />{/if}
                Kjøp tilgang <ArrowRight size={16} />
              {/if}
            </button>
            {#if !$auth.user}
              <p class="mt-3 text-center text-xs text-muted">Du må være innlogget for å kjøpe.</p>
            {/if}
          {/if}
          {#if error}<p class="mt-3 text-xs text-danger" data-testid="buy-error">{error}</p>{/if}

          <ul class="mt-6 space-y-2.5 border-t border-line pt-5 text-sm text-muted">
            <li class="flex items-center gap-2.5"><Check size={15} class="text-mint" /> Tilgang samlet i Min konto</li>
            <li class="flex items-center gap-2.5"><Check size={15} class="text-mint" /> Ta kurset i ditt eget tempo</li>
            <li class="flex items-center gap-2.5"><Check size={15} class="text-mint" /> Spørsmål? Svar fra fagpersonen</li>
          </ul>
          <div class="mt-5 flex items-center gap-2 text-xs text-muted">
            <ShieldCheck size={14} class="text-mint" /> Sikker betaling via Stripe
          </div>
        </div>
        <InstructorCard instructor={course.instructor} compact />
        </div>
      </aside>
    </div>
  </section>
{/if}
