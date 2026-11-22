<script>
  export let instructor;
  export let compact = false;
</script>

{#if instructor}
  <div class="card {compact ? '!p-5' : '!p-7'} flex items-start gap-4" data-testid="instructor-card">
    {#if instructor.photo_url}
      <img src={instructor.photo_url} alt={instructor.name} class="h-14 w-14 shrink-0 rounded-full object-cover border border-line2" />
    {:else}
      <div class="grid h-14 w-14 shrink-0 place-items-center rounded-full border border-mint/30 bg-mint/10 text-base font-semibold text-mint" aria-hidden="true">
        {instructor.initials}
      </div>
    {/if}
    <div>
      <div class="text-xs text-muted">Kursholder</div>
      <div class="font-medium text-fg" data-testid="instructor-name">{instructor.name}</div>
      <div class="text-sm text-mint">{instructor.title}</div>
      <p class="mt-2 text-sm leading-relaxed text-muted" data-testid="instructor-bio">{instructor.bio}</p>
    </div>
  </div>
{/if}
