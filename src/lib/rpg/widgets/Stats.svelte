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
        display: flex;
        flex-direction: column;
        gap: 8px;
    }

    .stat-item {
        display: flex;
        justify-content: space-between;
        padding: 8px;
        background: rgba(255, 255, 255, 0.5);
        border-radius: 4px;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
    }
</style>
