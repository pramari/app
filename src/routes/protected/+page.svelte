<!-- src/routes/protected/+page.svelte -->
<script lang="ts">
    import type { PageData } from "./$types";

    export let data: PageData;
</script>

<h1>Protected Page</h1>
{#if data.user}
    <p>Welcome, {data.user.name || "User"}!</p>
    {#if data.user.email}
        <p>Email: {data.user.email}</p>
    {/if}
    {#if data.user.image}
        <img src={data.user.image} alt="Profile picture" />
    {/if}
    {JSON.stringify(data.user, null, 2)}
{/if}
