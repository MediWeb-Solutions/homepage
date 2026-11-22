<script lang='ts'>
    import type { Picture } from '@sveltejs/enhanced-img';

    type Props = {
        src: Picture;
        alt: string;
        class?: string;
    };

    let { src, alt, class: className }: Props = $props();
</script>

<enhanced:img {src} alt={alt || ''} class={className} />