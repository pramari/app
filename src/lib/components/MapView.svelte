<!-- src/lib/components/rpg/MapView.svelte -->
<script>
    import GameMap from "./GameMap.svelte";
    import { getScene } from "$lib/components/stories/utils.js"; // Utility function we'll create later

    export let currentLocation;
    export let mapData;
    export let onLocationSelect;
    export let onClose;
    export let inventory = [];
    export let progress = { visitedLocations: [], completedQuests: [] };

    // Add defensive checks
    $: isValidMap = mapData && typeof mapData === "object" && mapData.locations;
    $: isValidLocation =
        currentLocation && isValidMap && mapData.locations[currentLocation];
    $: currentLocationData = isValidLocation
        ? mapData.locations[currentLocation]
        : null;

    // Filter locations based on discovery conditions
    $: filteredLocations = isValidMap
        ? Object.entries(mapData.locations).reduce((acc, [id, location]) => {
              // Check if location should be visible based on discovery conditions
              if (location.discoveryConditions) {
                  if (
                      location.discoveryConditions.requiredItem &&
                      !inventory.some(
                          (item) =>
                              item.id ===
                              location.discoveryConditions.requiredItem,
                      )
                  ) {
                      return acc; // Skip this location
                  }

                  if (
                      location.discoveryConditions.requiredQuest &&
                      !progress.completedQuests.includes(
                          location.discoveryConditions.requiredQuest,
                      )
                  ) {
                      return acc; // Skip this location
                  }
              }

              acc[id] = location;
              return acc;
          }, {})
        : {};

    // Handle location selection
    function handleLocationSelected(event) {
        const { locationId } = event.detail;
        onLocationSelect(locationId);
    }

    function handleMovementBlocked() {
        alert("You can't travel there from your current location.");
    }
</script>

<div class="map-view">
    <div class="map-header">
        <h2>World Map</h2>
        <button class="close-button" on:click={onClose}>×</button>
    </div>

    <div class="map-instructions">
        <p>
            Click on a highlighted location to travel there. You can only travel
            to connected locations.
        </p>
    </div>

    {#if isValidMap}
        <div class="map-container">
            <GameMap
                {currentLocation}
                locations={filteredLocations}
                paths={mapData.paths || []}
                mapImage={mapData.image}
                mapWidth={mapData.width || 800}
                mapHeight={mapData.height || 600}
                on:locationSelected={handleLocationSelected}
                on:movementBlocked={handleMovementBlocked}
            />
        </div>

        {#if isValidLocation && currentLocationData}
            <div class="current-location-info">
                <h3>Current Location: {currentLocationData.name}</h3>
                <p>
                    {currentLocationData.description ||
                        "No description available."}
                </p>
            </div>
        {:else}
            <div class="error-message">
                <p>Error: Invalid current location data.</p>
            </div>
        {/if}
    {:else}
        <div class="error-message">
            <p>Error: Map data is invalid or missing.</p>
            <pre>Debug: mapData = {JSON.stringify(mapData, null, 2)}</pre>
            <pre>Debug: currentLocation = {currentLocation}</pre>
        </div>
    {/if}
</div>

<style>
    .map-view {
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
    }

    .current-location-info {
        background-color: #e8f4fd;
        padding: 10px 15px;
        border-radius: 6px;
    }

    .current-location-info h3 {
        margin-top: 0;
        color: #2d6da3;
    }
</style>
