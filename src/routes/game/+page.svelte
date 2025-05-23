<script>
    import { characterStore } from "$lib/stores/character";
    import RasterMapView from "$lib/rpg/RasterMapView.svelte";
    import Interaction from "$lib/rpg/Interaction.svelte";
    import StoryEngine from "$lib/rpg/StoryEngine.svelte";
    import {
        characterClasses,
        getClassById,
    } from "$lib/stories/characterclasses";
    import Character from "$lib/rpg/Character.svelte";
    import { getSkillInfo } from "$lib/stories/skills";
    import { getScene, getSceneForLocation } from "$lib/rpg/utils.js";
    import { onMount } from "svelte";
    import { page } from "$app/stores";

    // Receive authenticated user from parent component
    let { data } = $props();

    // Import the story
    import { gameStory } from "$lib/stories/mainStory.js";

    let playerMapPosition = { x: 200, y: 150 }; // Default position on raster map
    let gameStarted = false;
    let currentScene = null;
    let currentLocation = null;
    let activeInteraction = null;
    let showingMap = true; // Start with map view by default

    currentScene = gameStory.scenes[gameStory.startingScene];
    currentLocation = gameStory.map.locations[gameStory.startingLocation];

    // Initialize player position on the map
    if (gameStory.map.rasterMap && gameStory.map.rasterMap.startingPosition) {
        playerMapPosition = { ...gameStory.map.rasterMap.startingPosition };
    }

    // Initialize player position from the story data
    $effect(() => {
        if (gameStory.map.rasterMap && !gameStarted) {
            playerMapPosition = gameStory.map.rasterMap.startingPosition || {
                x: 800,
                y: 600,
            };
        }
    });

    // Game progress tracking
    let gameProgress = {
        visitedLocations: [],
        completedQuests: [],
        discoveredLocations: [],
    };

    function makeChoice(choice) {
        console.log("Player chose:", choice);

        // Check if this choice opens the map
        if (choice.showMap) {
            showingMap = true;
            return;
        }

        // Process skill checks if needed
        if (choice.skillCheck) {
            const skillValue = $characterStore.skills[choice.skillCheck.skill] || 0;
            const success = skillValue >= choice.skillCheck.difficulty;

            // Apply skill improvement on attempts
            improveSkill(choice.skillCheck.skill, 1);

            currentScene = success
                ? gameStory.scenes[choice.skillCheck.successScene]
                : gameStory.scenes[choice.skillCheck.failScene];

            // Update location if the scene has a different location
            if (
                currentScene.location &&
                currentScene.location !== currentLocation
            ) {
                travelToLocation(currentScene.location);
            }
        } else if (choice.nextScene) {
            // Regular choice
            currentScene = gameStory.scenes[choice.nextScene];

            // Update location if the scene has a different location
            if (
                currentScene.location &&
                currentScene.location !== currentLocation
            ) {
                travelToLocation(currentScene.location);
            }

            // Apply consequences
            if (choice.consequences) {
                if (choice.consequences.experience) {
                    gainExperience(choice.consequences.experience);
                }

                if (choice.consequences.items) {
                    choice.consequences.items.forEach((item) => {
                        $characterStore.inventory.push(item);
                    });
                }

                if (choice.consequences.revealLocation) {
                    revealLocation(choice.consequences.revealLocation);
                }

                if (choice.consequences.quest) {
                    completeQuest(choice.consequences.quest);
                }
            }
        }
        // If the scene has a different location, update currentLocation
        if (
            currentScene.location &&
            currentScene.location !== currentLocation
        ) {
            currentLocation = currentScene.location;
        }
    }
    // Handle area interaction in raster map
    function handleAreaEntered(areaId, area) {
        console.log(`Callback for Entered area: ${areaId}`);

        // If this area has a scene associated, update the current scene name
        // (but don't switch to it yet - just make it available for "Explore" option)
        if (area.sceneId) {
            // Store the current area for potential scene activation
            currentArea = area;
        }
    }

    function handleAreaLeft(areaId) {
        console.log(`Callback for Left area: ${areaId}`);
        if (currentArea && currentArea.id === areaId) {
            currentArea = null;
        }
    }

    // Track the current area the player is in
    let currentArea = null;

    // Function to explore the current area
    function exploreCurrentArea() {
        if (currentArea && currentArea.sceneId) {
            // Get the scene for this area
            const areaScene = gameStory.scenes[currentArea.sceneId];

            if (areaScene) {
                currentScene = areaScene;
                showingMap = false;

                // Update location
                if (areaScene.location) {
                    currentLocation = areaScene.location;

                    // Add to visited locations
                    if (
                        !gameProgress.visitedLocations.includes(currentLocation)
                    ) {
                        gameProgress.visitedLocations = [
                            ...gameProgress.visitedLocations,
                            currentLocation,
                        ];
                    }
                }
            }
        }
    }

    // Function to close the map (now returns to the scene without hiding the map)
    function closeMap() {
        // Map is always shown, but this function is still called by RasterMapView
        // We'll just log that it was called for debugging purposes
        console.log("closeMap called");
    }

    function travelToLocation(locationId) {
        // Update current location
        currentLocation = locationId;

        // Add to visited locations if not already there
        if (!gameProgress.visitedLocations.includes(locationId)) {
            gameProgress.visitedLocations = [
                ...gameProgress.visitedLocations,
                locationId,
            ];
        }

        // Close map view
        showingMap = false;

        // Get the scene for this location
        const locationScene = getSceneForLocation(locationId);

        if (locationScene) {
            currentScene = locationScene;
        } else {
            console.error(`No scene found for location: ${locationId}`);
            // Create a generic scene for this location
            currentScene = {
                title:
                    gameStory.map.locations[locationId]?.name ||
                    "Unknown Location",
                description:
                    gameStory.map.locations[locationId]?.description ||
                    "You arrive at your destination.",
                location: locationId,
                choices: [
                    {
                        text: "Travel to another location",
                        showMap: true,
                    },
                ],
            };
        }
    }

    function handleLocationSelect(locationId) {
        console.log("Selected location:", locationId);
        travelToLocation(locationId);
    }

    function revealLocation(locationId) {
        if (!gameProgress.discoveredLocations.includes(locationId)) {
            gameProgress.discoveredLocations = [
                ...gameProgress.discoveredLocations,
                locationId,
            ];
        }
    }

    function completeQuest(questId) {
        if (!gameProgress.completedQuests.includes(questId)) {
            gameProgress.completedQuests = [...gameProgress.completedQuests, questId];
        }
    }

    function improveSkill(skillId, amount) {
        if (!$characterStore.skills[skillId]) {
            let skill = getSkillInfo(skillId);
            $characterStore.skills[skillId] = 0;
            $characterStore = { ...$characterStore };
        }

        $characterStore.skills[skillId] += amount;
        $characterStore = { ...$characterStore };
    }

    function gainExperience(amount) {
        $characterStore.experience += amount;

        // Level up if enough experience
        if ($characterStore.experience >= $characterStore.level * 100) {
            $characterStore.level++;
            // Give skill points on level up
            $characterStore.skillPoints =
                ($characterStore.skillPoints || 0) + 3;

            // Check for new abilities
            const characterClass = getClassById($characterStore.class);
            if (characterClass) {
                const newAbilities = characterClass.abilities
                    .filter(
                        (ability) =>
                            ability.unlockLevel === $characterStore.level,
                    )
                    .map((ability) => ability.id);

                if (newAbilities.length > 0) {
                    $characterStore.abilities = [
                        ...$characterStore.abilities,
                        ...newAbilities,
                    ];
                }
            }
        }

        $characterStore = { ...$characterStore };
    }

    function spendSkillPoint(skillId) {
        if (($characterStore.skillPoints || 0) > 0) {
            improveSkill(skillId, 1);
            $characterStore.skillPoints--;
            $characterStore = { ...$characterStore };
        }
    }

    function startInteraction(characterId) {
        activeInteraction = currentScene.characters.find(
            (c) => c.id === characterId,
        );
    }

    function endInteraction() {
        activeInteraction = null;
    }
