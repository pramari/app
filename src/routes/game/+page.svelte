<script>
    import RPGGame from "$lib/rpg/RPGGame.svelte";
    import { characterStore } from "$lib/stores/character";
    import { onMount } from "svelte";
    import { page } from "$app/stores";
</script>

<main>
    {#if $page.data.user}
        <RPGGame user={$page.data.user} />
    {/if}
</main>

<style>
    main {
        font-family: Arial, sans-serif;
        max-width: 1200px;
        margin: 0 auto;
        padding: 20px;
    }
</style>
