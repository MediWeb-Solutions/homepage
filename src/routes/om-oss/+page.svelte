<script>
  import { onMount } from 'svelte';
  import { ArrowRight } from '@lucide/svelte';
  import { api } from '$lib/api';
  import PageHero from '$lib/components/PageHero.svelte';
  import InstructorCard from '$lib/components/InstructorCard.svelte';
  let instructor = null;
  onMount(async () => { instructor = (await api('/api/courses')).courses[0]?.instructor; });
</script>

<svelte:head><title>Om oss — MediWeb Solutions</title></svelte:head>

<PageHero eyebrow="Om oss" title="Et lite foretak med tre ben å stå på." lead="Moderne webutvikling, profesjonelle legetjenester og engasjerende kursvirksomhet — samlet under ett tak." />

<section class="py-20">
  <div class="container-rhythm grid lg:grid-cols-12 gap-12">
    <div class="lg:col-span-7 space-y-6 text-[17px] leading-relaxed text-muted">
      <p>
        MediWeb Solutions er et lite, norsk foretak der tre fagfelt møtes. For noen virker kombinasjonen uvanlig — for oss er den en naturlig følge av et faglig liv der kode, klinikk og undervisning har gått hånd i hånd.
      </p>
      <p>
        Vi tar på oss oppdrag der omtanke betyr mer enn skala: en nettside som faktisk er rask, en anestesi som gjennomføres trygt, et kurs som fester seg hos deltakerne.
      </p>
      <p>Du snakker alltid direkte med den som utfører arbeidet. Det er både vår begrensning og vår styrke.</p>
    </div>
    <aside class="lg:col-span-5">
      <figure class="card !p-8 border-l-2 !border-l-mint">
        <blockquote class="text-xl leading-snug text-fg">«Få hender, mye ansvar. Vi tar bare oppdrag vi kan levere godt.»</blockquote>
        <figcaption class="mt-4 text-sm text-muted">MediWeb Solutions</figcaption>
      </figure>
      <div class="mt-5"><InstructorCard {instructor} /></div>
      <a href="/kontakt" class="btn-primary mt-6" data-testid="about-cta">Ta kontakt <ArrowRight size={16} /></a>
    </aside>
  </div>
</section>
