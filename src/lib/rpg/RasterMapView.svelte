<script>
    import RasterMap from "./RasterMap.svelte";
    import { onMount } from "svelte";

    export let mapData;
    export let playerPosition = { x: 200, y: 150 };
    export let onClose;
    export let onAreaEntered = () => {};
    export let onAreaLeft = () => {};
    export let onAreaClicked = () => {};

    // Debug mode toggle
    let debugMode = false;

    onMount(() => {
        // Set global DEBUG_MODE for the map
        window.DEBUG_MODE = debugMode;
    });

    function toggleDebugMode() {
        debugMode = !debugMode;
        window.DEBUG_MODE = debugMode;
    }

    function handlePlayerMoved(event) {
        playerPosition = event.detail.position;
    }

    function handleAreaEntered(event) {
        const { areaId, area } = event.detail;
        console.log(`RasterMapView Entered area: ${areaId}`);
        onAreaEntered(areaId, area);
    }

    function handleAreaLeft(event) {
        const { areaId, area } = event.detail;
        console.log(`RasterMapView Left area: ${areaId}`);
        onAreaLeft(areaId, area);
    }

    function handleAreaClicked(event) {
        const { areaId, area } = event.detail;
        console.log(`Clicked on area: ${areaId}`);
        onAreaClicked(areaId, area);
    }
</script>

<div class="raster-map-view">
    <div class="map-header">
        <h2>World Map</h2>
        <div class="map-controls">
            <label class="debug-toggle">
                <input
                    type="checkbox"
                    bind:checked={debugMode}
                    on:change={toggleDebugMode}
                />
                Debug Mode
            </label>
            <button class="close-button" on:click={onClose}>×</button>
        </div>
    </div>

    <div class="map-instructions">
        <p>
            Explore the world freely. Use arrow keys or WASD to move your
            character.
        </p>
    </div>

    <div class="map-container">
        <RasterMap
            mapImage={mapData.image}
            mapWidth={mapData.width || 800}
            mapHeight={mapData.height || 600}
            {playerPosition}
            playerAvatar={mapData.playerAvatar || "🧙‍♂️"}
            obstacles={mapData.obstacles || []}
            interactiveAreas={mapData.interactiveAreas || []}
            moveSpeed={mapData.moveSpeed || 5}
            allowMovement={true}
            on:playerMoved={handlePlayerMoved}
            on:areaEntered={handleAreaEntered}
            on:areaLeft={handleAreaLeft}
            on:areaClicked={handleAreaClicked}
        />
    </div>

    {#if debugMode}
        <div class="debug-info">
            <h3>Debug Information</h3>
            <p>
                Player position: X:{Math.round(playerPosition.x)}, Y:{Math.round(
                    playerPosition.y,
                )}
            </p>
            <p>Obstacles: {mapData.obstacles?.length || 0}</p>
            <p>Interactive areas: {mapData.interactiveAreas?.length || 0}</p>
        </div>
    {/if}
</div>

<style>
    .raster-map-view {
        background-color: #f9f9f9;
        border-radius: 8px;
        padding: 20px;
        max-width: 100%;
        box-shadow: 0 3px 10px rgba(0, 0, 0, 0.2);
    }

    .map-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 10px;
    }

    .map-header h2 {
        margin: 0;
    }

    .map-controls {
        display: flex;
        align-items: center;
        gap: 15px;
    }

    .debug-toggle {
        display: flex;
        align-items: center;
        gap: 5px;
        font-size: 0.9em;
        cursor: pointer;
    }

    .close-button {
        background: none;
        border: none;
        font-size: 24px;
        cursor: pointer;
        color: #888;
    }

    .close-button:hover {
        color: #333;
    }

    .map-instructions {
        background-color: #fff3cd;
        padding: 10px;
        border-radius: 6px;
        margin-bottom: 15px;
    }

    .map-instructions p {
        margin: 0;
        font-style: italic;
    }

    .map-container {
        margin: 15px 0;
        display: flex;
        justify-content: center;
    }

    .debug-info {
        background: #efefef;
        padding: 10px;
        border-radius: 6px;
        margin-top: 15px;
        font-family: monospace;
        font-size: 0.9em;
    }

    .debug-info h3 {
        margin-top: 0;
        font-size: 1em;
        border-bottom: 1px solid #ddd;
        padding-bottom: 5px;
    }
</style>
