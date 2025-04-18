<script>
    import { goto } from "$app/navigation";
    function gotoCreateCharacter() {
        goto("/character");
    }
</script>

<p>
    <button
        class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        onclick={gotoCreateCharacter}
    >
        Create a new character
    </button>
</p>

<!-- component

<style lang="postcss">
    @reference "tailwindcss";
    :global(html) {
        /*    background-color: #cccccc;  theme(--color-gray-100);*/
    }
</style>
-->
