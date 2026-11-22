<script>
  import { ArrowRight, Code2, Stethoscope, GraduationCap, ShieldCheck, MapPin, MessageCircle, BookOpenCheck } from '@lucide/svelte';
  import PlatformPreview from '$lib/components/PlatformPreview.svelte';

  const pillars = [
    { key: 'web', title: 'Webutvikling', href: '/tjenester/webutvikling', icon: Code2,
      lead: 'Raske, tilgjengelige nettsider og webapper bygget med moderne rammeverk.',
      items: ['Responsiv design', 'Moderne rammeverk', 'SEO-optimalisering'] },
    { key: 'med', title: 'Legetjenester', href: '/tjenester/legetjenester', icon: Stethoscope,
      lead: 'Anestesi i klinikk, medic på arrangementer og andre legeoppdrag.',
      items: ['Anestesitjenester', 'Medic-funksjon', 'Andre legetjenester'] },
    { key: 'kurs', title: 'Kursvirksomhet', href: '/kurs', icon: GraduationCap,
      lead: 'Førstehjelp og HLR — online på vår egen kursplattform.',
      items: ['3-timers førstehjelpskurs', 'HLR på ulike nivå', 'Skreddersydde kurs'] }
  ];

  const trust = [
    { icon: ShieldCheck, t: 'Sikker betaling med Stripe' },
    { icon: BookOpenCheck, t: 'Kurs etter norske retningslinjer' },
    { icon: MessageCircle, t: 'Direkte kontakt med fagpersonen' },
    { icon: MapPin, t: 'Basert i Norge' }
  ];
</script>

<svelte:head>
  <title>MediWeb Solutions — Webutvikling, legetjenester og kurs</title>
  <meta name="description" content="Profesjonelt lite foretak med tre ben å stå på: moderne webutvikling, legetjenester og kurs." />
</svelte:head>

<section class="relative overflow-hidden">
  <div class="pointer-events-none absolute inset-0 grid-faint opacity-60"></div>
  <div class="pointer-events-none absolute inset-0 hero-glow"></div>
  <div class="container-rhythm relative grid lg:grid-cols-2 gap-14 items-center pt-20 pb-20 md:pt-28 md:pb-28">
    <div>
      <div class="pill rise" data-testid="hero-badge"><span class="h-1.5 w-1.5 rounded-full bg-mint"></span>Lege · Utvikler · Kursholder</div>
      <h1 class="rise rise-delay-1 mt-6 text-[clamp(2.4rem,5.2vw,3.9rem)] leading-[1.04]">
        Trygg kompetanse —<br /><span class="text-mint">digitalt og klinisk.</span>
      </h1>
      <p class="rise rise-delay-2 lead mt-6 max-w-lg">
        MediWeb Solutions kombinerer moderne webutvikling, profesjonelle legetjenester og engasjerende kurs — med samme krav til presisjon i alt vi gjør.
      </p>
      <div class="rise rise-delay-3 mt-9 flex flex-wrap gap-3">
        <a href="/kurs" class="btn-primary group" data-testid="hero-cta-kurs">
          Utforsk kursene <ArrowRight size={16} class="transition-transform group-hover:translate-x-0.5" />
        </a>
        <a href="/kontakt" class="btn-outline" data-testid="hero-cta-kontakt">Ta kontakt</a>
      </div>
    </div>
    <div class="rise rise-delay-2"><PlatformPreview /></div>
  </div>
</section>

<section class="border-y border-line bg-panel/40">
  <ul class="container-rhythm grid grid-cols-2 md:grid-cols-4 gap-6 py-6" data-testid="trust-strip">
    {#each trust as item}
      {@const Icon = item.icon}
      <li class="flex items-center gap-2.5 text-sm text-muted"><Icon size={16} class="text-mint shrink-0" />{item.t}</li>
    {/each}
  </ul>
</section>

<section class="py-24" id="tjenester">
  <div class="container-rhythm">
    <div class="max-w-2xl mb-12">
      <div class="eyebrow mb-3">Tjenester</div>
      <h2 class="section-title">Tre fagområder, én kontaktperson.</h2>
      <p class="lead mt-4">Kombinasjonen er bevisst: erfaring fra klinikk, kode og klasserom gjør hvert fagfelt sterkere.</p>
    </div>
    <div class="grid md:grid-cols-3 gap-5">
      {#each pillars as p}
        {@const Icon = p.icon}
        <a href={p.href} class="card card-hover group flex flex-col" data-testid="pillar-{p.key}">
          <div class="grid h-10 w-10 place-items-center rounded-lg border border-mint/25 bg-mint/10 mb-6">
            <Icon size={20} class="text-mint" strokeWidth={1.8} />
          </div>
          <h3 class="text-xl mb-2">{p.title}</h3>
          <p class="text-sm leading-relaxed text-muted mb-5">{p.lead}</p>
          <ul class="space-y-2 mb-7 text-sm text-muted">
            {#each p.items as it}<li class="flex items-center gap-2"><span class="h-1 w-1 rounded-full bg-mint"></span>{it}</li>{/each}
          </ul>
          <span class="mt-auto inline-flex items-center gap-1.5 text-sm font-medium text-fg">
            Les mer <ArrowRight size={15} class="transition-transform group-hover:translate-x-0.5" />
          </span>
        </a>
      {/each}
    </div>
  </div>
</section>

<section class="py-20">
  <div class="container-rhythm grid md:grid-cols-3 gap-5">
    {#each [
      ['Direkte kontakt', 'Du snakker alltid med den som faktisk gjør jobben — ingen mellomledd.'],
      ['Faglig presisjon', 'Enten det gjelder kode, anestesi eller et kursopplegg: detaljene avgjør.'],
      ['Ærlige vurderinger', 'Vi tar bare oppdrag vi kan levere godt. Ellers sier vi fra.']
    ] as [h, t], i}
      <div class="border-l border-line2 pl-6">
        <div class="font-mono text-xs text-mint mb-3">0{i + 1}</div>
        <h3 class="text-lg mb-2">{h}</h3>
        <p class="text-sm leading-relaxed text-muted">{t}</p>
      </div>
    {/each}
  </div>
</section>

<section class="py-16">
  <div class="container-rhythm">
    <div class="relative overflow-hidden rounded-2xl border border-line2 bg-panel px-8 py-14 md:px-14 text-center">
      <div class="pointer-events-none absolute inset-0 hero-glow"></div>
      <h2 class="relative section-title">Har du et oppdrag til oss?</h2>
      <p class="relative lead mt-3 mb-8">Vi svarer vanligvis innen én virkedag.</p>
      <div class="relative flex flex-wrap justify-center gap-3">
        <a href="/kontakt" class="btn-primary" data-testid="bottom-cta-kontakt">Send en melding <ArrowRight size={16} /></a>
        <a href="/kurs" class="btn-outline" data-testid="bottom-cta-kurs">Se kurs</a>
      </div>
    </div>
  </div>
</section>