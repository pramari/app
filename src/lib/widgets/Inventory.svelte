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
