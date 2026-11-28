<script>
  import '../app.css';
  import Header from '$lib/components/Header.svelte';
  import Footer from '$lib/components/Footer.svelte';
  import logo from '$lib/assets/logo/MediWeb-darkbg.png';

</script>

<svelte:head>
  <link rel="icon" type="image/png" href={logo} />
  <script defer src="https://cloud.umami.is/script.js" data-website-id="10499c3d-a12f-4606-8ee8-30db2a2181a9"></script>
</svelte:head>

<div class="relative min-h-screen flex flex-col">
  <Header />
  <main class="flex-1 relative z-10">
    <slot />
  </main>
  <Footer />
</div>
