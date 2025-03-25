<!-- src/routes/protected/+page.svelte -->
<script lang="ts">
    import type { PageData } from "./$types";

    export let data: PageData;
</script>

<h1>User Profile</h1>
{#if data.user}
    <p>Welcome, {data.user.name || "User"}!</p>
    {#if data.user.email}
        <p>Email: {data.user.email}</p>
    {/if}
    {#if data.user.image}
        <img src={data.user.img} alt="{data.user.first_name} Profile" />
    {/if}
    {JSON.stringify(data.user, null, 2)}
{/if}
