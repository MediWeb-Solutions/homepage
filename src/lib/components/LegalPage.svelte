<script>
  export let eyebrow;
  export let title;
  export let updated;
</script>

<section class="py-16 md:py-20">
  <div class="container-rhythm grid lg:grid-cols-12 gap-10">
    <aside class="lg:col-span-4">
      <div class="lg:sticky lg:top-24">
        <div class="eyebrow">{eyebrow}</div>
        <h1 class="mt-3 text-4xl leading-[1.08]">{title}</h1>
        <p class="mt-4 text-sm text-muted">Sist oppdatert: {updated}</p>
        <div class="card !p-5 mt-8 text-sm text-muted leading-relaxed">
          <div class="font-medium text-fg">MediWeb Solutions</div>
          Org.nr. 924 803 673<br />
          Lektor Musums gate 17, 7650 Verdal<br />
          <a href="mailto:post@mediweb.no" class="text-mint link-underline">post@mediweb.no</a>
        </div>
      </div>
    </aside>
    <article class="legal lg:col-span-8 max-w-2xl" data-testid="legal-content">
      <slot />
    </article>
  </div>
</section>

<style>
  .legal :global(h2) { font-size: 1.25rem; margin: 2.5rem 0 0.75rem; }
  .legal :global(h2:first-child) { margin-top: 0; }
  .legal :global(p), .legal :global(li) { color: #8A9A97; line-height: 1.75; font-size: 0.95rem; }
  .legal :global(p + p) { margin-top: 0.75rem; }
  .legal :global(ul) { margin: 0.75rem 0; padding-left: 1.1rem; list-style: disc; }
  .legal :global(li::marker) { color: #5FD4B4; }
  .legal :global(strong) { color: #E6ECEA; font-weight: 500; }
  .legal :global(a) { color: #5FD4B4; }
</style>
