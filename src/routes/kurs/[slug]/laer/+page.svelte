<script>
  import { page } from '$app/state';
  import { goto } from '$app/navigation';
  import { onMount } from 'svelte';
  import { get } from 'svelte/store';
  import { api, auth, authReady } from '$lib/api';
  import { ArrowLeft, ArrowRight, Check, PartyPopper, Lock } from '@lucide/svelte';
  import ProgressBar from '$lib/components/ProgressBar.svelte';
  import LessonList from '$lib/components/LessonList.svelte';
  import InstructorCard from '$lib/components/InstructorCard.svelte';

  let data = null;
  let completed = [];
  let percent = 0;
  let currentId = null;
  let status = 'loading';
  let saving = false;

  $: lessons = data?.course.lessons ?? [];
  $: index = lessons.findIndex((l) => l.id === currentId);
  $: lesson = lessons[index];
  $: isDone = completed.includes(currentId);

  onMount(async () => {
    const slug = page.params.slug;
    await authReady;
    if (!get(auth).user) { goto(`/logg-inn?next=/kurs/${slug}/laer`); return; }
    try {
      data = await api(`/api/learn/${slug}`);
      completed = data.progress.completed;
      percent = data.progress.percent;
      const fromUrl = page.url.searchParams.get('leksjon');
      const ids = data.course.lessons.map((l) => l.id);
      currentId = ids.includes(fromUrl) ? fromUrl
        : data.last_lesson_id ?? ids.find((id) => !completed.includes(id)) ?? ids[0];
      status = 'ready';
    } catch (e) {
      if (/innlogget|økt/i.test(e.message)) goto(`/logg-inn?next=/kurs/${slug}/laer`);
      else status = /tilgang/i.test(e.message) ? 'forbidden' : 'error';
    }
  });

  function select(id) {
    currentId = id;
    const url = new URL(page.url);
    url.searchParams.set('leksjon', id);
    history.replaceState(history.state, '', url);
    api(`/api/learn/${data.course.slug}/last/${id}`, { method: 'POST' }).catch(() => {});
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  async function setDone(done) {
    saving = true;
    try {
      const r = await api(`/api/learn/${data.course.slug}/lessons/${currentId}`, { method: 'POST', body: { completed: done } });
      completed = r.progress.completed;
      percent = r.progress.percent;
    } finally { saving = false; }
  }

  function onEnded() { if (!isDone) setDone(true); }
</script>

<svelte:head><title>{lesson?.title ?? 'Kurs'} — MediWeb Solutions</title></svelte:head>

{#if status === 'loading'}
  <div class="container-rhythm py-16">
    <div class="h-6 w-64 rounded bg-panel animate-pulse mb-8"></div>
    <div class="grid lg:grid-cols-12 gap-8"><div class="lg:col-span-8 aspect-video rounded-xl bg-panel animate-pulse"></div><div class="lg:col-span-4 h-80 rounded-xl bg-panel animate-pulse"></div></div>
  </div>
{:else if status === 'forbidden'}
  <section class="container-rhythm py-28 max-w-md text-center" data-testid="player-forbidden">
    <Lock size={32} class="mx-auto mb-5 text-muted" />
    <h1 class="text-2xl">Du har ikke tilgang til dette kurset</h1>
    <p class="mt-2 mb-8 text-muted">Kjøp kurset for å se leksjonene.</p>
    <a href="/kurs/{page.params.slug}" class="btn-primary">Gå til kurssiden <ArrowRight size={16} /></a>
  </section>
{:else if status === 'error'}
  <section class="container-rhythm py-28 text-center">
    <h1 class="text-2xl mb-6">Kunne ikke laste kurset</h1>
    <a href="/konto" class="btn-primary">Tilbake til Min konto</a>
  </section>
{:else}
  <section class="border-b border-line bg-panel/40">
    <div class="container-rhythm py-5 flex flex-col md:flex-row md:items-center gap-4 md:gap-10">
      <div class="min-w-0">
        <a href="/konto" class="inline-flex items-center gap-1.5 text-xs text-muted hover:text-fg transition-colors" data-testid="player-back"><ArrowLeft size={13} /> Min konto</a>
        <h1 class="mt-1 truncate text-lg md:text-xl" data-testid="player-course-title">{data.course.title}</h1>
      </div>
      <div class="md:ml-auto md:w-80">
        <div class="mb-1.5 text-xs text-muted">{completed.length} av {lessons.length} leksjoner fullført</div>
        <ProgressBar {percent} />
      </div>
    </div>
  </section>

  <section class="py-8 md:py-10">
    <div class="container-rhythm grid lg:grid-cols-12 gap-8">
      <div class="lg:col-span-8">
        {#if percent === 100}
          <div class="mb-5 flex items-center gap-3 rounded-xl border border-mint/30 bg-mint/10 px-4 py-3 text-sm text-mint" data-testid="course-complete-banner">
            <PartyPopper size={18} /> Gratulerer — du har fullført hele kurset!
          </div>
        {/if}
        {#key currentId}
          <div class="overflow-hidden rounded-xl border border-line2 bg-black aspect-video rise">
            <!-- svelte-ignore a11y_media_has_caption -->
            <video src={lesson.video_url} controls playsinline preload="metadata" class="h-full w-full" onended={onEnded} data-testid="lesson-video"></video>
          </div>
        {/key}
        <div class="mt-6 flex flex-wrap items-start justify-between gap-4">
          <div class="min-w-0">
            <div class="font-mono text-xs text-mint">Leksjon {index + 1} av {lessons.length} · {lesson.minutes} min</div>
            <h2 class="mt-1.5 text-2xl" data-testid="lesson-title">{lesson.title}</h2>
            <p class="mt-2 max-w-2xl text-muted leading-relaxed">{lesson.description}</p>
          </div>
          {#if isDone}
            <button onclick={() => setDone(false)} disabled={saving} class="btn-outline !border-mint/40 !text-mint" data-testid="mark-incomplete-btn"><Check size={16} /> Fullført</button>
          {:else}
            <button onclick={() => setDone(true)} disabled={saving} class="btn-primary" data-testid="mark-complete-btn"><Check size={16} /> Marker som fullført</button>
          {/if}
        </div>
        <div class="mt-8 flex items-center justify-between border-t border-line pt-5">
          <button onclick={() => select(lessons[index - 1].id)} disabled={index <= 0} class="btn-outline disabled:opacity-40 disabled:cursor-not-allowed" data-testid="prev-lesson-btn"><ArrowLeft size={16} /> Forrige</button>
          <button onclick={() => select(lessons[index + 1].id)} disabled={index >= lessons.length - 1} class="btn-outline disabled:opacity-40 disabled:cursor-not-allowed" data-testid="next-lesson-btn">Neste <ArrowRight size={16} /></button>
        </div>
      </div>

      <aside class="lg:col-span-4 space-y-5">
        <div class="card !p-3">
          <div class="px-3 pt-2 pb-3 text-sm font-medium">Innhold</div>
          <LessonList {lessons} {completed} {currentId} onselect={select} />
        </div>
        <InstructorCard instructor={data.instructor} compact />
      </aside>
    </div>
  </section>
{/if}
