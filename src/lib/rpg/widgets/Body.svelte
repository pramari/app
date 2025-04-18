<script>
    import { characterStore } from "$lib/stores/character.ts";
</script>

<div class="section-content body-details">
    <div class="attribute-row">
        <div class="attribute-label">Height:</div>
        <div class="attribute-value">{$characterStore.body.height} cm</div>
    </div>

    <div class="attribute-row">
        <div class="attribute-label">Weight:</div>
        <div class="attribute-value">{$characterStore.body.weight} kg</div>
    </div>

    <div class="attribute-row">
        <div class="attribute-label">Measurements:</div>
        <div class="attribute-value">
            {$characterStore.body.measurements || "N/A"}
        </div>
    </div>

    <div class="attribute-row">
        <div class="attribute-label">Cup Size:</div>
        <div class="attribute-value">
            {$characterStore.body.cup || "N/A"}
        </div>
    </div>

    <div class="attribute-row">
        <div class="attribute-label">Body Type:</div>
        <div class="attribute-value">
            {$characterStore.body.bodytype || "N/A"}
        </div>
    </div>

    <div class="attribute-row">
        <div class="attribute-label">Eye Color:</div>
        <div class="attribute-value">
            {$characterStore.body.eyecolor || "N/A"}
        </div>
    </div>

    <div class="attribute-row">
        <div class="attribute-label">Hair Color:</div>
        <div class="attribute-value">
            {$characterStore.body.haircolor || "N/A"}
        </div>
    </div>

    <div class="attribute-row">
        <div class="attribute-label">Pubic Hair:</div>
        <div class="attribute-value">
            {$characterStore.body.pubichair || "N/A"}
        </div>
    </div>

    <div class="attribute-row">
        <div class="attribute-label">Piercings:</div>
        <div class="attribute-value">
            {$characterStore.body.piercings || "None"}
        </div>
    </div>

    <div class="attribute-row">
        <div class="attribute-label">Tattoos:</div>
        <div class="attribute-value">
            {$characterStore.body.tattoos || "None"}
        </div>
    </div>
</div>

<style>
    .section-content {
        padding: 10px;
        background-color: #f5f5f5;
        border-radius: 0 0 4px 4px;
    }

    /* Styles for Body section */
    .body-details {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 10px;
    }

    .attribute-row {
        display: flex;
        padding: 5px 0;
        border-bottom: 1px solid #eaeaea;
    }

    .attribute-label {
        font-weight: 600;
        width: 120px;
        color: #555;
    }

    .attribute-value {
        flex-grow: 1;
    }

    @media (max-width: 600px) {
        .body-details {
            grid-template-columns: 1fr;
        }
    }
</style>
