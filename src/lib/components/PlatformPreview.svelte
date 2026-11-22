<script>
  import { CheckCircle2, PlayCircle, Circle } from '@lucide/svelte';
  const lessons = [
    { t: 'Vurdering av bevissthet og pust', d: '12 min', s: 'done' },
    { t: 'Stabilt sideleie', d: '9 min', s: 'done' },
    { t: 'HLR på voksen', d: '18 min', s: 'active' },
    { t: 'Stans av alvorlige blødninger', d: '14 min', s: 'todo' },
    { t: 'Når og hvordan du ringer 113', d: '7 min', s: 'todo' }
  ];
</script>

<div class="relative rounded-2xl border border-line2 bg-panel shadow-[0_30px_80px_-20px_rgba(0,0,0,0.6)]" aria-hidden="true">
  <div class="flex items-center gap-1.5 border-b border-line px-4 py-3">
    <span class="h-2.5 w-2.5 rounded-full bg-line2"></span>
    <span class="h-2.5 w-2.5 rounded-full bg-line2"></span>
    <span class="h-2.5 w-2.5 rounded-full bg-line2"></span>
    <span class="ml-3 font-mono text-[11px] text-muted">mediweb.no/konto</span>
  </div>
  <div class="p-5">
    <div class="flex items-center justify-between mb-1">
      <div class="text-sm font-medium">Grunnleggende førstehjelp</div>
      <div class="font-mono text-xs text-mint">40 %</div>
    </div>
    <div class="h-1.5 w-full rounded-full bg-line overflow-hidden mb-5">
      <div class="bar-fill h-full w-[40%] rounded-full bg-mint"></div>
    </div>
    <ul class="space-y-1">
      {#each lessons as l}
        <li class="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm {l.s === 'active' ? 'bg-panel2 border border-line2' : ''}">
          {#if l.s === 'done'}<CheckCircle2 size={16} class="text-mint shrink-0" />
          {:else if l.s === 'active'}<PlayCircle size={16} class="text-mint shrink-0" />
          {:else}<Circle size={16} class="text-line2 shrink-0" />{/if}
          <span class="flex-1 {l.s === 'todo' ? 'text-muted' : 'text-fg'}">{l.t}</span>
          <span class="font-mono text-[11px] text-muted">{l.d}</span>
        </li>
      {/each}
    </ul>
  </div>
</div>
