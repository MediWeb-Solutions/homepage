<script lang="ts">
    import Image from "$lib/components/base/Image.svelte";
    import anestesiIllustrasjon from "$lib/assets/anestesi-illustrasjon.jpg?enhanced";

</script>

<section class="hero">
    <div class="hero-text">
        <h1>Hero Heading</h1>
        <p>Hero text</p>
    </div>
    <Image src={anestesiIllustrasjon} alt="Anestesi illustrasjon" />
</section>