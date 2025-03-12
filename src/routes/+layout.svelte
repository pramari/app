<script>
    let { children } = $props();
    import "../app.css";
</script>

<nav class="bg-gray-800">
    <a href="/">Home</a>
    <a href="/about">About</a>
</nav>

{@render children()}
