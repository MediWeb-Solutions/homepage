<script lang="ts">
  import Image from '$lib/components/base/Image.svelte';
  import logo from '$lib/assets/logo/MediWeb-darkbg.png?enhanced';

  type Props = {
    class?: string;
  };

  let { class: className = 'h-12 w-auto' }: Props = $props();
</script>

<Image src={logo} alt="MediWeb Solutions" class={className} />
