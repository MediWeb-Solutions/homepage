<script>
  import '../app.css';
  import Header from '$lib/components/Header.svelte';
  import Footer from '$lib/components/Footer.svelte';
  import logo from '$lib/assets/logo/MediWeb-darkbg.png';
  
</script>

<svelte:head>
  <link rel="icon" type="image/png" href={logo} />
</svelte:head>

<div class="relative min-h-screen flex flex-col">
  <Header />
  <main class="flex-1 relative z-10">
    <slot />
  </main>
  <Footer />
</div>
