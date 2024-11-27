<script>
  import TailwindCss from '../lib/TailwindCSS.svelte';
  import "../app.css";
  let { children } = $props();
</script>

<TailwindCss/>

<nav class="">
  <a href="/">Home</a>
  <a href="/about">About</a>
</nav>

{@render children()}
