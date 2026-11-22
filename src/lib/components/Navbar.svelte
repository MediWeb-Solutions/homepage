<script lang="ts">
    import Navigation from "./Navigation.svelte";
    import Image from "$lib/components/base/Image.svelte";
    import logo from "$lib/assets/logo/MediWeb-darkbg.png?enhanced";

</script>

<header class="topnav">
    <div class="container navbar">
        <div class="brand-box">
            <Image src={logo} alt="MediWeb Solutions" class="w-40 h-auto" />
        </div>
        <Navigation />
    </div>
</header>