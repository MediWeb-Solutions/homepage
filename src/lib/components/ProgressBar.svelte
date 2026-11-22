<script>
  export let percent = 0;
  export let label = true;
</script>

<div class="flex items-center gap-3" data-testid="progress-bar">
  <div class="h-1.5 flex-1 overflow-hidden rounded-full bg-line" role="progressbar" aria-valuenow={percent} aria-valuemin="0" aria-valuemax="100">
    <div class="h-full rounded-full bg-mint transition-[width] duration-700 ease-out" style="width: {percent}%"></div>
  </div>
  {#if label}<span class="font-mono text-xs text-mint w-10 text-right" data-testid="progress-percent">{percent} %</span>{/if}
</div>
