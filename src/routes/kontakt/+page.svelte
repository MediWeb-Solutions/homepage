<script>
  import { page } from '$app/state';
  import { api } from '$lib/api';
  import { ArrowRight, CheckCircle2, Mail, Clock } from '@lucide/svelte';

  let name = '';
  let email = '';
  let service = page.url.searchParams.get('service') || '';
  let message = '';
  let busy = false;
  let sent = false;
  let err = '';

  async function submit(e) {
    e.preventDefault(); err = ''; busy = true;
    try {
      await api('/api/contact', { method: 'POST', body: { name, email, service: service || null, message } });
      sent = true;
    } catch (e) { err = e.message; }
    busy = false;
  }
</script>

<svelte:head><title>Kontakt — MediWeb Solutions</title></svelte:head>

<section class="relative py-16 md:py-24 overflow-hidden">
  <div class="pointer-events-none absolute inset-0 hero-glow"></div>
  <div class="container-rhythm relative grid lg:grid-cols-12 gap-12">
    <div class="lg:col-span-5">
      <div class="eyebrow rise">Kontakt</div>
      <h1 class="rise rise-delay-1 mt-4 text-4xl md:text-5xl leading-[1.08]">Fortell oss om oppdraget.</h1>
      <p class="rise rise-delay-2 lead mt-5">Send en melding, så hører du fra oss.</p>
      <ul class="mt-10 space-y-4">
        <li class="flex items-center gap-3 text-muted">
          <span class="grid h-9 w-9 place-items-center rounded-lg border border-line2 bg-panel"><Clock size={16} class="text-mint" /></span>
          Vi svarer vanligvis innen 1-2 virkedager
        </li>
      </ul>
    </div>

    <div class="lg:col-span-7">
      {#if sent}
        <div class="card !p-12 text-center" data-testid="contact-success">
          <CheckCircle2 class="mx-auto mb-4 text-mint" size={40} strokeWidth={1.6} />
          <h2 class="text-2xl">Takk for meldingen!</h2>
          <p class="mt-2 text-muted">Vi tar kontakt så snart vi kan.</p>
        </div>
      {:else}
        <form onsubmit={submit} class="card !p-8 space-y-5">
          <div class="grid sm:grid-cols-2 gap-5">
            <label class="block"><span class="field-label">Navn</span>
              <input data-testid="contact-name" bind:value={name} required class="field" />
            </label>
            <label class="block"><span class="field-label">E-post</span>
              <input data-testid="contact-email" type="email" bind:value={email} required class="field" />
            </label>
          </div>
          <label class="block"><span class="field-label">Tjeneste</span>
            <select bind:value={service} data-testid="contact-service" class="field">
              <option value="">Jeg er ikke sikker enda</option>
              <option value="webutvikling">Webutvikling</option>
              <option value="legetjenester">Legetjenester</option>
              <option value="kursvirksomhet">Kurs</option>
            </select>
          </label>
          <label class="block"><span class="field-label">Melding</span>
            <textarea data-testid="contact-message" bind:value={message} required rows="6" class="field resize-none"></textarea>
          </label>
          {#if err}<div class="text-sm text-danger" data-testid="contact-error">{err}</div>{/if}
          <button type="submit" disabled={busy} class="btn-primary w-full" data-testid="contact-submit">
            {busy ? 'Sender …' : 'Send melding'} <ArrowRight size={16} />
          </button>
        </form>
      {/if}
    </div>
  </div>
</section>
