<script>
    import RPGGame from "$lib/components/RPGGame.svelte";
    import { characterStore } from "$lib/stores/character";
    import { onMount } from "svelte";
</script>

<main>
    {#if $characterStore.name}
        <h1>Welcome, {$characterStore.name}!</h1>
        <RPGGame />
    {:else}
        <h1>Welcome!</h1>
        
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
