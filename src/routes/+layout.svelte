<script>

import "../app.css";</script>
let { children } = $props();

<!-- <slot></slot> -->

<nav>
  <a href="/">Home</a>
  <a href="/about">About</a>
</nav>

{@render children()}
