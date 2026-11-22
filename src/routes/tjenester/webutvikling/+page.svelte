<script>
  import { ArrowRight, MonitorSmartphone, Layers, Search, Accessibility, BarChart3, Wrench } from '@lucide/svelte';
  import PageHero from '$lib/components/PageHero.svelte';
  const features = [
    [MonitorSmartphone, 'Responsiv design', 'Nettsider som fungerer like godt på mobil, nettbrett og stor skjerm.'],
    [Layers, 'Moderne rammeverk', 'SvelteKit, Astro, Next.js — vi velger verktøyet som passer oppgaven.'],
    [Search, 'SEO-optimalisering', 'Rask lastetid, semantisk markup og strukturerte data som søkemotorer forstår.'],
    [Accessibility, 'Universell utforming', 'Tilgjengelighet bygges inn fra start, ikke lagt på til slutt.'],
    [BarChart3, 'Målinger og innsikt', 'Vi måler det som faktisk betyr noe for virksomheten din.'],
    [Wrench, 'Drift og videreutvikling', 'Vi blir med videre etter lansering — nettsiden skal leve.']
  ];
</script>

<svelte:head><title>Webutvikling — MediWeb Solutions</title></svelte:head>

<PageHero eyebrow="Webutvikling" title="Nettsider som er raske, tilgjengelige og bygget for å vare." lead="Fra idé til lansering — med samme presisjon som i klinikken. Få, gjennomtenkte valg som gir et varig resultat." />

<section class="py-20">
  <div class="container-rhythm grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
    {#each features as [Icon, t, d], i}
      <div class="card card-hover" data-testid="web-feature-{i}">
        <Icon size={20} class="text-mint mb-5" strokeWidth={1.8} />
        <h3 class="text-lg mb-2">{t}</h3>
        <p class="text-sm leading-relaxed text-muted">{d}</p>
      </div>
    {/each}
  </div>
</section>

<section class="pb-8">
  <div class="container-rhythm">
    <div class="card !p-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
      <div>
        <h2 class="text-2xl">Klar for å starte et prosjekt?</h2>
        <p class="text-muted mt-2">Fortell kort om behovet, så tar vi en uforpliktende prat.</p>
      </div>
      <a href="/kontakt?service=webutvikling" class="btn-primary shrink-0" data-testid="web-cta">Ta kontakt <ArrowRight size={16} /></a>
    </div>
  </div>
</section>
