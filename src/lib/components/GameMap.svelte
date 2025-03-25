<!-- src/lib/components/rpg/GameMap.svelte -->
<script>
    import { createEventDispatcher } from "svelte";

    // Export props
    export let currentLocation;
    export let locations = {};
    export let paths = [];
    export let mapImage = null;
    export let mapWidth = 800;
    export let mapHeight = 600;
    export let playerCanMove = true;

    // Create a dispatcher for events
    const dispatch = createEventDispatcher();

    // Calculate which locations are accessible from current location
    $: availableLocations = Object.keys(locations).filter((locId) => {
        // Check if there's a path from current to this location
        return paths.some(
            (path) =>
                (path.from === currentLocation && path.to === locId) ||
                (path.bidirectional &&
                    path.from === locId &&
                    path.to === currentLocation),
        );
    });

    // Handle location click
    function handleLocationClick(locationId) {
        // Check if this location is accessible
        if (availableLocations.includes(locationId) && playerCanMove) {
            dispatch("locationSelected", { locationId });
        } else if (locationId === currentLocation) {
            // Clicking current location
            dispatch("examineLocation", { locationId });
        } else if (!playerCanMove) {
            // Can't move - inform player
            dispatch("movementBlocked");
        }
    }

    // Show hover info for a location
    let hoveredLocation = null;

    // Show path hover
    function getPathClass(path) {
        // Is this path available to the player right now?
        const isAvailable =
            path.from === currentLocation ||
            (path.bidirectional && path.to === currentLocation);

        let classes = [];
        if (isAvailable) classes.push("available");
        if (path.hidden) classes.push("hidden");

        return classes.join(" ");
    }
</script>

<div class="game-map-container">
    <div
        class="game-map"
        style="width: {mapWidth}px; height: {mapHeight}px; {mapImage
            ? `background-image: url(${mapImage})`
            : ''}"
    >
        <!-- Draw paths -->
        <svg
            class="map-paths"
            viewBox="0 0 {mapWidth} {mapHeight}"
            width={mapWidth}
            height={mapHeight}
        >
            {#each paths as path}
                <!-- Skip hidden paths unless they're available -->
                {#if !path.hidden || path.from === currentLocation || (path.bidirectional && path.to === currentLocation)}
                    <line
                        x1={locations[path.from]?.x}
                        y1={locations[path.from]?.y}
                        x2={locations[path.to]?.x}
                        y2={locations[path.to]?.y}
                        class="path {getPathClass(path)}"
                    />
                {/if}
            {/each}
        </svg>

        <!-- Render locations -->
        {#each Object.entries(locations) as [id, location]}
            <div
                class="map-location {id === currentLocation ? 'current' : ''}
               {availableLocations.includes(id) ? 'available' : ''}"
                style="left: {location.x - 15}px; top: {location.y - 15}px;"
                on:click={() => handleLocationClick(id)}
                on:mouseenter={() => (hoveredLocation = id)}
                on:mouseleave={() => (hoveredLocation = null)}
            >
                <div class="location-icon">{location.icon || "📍"}</div>

                {#if hoveredLocation === id}
                    <div class="location-tooltip">
                        <h4>{location.name}</h4>
                        {#if location.description}
                            <p>{location.description}</p>
                        {/if}

                        {#if id === currentLocation}
                            <span class="location-status">You are here</span>
                        {:else if availableLocations.includes(id)}
                            <span class="location-status"
                                >Available to travel</span
                            >
                        {:else}
                            <span class="location-status">Not available</span>
                        {/if}
                    </div>
                {/if}
            </div>
        {/each}
    </div>

    <div class="map-legend">
        <h3>Map Legend</h3>
        <div class="legend-item">
            <span class="legend-icon current"></span>
            <span>Current Location</span>
        </div>
        <div class="legend-item">
            <span class="legend-icon available"></span>
            <span>Available Destinations</span>
        </div>
    </div>
</div>

<style>
    .game-map-container {
        position: relative;
        margin: 20px 0;
    }

    .game-map {
        position: relative;
        background-color: #e0d8c0;
        background-size: cover;
        background-position: center;
        border: 2px solid #8b7d6b;
        border-radius: 8px;
        overflow: hidden;
    }

    .map-paths {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
    }

    .path {
        stroke: #8b7d6b;
        stroke-width: 5;
        stroke-linecap: round;
    }

    .path.available {
        stroke: #4a6;
        stroke-width: 6;
        stroke-dasharray: 5, 3;
        animation: dash 1s linear infinite;
    }

    .path.hidden {
        stroke-dasharray: 2, 5;
        stroke-width: 2;
        opacity: 0.5;
    }

    @keyframes dash {
        to {
            stroke-dashoffset: -8;
        }
    }

    .map-location {
        position: absolute;
        width: 30px;
        height: 30px;
        border-radius: 50%;
        background: #8b7d6b;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        z-index: 5;
    }

    .map-location.current {
        background: #e74c3c;
        box-shadow: 0 0 0 4px rgba(231, 76, 60, 0.5);
        z-index: 10;
    }

    .map-location.available {
        background: #4a6;
        animation: pulse 2s infinite;
    }

    @keyframes pulse {
        0% {
            box-shadow: 0 0 0 0 rgba(74, 170, 102, 0.7);
        }
        70% {
            box-shadow: 0 0 0 10px rgba(74, 170, 102, 0);
        }
        100% {
            box-shadow: 0 0 0 0 rgba(74, 170, 102, 0);
        }
    }

    .location-icon {
        font-size: 1.2em;
        color: white;
    }

    .location-tooltip {
        position: absolute;
        bottom: 100%;
        left: 50%;
        transform: translateX(-50%);
        width: 180px;
        background: rgba(30, 30, 30, 0.9);
        color: white;
        padding: 10px;
        border-radius: 6px;
        z-index: 100;
        margin-bottom: 10px;
        pointer-events: none;
    }

    .location-tooltip::after {
        content: "";
        position: absolute;
        top: 100%;
        left: 50%;
        transform: translateX(-50%);
        border-width: 8px;
        border-style: solid;
        border-color: rgba(30, 30, 30, 0.9) transparent transparent transparent;
    }

    .location-tooltip h4 {
        margin: 0 0 5px 0;
    }

    .location-tooltip p {
        margin: 5px 0;
        font-size: 0.9em;
    }

    .location-status {
        display: block;
        font-size: 0.8em;
        font-style: italic;
        margin-top: 5px;
    }

    .map-legend {
        margin-top: 15px;
        padding: 10px;
        background: #f5f5f5;
        border-radius: 8px;
    }

    .map-legend h3 {
        margin-top: 0;
        font-size: 1em;
        border-bottom: 1px solid #ddd;
        padding-bottom: 5px;
        margin-bottom: 10px;
    }

    .legend-item {
        display: flex;
        align-items: center;
        margin-bottom: 5px;
    }

    .legend-icon {
        width: 15px;
        height: 15px;
        border-radius: 50%;
        margin-right: 10px;
    }

    .legend-icon.current {
        background: #e74c3c;
    }

    .legend-icon.available {
        background: #4a6;
    }
</style>
