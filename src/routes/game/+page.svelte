<script>
    import RPGGame from "$lib/components/RPGGame.svelte";
    import { characterStore } from "$lib/stores/character";
    import { onMount } from "svelte";
</script>

<main>
    <RPGGame />
</main>

<style>
    main {
        font-family: Arial, sans-serif;
        max-width: 1200px;
        margin: 0 auto;
        padding: 20px;
    }
</style>
