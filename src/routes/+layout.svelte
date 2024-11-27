<script>import "../app.css";</script><slot></slot>

<script>
 let { children } = $props();
</script>

<nav>
  <a href="/">Home</a>
  <a href="/about">About</a>
</nav>

{@render children()}
