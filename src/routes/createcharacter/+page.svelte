<!-- CharacterCreation.svelte -->
<script>
    import { onMount } from "svelte";

    import { characterClasses } from "$lib/components/stories/classes.ts";
    import {
        skills,
        skillCategories,
        getSkillInfo,
    } from "$lib/components/stories/skills.js";
    import {
        characterStore,
        updateCharacter,
        updateCharacterName,
        updateCharacterClass,
    } from "$lib/stores/character.ts";

    import { goto } from "$app/navigation";

    $: character = $characterStore;

    onMount(() => {});

    let selectedClassId = characterClasses[0].id;
    $: selectedClass = characterClasses.find((c) => c.id === selectedClassId);

    function handleClassSelection(classId) {
        selectedClassId = classId;
        const classObject = characterClasses.find((c) => c.id === classId);
        updateCharacterClass(classId, classObject);
    }

    function handleNameChange(event) {
        updateCharacter({ name: event.target.value });
    }

    async function createCharacter() {
        if ($characterStore.name.trim() === "") {
            alert("Please enter a character name");
            return;
        }

        // Make sure we have a valid selected class
        if (!selectedClass) {
            console.error("No class selected!", selectedClassId);
            alert("Please select a character class");
            return;
        }

        // Debug log
        console.log("Creating character with class:", selectedClass);

        const character = characterClasses[selectedClassId];

        try {
            // In a real app, you might save to a server here
            const response = await fetch("/api/characters", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify($characterStore),
            });
            const data = await response.json();

            // For now, we'll just navigate to the game
        } catch (error) {
            console.error("Error creating character:", error);
            // alert("Failed to create character. Please try again.");
            // todo
            goto("/game");
        }
        console.log("Character created:", character);
    }
</script>

<div class="character-creation">
    <h1>Create Your Character</h1>

    <div class="name-input">
        <label for="character-name">Character Name:</label>
        <input
            id="character-name"
            type="text"
            bind:value={$characterStore.name}
            placeholder="Enter name..."
            oninput={handleNameChange}
        />
    </div>

    <div class="class-selection">
        <h2>Choose a Class</h2>

        <div class="class-options">
            {#each characterClasses as characterClass}
                <button
                    aria-label={characterClass}
                    class="class-option"
                    class:selected={selectedClassId === characterClass.id}
                    onclick={() => handleClassSelection(characterClass.id)}
                >
                    {#if characterClass.portrait}
                        <img
                            src={characterClass.portrait}
                            alt={characterClass.name}
                            class="class-portrait"
                        />
                    {/if}

                    <h3>{characterClass.name}</h3>
                    <p>{characterClass.description}</p>
                    <div class="starting-skills">
                        <h4>Starting Skills:</h4>
                        <ul>
                            {#each Object.entries(characterClass.startingSkills) as [skillId, value]}
                                {@const skillInfo = getSkillInfo(skillId)}
                                <li>
                                    <span class="skill-icon"
                                        >{skillInfo.icon}</span
                                    >
                                    <span class="skill-name"
                                        >{skillInfo.name}:</span
                                    >
                                    <span class="skill-value">{value}</span>
                                </li>
                            {/each}
                        </ul>
                    </div>
                </button>
            {/each}
        </div>
    </div>

    <button class="create-button" onclick={createCharacter}>
        Begin Your Adventure
    </button>
</div>

<style>
    .character-creation {
        max-width: 800px;
        margin: 0 auto;
    }

    .name-input {
        margin-bottom: 20px;
    }

    .name-input input {
        width: 100%;
        padding: 8px;
        font-size: 16px;
    }

    .class-options {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(230px, 1fr));
        gap: 15px;
        margin-bottom: 20px;
    }

    .class-option {
        border: 2px solid #ddd;
        border-radius: 8px;
        padding: 15px;
        cursor: pointer;
        transition: all 0.2s;
    }

    .class-option:hover {
        background-color: #f5f5f5;
        transform: translateY(-2px);
    }

    .class-option.selected {
        border-color: #4a6;
        background-color: #efffef;
    }

    .class-portrait {
        width: 80px;
        height: 80px;
        border-radius: 40px;
        object-fit: cover;
        margin: 0 auto 10px;
        display: block;
    }

    .starting-skills ul {
        list-style-type: none;
        padding-left: 5px;
    }

    .starting-skills li {
        margin-bottom: 4px;
        display: flex;
        align-items: center;
    }

    .skill-icon {
        margin-right: 5px;
        font-size: 1.2em;
    }

    .skill-name {
        flex: 1;
    }

    .skill-value {
        font-weight: bold;
    }

    .create-button {
        display: block;
        width: 100%;
        padding: 12px;
        background-color: #4a6;
        color: white;
        border: none;
        border-radius: 4px;
        font-size: 18px;
        cursor: pointer;
    }

    .create-button:hover {
        background-color: #3b5;
    }
</style>
