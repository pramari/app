<script>
    import TailwindCss from "../lib/TailwindCSS.svelte";
    let { children } = $props();
    import "../app.css";
</script>

<TailwindCss />

<nav class="bg-gray-800">
    <a href="/">Home</a>
    <a href="/about">About</a>
</nav>

{@render children()}
