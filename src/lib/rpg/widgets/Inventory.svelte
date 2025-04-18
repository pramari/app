<script>
    import { characterStore } from "$lib/stores/character.ts";
</script>

<div class="section-content">
    {#if $characterStore.inventory.length === 0}
        <p>Your inventory is empty.</p>
    {:else}
        <ul class="inventory-list">
            {#each $characterStore.inventory as item}
                <li>
                    {item.name}
                    {#if item.description}<span class="item-description"
                            >- {item.description}</span
                        >{/if}
                    : {item.quantity}
                </li>
            {/each}
        </ul>
    {/if}
</div>

<style>
    .inventory-list {
        list-style-type: none;
        padding-left: 0;
    }

    .inventory-list li {
        padding: 5px 0;
        border-bottom: 1px solid #eee;
    }

    .item-description {
        font-size: 0.9em;
        color: #666;
    }
</style>
