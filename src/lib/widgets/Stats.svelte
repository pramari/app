<script>
    import { characterStore } from "$lib/stores/character.ts";
</script>

<div class="section-content">
    <div class="stats-grid">
        {#each Object.entries($characterStore.stats) as [stat, value]}
            <div class="stat-item">
                <span class="stat-name"
                    >{stat.charAt(0).toUpperCase() + stat.slice(1)}</span
                >
                <span class="stat-value">{value}</span>
            </div>
        {/each}
    </div>
</div>

<style>
    .stats-grid {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 10px;
    }

    .stat-item {
        display: flex;
        justify-content: space-between;
        padding: 5px;
        background: rgba(255, 255, 255, 0.5);
        border-radius: 4px;
    }
</style>
