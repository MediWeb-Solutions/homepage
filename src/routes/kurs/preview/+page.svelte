<script>
  import { onMount } from 'svelte';
  import { ArrowRight, BookOpen, Clock, MonitorPlay } from '@lucide/svelte';
  import { api } from '$lib/api';

  let courses = [];
  let loading = true;
  let error = '';

  onMount(async () => {
    try {
      const result = await api('/api/courses');
      if (!Array.isArray(result.courses)) throw new Error('Ugyldig svar fra kurskatalogen.');
      courses = result.courses;
    } catch (e) {
      error = e instanceof Error ? e.message : 'Kunne ikke laste kursene.';
    } finally {
      loading = false;
    }
  });
</script>

<svelte:head>
  <title>Forhåndsvisning av kurs — MediWeb Solutions</title>
  <meta name="description" content="Forhåndsvisning av kurskatalogen." />
</svelte:head>

<section class="py-14 md:py-20">
  <div class="container-rhythm">
    <div class="max-w-2xl mb-12">
      <div class="eyebrow mb-3">Forhåndsvisning · Kurs</div>
      <h1 class="section-title">Kunnskap som gjør deg trygg når det gjelder.</h1>
      <p class="lead mt-4">Praktiske nettkurs i førstehjelp og HLR, laget av helsepersonell.</p>
    </div>

    {#if loading}
      <p class="py-16 text-center text-sm text-muted">Laster kurs …</p>
    {:else if error}
      <p class="py-16 text-center text-sm text-danger" role="alert">Kunne ikke laste kursene: {error}</p>
    {:else if courses.length === 0}
      <p class="py-16 text-center text-sm text-muted">Ingen kurs er publisert ennå.</p>
    {:else}
      <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
        {#each courses as course (course.slug)}
          <article class="card card-hover flex flex-col">
            <div class="grid h-10 w-10 place-items-center rounded-lg border border-mint/25 bg-mint/10 mb-6">
              <BookOpen size={20} class="text-mint" />
            </div>
            <h2 class="text-xl mb-2">{course.title}</h2>
            <p class="text-sm leading-relaxed text-muted mb-5">{course.summary}</p>
            <div class="flex flex-wrap gap-2 mb-6 text-xs text-muted">
              <span class="pill"><Clock size={13} /> {course.duration}</span>
              <span class="pill"><MonitorPlay size={13} /> {course.lessons.length} leksjoner</span>
            </div>
            <div class="mt-auto flex items-center justify-between border-t border-line pt-5">
              <span class="text-lg font-semibold">{course.price_nok.toLocaleString('nb-NO')} kr</span>
              <a href="/kurs/{course.slug}" class="btn-primary" data-testid="course-link-{course.slug}">
                Les mer <ArrowRight size={16} />
              </a>
            </div>
          </article>
        {/each}
      </div>
    {/if}
  </div>
</section>
