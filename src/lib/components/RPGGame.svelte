<!-- src/lib/components/rpg/RPGGame.svelte -->
<script>
    import { characterStore } from "$lib/stores/character";
    import Character from "./Character.svelte";
    import RasterMapView from "./RasterMapView.svelte";
    import Interaction from "./Interaction.svelte";
    import StoryEngine from "./StoryEngine.svelte";
    import {
        characterClasses,
        getClassById,
    } from "$lib/stories/characterClasses.ts";
    import { getSkillInfo } from "$lib/stories/skills.ts";
    import { getScene, getSceneForLocation } from "$lib/components/utils.js";
    import { onMount } from "svelte";

    // Import the story
    import { gameStory } from "$lib/stories/mainStory.js";

    let playerMapPosition = { x: 200, y: 150 }; // Default position on raster map
    let gameStarted = false;
    let currentScene = null;
    let currentLocation = null;
    let activeInteraction = null;
    let showingMap = false;

    currentScene = gameStory.scenes[gameStory.startingScene];
    currentLocation = gameStory.map.locations[gameStory.startingLocation];

    // Initialize player position on the map
    if (gameStory.map.rasterMap && gameStory.map.rasterMap.startingPosition) {
        playerMapPosition = { ...gameStory.map.rasterMap.startingPosition };
    }

    // Initialize player position from the story data
    $: if (gameStory.map.rasterMap && !gameStarted) {
        playerMapPosition = gameStory.map.rasterMap.startingPosition || {
            x: 800,
            y: 600,
        };
    }

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
            const skillValue = player.skills[choice.skillCheck.skill] || 0;
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
                        player.inventory.push(item);
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

    // Function to close the map
    function closeMap() {
        showingMap = false;
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
        if (!progress.discoveredLocations.includes(locationId)) {
            progress.discoveredLocations = [
                ...progress.discoveredLocations,
                locationId,
            ];
        }
    }

    function completeQuest(questId) {
        if (!progress.completedQuests.includes(questId)) {
            progress.completedQuests = [...progress.completedQuests, questId];
        }
    }

    function improveSkill(skillId, amount) {
        if (!$characterStore.skills[skillId]) {
            let skill = getSkillInfo(skillId);
            $characterStore.updateCharacter({ skill: 0 });
        }
        let skill = getSkillInfo(skillId);
        $characterStore.updateCharacter({
            skill: $characterStore.skills[skillId] + amount,
        });
        // player.skills[skillId] += amount;
        // player = { ...player }; // Trigger reactivity
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

        // player = { ...player }; // Trigger reactivity
    }

    function spendSkillPoint(skillId) {
        if (($characterStore.skillPoints || 0) > 0) {
            improveSkill(skillId, 1);
            $characterStore.skillPoints--;
            // player = { ...player };
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
        <div class="character-panel">
            <Character {spendSkillPoint} />
            <!-- Add a button to open the map -->
            <div class="map-button-container">
                <button
                    class="show-map-button"
                    on:click={() => (showingMap = true)}
                >
                    Open World Map
                </button>
            </div>
        </div>

        <div class="story-panel">
            {#if showingMap}
                <RasterMapView
                    mapData={gameStory.map.rasterMap}
                    playerPosition={playerMapPosition}
                    onClose={closeMap}
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
            {:else if activeInteraction}
                <Interaction
                    character={activeInteraction}
                    {player}
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
                        The current scene {currentScene} could not be loaded. This
                        might be a bug in the game.
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

<style>
    .rpg-game {
        font-family: "Trebuchet MS", Arial, sans-serif;
        max-width: 1000px;
        margin: 0 auto;
        padding: 20px;
    }

    .game-container {
        display: flex;
        gap: 20px;
    }

    .character-panel {
        flex: 1;
        padding: 15px;
        background: #f0f0f0;
        border-radius: 8px;
    }

    .story-panel {
        flex: 2;
        padding: 15px;
        background: #fff;
        border: 1px solid #ddd;
        border-radius: 8px;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
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

    .map-button-container {
        margin-top: 15px;
    }

    .show-map-button {
        width: 100%;
        padding: 12px;
        background: #6b5b95;
        color: white;
        border: none;
        border-radius: 8px;
        cursor: pointer;
        font-weight: bold;
        transition: background-color 0.2s;
    }

    .show-map-button:hover {
        background: #7d6aa9;
    }
</style>
