<script>
  import { ArrowRight, Syringe, Ambulance, ClipboardList } from '@lucide/svelte';
  import PageHero from '$lib/components/PageHero.svelte';
  const services = [
    [Syringe, 'Anestesitjenester', 'Anestesi for dagkirurgi og polikliniske inngrep på din klinikk, med fleksible avtaler.'],
    [Ambulance, 'Medic-funksjon', 'Medisinsk beredskap på festivaler, idrettsarrangementer og større samlinger.'],
    [ClipboardList, 'Andre legetjenester', 'Faglige vurderinger, prosedyrearbeid og andre oppdrag etter avtale.']
  ];
</script>

<svelte:head><title>Legetjenester — MediWeb Solutions</title></svelte:head>

<PageHero eyebrow="Legetjenester" title="Trygg medisinsk kompetanse — der du trenger den." lead="Fra anestesi i klinikk til beredskap på arrangementer: erfarne legetjenester i et format som passer din virksomhet." />

<section class="py-20">
  <div class="container-rhythm space-y-4">
    {#each services as [Icon, t, d], i}
      <div class="card card-hover flex items-start gap-6" data-testid="med-service-{i}">
        <div class="grid h-11 w-11 shrink-0 place-items-center rounded-lg border border-mint/25 bg-mint/10">
          <Icon size={20} class="text-mint" strokeWidth={1.8} />
        </div>
        <div>
          <h3 class="text-xl mb-1.5">{t}</h3>
          <p class="text-muted leading-relaxed max-w-2xl">{d}</p>
        </div>
      </div>
    {/each}
  </div>
</section>

<section class="pb-8">
  <div class="container-rhythm">
    <div class="card !p-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
      <div>
        <h2 class="text-2xl">Diskret, faglig og tilgjengelig.</h2>
        <p class="text-muted mt-2">Ta kontakt for å avtale oppdrag eller høre mer.</p>
      </div>
      <a href="/kontakt?service=legetjenester" class="btn-primary shrink-0" data-testid="med-cta">Spør om en avtale <ArrowRight size={16} /></a>
    </div>
  </div>
</section>
