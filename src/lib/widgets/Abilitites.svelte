<script>
    import { characterStore } from "$lib/stores/character.ts";
    import { characterClasses } from "$lib/stories/characterclasses.ts";
</script>

<div class="section-content">
    <div class="abilities-list">
        {#each $characterStore.abilities as abilityId}
            {@const ability = (
                ($characterStore.class &&
                    characterClasses.find((c) => c.id === $characterStore.class)
                        ?.abilities) ||
                []
            ).find((a) => a.id === abilityId)}
            {#if ability}
                <div class="ability-item">
                    <h4>{ability.name}</h4>
                    <p>{ability.description}</p>
                </div>
            {/if}
        {/each}
    </div>
</div>

<style>
    .ability-item {
        background: rgba(255, 255, 255, 0.5);
        border-radius: 4px;
        padding: 8px;
        margin-bottom: 8px;
    }

    .ability-item h4 {
        margin: 0 0 5px 0;
        color: #444;
    }

    .ability-item p {
        margin: 0;
        font-size: 0.9em;
        color: #666;
    }
</style>