</script>

<div class="rpg-game">
    <div class="game-container">
        <!-- Character Panel (Full Height Left Column) -->
        <div class="character-panel">
            <Character {spendSkillPoint} />
        </div>

        <!-- Main Game Area (Right Column) -->
        <div class="main-game-area">
            <!-- Map View -->
            <div class="map-panel">
                {#if showingMap}
                    <RasterMapView
                        mapData={gameStory.map.rasterMap}
                        playerPosition={playerMapPosition}
                        onAreaEntered={handleAreaEntered}
                        onAreaLeft={handleAreaLeft}
                    />
                    {#if currentArea}
                        <div class="current-area-info">
                            <h3>{currentArea.name}</h3>
                            <p>{currentArea.description}</p>
                            <button
                                class="explore-button"
                                on:click={exploreCurrentArea}
                            >
                                Explore {currentArea.name}
                            </button>
                        </div>
                    {/if}
                {/if}
            </div>

            <!-- Story Panel -->
            <div class="story-panel">
                {#if activeInteraction}
                    <Interaction
                        character={activeInteraction}
                        player={$characterStore}
                        onDialogueEnd={endInteraction}
                    />
                {:else if currentScene}
                    <StoryEngine
                        scene={currentScene}
                        {makeChoice}
                        onInteract={startInteraction}
                    />
                {:else}
                    <div class="error-scene">
                        <h2>Scene Error</h2>
                        <p>
                            The current scene {currentScene} could not be loaded.
                            This might be a bug in the game.
                        </p>
                        <button
                            on:click={() => {
                                const startingScene =
                                    gameStory.scenes[gameStory.startingScene];
                                if (startingScene) {
                                    currentScene = startingScene;
                                    currentLocation =
                                        gameStory.startingLocation ||
                                        gameStory.startingScene;
                                }
                            }}>Return to Starting Area</button
                        >
                    </div>
                {/if}
            </div>
        </div>
    </div>
</div>

<style>
    .rpg-game {
        font-family: "Trebuchet MS", Arial, sans-serif;
        max-width: 1200px;
        margin: 0 auto;
        padding: 20px;
    }

    .user-info {
        background: #f8f8f8;
        border-radius: 8px;
        padding: 15px;
        margin-bottom: 20px;
        border: 1px solid #ddd;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
    }

    .user-info h2 {
        margin-top: 0;
        color: #333;
        font-size: 1.5rem;
    }

    .user-info p {
        margin-bottom: 0;
        color: #666;
    }

    .game-container {
        display: flex;
        flex-direction: row; /* Changed to row layout */
        gap: 20px;
        height: calc(100vh - 120px); /* Adjust for header and margins */
    }

    .main-game-area {
        display: flex;
        flex-direction: column;
        flex: 3; /* Take up 3/4 of the available horizontal space */
        gap: 15px;
        height: 100%;
    }

    .map-panel {
        height: 70%; /* Top portion of the game area */
        background: #f8f8f8;
        border-radius: 8px;
        border: 1px solid #ddd;
        overflow: hidden;
        position: relative;
    }

    .character-panel {
        width: 300px; /* Fixed width for character panel */
        padding: 15px;
        background: #f0f0f0;
        border-radius: 8px;
        overflow: auto;
        height: 100%; /* Full height */
        border: 1px solid #ddd;
    }

    .story-panel {
        height: 30%; /* Bottom portion of the game area */
        padding: 15px;
        background: #fff;
        border: 1px solid #ddd;
        border-radius: 8px;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        overflow: auto;
    }

    .current-area-info {
        background: rgba(255, 255, 255, 0.9);
        border-radius: 8px;
        padding: 15px;
        margin-top: 15px;
        box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1);
        border: 1px solid #ddd;
    }

    .current-area-info h3 {
        margin-top: 0;
        color: #333;
    }

    .explore-button {
        background: #4a6;
        color: white;
        border: none;
        padding: 10px 15px;
        border-radius: 5px;
        cursor: pointer;
        font-weight: bold;
        margin-top: 10px;
    }

    .explore-button:hover {
        background: #3b5;
    }

    /* Responsive layout for smaller screens */
    @media (max-width: 768px) {
        .game-container {
            flex-direction: column;
        }

        .character-panel {
            width: 100%;
            height: auto;
            max-height: 200px;
        }

        .main-game-area {
            flex: 1;
        }
    }
</style>
