<!-- src/lib/components/rpg/RPGGame.svelte -->
<script>
    import Character from "./Character.svelte";
    import Interaction from "./Interaction.svelte";
    import StoryEngine from "./StoryEngine.svelte";
    import CharacterCreation from "./CharacterCreation.svelte";
    import {
        characterClasses,
        getClassById,
    } from "$lib/components/stories/classes.js";
    import { getSkillInfo } from "$lib/components/stories/skills.js";
    import { onMount } from "svelte";

    // Import the story
    import { gameStory } from "$lib/components/stories/mainStory.js";

    let player = null;
    let gameStarted = false;
    let currentScene = null;
    let activeInteraction = null;

    function startGame(characterData) {
        player = {
            ...characterData,
            inventory: [],
        };
        gameStarted = true;
        currentScene = gameStory.scenes[gameStory.startingScene];

        console.log("Game started with:", player);
        console.log("Current scene:", currentScene);
    }

    function makeChoice(choice) {
        console.log("Player chose:", choice);

        // Process skill checks if needed
        if (choice.skillCheck) {
            const skillValue = player.skills[choice.skillCheck.skill] || 0;
            const success = skillValue >= choice.skillCheck.difficulty;

            // Apply skill improvement on attempts
            improveSkill(choice.skillCheck.skill, 1);

            currentScene = success
                ? gameStory.scenes[choice.skillCheck.successScene]
                : gameStory.scenes[choice.skillCheck.failScene];
        } else {
            // Regular choice
            currentScene = gameStory.scenes[choice.nextScene];
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
        }
    }

    function improveSkill(skillId, amount) {
        if (!player.skills[skillId]) {
            player.skills[skillId] = 0;
        }
        player.skills[skillId] += amount;
        player = { ...player }; // Trigger reactivity
    }

    function gainExperience(amount) {
        player.experience += amount;

        // Level up if enough experience
        if (player.experience >= player.level * 100) {
            player.level++;
            // Give skill points on level up
            player.skillPoints = (player.skillPoints || 0) + 3;

            // Check for new abilities
            const characterClass = getClassById(player.class);
            if (characterClass) {
                const newAbilities = characterClass.abilities
                    .filter((ability) => ability.unlockLevel === player.level)
                    .map((ability) => ability.id);

                if (newAbilities.length > 0) {
                    player.abilities = [...player.abilities, ...newAbilities];
                }
            }
        }

        player = { ...player }; // Trigger reactivity
    }

    function spendSkillPoint(skillId) {
        if ((player.skillPoints || 0) > 0) {
            improveSkill(skillId, 1);
            player.skillPoints--;
            player = { ...player };
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
    {#if !gameStarted}
        <CharacterCreation {startGame} />
    {:else}
        <div class="game-container">
            <div class="character-panel">
                <Character {player} {spendSkillPoint} />
            </div>

            <div class="story-panel">
                {#if activeInteraction}
                    <Interaction
                        character={activeInteraction}
                        {player}
                        onDialogueEnd={endInteraction}
                    />
                {:else}
                    <StoryEngine
                        scene={currentScene}
                        {makeChoice}
                        {player}
                        onInteract={startInteraction}
                    />
                {/if}
            </div>
        </div>
    {/if}
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
</style>
