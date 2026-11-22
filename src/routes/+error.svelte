<script>
  import { page } from '$app/state';
</script>

<svelte:head><title>{page.status} — MediWeb Solutions</title></svelte:head>

<section class="min-h-[70vh] flex items-center">
  <div class="container-rhythm text-center max-w-md">
    <div class="font-mono text-sm text-mint mb-3">Feil {page.status}</div>
    <h1 class="text-4xl mb-4">Siden finnes ikke</h1>
    <p class="text-muted mb-8">Lenken kan være utdatert eller skrevet feil.</p>
    <a href="/" class="btn-primary" data-testid="error-home">Tilbake til forsiden</a>
  </div>
</section>
