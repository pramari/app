<!-- CharacterCreation.svelte -->
<script>
    import { characterClasses } from "$lib/components/stories/classes.js";
    import {
        skills,
        skillCategories,
        getSkillInfo,
    } from "$lib/components/stories/skills.js";
    export let startGame;

    let characterName = "";
    let selectedClassId = characterClasses[0].id;

    $: selectedClass = characterClasses.find((c) => c.id === selectedClassId);

    function handleClassSelection(classId) {
        selectedClass = classId;
    }

    function createCharacter() {
        if (characterName.trim() === "") {
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

        const character = {
            name: characterName,
            class: selectedClass.id,
            className: selectedClass.name,
            skills: { ...selectedClass.startingSkills },
            stats: { ...selectedClass.startingStats },
            skillPoints: 2,
            level: 1,
            experience: 0,
            abilities: Array.isArray(selectedClass.abilities)
                ? selectedClass.abilities
                      .filter((ability) => ability.unlockLevel === 1)
                      .map((ability) => ability.id)
                : [],
        };
        console.log("Character created:", character);
        startGame(character);
    }
</script>

<div class="character-creation">
    <h1>Create Your Character</h1>

    <div class="name-input">
        <label for="character-name">Character Name:</label>
        <input
            id="character-name"
            type="text"
            bind:value={characterName}
            placeholder="Enter name..."
        />
    </div>

    <div class="class-selection">
        <h2>Choose a Class</h2>

        <div class="class-options">
            {#each characterClasses as characterClass}
                <div
                    class="class-option"
                    class:selected={selectedClassId === characterClass.id}
                    on:click={() => handleClassSelection(characterClass.id)}
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
                </div>
            {/each}
        </div>
    </div>

    <button class="create-button" on:click={createCharacter}>
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
