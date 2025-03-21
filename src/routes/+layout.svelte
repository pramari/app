<script>
    let { children } = $props();
    import { page } from "$app/stores";

    import "../app.css";
</script>

<nav class="bg-gray-200">
    <a href="/">Home</a>
    <a href="/about">About</a>
    {#if $page.data.session}
        <span>Signed in as {$page.data.session.user?.name || "User"}</span>
        <form action="/auth/signout" method="POST">
            <button type="submit">Sign out</button>
        </form>
    {:else}
        <form action="/auth/signin" method="POST">
            <button type="submit">Sign in</button>
        </form>
    {/if}
</nav>

{@render children()}
