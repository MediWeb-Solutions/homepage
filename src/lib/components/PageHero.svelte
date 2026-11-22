<script>
  export let eyebrow;
  export let title;
  export let lead = undefined;
</script>

<section class="relative overflow-hidden border-b border-line">
  <div class="pointer-events-none absolute inset-0 grid-faint opacity-50"></div>
  <div class="pointer-events-none absolute inset-0 hero-glow"></div>
  <div class="container-rhythm relative pt-20 pb-16 md:pt-24 md:pb-20">
    <div class="max-w-3xl">
    <div class="eyebrow rise">{eyebrow}</div>
    <h1 class="rise rise-delay-1 mt-4 text-4xl md:text-5xl leading-[1.08]">{title}</h1>
    {#if lead}<p class="rise rise-delay-2 lead mt-5 max-w-2xl">{lead}</p>{/if}
    <slot />
    </div>
  </div>
</section>
