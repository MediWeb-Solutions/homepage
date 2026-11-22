<script>
  import { page } from '$app/state';
  import { onMount } from 'svelte';
  import { api } from '$lib/api';
  import { CheckCircle2, ArrowRight, Loader2, AlertCircle } from '@lucide/svelte';

  let status = 'checking';
  let course_slug = null;
  let tries = 0;

  async function poll() {
    const sid = page.url.searchParams.get('session_id');
    if (!sid) { status = 'error'; return; }
    try {
      const r = await api(`/api/payments/status/${sid}`);
      course_slug = r.course_slug;
      if (r.payment_status === 'paid') { status = 'paid'; return; }
      if (r.payment_status === 'failed' || r.payment_status === 'expired') { status = 'failed'; return; }
    } catch { /* keep polling */ }
    if (tries++ < 20) setTimeout(poll, 1500);
    else status = 'timeout';
  }

  onMount(poll);
</script>

<svelte:head><title>Betaling — MediWeb Solutions</title></svelte:head>

<section class="min-h-[70vh] flex items-center py-20">
  <div class="container-rhythm max-w-lg">
    <div class="card !p-10 text-center" data-testid="payment-status-{status}">
      {#if status === 'checking'}
        <Loader2 class="mx-auto mb-5 animate-spin text-mint" size={36} />
        <h1 class="text-2xl">Bekrefter betalingen …</h1>
        <p class="mt-2 text-muted">Et øyeblikk, vi henter bekreftelsen fra Stripe.</p>
      {:else if status === 'paid'}
        <CheckCircle2 class="mx-auto mb-5 text-mint" size={44} strokeWidth={1.6} />
        <h1 class="text-3xl">Du er påmeldt!</h1>
        <p class="mt-3 mb-8 text-muted">Kurset ligger nå klart i Min konto.</p>
        <div class="flex flex-wrap justify-center gap-3">
          <a href="/konto" class="btn-primary" data-testid="go-account">Gå til Min konto <ArrowRight size={16} /></a>
          <a href="/kurs" class="btn-outline">Se flere kurs</a>
        </div>
      {:else if status === 'failed'}
        <AlertCircle class="mx-auto mb-5 text-danger" size={40} />
        <h1 class="text-2xl">Betalingen gikk ikke gjennom</h1>
        <p class="mt-2 mb-8 text-muted">Ingen penger er trukket. Du kan prøve igjen.</p>
        <a href={course_slug ? `/kurs/${course_slug}` : '/kurs'} class="btn-primary">Tilbake til kurset</a>
      {:else}
        <h1 class="text-2xl">Det tar litt lengre tid enn vanlig</h1>
        <p class="mt-2 mb-8 text-muted">Sjekk Min konto om et øyeblikk.</p>
        <a href="/konto" class="btn-primary">Gå til Min konto</a>
      {/if}
    </div>
  </div>
</section>
