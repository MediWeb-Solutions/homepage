<script>
  import { CheckCircle2, PlayCircle, Circle } from '@lucide/svelte';
  export let lessons;
  export let completed;
  export let currentId;
  export let onselect;
</script>

<ul class="space-y-1" data-testid="lesson-list">
  {#each lessons as l, i}
    {@const done = completed.includes(l.id)}
    {@const active = l.id === currentId}
    <li>
      <button
        onclick={() => onselect(l.id)}
        class="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm transition-colors duration-200 {active ? 'bg-panel2 border border-line2' : 'border border-transparent hover:bg-panel2/60'}"
        data-testid="lesson-item-{l.id}"
        aria-current={active ? 'true' : undefined}
      >
        {#if done}<CheckCircle2 size={16} class="shrink-0 text-mint" />
        {:else if active}<PlayCircle size={16} class="shrink-0 text-mint" />
        {:else}<Circle size={16} class="shrink-0 text-line2" />{/if}
        <span class="font-mono text-[11px] text-muted w-5">{String(i + 1).padStart(2, '0')}</span>
        <span class="flex-1 {done || active ? 'text-fg' : 'text-muted'}">{l.title}</span>
        <span class="font-mono text-[11px] text-muted">{l.minutes} min</span>
      </button>
    </li>
  {/each}
</ul>
