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
        display: flex;
        flex-direction: column;
        gap: 8px;
    }

    .attribute-row {
        display: flex;
        padding: 8px;
        border-bottom: 1px solid #eaeaea;
        background: rgba(255, 255, 255, 0.5);
        border-radius: 4px;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
    }

    .attribute-label {
        font-weight: 600;
        width: 120px;
        color: #555;
    }

    .attribute-value {
        flex-grow: 1;
    }
</style>
