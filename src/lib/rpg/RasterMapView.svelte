<script>
    import RasterMap from "./RasterMap.svelte";
    import { onMount } from "svelte";

    export let mapData;
    export let playerPosition = { x: 200, y: 150 };
    export let onClose;
    export let onAreaEntered = () => {};
    export let onAreaLeft = () => {};
    export let onAreaClicked = () => {};

    onMount(() => {
        // Set global DEBUG_MODE to false
        window.DEBUG_MODE = false;
    });

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
    <div class="map-container">
        <RasterMap
            mapImage={mapData.image}
            mapWidth={mapData.width || 800}
            mapHeight={mapData.height || 600}
            viewportWidth={800}
            viewportHeight={600}
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

    <!-- Debug info removed -->
</div>

<style>
    .raster-map-view {
        background-color: #f9f9f9;
        border-radius: 8px;
        padding: 20px;
        max-width: 100%;
        box-shadow: 0 3px 10px rgba(0, 0, 0, 0.2);
    }

    .map-controls {
        display: flex;
        align-items: center;
        gap: 15px;
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

    .map-container {
        margin: 15px 0;
        display: flex;
        justify-content: center;
    }
</style>
