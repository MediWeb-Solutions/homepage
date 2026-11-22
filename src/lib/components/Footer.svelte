<script>
  import Logo from './Logo.svelte';
</script>

<footer class="mt-28 border-t border-line">
  <div class="container-rhythm py-14 grid gap-10 md:grid-cols-4">
    <div class="md:col-span-2">
      <Logo />
      <p class="mt-4 max-w-sm text-sm leading-relaxed text-muted">
        Webutvikling, legetjenester og kurs — levert av et lite norsk foretak med direkte kontakt og høy faglig standard.
      </p>
    </div>
    <div>
      <div class="text-xs font-medium text-fg mb-4">Tjenester</div>
      <ul class="space-y-2.5 text-sm text-muted">
        <li><a href="/tjenester/webutvikling" class="hover:text-fg transition-colors">Webutvikling</a></li>
        <li><a href="/tjenester/legetjenester" class="hover:text-fg transition-colors">Legetjenester</a></li>
        <li><a href="/kurs" class="hover:text-fg transition-colors">Kurs</a></li>
        <li><a href="/om-oss" class="hover:text-fg transition-colors">Om oss</a></li>
      </ul>
    </div>
    <div>
      <div class="text-xs font-medium text-fg mb-4">Kontakt</div>
      <ul class="space-y-2.5 text-sm text-muted">
        <li><a href="mailto:post@mediweb.no" class="hover:text-fg transition-colors">post@mediweb.no</a></li>
        <li><a href="/kontakt" class="hover:text-fg transition-colors">Send en melding</a></li>
      </ul>
    </div>
  </div>
  <div class="border-t border-line">
    <div class="container-rhythm py-5 flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-muted">
      <div>&copy; {new Date().getFullYear()} MediWeb Solutions</div>
      <div class="flex gap-6">
        <a href="/personvern" class="hover:text-fg transition-colors">Personvern</a>
        <a href="/brukervilkar" class="hover:text-fg transition-colors">Brukervilkår</a>
      </div>
    </div>
  </div>
</footer>
